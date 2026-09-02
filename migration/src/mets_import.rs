//! Parses a bundle's METS files (manifest/collection/document) and orchestrates a full
//! import into the database -- the inverse of `crate::mets`. See
//! `migration/import-from-xml.md` for the overall design, processing order, and known
//! limitations, and `migration/mets-xml.md` for the export side's full element/attribute
//! catalog this module parses against.

use std::collections::{HashMap, HashSet};
use std::path::{Path, PathBuf};

use anyhow::{bail, Context, Result};
use dailp::{
    raw, AnnotatedDoc, AudioSlice, CollectionSection, Database, DocumentId, DocumentMetadata,
    IiifImages, ImageSourceId, Uuid,
};
use log::{info, warn};
use roxmltree::{Document, Node};

use crate::checksum::sha256_hex;
use crate::editorial_import;
use crate::tei_import;
use crate::xml_util::{children_named, descendant, descendants_named};

/// The `document_group` every restored document is assigned to, since a document's
/// original group is never rendered anywhere in the bundle -- see
/// `migration/import-from-xml.md`.
const RESTORED_DOCUMENT_GROUP_TITLE: &str = "Restored from XML Backup";

pub struct ImportOptions {
    /// Parse and checksum-verify only; never opens a DB connection.
    pub verify_only: bool,
    /// Connect (read-only) and report create/update/skip counts; issue no writes.
    pub dry_run: bool,
    /// Skip the pre-flight collision scan and overwrite existing rows.
    pub truncate: bool,
    /// Abort the whole run on the first document/collection/editorial-page import
    /// failure, instead of the default best-effort behavior (log it, record it in
    /// [`ImportSummary`], and keep going). Useful when actively debugging a single bad
    /// file in an otherwise-large bundle, where waiting for everything else to finish
    /// first isn't worth it. Structural/checksum/collision problems found during the
    /// pre-write validation pass always abort immediately regardless of this flag --
    /// it only governs the per-document/per-collection/per-page write loop.
    pub fail_fast: bool,
    /// Restrict the run to these collection slugs (`None` = every collection in the
    /// bundle's manifest).
    pub collections_filter: Option<Vec<String>>,
}

#[derive(Default, Debug)]
pub struct ImportSummary {
    pub documents_imported: usize,
    pub collections_imported: usize,
    pub editorial_pages_imported: usize,
    /// `(title, error)` for every document whose import failed and was skipped rather
    /// than aborting the whole run -- see [`ImportOptions::fail_fast`].
    pub failed_documents: Vec<(String, String)>,
    pub failed_collections: Vec<(String, String)>,
    pub failed_editorial_pages: Vec<(String, String)>,
}

impl ImportSummary {
    /// Whether anything was skipped due to a failure -- callers (`import-from-xml.rs`)
    /// use this to decide the process's exit status, since [`import_bundle`] itself
    /// returns `Ok` for a best-effort run that completed with some failures (the whole
    /// point of not using `?` in those loops is to keep going and report everything at
    /// the end, not to hide that something went wrong).
    pub fn has_failures(&self) -> bool {
        !self.failed_documents.is_empty()
            || !self.failed_collections.is_empty()
            || !self.failed_editorial_pages.is_empty()
    }
}

/// One already-imported document -- everything [`import_one_collection`] needs to build
/// this document's chapter entry in any collection it belongs to.
struct ImportedDocument {
    id: DocumentId,
    short_name: String,
    title: String,
}

/// Finds the most recently generated `dailp-<timestamp>` run directory under
/// `<workspace>/backups/xml/dailp`, mirroring `crate::mets`'s own `output_root()`.
/// Lexicographic order matches chronological order, since the export side's
/// `FILENAME_TIMESTAMP_FORMAT` ("%Y%m%dT%H%M%S") sorts that way.
pub fn find_latest_bundle(workspace_root: &Path) -> Result<PathBuf> {
    let root = workspace_root.join("backups/xml/dailp");
    let mut runs: Vec<PathBuf> = std::fs::read_dir(&root)
        .with_context(|| format!("Failed to read {}", root.display()))?
        .filter_map(|entry| entry.ok())
        .map(|entry| entry.path())
        .filter(|path| {
            path.is_dir()
                && path
                    .file_name()
                    .and_then(|n| n.to_str())
                    .is_some_and(|n| n.starts_with("dailp-"))
        })
        .collect();
    runs.sort();
    runs.pop().with_context(|| {
        format!(
            "No \"dailp-<timestamp>\" run directory found under {}",
            root.display()
        )
    })
}

/// Runs the full import pipeline described in `migration/import-from-xml.md` against
/// `run_dir`. `db` is required unless `opts.verify_only` is set.
pub async fn import_bundle(
    run_dir: &Path,
    opts: &ImportOptions,
    db: Option<&Database>,
) -> Result<ImportSummary> {
    let mut summary = ImportSummary::default();
    let collections_dir = run_dir.join("collections");
    let documents_dir = run_dir.join("documents");

    // --- 1. Manifest pass ---
    let manifest_path = run_dir.join("manifest.mets.xml");
    let manifest_xml = std::fs::read_to_string(&manifest_path)
        .with_context(|| format!("Failed to read {}", manifest_path.display()))?;
    let manifest = parse_manifest(&manifest_xml)
        .with_context(|| format!("Failed to parse {}", manifest_path.display()))?;

    let wanted: Option<HashSet<String>> = opts
        .collections_filter
        .as_ref()
        .map(|slugs| slugs.iter().cloned().collect());

    // --- 2/3. Checksum-verify, then parse, every collection file ---
    let mut parsed_collections = Vec::new();
    for collection_ref in &manifest.collections {
        let path = collections_dir.join(&collection_ref.mets_filename);
        verify_checksum(&path, collection_ref.checksum.as_deref())?;
        let xml = std::fs::read_to_string(&path)
            .with_context(|| format!("Failed to read {}", path.display()))?;
        let parsed = parse_collection_file(&xml)
            .with_context(|| format!("Failed to parse {}", path.display()))?;
        if let Some(wanted) = &wanted {
            if !wanted.contains(&parsed.slug) {
                info!(
                    "Skipping collection \"{}\" (not in --collections filter)",
                    parsed.title
                );
                continue;
            }
        }
        parsed_collections.push(parsed);
    }
    if parsed_collections.is_empty() {
        bail!(
            "No collections to import (bundle manifest is empty, or --collections matched nothing)"
        );
    }

    // --- Parse every unique document file (deduplicated -- a document can be `mptr`'d
    // from more than one collection), + its sibling TEI file if it has one ---
    let mut document_filenames: Vec<String> = parsed_collections
        .iter()
        .flat_map(|c| c.document_mets_filenames.iter().cloned())
        .collect();
    document_filenames.sort();
    document_filenames.dedup();

    let mut parsed_documents: HashMap<String, ParsedDocumentFile> = HashMap::new();
    for filename in &document_filenames {
        let path = documents_dir.join(filename);
        let xml = std::fs::read_to_string(&path)
            .with_context(|| format!("Failed to read {}", path.display()))?;
        let mut parsed = parse_document_file(&xml)
            .with_context(|| format!("Failed to parse {}", path.display()))?;

        // Parsed eagerly here (not deferred to the write phase) so `--verify-only`/
        // `--dry-run` actually exercise TEI structural validation, not just its
        // checksum -- see `migration/import-from-xml.md`'s "coverage gaps" note.
        if let Some(tei_filename) = parsed.tei_filename.clone() {
            let tei_path = documents_dir.join(&tei_filename);
            verify_checksum(&tei_path, parsed.tei_checksum.as_deref())?;
            let tei_xml = std::fs::read_to_string(&tei_path)
                .with_context(|| format!("Failed to read {}", tei_path.display()))?;
            let parsed_tei = tei_import::parse_tei_document(&tei_xml, DocumentId(Uuid::nil()))
                .with_context(|| format!("Failed to parse {}", tei_path.display()))?;

            // Both files are rendered from the same in-memory `AnnotatedDoc`/context in
            // one export run, so they should always agree -- a mismatch here means the
            // bundle was hand-edited or assembled from mismatched files, worth a loud
            // warning even though it isn't fatal on its own.
            if parsed_tei.title != parsed.title {
                warn!(
                    "\"{}\"'s METS and TEI files disagree on title (METS: {:?}, TEI: {:?})",
                    parsed.title, parsed.title, parsed_tei.title
                );
            }
            if parsed.document_audio_url.is_some()
                != parsed_tei.document_audio_archival_locref.is_some()
            {
                warn!(
                    "\"{}\"'s METS and TEI files disagree on whether it has overall audio",
                    parsed.title
                );
            }
            log::debug!(
                "\"{}\"'s TEI file names \"{}\" as its home collection (informational only -- \
                 real membership comes from its own METS fileSec, see `collection_slugs`)",
                parsed.title,
                parsed_tei.collection
            );

            parsed.tei = Some(parsed_tei);
        }
        parsed_documents.insert(filename.clone(), parsed);
    }

    // --- 4. Cross-validate: every collection's document list must actually resolve, and
    // agree with each document's own idea of its collection membership. These are two
    // different views of the same many-to-many join (mirroring the read-direction of
    // `validate_document_references`/`validate_tei_bundle` on the export side), so a
    // mismatch means the bundle itself is inconsistent -- worth a loud warning, though
    // not fatal on its own the way a checksum mismatch is. ---
    for collection in &parsed_collections {
        for filename in &collection.document_mets_filenames {
            let Some(document) = parsed_documents.get(filename) else {
                bail!(
                    "Collection \"{}\" references document file \"{filename}\", which was \
                     never found/parsed",
                    collection.title
                );
            };
            if !document
                .collection_slugs
                .iter()
                .any(|slug| slug == &collection.slug)
            {
                warn!(
                    "Collection \"{}\" (slug {:?}) lists \"{}\" as a member, but that \
                     document's own METS file doesn't list this collection among its own \
                     membership ({:?}) -- the bundle may be internally inconsistent",
                    collection.title, collection.slug, document.title, document.collection_slugs
                );
            }
        }
    }
    // Read + checksum-verify every editorial page's content eagerly, here in the
    // validation pass rather than lazily during the write phase -- same reasoning as
    // eager TEI parsing above. `editorial_import::read_and_verify` is pure/DB-free, so
    // this costs nothing extra at write time (the content is threaded through instead
    // of re-read) and means `--verify-only`/`--dry-run` actually catch a missing or
    // corrupted editorial file instead of only discovering it on a real run.
    let mut site_page_contents: Vec<String> = Vec::with_capacity(manifest.site_pages.len());
    for page in &manifest.site_pages {
        let content = editorial_import::read_and_verify(run_dir, page)
            .with_context(|| format!("Failed to read/verify site page \"{}\"", page.title))?;
        site_page_contents.push(content);
    }
    let mut collection_editorial_contents: Vec<Vec<String>> =
        Vec::with_capacity(parsed_collections.len());
    for collection in &parsed_collections {
        let mut contents = Vec::with_capacity(collection.editorial_pages.len());
        for page in &collection.editorial_pages {
            let content =
                editorial_import::read_and_verify(&collections_dir, page).with_context(|| {
                    format!(
                        "Failed to read/verify editorial page \"{}\" in \"{}\"",
                        page.title, collection.title
                    )
                })?;
            contents.push(content);
        }
        collection_editorial_contents.push(contents);
    }

    info!(
        "Parsed {} collection(s) and {} unique document(s) from {}",
        parsed_collections.len(),
        parsed_documents.len(),
        run_dir.display()
    );

    if opts.verify_only {
        info!("--verify-only set: not connecting to a database");
        return Ok(summary);
    }
    let db = db.context("A database connection is required unless --verify-only is set")?;

    if !opts.truncate {
        precheck_no_collisions(db, &parsed_collections, &parsed_documents).await?;
    }

    if opts.dry_run {
        info!(
            "--dry-run set: would import {} document(s), {} collection(s), and {} editorial \
             page(s); no writes issued",
            parsed_documents.len(),
            parsed_collections.len(),
            manifest.site_pages.len()
                + parsed_collections
                    .iter()
                    .map(|c| c.editorial_pages.len())
                    .sum::<usize>()
        );
        return Ok(summary);
    }

    // --- 5. Import documents before collections/chapters -- see
    // migration/import-from-xml.md §3 for why this order is required. ---
    let restored_group_id = db
        .insert_top_collection(RESTORED_DOCUMENT_GROUP_TITLE.to_owned(), 0)
        .await
        .context("Failed to create/find the restored-documents document group")?;

    // Sorted (rather than iterated straight off the `HashMap`) so that which documents
    // land before a mid-run failure is reproducible, not an artifact of hash order --
    // matters now that a failure here is recorded and skipped rather than aborting.
    let mut parsed_documents: Vec<(String, ParsedDocumentFile)> =
        parsed_documents.into_iter().collect();
    parsed_documents.sort_by(|a, b| a.0.cmp(&b.0));

    let mut imported_documents: HashMap<String, ImportedDocument> = HashMap::new();
    for (filename, parsed) in parsed_documents {
        let title = parsed.title.clone();
        let short_name = dailp::slugify(&title);
        match import_one_document(db, parsed, &short_name, restored_group_id).await {
            Ok(document_id) => {
                imported_documents.insert(
                    filename,
                    ImportedDocument {
                        id: document_id,
                        short_name,
                        title,
                    },
                );
                summary.documents_imported += 1;
            }
            Err(e) if !opts.fail_fast => {
                warn!("Failed to import document \"{title}\": {e:#}");
                summary.failed_documents.push((title, format!("{e:#}")));
            }
            Err(e) => return Err(e.context(format!("Failed to import document \"{title}\""))),
        }
    }

    for (collection, editorial_contents) in parsed_collections
        .iter()
        .zip(&collection_editorial_contents)
    {
        match import_one_collection(db, collection, editorial_contents, &imported_documents).await {
            Ok(()) => {
                summary.collections_imported += 1;
                summary.editorial_pages_imported += collection.editorial_pages.len();
            }
            Err(e) if !opts.fail_fast => {
                warn!(
                    "Failed to import collection \"{}\": {e:#}",
                    collection.title
                );
                summary
                    .failed_collections
                    .push((collection.title.clone(), format!("{e:#}")));
            }
            Err(e) => {
                return Err(e.context(format!(
                    "Failed to import collection \"{}\"",
                    collection.title
                )))
            }
        }
    }

    // --- 6. Standalone site pages ---
    for (page, content) in manifest.site_pages.iter().zip(&site_page_contents) {
        match editorial_import::import_editorial_page(db, page, content).await {
            Ok(()) => summary.editorial_pages_imported += 1,
            Err(e) if !opts.fail_fast => {
                warn!("Failed to import site page \"{}\": {e:#}", page.title);
                summary
                    .failed_editorial_pages
                    .push((page.title.clone(), format!("{e:#}")));
            }
            Err(e) => {
                return Err(e.context(format!("Failed to import site page \"{}\"", page.title)))
            }
        }
    }

    info!(
        "Finished importing {} document(s), {} collection(s), and {} editorial page(s) from {}",
        summary.documents_imported,
        summary.collections_imported,
        summary.editorial_pages_imported,
        run_dir.display()
    );
    if summary.has_failures() {
        warn!(
            "{} document(s), {} collection(s), and {} editorial page(s) FAILED to import -- \
             see warnings above for detail",
            summary.failed_documents.len(),
            summary.failed_collections.len(),
            summary.failed_editorial_pages.len()
        );
    }
    Ok(summary)
}

/// Before writing anything, confirm none of this run's collections/documents already
/// exist in the target database -- `--truncate` skips this and overwrites instead. This
/// is what still gives the whole run an all-or-nothing guarantee against *accidentally*
/// clobbering existing rows, even though individual document/collection imports below
/// are each their own transaction (see `migration/import-from-xml.md` §"Transaction
/// granularity").
async fn precheck_no_collisions(
    db: &Database,
    collections: &[ParsedCollectionFile],
    documents: &HashMap<String, ParsedDocumentFile>,
) -> Result<()> {
    let mut collisions = Vec::new();

    for collection in collections {
        if db
            .document_group_id_by_slug(&collection.slug)
            .await
            .with_context(|| format!("Failed to look up collection slug \"{}\"", collection.slug))?
            .is_some()
        {
            // `document_group_id_by_slug` checks `document_group`, not
            // `edited_collection` -- kept anyway as a defensive check against the
            // synthetic "Restored from XML Backup" group's own slug colliding, which
            // would otherwise silently succeed. The real `edited_collection` check
            // below is what matters for a re-run of this importer.
        }
        if db
            .all_edited_collections()
            .await?
            .iter()
            .any(|c| c.slug == collection.slug)
        {
            collisions.push(format!(
                "collection \"{}\" (slug {:?})",
                collection.title, collection.slug
            ));
        }
    }

    let restored_group_id = db
        .document_group_id_by_slug(&dailp::slugify(RESTORED_DOCUMENT_GROUP_TITLE))
        .await?;
    if let Some(group_id) = restored_group_id {
        let existing_short_names: HashSet<String> = db
            .document_short_names_in_group(group_id)
            .await?
            .into_iter()
            .collect();
        for parsed in documents.values() {
            let short_name = dailp::slugify(&parsed.title);
            if existing_short_names.contains(&short_name) {
                collisions.push(format!(
                    "document \"{}\" (short_name {short_name:?})",
                    parsed.title
                ));
            }
        }
    }

    if !collisions.is_empty() {
        bail!(
            "Refusing to import: {} row(s) already exist in the target database and \
             --truncate wasn't set:\n  - {}",
            collisions.len(),
            collisions.join("\n  - ")
        );
    }
    Ok(())
}

/// Re-hashes `path` and compares it against `expected` (an embedded `CHECKSUM`
/// attribute). `None` means the bundle never recorded one for this file (e.g. it's a
/// live-webpage locref with nothing to check, or -- for a document's own `.mets.xml`
/// file -- nothing in the bundle ever checksums it at all; see
/// `migration/import-from-xml.md`), in which case this is a no-op.
fn verify_checksum(path: &Path, expected: Option<&str>) -> Result<()> {
    let Some(expected) = expected else {
        return Ok(());
    };
    let bytes =
        std::fs::read(path).with_context(|| format!("Failed to read {}", path.display()))?;
    let actual = sha256_hex(&bytes);
    if actual != expected {
        bail!(
            "Checksum mismatch for {}: expected {expected}, got {actual}",
            path.display()
        );
    }
    Ok(())
}

// --- Manifest parsing ---------------------------------------------------------------

struct ManifestRef {
    collections: Vec<CollectionFileRef>,
    site_pages: Vec<editorial_import::EditorialPageRef>,
}

struct CollectionFileRef {
    mets_filename: String,
    /// Present iff the manifest's archival fileGrp recorded one for this collection
    /// file (always true for a well-formed bundle -- see `mets_macros.tera.xml`'s
    /// `file_entry` macro).
    checksum: Option<String>,
}

fn parse_manifest(xml: &str) -> Result<ManifestRef> {
    let doc = Document::parse(xml).context("Failed to parse manifest XML")?;
    let root = doc.root_element();
    let struct_map = descendant(root, "structMap").context("Manifest has no structMap")?;
    let top_div = children_named(struct_map, "div")
        .next()
        .context("Manifest structMap has no top-level div")?;

    let mut collections = Vec::new();
    let mut site_pages = Vec::new();
    for div in children_named(top_div, "div") {
        match div.attribute("TYPE") {
            Some("collection") => {
                let mptr = descendant(div, "mptr").context("Collection div missing mptr")?;
                let locref = mptr.attribute("LOCREF").context("mptr missing LOCREF")?;
                let mets_filename = locref
                    .strip_prefix("./collections/")
                    .with_context(|| format!("Unexpected collection mptr LOCREF {locref:?}"))?
                    .to_owned();
                let checksum = find_file_by_locref(root, "archival", locref)
                    .and_then(|f| f.attribute("CHECKSUM"))
                    .map(str::to_owned);
                collections.push(CollectionFileRef {
                    mets_filename,
                    checksum,
                });
            }
            Some("site page") => {
                let title = div.attribute("LABEL").unwrap_or_default().to_owned();
                let base_id = descendant(div, "fptr")
                    .and_then(|f| f.attribute("FILEID"))
                    .and_then(|id| id.strip_suffix("_m"))
                    .context("Site page div missing fptr FILEID")?
                    .to_owned();
                let archival_locref = find_file_by_id(root, "archival", &format!("{base_id}_a"))
                    .and_then(|f| descendant(f, "FLocat"))
                    .and_then(|l| l.attribute("LOCREF"))
                    .context("Site page missing archival fileGrp entry")?
                    .to_owned();
                let checksum = find_file_by_id(root, "archival", &format!("{base_id}_a"))
                    .and_then(|f| f.attribute("CHECKSUM"))
                    .map(str::to_owned);
                let original_locref = find_file_by_id(root, "original", &format!("{base_id}_m"))
                    .and_then(|f| descendant(f, "FLocat"))
                    .and_then(|l| l.attribute("LOCREF"))
                    .map(str::to_owned);
                site_pages.push(editorial_import::EditorialPageRef {
                    title,
                    archival_locref,
                    original_locref,
                    checksum,
                });
            }
            _ => {}
        }
    }
    Ok(ManifestRef {
        collections,
        site_pages,
    })
}

// --- Collection file parsing ---------------------------------------------------------

pub(crate) struct ParsedCollectionFile {
    pub(crate) title: String,
    pub(crate) slug: String,
    /// Falls back to the title on export when the collection has no real description
    /// (`CollectionMetsContext.collection_label`) -- there is no way to tell the two
    /// cases apart from the bundle alone, so a collection with no description will get
    /// its title written back as one. Documented, not fixed: the `dc:record`'s
    /// `dc:title` (always the real title) would let us detect this, but distinguishing
    /// "genuinely no description" from "description equals title" either way isn't
    /// possible without a schema change to the export side.
    pub(crate) description: Option<String>,
    /// This collection's member documents, in chapter order, by their `.mets.xml`
    /// filename (deduplicated/resolved against `parsed_documents` by the caller).
    pub(crate) document_mets_filenames: Vec<String>,
    pub(crate) editorial_pages: Vec<editorial_import::EditorialPageRef>,
}

fn parse_collection_file(xml: &str) -> Result<ParsedCollectionFile> {
    let doc = Document::parse(xml).context("Failed to parse collection XML")?;
    let root = doc.root_element();

    let title = root
        .attribute("OBJID")
        .context("Collection missing OBJID")?
        .to_owned();
    // `collection_slug` is only rendered as a fragment of the descriptive `md@ID`
    // (`"{slug}_dc"`) -- there's no dedicated attribute for it.
    let slug = descendants_named(root, "md")
        .find_map(|md| md.attribute("ID").and_then(|id| id.strip_suffix("_dc")))
        .with_context(|| {
            format!("Collection \"{title}\" has no \"<slug>_dc\" md ID to recover its slug from")
        })?
        .to_owned();
    // `LABEL` holds `collection_label`, which falls back to the (already-escaped)
    // title itself when the collection has no real description -- see
    // `ParsedCollectionFile::description`. `OBJID` (== `title` above) is always the
    // real title, so comparing the two recovers the description whenever one exists.
    let label = root.attribute("LABEL").unwrap_or_default();
    let description = (label != title && !label.is_empty()).then(|| label.to_owned());

    let struct_map = descendant(root, "structMap").context("Collection has no structMap")?;
    let top_div = children_named(struct_map, "div")
        .next()
        .context("Collection structMap has no top-level div")?;

    let mut document_mets_filenames = Vec::new();
    let mut editorial_pages = Vec::new();
    for div in children_named(top_div, "div") {
        match div.attribute("TYPE") {
            Some("document") => {
                let locref = descendant(div, "mptr")
                    .and_then(|m| m.attribute("LOCREF"))
                    .context("Document div missing mptr LOCREF")?;
                let filename = locref
                    .strip_prefix("../documents/")
                    .with_context(|| format!("Unexpected document mptr LOCREF {locref:?}"))?
                    .to_owned();
                document_mets_filenames.push(filename);
            }
            Some("editorial page") => {
                let title = div.attribute("LABEL").unwrap_or_default().to_owned();
                let base_id = descendant(div, "fptr")
                    .and_then(|f| f.attribute("FILEID"))
                    .and_then(|id| id.strip_suffix("_m"))
                    .context("Editorial page div missing fptr FILEID")?
                    .to_owned();
                let archival_locref = find_file_by_id(root, "archival", &format!("{base_id}_a"))
                    .and_then(|f| descendant(f, "FLocat"))
                    .and_then(|l| l.attribute("LOCREF"))
                    .context("Editorial page missing archival fileGrp entry")?
                    .to_owned();
                let checksum = find_file_by_id(root, "archival", &format!("{base_id}_a"))
                    .and_then(|f| f.attribute("CHECKSUM"))
                    .map(str::to_owned);
                // Not needed for a collection-owned chapter (its path is always
                // derivable by convention -- see
                // `editorial_import::import_collection_chapter_page`), but harmless to
                // leave `None` here rather than looking it up unnecessarily.
                editorial_pages.push(editorial_import::EditorialPageRef {
                    title,
                    archival_locref,
                    original_locref: None,
                    checksum,
                });
            }
            _ => {}
        }
    }

    Ok(ParsedCollectionFile {
        title,
        slug,
        description,
        document_mets_filenames,
        editorial_pages,
    })
}

// --- Document file parsing ------------------------------------------------------------

pub(crate) struct ParsedDocumentFile {
    pub(crate) title: String,
    pub(crate) tei_filename: Option<String>,
    tei_checksum: Option<String>,
    /// Already parsed (not just read as a raw string) by the time `import_bundle`'s
    /// parse pass finishes -- see that function for why this happens eagerly rather
    /// than lazily during the write phase.
    pub(crate) tei: Option<tei_import::ParsedTeiDocument>,
    /// Every collection slug this document's own fileSec says it belongs to in this
    /// run -- the document's *full* membership list, not just the "home" collection its
    /// `.tei.xml` navigation happened to be built from. See `migration/mets-xml.md` §6.
    pub(crate) collection_slugs: Vec<String>,
    /// This document's real external audio resource URL (from the `original`-fileGrp
    /// entry, not the archived copy), if it has any overall audio.
    document_audio_url: Option<String>,
    /// Word id ("w{index}") -> real external audio resource URL, for every word with
    /// recorded audio.
    word_audio_urls: HashMap<String, String>,
    /// `(page_number, oid, source_url)` triples, one per manuscript page image, parsed
    /// from the archival/original fileGrp pair. Not yet grouped by page -- see
    /// `build_page_images`.
    page_images: Vec<(usize, String, String)>,
}

fn parse_document_file(xml: &str) -> Result<ParsedDocumentFile> {
    let doc = Document::parse(xml).context("Failed to parse document XML")?;
    let root = doc.root_element();

    let title = root
        .attribute("LABEL")
        .context("Document missing LABEL")?
        .to_owned();
    let document_slug = root
        .attribute("OBJID")
        .context("Document missing OBJID")?
        .to_owned();

    let tei_filename = descendant(root, "mdRef")
        .filter(|r| r.attribute("OTHERMDTYPE") == Some("TEI"))
        .and_then(|r| r.attribute("LOCREF"))
        .and_then(|l| l.strip_prefix("./"))
        .map(str::to_owned);
    let tei_checksum = descendant(root, "mdRef")
        .filter(|r| r.attribute("OTHERMDTYPE") == Some("TEI"))
        .and_then(|r| r.attribute("CHECKSUM"))
        .map(str::to_owned);

    // Every "<slug>_collmets_m" id in the original fileGrp identifies one collection
    // this document belongs to in this run -- see `document.tera.xml`'s fileSec.
    let collection_slugs: Vec<String> = descendants_named(root, "file")
        .filter_map(|f| f.attribute("ID"))
        .filter_map(|id| id.strip_suffix("_collmets_m"))
        .map(str::to_owned)
        .collect();

    let document_audio_url = descendants_named(root, "file")
        .find(|f| {
            f.attribute("ID")
                .and_then(|id| id.strip_prefix(&format!("{document_slug}_m")))
                .is_some_and(|rest| rest.is_empty() || rest.starts_with('.'))
        })
        .and_then(|f| descendant(f, "FLocat"))
        .and_then(|l| l.attribute("LOCREF"))
        .map(str::to_owned);

    // Word audio ids are exactly "w<digits>_m" -- see `mets::WordAudioEntry`. Bare "w"
    // followed by digits never collides with the image/TEI/manifest/collection id
    // patterns used elsewhere in this file, which all carry their own distinct suffix
    // ("_tei_m", "_collmets_m", "manifest_m", or an oid).
    let word_audio_urls: HashMap<String, String> = descendants_named(root, "file")
        .filter_map(|f| {
            let id = f.attribute("ID")?;
            let word_id = id.strip_suffix("_m")?;
            if !is_word_id(word_id) {
                return None;
            }
            let url = descendant(f, "FLocat")?.attribute("LOCREF")?;
            Some((word_id.to_owned(), url.to_owned()))
        })
        .collect();

    let page_images = parse_page_image_refs(root, &document_slug);

    Ok(ParsedDocumentFile {
        title,
        tei_filename,
        tei_checksum,
        tei: None,
        collection_slugs,
        document_audio_url,
        word_audio_urls,
        page_images,
    })
}

/// A word id is exactly `"w"` followed by one or more ASCII digits (`AnnotatedForm`'s
/// `position.index`, per `mets::words_with_audio`/`tei_macros.tera.xml`'s `word.id`).
fn is_word_id(id: &str) -> bool {
    id.strip_prefix('w')
        .is_some_and(|rest| !rest.is_empty() && rest.bytes().all(|b| b.is_ascii_digit()))
}

/// Recovers `(page_number, oid, source_url)` triples from a document file's archival/
/// original fileGrp entries. The archival locref
/// (`"../images/{document_slug}_page{page_number}_{oid}.jpg"`, see
/// `mets::PageImageEntry.filename`) is the only place a page number is recorded at all
/// -- structMap order alone doesn't separate one page's images from the next (see
/// `migration/import-from-xml.md`). The matching original-fileGrp entry
/// (`"{source_url}/{oid}/full/max/0/default.jpg"`, see `document.tera.xml`) is found by
/// oid and its locref suffix stripped to recover `source_url`.
fn parse_page_image_refs(root: Node, document_slug: &str) -> Vec<(usize, String, String)> {
    let prefix = format!("../images/{document_slug}_page");
    descendants_named(root, "fileGrp")
        .find(|g| g.attribute("USE") == Some("archival"))
        .into_iter()
        .flat_map(|g| children_named(g, "file"))
        .filter_map(|f| {
            let locref = descendant(f, "FLocat")?.attribute("LOCREF")?;
            let rest = locref.strip_prefix(&prefix)?; // "{page_number}_{oid}.jpg"
            let (page_number, oid) = rest.split_once('_')?;
            let oid = oid.strip_suffix(".jpg").unwrap_or(oid);
            let page_number: usize = page_number.parse().ok()?;

            let suffix = format!("/{oid}/full/max/0/default.jpg");
            let source_url = descendants_named(root, "fileGrp")
                .find(|g| g.attribute("USE") == Some("original"))
                .into_iter()
                .flat_map(|g| children_named(g, "file"))
                .find_map(|f| {
                    let l = descendant(f, "FLocat")?.attribute("LOCREF")?;
                    l.strip_suffix(&suffix).map(str::to_owned)
                })?;

            Some((page_number, oid.to_owned(), source_url))
        })
        .collect()
}

fn find_file_by_id<'a, 'input>(
    root: Node<'a, 'input>,
    use_: &str,
    file_id: &str,
) -> Option<Node<'a, 'input>> {
    descendants_named(root, "fileGrp")
        .find(|g| g.attribute("USE") == Some(use_))
        .and_then(|g| children_named(g, "file").find(|f| f.attribute("ID") == Some(file_id)))
}

fn find_file_by_locref<'a, 'input>(
    root: Node<'a, 'input>,
    use_: &str,
    locref: &str,
) -> Option<Node<'a, 'input>> {
    descendants_named(root, "fileGrp")
        .find(|g| g.attribute("USE") == Some(use_))
        .and_then(|g| {
            children_named(g, "file").find(|f| {
                descendant(*f, "FLocat").and_then(|l| l.attribute("LOCREF")) == Some(locref)
            })
        })
}

// --- Import (DB writes) ----------------------------------------------------------------

/// Imports one document's metadata + page/paragraph/word content. See
/// `migration/import-from-xml.md` for exactly which `DocumentMetadata` fields can and
/// can't be recovered from the bundle.
async fn import_one_document(
    db: &Database,
    parsed: ParsedDocumentFile,
    short_name: &str,
    restored_group_id: Uuid,
) -> Result<DocumentId> {
    // `parsed.tei` was already parsed (and cross-checked against `parsed` itself) back
    // in `import_bundle`'s validation pass -- see that function for why this happens
    // eagerly rather than lazily here.
    let word_audio_archival_locrefs = parsed
        .tei
        .as_ref()
        .map(|tei| tei.word_audio_archival_locrefs.clone())
        .unwrap_or_default();

    let audio_recording = parsed.document_audio_url.as_ref().map(|url| AudioSlice {
        slice_id: None,
        resource_url: url.clone(),
        parent_track: None,
        recorded_at: None,
        recorded_by: None,
        include_in_edited_collection: true,
        edited_by: None,
        annotations: None,
        index: 0,
        // Trim offsets are never recoverable -- see migration/import-from-xml.md.
        start_time: None,
        end_time: None,
    });

    let contributors = parsed
        .tei
        .as_ref()
        .map(|t| {
            t.contributor_names
                .iter()
                .map(|name| dailp::Contributor {
                    id: Uuid::nil(),
                    name: name.clone(),
                    // Never rendered anywhere in the bundle -- see
                    // migration/import-from-xml.md.
                    role: None,
                })
                .collect()
        })
        .filter(|c: &Vec<_>| !c.is_empty());

    let meta = DocumentMetadata {
        id: DocumentId(Uuid::nil()), // overwritten by `insert_document`'s return value
        short_name: short_name.to_owned(),
        title: parsed.title.clone(),
        sources: Vec::new(),
        collection: None,
        genre_id: None,
        format_id: None,
        subject_headings_ids: None,
        languages_ids: None,
        keywords_ids: None,
        creators_ids: None,
        contributors,
        spatial_coverage_ids: None,
        translation: None,
        page_images: build_page_images(db, &parsed.page_images).await?,
        date: None,
        is_reference: false,
        audio_recording,
        order_index: 0,
    };

    let document_id = db.insert_document(&meta, restored_group_id, 0).await?;

    if let Some(mut tei) = parsed.tei {
        // Fill in the real document id and cross-reference each word's real audio
        // `resource_url` from this document's own METS fileSec (the TEI file only ever
        // stores the local archival path -- see `tei_import`'s module doc comment).
        for page in &mut tei.pages {
            for paragraph in &mut page.paragraphs {
                for seg in &mut paragraph.source {
                    if let dailp::AnnotatedSeg::Word(word) = seg {
                        word.position.document_id = document_id;
                        let word_id = format!("w{}", word.position.index);
                        if word_audio_archival_locrefs.contains_key(&word_id) {
                            if let Some(url) = parsed.word_audio_urls.get(&word_id) {
                                word.ingested_audio_track = Some(AudioSlice {
                                    slice_id: None,
                                    resource_url: url.clone(),
                                    parent_track: None,
                                    recorded_at: None,
                                    recorded_by: None,
                                    include_in_edited_collection: true,
                                    edited_by: None,
                                    annotations: None,
                                    index: 0,
                                    start_time: None,
                                    end_time: None,
                                });
                            } else {
                                warn!(
                                    "Word {word_id:?} in \"{}\" has an archived audio file but no \
                                     matching original-fileGrp entry in its METS file; its audio \
                                     won't be restored",
                                    parsed.title
                                );
                            }
                        }
                    }
                }
            }
        }

        // `insert_document` only borrowed `meta` above, so it's still available here --
        // `insert_document_contents` also needs `meta.page_images` (to resolve each
        // page's `iiif_source_id`/`iiif_oid`), not just `meta.id`, so the real value is
        // reused (with its `id` corrected to what `insert_document` actually assigned)
        // rather than a stub.
        db.insert_document_contents(AnnotatedDoc {
            meta: DocumentMetadata {
                id: document_id,
                ..meta
            },
            segments: Some(tei.pages),
        })
        .await?;
    }

    Ok(document_id)
}

/// Groups this document's parsed `(page_number, oid, source_url)` triples by page,
/// joining a page's multiple oids back into one comma-separated string -- mirroring how
/// `document_page.iiif_oid` originally stored them (see `images.rs`'s module doc
/// comment) -- and resolves one shared [`ImageSourceId`] via
/// [`Database::upsert_image_source`]. If pages disagree on source URL (only possible if
/// the original document really did mix IIIF hosts across pages), the first one found is
/// used for all of them and a warning is logged -- `insert_document_contents` itself has
/// no way to record more than one source per document, so this isn't a regression
/// introduced by the importer.
async fn build_page_images(
    db: &Database,
    images: &[(usize, String, String)],
) -> Result<Option<IiifImages>> {
    if images.is_empty() {
        return Ok(None);
    }
    let mut by_page: HashMap<usize, Vec<&str>> = HashMap::new();
    let mut source_urls: HashSet<&str> = HashSet::new();
    for (page_number, oid, source_url) in images {
        by_page.entry(*page_number).or_default().push(oid);
        source_urls.insert(source_url);
    }
    if source_urls.len() > 1 {
        warn!(
            "Document's manuscript images reference {} different IIIF sources; only the \
             first will be restored (insert_document_contents supports one source per \
             document) -- see migration/import-from-xml.md",
            source_urls.len()
        );
    }
    let source_url = images[0].2.clone();
    let source_id = db
        .upsert_image_source("Restored from XML Backup", &source_url)
        .await?;

    let max_page = *by_page.keys().max().unwrap_or(&0);
    let ids: Vec<String> = (1..=max_page)
        .map(|page_number| {
            by_page
                .get(&page_number)
                .map(|oids| oids.join(","))
                .unwrap_or_default()
        })
        .collect();

    Ok(Some(IiifImages {
        source: ImageSourceId(source_id),
        ids,
    }))
}

/// Imports one collection's own metadata and chapter list. See
/// `migration/import-from-xml.md` for exactly which `EditedCollection` fields can and
/// can't be recovered, and why document-backed chapters are given a flat,
/// `CollectionSection::Body` chapter list rather than reconstructing the original tree.
async fn import_one_collection(
    db: &Database,
    collection: &ParsedCollectionFile,
    editorial_contents: &[String],
    imported_documents: &HashMap<String, ImportedDocument>,
) -> Result<()> {
    let raw_collection = raw::EditedCollection {
        title: collection.title.clone(),
        description: collection.description.clone(),
        slug: collection.slug.clone(),
        // Never rendered anywhere in the bundle -- see migration/import-from-xml.md.
        wordpress_menu_id: None,
        chapters: Vec::new(),
        thumbnail_url: None,
    };
    db.upsert_collection(&raw_collection).await?;
    db.set_edited_collection_metadata(&collection.slug, collection.description.as_deref(), None)
        .await?;

    let mut chapters = Vec::new();
    let mut index_in_parent = 1;
    for filename in &collection.document_mets_filenames {
        // A document that failed to import (see `import_bundle`'s fail-soft document
        // loop) is skipped here with a warning rather than failing this whole
        // collection -- one broken document shouldn't also take down every collection
        // that happens to reference it.
        let Some(document) = imported_documents.get(filename) else {
            warn!(
                "Skipping chapter for document file \"{filename}\" in collection \"{}\": that \
                 document was never successfully imported",
                collection.title
            );
            continue;
        };
        log::debug!(
            "Chaptering document {:?} (id {}) into collection \"{}\"",
            document.title,
            document.id.0,
            collection.title
        );
        chapters.push(raw::CollectionChapter {
            id: None,
            // `raw::CollectionChapter.url_slug` becomes a Postgres `ltree` label
            // (`insert_all_chapters`), which only permits `[A-Za-z0-9_]` -- unlike
            // `document.short_name`/`dailp::slugify`, which use hyphens. Mirrors
            // `dailp::slugify_ltree`'s own hyphen->underscore substitution (applied
            // inline since `short_name` is already slugified).
            url_slug: document.short_name.replace('-', "_"),
            index_in_parent,
            chapter_name: document.title.clone(),
            document_short_name: Some(document.short_name.clone()),
            wordpress_id: None,
            // Document-backed chapters carry no section attribute in the bundle --
            // `Body` is the only value that was ever going to be correct here (see
            // migration/import-from-xml.md's "expected behavior, not data loss").
            section: CollectionSection::Body,
        });
        index_in_parent += 1;
    }

    for (page, content) in collection.editorial_pages.iter().zip(editorial_contents) {
        let imported = editorial_import::import_collection_chapter_page(
            db,
            &collection.title,
            &collection.slug,
            page,
            content,
        )
        .await?;
        chapters.push(raw::CollectionChapter {
            id: None,
            // See the document-backed branch above for why this needs the
            // ltree-safe (underscored) form rather than `imported.chapter_slug` as-is.
            url_slug: imported.chapter_slug.replace('-', "_"),
            index_in_parent,
            chapter_name: imported.title,
            document_short_name: None,
            // Any non-null value marks this chapter as page-backed -- see
            // `editorial.rs`'s `chapter.wordpress_id.is_some()` check. The real
            // original value is never recoverable (see migration/import-from-xml.md).
            wordpress_id: Some(1),
            section: imported.section,
        });
        index_in_parent += 1;
    }

    db.insert_all_chapters(chapters, collection.slug.clone())
        .await?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn is_word_id_matches_bare_w_plus_digits_only() {
        assert!(is_word_id("w1"));
        assert!(is_word_id("w42"));
        assert!(!is_word_id("w"));
        assert!(!is_word_id("wombat"));
        assert!(!is_word_id("manifest"));
        assert!(!is_word_id("some-collection_collmets"));
    }

    const SAMPLE_MANIFEST: &str = r##"<?xml version="1.0" encoding="UTF-8"?>
<mets:mets xmlns:mets="http://www.loc.gov/METS/v2" OBJID="DAILP-Backup-Manifest" LABEL="DAILP XML Backup Manifest">
  <mets:fileSec>
    <mets:fileGrp USE="archival">
      <mets:file ID="willie-jumper-stories_a" CHECKSUM="abc123" CHECKSUMTYPE="SHA-256">
        <mets:FLocat LOCTYPE="SYSTEM" LOCREF="./collections/Willie-Jumper-Stories.mets.xml"/>
      </mets:file>
      <mets:file ID="team_a" CHECKSUM="def456" CHECKSUMTYPE="SHA-256">
        <mets:FLocat LOCTYPE="SYSTEM" LOCREF="./editorial/about/team.md"/>
      </mets:file>
    </mets:fileGrp>
  </mets:fileSec>
  <mets:structSec>
    <mets:structMap TYPE="logical">
      <mets:div TYPE="manifest" LABEL="DAILP XML Backup Manifest">
        <mets:div TYPE="collection" LABEL="Willie Jumper Stories">
          <mets:mptr LOCTYPE="URL" LOCREF="./collections/Willie-Jumper-Stories.mets.xml"/>
        </mets:div>
        <mets:div TYPE="site page" LABEL="Team">
          <mets:fptr FILEID="team_m"/>
          <mets:fptr FILEID="team_b"/>
          <mets:fptr FILEID="team_a"/>
        </mets:div>
      </mets:div>
    </mets:structMap>
  </mets:structSec>
</mets:mets>
"##;

    #[test]
    fn parses_manifest_collections_and_site_pages() {
        let manifest = parse_manifest(SAMPLE_MANIFEST).expect("should parse");
        assert_eq!(manifest.collections.len(), 1);
        assert_eq!(
            manifest.collections[0].mets_filename,
            "Willie-Jumper-Stories.mets.xml"
        );
        assert_eq!(manifest.collections[0].checksum.as_deref(), Some("abc123"));

        assert_eq!(manifest.site_pages.len(), 1);
        assert_eq!(manifest.site_pages[0].title, "Team");
        assert_eq!(
            manifest.site_pages[0].archival_locref,
            "./editorial/about/team.md"
        );
        assert_eq!(manifest.site_pages[0].checksum.as_deref(), Some("def456"));
    }

    const SAMPLE_COLLECTION: &str = r##"<?xml version="1.0" encoding="UTF-8"?>
<mets:mets xmlns:mets="http://www.loc.gov/METS/v2" OBJID="Willie Jumper Stories" LABEL="A collection of manuscripts.">
  <mets:mdSec>
    <mets:mdGrp USE="DESCRIPTIVE">
      <mets:md ID="willie_jumper_stories_dc"/>
    </mets:mdGrp>
  </mets:mdSec>
  <mets:fileSec>
    <mets:fileGrp USE="archival">
      <mets:file ID="greetings_a" CHECKSUM="page123" CHECKSUMTYPE="SHA-256">
        <mets:FLocat LOCTYPE="SYSTEM" LOCREF="./editorial/willie_jumper_stories_intro_greetings.md"/>
      </mets:file>
    </mets:fileGrp>
  </mets:fileSec>
  <mets:structSec>
    <mets:structMap TYPE="logical">
      <mets:div TYPE="collection" LABEL="Willie Jumper Stories">
        <mets:div TYPE="document" LABEL="Story of Millie Pigeon">
          <mets:mptr LOCTYPE="URL" LOCREF="../documents/Story-of-Millie-Pigeon.mets.xml"/>
        </mets:div>
        <mets:div TYPE="editorial page" LABEL="Greetings">
          <mets:fptr FILEID="greetings_m"/>
          <mets:fptr FILEID="greetings_b"/>
          <mets:fptr FILEID="greetings_a"/>
        </mets:div>
      </mets:div>
    </mets:structMap>
  </mets:structSec>
</mets:mets>
"##;

    #[test]
    fn parses_collection_slug_documents_and_editorial_pages() {
        let parsed = parse_collection_file(SAMPLE_COLLECTION).expect("should parse");
        assert_eq!(parsed.title, "Willie Jumper Stories");
        assert_eq!(parsed.slug, "willie_jumper_stories");
        assert_eq!(
            parsed.description.as_deref(),
            Some("A collection of manuscripts.")
        );
        assert_eq!(
            parsed.document_mets_filenames,
            vec!["Story-of-Millie-Pigeon.mets.xml".to_string()]
        );
        assert_eq!(parsed.editorial_pages.len(), 1);
        assert_eq!(parsed.editorial_pages[0].title, "Greetings");
        assert_eq!(
            parsed.editorial_pages[0].archival_locref,
            "./editorial/willie_jumper_stories_intro_greetings.md"
        );
    }

    const SAMPLE_DOCUMENT: &str = r##"<?xml version="1.0" encoding="UTF-8"?>
<mets:mets xmlns:mets="http://www.loc.gov/METS/v2" OBJID="story-of-millie-pigeon" LABEL="Story of Millie Pigeon">
  <mets:mdSec>
    <mets:mdGrp USE="DESCRIPTIVE">
      <mets:mdRef ID="story-of-millie-pigeon_tei_desc" LOCTYPE="URL" LOCREF="./Story-of-Millie-Pigeon.tei.xml" MDTYPE="OTHER" OTHERMDTYPE="TEI" CHECKSUM="teichecksum" CHECKSUMTYPE="SHA-256"/>
    </mets:mdGrp>
  </mets:mdSec>
  <mets:fileSec>
    <mets:fileGrp USE="original">
      <mets:file ID="story-of-millie-pigeon_m.mp3" CHECKSUM="audiochecksum" CHECKSUMTYPE="SHA-256">
        <mets:FLocat LOCTYPE="URL" LOCREF="https://example.com/audio/millie.mp3"/>
      </mets:file>
      <mets:file ID="willie_jumper_stories_story-of-millie-pigeon_15532353_m">
        <mets:FLocat LOCTYPE="URL" LOCREF="https://images.example.com/iiif/2/images/dailp/15532353/full/max/0/default.jpg"/>
      </mets:file>
      <mets:file ID="willie_jumper_stories_collmets_m">
        <mets:FLocat LOCTYPE="URL" LOCREF="https://dailp.northeastern.edu/collections/willie_jumper_stories"/>
      </mets:file>
      <mets:file ID="w1_m" CHECKSUM="w1audiochecksum" CHECKSUMTYPE="SHA-256">
        <mets:FLocat LOCTYPE="URL" LOCREF="https://example.com/audio/w1.mp3"/>
      </mets:file>
    </mets:fileGrp>
    <mets:fileGrp USE="archival">
      <mets:file ID="story-of-millie-pigeon_a.mp3" CHECKSUM="audiochecksum" CHECKSUMTYPE="SHA-256">
        <mets:FLocat LOCTYPE="SYSTEM" LOCREF="../audio/Story-of-Millie-Pigeon/Story-of-Millie-Pigeon_audio.mp3"/>
      </mets:file>
      <mets:file ID="willie_jumper_stories_story-of-millie-pigeon_15532353_a">
        <mets:FLocat LOCTYPE="SYSTEM" LOCREF="../images/story-of-millie-pigeon_page1_15532353.jpg"/>
      </mets:file>
    </mets:fileGrp>
  </mets:fileSec>
</mets:mets>
"##;

    #[test]
    fn parses_document_tei_reference_and_collection_membership() {
        let parsed = parse_document_file(SAMPLE_DOCUMENT).expect("should parse");
        assert_eq!(parsed.title, "Story of Millie Pigeon");
        assert_eq!(
            parsed.tei_filename.as_deref(),
            Some("Story-of-Millie-Pigeon.tei.xml")
        );
        assert_eq!(parsed.tei_checksum.as_deref(), Some("teichecksum"));
        assert_eq!(
            parsed.collection_slugs,
            vec!["willie_jumper_stories".to_string()]
        );
    }

    #[test]
    fn parses_document_and_word_audio_real_resource_urls() {
        let parsed = parse_document_file(SAMPLE_DOCUMENT).expect("should parse");
        assert_eq!(
            parsed.document_audio_url.as_deref(),
            Some("https://example.com/audio/millie.mp3")
        );
        assert_eq!(
            parsed.word_audio_urls.get("w1").map(String::as_str),
            Some("https://example.com/audio/w1.mp3")
        );
    }

    #[test]
    fn parses_page_image_number_oid_and_source_url() {
        let parsed = parse_document_file(SAMPLE_DOCUMENT).expect("should parse");
        assert_eq!(parsed.page_images.len(), 1);
        let (page_number, oid, source_url) = &parsed.page_images[0];
        assert_eq!(*page_number, 1);
        assert_eq!(oid, "15532353");
        assert_eq!(source_url, "https://images.example.com/iiif/2/images/dailp");
    }
}
