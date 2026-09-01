//! Generates METS (Metadata Encoding & Transmission Standard) XML backup manifests
//! describing an [`dailp::EditedCollection`] and its member [`dailp::AnnotatedDoc`]s.
//!
//! Three Tera templates drive this:
//! - `migration/manifest.tera.xml` renders one manifest file per run, listing every
//!   collection processed.
//! - `migration/collection.tera.xml` renders one file per collection.
//! - `migration/document.tera.xml` renders one file per member document.
//!
//! Each document's word-for-word audio (where it's been recorded) is referenced
//! directly in its METS file; the word-for-word translation/analysis content itself is
//! encoded in a separate TEI XML file, rendered from `migration/translation.tera.xml` by
//! the sibling [`crate::tei`] module and written alongside this document's METS file.
//! Full multi-collection linkage is also out of scope for now — see the doc comment on
//! [`generate_mets_for_collection`].

use std::collections::{HashMap, HashSet};
use std::path::{Path, PathBuf};

use anyhow::{Context as _, Result};
use dailp::async_graphql::dataloader::Loader;
use dailp::{AnnotatedDoc, ChaptersInCollection, Database, DocumentId, EditedCollectionDetails};
use log::{info, warn};
use serde::Serialize;

use crate::checksum::sha256_hex;

/// Generates a full backup bundle for one collection into a fresh, timestamped run
/// directory, `<workspace root>/backups/xml/dailp/dailp-<timestamp>/`:
/// - `manifest.mets.xml` — lists the collection(s) processed in this run.
/// - `collections/<collection title>.mets.xml` — one per collection processed.
/// - `documents/<document title>.mets.xml` and `documents/<document title>.tei.xml` —
///   one METS/TEI pair per member document, sharing a filename stem (see
///   `CollectionDocumentEntry.file_stem`).
/// - `images/` — each document's manuscript page images, downloaded from their real IIIF
///   source and named `{document_slug}_{iiif_oid}.jpg` — see
///   [`crate::images::download_page_images`].
/// - `audio/<document file_stem>/` — each document's overall audio (if it has any) and its
///   word-for-word audio (for words with a recorded track), downloaded from their real
///   resource URLs — see [`crate::audio_backup::download_document_audio`]/
///   [`crate::audio_backup::download_words_with_audio`] for the exact filename convention.
/// - `editorial/<heading>/<page title>.{md,html}` — standalone site pages (not owned by
///   any edited collection), grouped by their top-level site-nav heading — see
///   [`crate::editorial::export_site_pages`].
/// - `collections/editorial/<collection>_<section>_<chapter>.{md,html}` — editorial
///   content for this collection's chapters that are backed by a `page` row (rather than,
///   or in addition to, an `AnnotatedDoc`) — see
///   [`crate::editorial::export_collection_chapters`].
///
/// `logs/` (see [`logs_dir`]) sits alongside the `dailp-<timestamp>` run directories,
/// not inside any one of them, since logs span runs.
///
/// Requires the `CF_URL` env var to be set (see `audio.rs`'s use of the same variable),
/// used for `cloud backup` file locations, and reads `TF_STAGE` (defaulting to
/// production) to build DAILP website URLs, mirroring the convention already used
/// elsewhere in this crate (`edited_collection.rs`, `main.rs`) and in
/// `terraform/website.nix`.
///
/// Known limitation: a document's METS file lists the collection(s) it belongs to as
/// just the collection processed in this run, since there's no `CollectionsForDocument`
/// reverse-lookup loader yet (mirroring `ChaptersInCollection` in
/// `types/src/database_sql.rs`), and this function itself only ever processes one
/// hardcoded collection per invocation (see the TODO in `migrate-to-xml.rs`). The
/// manifest file has the same limitation: it lists only the collection(s) processed in
/// this run, not every collection in the database.
pub async fn generate_mets_for_collection(db: &Database, collection_slug: &str) -> Result<()> {
    info!("Generating METS backups for collection \"{collection_slug}\"");

    let now = dailp::chrono::Utc::now();
    let created_at = now.format(CREATEDATE_FORMAT).to_string();
    let file_timestamp = now.format(FILENAME_TIMESTAMP_FORMAT).to_string();

    let cf_url = std::env::var("CF_URL").context(
        "CF_URL must be set to generate METS backups (used for cloud backup file locations)",
    )?;
    let dailp_base_url = dailp_base_url();

    let collection_key = EditedCollectionDetails(collection_slug.to_owned());
    let collection = Loader::load(db, &[collection_key.clone()])
        .await
        .map_err(|e| anyhow::anyhow!("Failed to load collection {collection_slug}: {e}"))?
        .remove(&collection_key)
        .ok_or_else(|| anyhow::anyhow!("No collection found with slug {collection_slug}"))?;
    info!("Loaded collection \"{}\"", collection.title);

    let chapters_key = ChaptersInCollection(collection_slug.to_owned());
    let chapters = Loader::load(db, &[chapters_key.clone()])
        .await
        .map_err(|e| anyhow::anyhow!("Failed to load chapters for {collection_slug}: {e}"))?
        .remove(&chapters_key)
        .unwrap_or_default();
    info!(
        "Loaded {} chapter(s) for \"{}\"",
        chapters.len(),
        collection.title
    );

    // Chapters without a document_id are Intro/Credit sections with no AnnotatedDoc of
    // their own; word/paragraph-level TEI content is out of scope here regardless.
    let document_ids: Vec<DocumentId> = chapters
        .iter()
        .filter_map(|chapter| chapter.document_id)
        .collect();

    let mut documents_by_id: HashMap<DocumentId, AnnotatedDoc> = Loader::load(db, &document_ids)
        .await
        .map_err(|e| anyhow::anyhow!("Failed to load documents for {collection_slug}: {e}"))?;

    if documents_by_id.len() < document_ids.len() {
        warn!(
            "{} chapter(s) in \"{}\" reference a document_id that couldn't be loaded; they'll be skipped",
            document_ids.len() - documents_by_id.len(),
            collection.title
        );
    }

    // Preserve the chapters' order (already sorted by the collection_chapters query).
    let documents: Vec<AnnotatedDoc> = document_ids
        .iter()
        .filter_map(|id| documents_by_id.remove(id))
        .collect();
    info!(
        "Loaded {} member document(s) for \"{}\"",
        documents.len(),
        collection.title
    );

    // Every file produced by this run lives under one fresh, timestamped directory, so
    // a run's collection/document/manifest files, its downloaded page images/audio, and
    // its editorial content are all found together.
    let run_root = output_root().join(format!("dailp-{file_timestamp}"));
    let collections_dir = run_root.join("collections");
    let documents_dir = run_root.join("documents");
    let audio_dir = run_root.join("audio");
    let editorial_dir = run_root.join("editorial");
    let collections_editorial_dir = collections_dir.join("editorial");
    let images_dir = run_root.join("images");
    for dir in [
        &collections_dir,
        &documents_dir,
        &audio_dir,
        &editorial_dir,
        &collections_editorial_dir,
        &images_dir,
    ] {
        std::fs::create_dir_all(dir)
            .with_context(|| format!("Failed to create directory {}", dir.display()))?;
    }
    // Standalone site pages (not owned by this or any other collection) grouped by their
    // top-level site-nav heading. Referenced from the manifest file below.
    //
    // TODO
    // Goal: Only reference, from manifest.mets.xml, the site pages that are actually
    // reachable from the site's nav menu (i.e. present in `build_menu_heading_map`'s
    // output, not just falling back to their own path/"uncategorized"), and give
    // `editorial/` its own manifest file (mirroring `collections/<slug>.mets.xml`) that
    // the top-level manifest points at via a single `mptr`, instead of listing every site
    // page's fileGrp entries directly in manifest.mets.xml.
    // Deferred because: needs a decision on what happens to pages absent from the menu
    // (omit entirely vs. still export to disk but leave unlinked from any manifest), plus
    // a new `editorial.tera.xml` template + context struct.
    let site_pages = crate::editorial::export_site_pages(db, &editorial_dir).await?;
    // This collection's chapters that are backed by a `page` row rather than (or in
    // addition to) an `AnnotatedDoc`. Referenced from this collection's own METS file
    // below.
    let collection_editorial_pages = crate::editorial::export_collection_chapters(
        db,
        &collection,
        &chapters,
        &collections_editorial_dir,
    )
    .await?;

    // Shared across every image/audio download this run makes, so connections/TLS sessions
    // are reused rather than re-established per file -- mirrors `audio.rs`'s `Client::new()`.
    let http_client = reqwest::Client::new();

    // Aggregate distinct contributor names across all member documents, in first-seen
    // order, since EditedCollection itself has no contributors field.
    let mut contributors = Vec::new();
    for doc in &documents {
        for contributor in doc.meta.contributors.iter().flatten() {
            if !contributors.contains(&contributor.name) {
                contributors.push(contributor.name.clone());
            }
        }
    }

    let citation = format!(
        "{} by {}, is licensed under CC BY-NC 4.0",
        collection.title,
        contributors.join(", ")
    );

    let mut collection_documents: Vec<CollectionDocumentEntry> =
        Vec::with_capacity(documents.len());
    for doc in &documents {
        // Every filename this document gets in the bundle (`.mets.xml`, `.tei.xml`, its
        // audio subdirectory, ...) shares this one stem, so they're guaranteed to stay
        // siblings with matching names. Computed once here rather than separately wherever
        // each filename is built, so `mets_filename` and `tei_filename` can't drift apart.
        let file_stem = sanitize_for_path(&doc.meta.title);

        // `None`/empty when the document has no linked audio recording at all, OR when it
        // does but downloading it failed after retries -- both cases collapse identically
        // here so every fileGrp (not just archival) falls back to a `<!-- No audio for
        // ... -->` comment instead of a `file` entry with nothing real to reference. See
        // `audio_backup`'s module doc comment for why a failed download is treated this way.
        let (audio_locref, ext, archival_locref, checksum) = match &doc.meta.audio_recording {
            Some(audio) => {
                let document_audio_dir = audio_dir.join(&file_stem);
                match crate::audio_backup::download_document_audio(
                    &http_client,
                    &audio.resource_url,
                    &document_audio_dir,
                    &file_stem,
                )
                .await
                {
                    Ok(downloaded) => (
                        Some(escape_xml(&audio.resource_url)),
                        file_extension(&audio.resource_url),
                        Some(downloaded.archival_locref),
                        Some(downloaded.checksum),
                    ),
                    Err(e) => {
                        warn!(
                            "Failed to download document audio for \"{}\" after retries: {e:#}. \
                             Treating this document as if it has no audio.",
                            doc.meta.title
                        );
                        (None, String::new(), None, None)
                    }
                }
            }
            None => (None, String::new(), None, None),
        };

        collection_documents.push(CollectionDocumentEntry {
            title: escape_xml(&doc.meta.title),
            // Slugified from the document's *title* (not its compact internal
            // `short_name`, e.g. "ms108") so that every ID referencing this document
            // across the bundle is human-readable. Mirrors
            // `DocumentMetsContext.document_slug` below, so a document's own METS
            // file and its entry here use the same slug. Note: two documents that
            // happen to share a title would collide here; there's no uniqueness
            // check for that today. Used only for `xml:id`/`OBJID` attributes, never
            // for filenames -- see `file_stem`.
            slug: dailp::slugify(&doc.meta.title),
            ext,
            audio_locref,
            archival_locref,
            checksum,
            // Lives in this run's `documents/` directory; the timestamp that used to
            // disambiguate this filename now lives in the run directory's own name
            // instead (`dailp-<timestamp>/`).
            mets_filename: format!("{file_stem}.mets.xml"),
            file_stem,
        });
    }

    let collection_mets_filename = format!("{}.mets.xml", sanitize_for_path(&collection.title));

    // `collections/editorial/` is a direct sibling of this collection's own METS file
    // (both live in `collections/`), and `editorial/` is a direct sibling of the manifest
    // (both live at the run root), so the same "./editorial/<relative_path>" archival
    // locref shape works for both -- see `editorial_page_refs`.
    let editorial_pages =
        editorial_page_refs(&collection_editorial_pages, &dailp_base_url, &cf_url);

    let collection_ctx = CollectionMetsContext {
        collection_title: escape_xml(&collection.title),
        collection_label: escape_xml(
            collection
                .description
                .as_deref()
                .unwrap_or(&collection.title),
        ),
        collection_slug: collection.slug.clone(),
        cf_url: cf_url.clone(),
        now: created_at.clone(),
        contributors: contributors.iter().map(|name| escape_xml(name)).collect(),
        citation: escape_xml(&citation),
        documents: collection_documents.clone(),
        editorial_pages,
    };

    let collection_xml = render_collection_mets(&collection_ctx)?;
    // Computed before writing (from the same `String` about to be written) rather than
    // read back off disk, so this document's METS/TEI files -- rendered later in this same
    // run, before the collection file's bytes could ever change -- can reference exactly
    // what's on disk.
    let collection_checksum = sha256_hex(collection_xml.as_bytes());
    let collection_path = collections_dir.join(&collection_mets_filename);
    std::fs::write(&collection_path, collection_xml)
        .with_context(|| format!("Failed to write {}", collection_path.display()))?;
    info!(
        "Wrote collection METS file to {}",
        collection_path.display()
    );

    // Collection(s) referenced from the manifest and from each document's fileSec. Only
    // the collection processed in this run today — see the doc comment above.
    let collection_refs = vec![CollectionRef {
        slug: collection.slug.clone(),
        title: escape_xml(&collection.title),
        mets_filename: collection_mets_filename,
        checksum: collection_checksum,
    }];

    let manifest_filename = "manifest.mets.xml".to_owned();
    let manifest_ctx = ManifestMetsContext {
        now: created_at.clone(),
        cf_url: cf_url.clone(),
        dailp_base_url: dailp_base_url.clone(),
        collections: collection_refs.clone(),
        site_pages: editorial_page_refs(&site_pages, &dailp_base_url, &cf_url),
    };
    let manifest_xml = render_manifest_mets(&manifest_ctx)?;
    // Same reasoning as `collection_checksum` above -- computed from the in-memory string
    // this run is about to write, so it's available for every document's METS file
    // (rendered further down, in this same run) to reference.
    let manifest_checksum = sha256_hex(manifest_xml.as_bytes());
    let manifest_path = run_root.join(&manifest_filename);
    std::fs::write(&manifest_path, manifest_xml)
        .with_context(|| format!("Failed to write {}", manifest_path.display()))?;
    info!("Wrote manifest METS file to {}", manifest_path.display());

    // Collected alongside each document's METS/TEI files so `validate_tei_bundle` (run
    // once, after this loop) can confirm both files agree with each other and with what's
    // actually on disk, rather than just trusting the in-memory data used to write them.
    let mut tei_validation_entries = Vec::new();

    for (i, (doc, entry)) in documents
        .iter()
        .zip(collection_documents.iter())
        .enumerate()
    {
        // Loaded once per document and shared by `document_page_images`, `words_with_audio`,
        // and the TEI render below, rather than each of them separately querying
        // `PagesInDocument`/`ParagraphsInPage`/`WordsInParagraph` -- see
        // `tei::load_document_pages`.
        let pages = crate::tei::load_document_pages(db, doc).await?;

        // Documents with no real linguistic content (no page/paragraph loaded at all, or
        // every paragraph has neither a translation nor any real words -- see
        // `tei::has_linguistic_content`) get no TEI file -- there'd be nothing but an
        // empty header in it. Bare source with no translation yet still counts, since a
        // document can be transcribed before it's translated. `document.tera.xml`
        // renders a "<!-- No TEI file; ... -->" comment in every place a TEI reference
        // would otherwise appear when this is `None`, mirroring how it already handles
        // documents with no `audio_url`.
        let tei_filename = crate::tei::has_linguistic_content(&pages)
            .then(|| format!("{}.tei.xml", entry.file_stem));

        // Reuse `entry.slug` (computed above from the document's title) rather than
        // re-deriving it, so a document's own METS file and its entry in the collection
        // file are guaranteed to agree.
        let document_slug = entry.slug.clone();

        // Downloads each page's manuscript image (resolving its real IIIF source URL
        // along the way) into this run's `images/` directory, named
        // `{document_slug}_{oid}.jpg`. See `document_page_images`.
        let page_images =
            document_page_images(&http_client, db, &pages, &document_slug, &images_dir).await?;

        // Downloads this document's word-for-word audio into the same per-document
        // audio subdirectory its overall audio (if any) was already downloaded into above
        // -- see `words_with_audio`.
        let document_audio_dir = audio_dir.join(&entry.file_stem);
        let words_with_audio =
            words_with_audio(&http_client, &pages, &document_audio_dir, &entry.file_stem).await?;

        // The TEI file is this document's actual word-for-word content; it's rendered and
        // written *before* this document's own METS file below (reversed from write
        // order in an earlier version of this function) so the METS file's DESCRIPTIVE
        // `mdRef`/TEI `file_entry` references can carry the TEI file's own checksum --
        // see `DocumentMetsContext.tei_checksum`.
        //
        // Maps each word's id to its archived audio filename, so the TEI file's per-word
        // `<ptr type="audio">` (see `tei_macros.tera.xml`) references exactly the same file
        // this document's own METS file does -- see `DocumentMetsContext.words_with_audio`.
        let word_audio_locrefs: HashMap<String, String> = words_with_audio
            .iter()
            .map(|word| (word.id.clone(), word.archival_locref.clone()))
            .collect();
        let tei_checksum = if let Some(tei_filename) = &tei_filename {
            // Links back to this document's own METS file, plus its neighbors' (in
            // collection order), for navigation -- see `tei::DocumentNavigation`. Built
            // from filenames only (no content), so it's available before this document's
            // own METS file has been rendered.
            let navigation = crate::tei::DocumentNavigation {
                mets_filename: entry.mets_filename.clone(),
                prev_mets_filename: i
                    .checked_sub(1)
                    .map(|prev| collection_documents[prev].mets_filename.clone()),
                next_mets_filename: collection_documents
                    .get(i + 1)
                    .map(|next| next.mets_filename.clone()),
            };
            let tei_xml = crate::tei::render_document_tei(
                db,
                &pages,
                doc,
                &collection_ctx.collection_title,
                &navigation,
                entry.archival_locref.as_deref(),
                &word_audio_locrefs,
            )
            .await?;
            let checksum = sha256_hex(tei_xml.as_bytes());
            let tei_path = documents_dir.join(tei_filename);
            std::fs::write(&tei_path, tei_xml)
                .with_context(|| format!("Failed to write {}", tei_path.display()))?;
            info!(
                "Wrote document TEI file for \"{}\" to {}",
                doc.meta.title,
                tei_path.display()
            );

            tei_validation_entries.push(TeiValidationEntry {
                mets_filename: entry.mets_filename.clone(),
                tei_filename: tei_filename.clone(),
                word_ids: words_with_audio
                    .iter()
                    .map(|word| word.id.clone())
                    .collect(),
            });

            Some(checksum)
        } else {
            info!(
                "Skipping TEI file for \"{}\": no linguistic content present during export",
                doc.meta.title
            );
            None
        };

        let document_ctx = DocumentMetsContext {
            document_title: escape_xml(&doc.meta.title),
            now: created_at.clone(),
            // `collection.slug` is the collection's own compact identifier (e.g.
            // "willie_jumper_stories"), unrelated to how document slugs are derived.
            collection_slug: collection.slug.clone(),
            document_slug: document_slug.clone(),
            cf_url: cf_url.clone(),
            dailp_base_url: dailp_base_url.clone(),
            manifest_filename: manifest_filename.clone(),
            manifest_checksum: manifest_checksum.clone(),
            collections: collection_refs.clone(),
            // Shares `entry.file_stem` with `entry.mets_filename` (`{file_stem}.mets.xml`)
            // so this document's METS and TEI files are true siblings with matching
            // names, rather than deriving this from `document_slug` (which would give it
            // a different stem than its own METS file — see `CollectionDocumentEntry`).
            // `None` when this document has no linguistic content -- see above.
            tei_filename: tei_filename.clone(),
            tei_checksum,
            // `entry.audio_locref` is already XML-escaped above.
            audio_url: entry.audio_locref.clone(),
            ext: entry.ext.clone(),
            archival_locref: entry.archival_locref.clone(),
            checksum: entry.checksum.clone(),
            // `doc.meta.page_images` is never populated by the `Loader<DocumentId>` this
            // function loads documents through (nor by any other loader in the codebase
            // -- it's legacy/dead), so page images come from the freshly-loaded `pages`
            // instead. See `document_page_images` (called above).
            page_images,
            words_with_audio,
        };

        let document_xml = render_document_mets(&document_ctx)?;
        let document_path = documents_dir.join(&entry.mets_filename);
        std::fs::write(&document_path, document_xml)
            .with_context(|| format!("Failed to write {}", document_path.display()))?;
        info!(
            "Wrote document METS file for \"{}\" to {}",
            doc.meta.title,
            document_path.display()
        );
    }

    // Read the collection METS file back off disk and confirm every document reference
    // in it actually resolves, rather than just trusting the in-memory data used to
    // produce it — see `validate_document_references`.
    let expected_document_filenames: Vec<String> = collection_documents
        .iter()
        .map(|entry| entry.mets_filename.clone())
        .collect();
    validate_document_references(
        &collection_path,
        &collections_dir,
        &expected_document_filenames,
    )?;

    // Likewise, confirm each document's TEI file actually exists where its METS file
    // says it does, and that the two files agree on cross-references (word ids that
    // have audio in the METS structSec must exist as `xml:id`s in the TEI file, and
    // every internal `corresp`/`target` in the TEI file must resolve within it).
    validate_tei_bundle(&documents_dir, &tei_validation_entries)?;

    info!(
        "Finished generating METS backups for \"{}\" in {}: 1 manifest file + 1 collection file + {} document file(s)",
        collection.title,
        run_root.display(),
        documents.len()
    );

    Ok(())
}

/// Parses a just-written collection METS file back off disk and confirms every document
/// reference in its `structMap` (each `mptr` inside a `TYPE="document"` `div`) both
/// points into the run's `documents/` directory (`"../documents/<filename>"`, relative to
/// the collection file's own location in `collections/`) and resolves to a file that
/// actually exists there. Also confirms the set of referenced filenames exactly matches
/// `expected_document_filenames`, so a document silently dropped from (or wrongly added
/// to) the structMap would still be caught.
///
/// This is a genuine post-hoc check of the bundle as written, not a re-derivation of the
/// same in-memory data used to write it, so it would also catch e.g. a future template
/// change that stops emitting `mptr` correctly.
fn validate_document_references(
    collection_path: &Path,
    collections_dir: &Path,
    expected_document_filenames: &[String],
) -> Result<()> {
    const DOCUMENTS_PREFIX: &str = "../documents/";

    let xml = std::fs::read_to_string(collection_path).with_context(|| {
        format!(
            "Failed to read {} back for bundle validation",
            collection_path.display()
        )
    })?;
    let tree = roxmltree::Document::parse(&xml).with_context(|| {
        format!(
            "{} is not well-formed XML, so its document references couldn't be validated",
            collection_path.display()
        )
    })?;

    let mut remaining: HashSet<&str> = expected_document_filenames
        .iter()
        .map(String::as_str)
        .collect();
    let mut errors = Vec::new();

    for div in tree
        .descendants()
        .filter(|n| n.tag_name().name() == "div" && n.attribute("TYPE") == Some("document"))
    {
        let label = div.attribute("LABEL").unwrap_or("<unlabeled document>");
        let Some(mptr) = div.children().find(|n| n.tag_name().name() == "mptr") else {
            errors.push(format!(
                "document \"{label}\" has no mptr referencing its METS file"
            ));
            continue;
        };
        let Some(locref) = mptr.attribute("LOCREF") else {
            errors.push(format!("document \"{label}\"'s mptr has no LOCREF"));
            continue;
        };
        let Some(filename) = locref.strip_prefix(DOCUMENTS_PREFIX) else {
            errors.push(format!(
                "document \"{label}\"'s mptr LOCREF \"{locref}\" doesn't start with the \
                 expected \"{DOCUMENTS_PREFIX}\""
            ));
            continue;
        };
        if !remaining.remove(filename) {
            errors.push(format!(
                "document \"{label}\"'s mptr LOCREF \"{locref}\" doesn't match any expected \
                 document filename (unknown, or already referenced by another div)"
            ));
        }
        let referenced_path = collections_dir.join(locref);
        if !referenced_path.is_file() {
            errors.push(format!(
                "document \"{label}\"'s mptr LOCREF \"{locref}\" doesn't resolve to a file at {}",
                referenced_path.display()
            ));
        }
    }

    for missing in remaining {
        errors.push(format!(
            "expected document file \"{missing}\" has no mptr referencing it in the structMap"
        ));
    }

    if errors.is_empty() {
        Ok(())
    } else {
        anyhow::bail!(
            "Bundle validation failed for {}:\n- {}",
            collection_path.display(),
            errors.join("\n- ")
        )
    }
}

/// Per-document inputs to `validate_tei_bundle`: which files to check, and which word
/// ids the METS file's word-audio structSec references (see `words_with_audio`).
struct TeiValidationEntry {
    mets_filename: String,
    tei_filename: String,
    word_ids: Vec<String>,
}

/// The namespace URI bound to the reserved `xml` prefix (used for `xml:id`), predefined
/// by the XML spec itself rather than declared in any of these documents.
const XML_NAMESPACE: &str = "http://www.w3.org/XML/1998/namespace";

/// For every document, confirms its TEI file exists in `documents_dir` (alongside its
/// METS file, per `entry.tei_filename`) and is internally consistent with itself and with
/// its METS file:
/// - Every `corresp`/`target` attribute in the TEI file resolves to an `xml:id` defined
///   somewhere else in the same file, rather than a dangling cross-reference.
/// - Every word id the METS file's word-audio structSec references (`w{index}`, from
///   `words_with_audio`) exists as an `xml:id` on some element in the TEI file, so the two
///   files can't silently drift apart on which words have audio.
///
/// Like `validate_document_references`, this re-reads the just-written files off disk
/// rather than re-checking the in-memory data that produced them.
fn validate_tei_bundle(documents_dir: &Path, entries: &[TeiValidationEntry]) -> Result<()> {
    let mut errors = Vec::new();

    for entry in entries {
        let tei_path = documents_dir.join(&entry.tei_filename);
        let xml = match std::fs::read_to_string(&tei_path) {
            Ok(xml) => xml,
            Err(e) => {
                errors.push(format!(
                    "document \"{}\"'s TEI file doesn't exist at {}: {e}",
                    entry.mets_filename,
                    tei_path.display()
                ));
                continue;
            }
        };
        let tree = match roxmltree::Document::parse(&xml) {
            Ok(tree) => tree,
            Err(e) => {
                errors.push(format!(
                    "{} is not well-formed XML: {e}",
                    tei_path.display()
                ));
                continue;
            }
        };

        let defined_ids: HashSet<&str> = tree
            .descendants()
            .filter_map(|node| {
                node.attributes()
                    .find(|attr| attr.name() == "id" && attr.namespace() == Some(XML_NAMESPACE))
                    .map(|attr| attr.value())
            })
            .collect();

        for node in tree.descendants() {
            for attr_name in ["corresp", "target"] {
                let Some(value) = node.attribute(attr_name) else {
                    continue;
                };
                for reference in value.split_whitespace() {
                    let Some(id) = reference.strip_prefix('#') else {
                        continue;
                    };
                    if !defined_ids.contains(id) {
                        errors.push(format!(
                            "{}: {attr_name}=\"{value}\" doesn't resolve to any xml:id in the file",
                            tei_path.display()
                        ));
                    }
                }
            }
        }

        for word_id in &entry.word_ids {
            if !defined_ids.contains(word_id.as_str()) {
                errors.push(format!(
                    "{}'s METS file references word-audio for \"{word_id}\", but {} has no \
                     matching xml:id",
                    entry.mets_filename,
                    tei_path.display()
                ));
            }
        }
    }

    if errors.is_empty() {
        Ok(())
    } else {
        anyhow::bail!("TEI bundle validation failed:\n- {}", errors.join("\n- "))
    }
}

/// Returns the directory that backup XML files are written under. Resolved relative to
/// the workspace root (via `CARGO_MANIFEST_DIR`, set at compile time to this crate's
/// directory) rather than the current working directory, so output lands in the same
/// place regardless of where the binary is invoked from. Each run gets its own
/// `dailp-<timestamp>` subdirectory here (see [`generate_mets_for_collection`]);
/// `logs/` (see [`logs_dir`]) is the one thing that lives directly under this directory.
fn output_root() -> PathBuf {
    Path::new(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .expect("migration crate should live directly under the workspace root")
        .join("backups/xml/dailp")
}

/// Returns the directory that this program's log files are written under
/// (`<output_root>/logs`).
pub fn logs_dir() -> PathBuf {
    output_root().join("logs")
}

/// Format used for the human-readable `CREATEDATE` attribute in the rendered METS,
/// matching the style of the hand-written example files (e.g. "2026-08-06T15:10:00").
const CREATEDATE_FORMAT: &str = "%Y-%m-%dT%H:%M:%S";
/// Format used for the `dailp-[timestamp]` run directory name. Colon-free so it's safe
/// on every filesystem.
const FILENAME_TIMESTAMP_FORMAT: &str = "%Y%m%dT%H%M%S";

const COLLECTION_TEMPLATE_NAME: &str = "collection.tera.xml";
const DOCUMENT_TEMPLATE_NAME: &str = "document.tera.xml";
const MANIFEST_TEMPLATE_NAME: &str = "manifest.tera.xml";
const MACROS_TEMPLATE_NAME: &str = "mets_macros.tera.xml";
const COLLECTION_TEMPLATE_SRC: &str = include_str!("../collection.tera.xml");
const DOCUMENT_TEMPLATE_SRC: &str = include_str!("../document.tera.xml");
const MANIFEST_TEMPLATE_SRC: &str = include_str!("../manifest.tera.xml");
const MACROS_TEMPLATE_SRC: &str = include_str!("../mets_macros.tera.xml");

/// Context for rendering `manifest.tera.xml`.
#[derive(Serialize)]
struct ManifestMetsContext {
    now: String,
    cf_url: String,
    dailp_base_url: String,
    collections: Vec<CollectionRef>,
    /// Standalone site pages (not owned by any edited collection) -- see
    /// [`crate::editorial::export_site_pages`]/[`editorial_page_refs`].
    site_pages: Vec<EditorialPageRef>,
}

/// Context for rendering `collection.tera.xml`.
#[derive(Serialize)]
struct CollectionMetsContext {
    collection_title: String,
    /// Falls back to the collection's title when it has no description.
    collection_label: String,
    /// `xs:ID`-safe slug for the collection, used to build `md@ID`s.
    collection_slug: String,
    cf_url: String,
    now: String,
    /// Distinct contributor names gathered from every member document, in first-seen order.
    contributors: Vec<String>,
    citation: String,
    documents: Vec<CollectionDocumentEntry>,
    /// This collection's chapters that are backed by a `page` row -- see
    /// [`crate::editorial::export_collection_chapters`]/[`editorial_page_refs`].
    editorial_pages: Vec<EditorialPageRef>,
}

/// One editorial page/chapter (see [`crate::editorial::EditorialPageEntry`]), resolved
/// into the three locrefs a METS `fileGrp` needs -- built by [`editorial_page_refs`] for
/// both `CollectionMetsContext.editorial_pages` and `ManifestMetsContext.site_pages`,
/// since both are written into an `editorial/` directory that's a direct sibling of the
/// METS file referencing it.
#[derive(Serialize, Clone)]
struct EditorialPageRef {
    /// `xs:ID`-safe slug for this page, used to build `file@ID`s (`{id}_m`/`_b`/`_a`).
    ///
    /// TODO
    /// Goal: Replace the terse "_m"/"_b"/"_a" suffix convention (original/cloud
    /// backup/archival) used to build every `file@ID` across this crate's templates
    /// (`collection.tera.xml`, `document.tera.xml`, `manifest.tera.xml`, and this struct)
    /// with clearer, self-describing suffixes, e.g. "_original"/"_cloudbackup"/"_archival".
    /// Deferred because: it's a purely cosmetic rename with no functional gap, but touches
    /// every fileGrp loop in every template plus every `*Ref`/`*Entry` struct across
    /// `mets.rs`, `audio_backup.rs`, and `images.rs` -- a coordinated rename, not a local
    /// fix, and lower priority than functional gaps.
    id: String,
    title: String,
    /// This content's live URL on the DAILP website, e.g.
    /// "https://.../about/team" -- used for the "original" fileGrp.
    original_locref: String,
    /// This content's cloud-backup URL, e.g. "{CF_URL}/team.md" -- mirrors how every
    /// other "cloud backup" fileGrp entry in this crate uses just the bare filename
    /// (not a full relative path) against `CF_URL`; see `DocumentMetsContext`'s own
    /// `cf_url` usage for the same simplification.
    cloud_locref: String,
    /// Path to this content file, relative to wherever it's referenced from (either
    /// `collections/<collection>.mets.xml` or the run-root `manifest.mets.xml`) -- both
    /// have an `editorial/` directory as a direct child, so this is always
    /// `"./editorial/<relative_path>"`.
    archival_locref: String,
    /// SHA-256 checksum (see `crate::checksum`) of the exported file this page was
    /// written to. Attached to the `cloud_locref`/`archival_locref` fileGrp entries only
    /// -- `original_locref` is a live, rendered webpage, not this exact file's bytes, so
    /// no checksum applies there.
    checksum: String,
}

/// Resolves a set of just-written [`crate::editorial::EditorialPageEntry`]s into
/// [`EditorialPageRef`]s a METS `fileGrp`/`structMap` can reference. Shared by both
/// `CollectionMetsContext.editorial_pages` and `ManifestMetsContext.site_pages` -- see the
/// doc comment on [`EditorialPageRef`] for why the same archival locref shape works for
/// both.
fn editorial_page_refs(
    pages: &[crate::editorial::EditorialPageEntry],
    dailp_base_url: &str,
    cf_url: &str,
) -> Vec<EditorialPageRef> {
    pages
        .iter()
        .map(|page| {
            let filename = Path::new(&page.relative_path)
                .file_name()
                .map(|name| name.to_string_lossy().into_owned())
                .unwrap_or_else(|| page.relative_path.clone());
            EditorialPageRef {
                id: dailp::slugify(&page.relative_path),
                title: escape_xml(&page.title),
                original_locref: escape_xml(&format!("{dailp_base_url}{}", page.site_path)),
                cloud_locref: escape_xml(&format!("{cf_url}/{filename}")),
                archival_locref: format!("./editorial/{}", page.relative_path),
                checksum: page.checksum.clone(),
            }
        })
        .collect()
}

#[derive(Serialize, Clone)]
struct CollectionDocumentEntry {
    title: String,
    /// `xs:ID`-safe slug for this document, used to build `file@ID`s in the collection
    /// METS file. Mirrors `DocumentMetsContext.document_slug`. Never used for
    /// filenames — see `file_stem`.
    slug: String,
    /// The document's real audio resource URL, or `None` if it has no audio recording, OR
    /// if it does but downloading it failed after retries -- both cases render identically
    /// (a `<!-- No audio for ... -->` comment) in every fileGrp, per
    /// `audio_backup`'s module doc comment on why a download failure collapses all three
    /// fileGrps, not just `archival`.
    audio_locref: Option<String>,
    /// File extension (including the leading `.`) derived from `audio_locref`, or an
    /// empty string when there's no audio.
    ext: String,
    /// Path to this document's archived audio file, relative to wherever it's referenced
    /// from (`collections/`, for this collection's own METS file, and `documents/`, for
    /// the document's own METS/TEI files -- both are one level below the run root, same as
    /// `audio/`, so the same `"../audio/..."` prefix works for both). `Some` iff
    /// `audio_locref` is `Some`. Computed once (see `generate_mets_for_collection`) and
    /// shared with `DocumentMetsContext.archival_locref` so a document's own METS file and
    /// its entry in the collection file can't disagree about where its audio lives.
    archival_locref: Option<String>,
    /// SHA-256 checksum (see `crate::checksum`) of the audio file referenced above --
    /// `Some` iff `archival_locref` is `Some`. The same downloaded bytes are referenced
    /// from every fileGrp (original/cloud backup/archival) across the bundle, so this one
    /// checksum covers all of them.
    checksum: Option<String>,
    /// Filename (not a path) of the corresponding document-level METS file, written to
    /// this run's `documents/` directory — a sibling of `collections/`, where the
    /// collection file referencing it lives.
    mets_filename: String,
    /// Filesystem-safe stem (`sanitize_for_path(&doc.meta.title)`) shared by every file
    /// this document gets in the bundle. `mets_filename` above is `{file_stem}.mets.xml`;
    /// `DocumentMetsContext.tei_filename` is `{file_stem}.tei.xml` — deriving both from
    /// the same stem guarantees a document's METS and TEI files are true siblings with
    /// matching names, the way collection/manifest files already are.
    file_stem: String,
}

/// A reference to a collection-level METS file, used both by the manifest (listing every
/// collection processed) and by each document (listing the collection(s) it belongs to).
#[derive(Serialize, Clone)]
struct CollectionRef {
    slug: String,
    title: String,
    /// Filename (not a path) of the collection's METS file, written to this run's
    /// `collections/` directory.
    mets_filename: String,
    /// SHA-256 checksum (see `crate::checksum`) of the collection METS file's own
    /// rendered content.
    checksum: String,
}

/// One manuscript page image, surfaced for `document.tera.xml`'s three fileGrp loops and
/// its structSec `area` loop. `source_url` and `filename` are resolved/computed once here
/// (see `document_page_images`) rather than re-derived in the template, mirroring
/// `WordAudioEntry.ext` below.
#[derive(Serialize, Clone)]
struct PageImageEntry {
    /// Bare IIIF oid, e.g. "15532353" -- still used for building `xml:id`s, matching every
    /// existing ID-building convention in `document.tera.xml`.
    oid: String,
    /// This oid's resolved `ImageSource.url` (e.g.
    /// "https://images.library.northeastern.edu/iiif/2/images/dailp"), used to build the
    /// "original" fileGrp's real per-image locref instead of a single hardcoded host.
    source_url: String,
    /// Archival filename this image was downloaded to in `images/`,
    /// "{document_slug}_page{page_number}_{oid}.jpg" -- computed once here so every locref
    /// referencing this file (across all three fileGrps) agrees with what's actually on
    /// disk. Includes the page number (not just the oid) since a single page can reference
    /// more than one oid -- see `crate::images`'s module doc comment.
    filename: String,
    /// SHA-256 checksum (see `crate::checksum`) of the downloaded image bytes.
    checksum: String,
}

/// One word's recorded, successfully-archived audio, surfaced for `document.tera.xml`'s
/// word-for-word fileSec/structSec entries and for the TEI file's per-word `<ptr
/// type="audio">`. Only words whose download succeeded produce an entry -- see
/// [`crate::audio_backup::download_words_with_audio`].
#[derive(Serialize, Clone)]
struct WordAudioEntry {
    /// `"w" + position index`, matching the word-ID convention established in
    /// `migration/tei_macros.tera.xml`'s TEI-generation macros.
    id: String,
    audio_url: String,
    /// File extension (including the leading `.`) derived from `audio_url`.
    ext: String,
    /// Path to this word's archived audio file, relative to `documents/` (where both this
    /// document's METS and TEI files live), e.g.
    /// `"../audio/Story-of-Millie-Pigeon/1_o-sdi_w1.mp3"`.
    archival_locref: String,
    /// SHA-256 checksum (see `crate::checksum`) of the downloaded audio bytes.
    checksum: String,
}

/// Context for rendering `document.tera.xml`.
#[derive(Serialize)]
struct DocumentMetsContext {
    document_title: String,
    now: String,
    collection_slug: String,
    document_slug: String,
    cf_url: String,
    dailp_base_url: String,
    /// Filename (not a path) of the manifest METS file produced in this run, one
    /// directory up from this document (`../manifest.mets.xml`).
    manifest_filename: String,
    /// SHA-256 checksum (see `crate::checksum`) of the manifest METS file's own rendered
    /// content, computed in `generate_mets_for_collection` right after it's rendered (and
    /// before this document's own METS file is), since the manifest is written before the
    /// per-document loop runs.
    manifest_checksum: String,
    /// Collection(s) this document belongs to. Just the collection processed in this
    /// run today — see the doc comment on `generate_mets_for_collection`.
    collections: Vec<CollectionRef>,
    /// Filename of this document's TEI file (see `tei::render_document_tei`), written
    /// alongside this document's own METS file in the run's `documents/` directory.
    /// Shares its stem with `mets_filename` -- see `CollectionDocumentEntry.file_stem`.
    /// `None` when the document has no linguistic content (see
    /// `tei::has_linguistic_content`) -- the template renders a "<!-- No TEI file; ... -->"
    /// comment in that case rather than a reference to a file that was never written,
    /// mirroring how it already handles documents with no `audio_url`.
    tei_filename: Option<String>,
    /// SHA-256 checksum (see `crate::checksum`) of the TEI file's own rendered content --
    /// `Some` iff `tei_filename` is `Some`.
    tei_checksum: Option<String>,
    /// The document's real audio resource URL, or `None` if it has no audio recording —
    /// the template renders a `<!-- No audio for ... -->` comment in that case rather
    /// than a `file` entry with nothing real to reference.
    audio_url: Option<String>,
    /// File extension (including the leading `.`) derived from `audio_url`, or an empty
    /// string when there's no audio.
    ext: String,
    /// Same value as `CollectionDocumentEntry.archival_locref` for this document -- see
    /// that field's doc comment. `None` exactly when `audio_url` is `None`.
    archival_locref: Option<String>,
    /// Same value as `CollectionDocumentEntry.checksum` for this document. `None` exactly
    /// when `audio_url` is `None`.
    checksum: Option<String>,
    /// The document's manuscript page images, in page order, each already downloaded into
    /// this run's `images/` directory -- see `document_page_images`.
    page_images: Vec<PageImageEntry>,
    /// Words with a recorded `ingested_audio_track`, in document order. Words without
    /// recorded audio are omitted entirely rather than emitted with a placeholder.
    words_with_audio: Vec<WordAudioEntry>,
}

/// Downloads a document's manuscript page images (see [`crate::images::download_page_images`])
/// and adapts the result into the `Serialize`-able shape `document.tera.xml` renders.
/// Reads already-loaded `pages` (see [`crate::tei::load_document_pages`]) rather than
/// `doc.meta.page_images` (always `None` -- see the comment where this is called) --
/// each [`DocumentPage`] carries its own optional image, which is the real, current
/// source of this data.
async fn document_page_images(
    client: &reqwest::Client,
    db: &Database,
    pages: &[crate::tei::LoadedPage],
    document_slug: &str,
    images_dir: &Path,
) -> Result<Vec<PageImageEntry>> {
    let downloaded =
        crate::images::download_page_images(client, db, pages, document_slug, images_dir).await?;
    Ok(downloaded
        .into_iter()
        .map(|image| PageImageEntry {
            oid: image.oid,
            source_url: image.source_url,
            filename: image.filename,
            checksum: image.checksum,
        })
        .collect())
}

/// Downloads a document's word-for-word audio (see
/// [`crate::audio_backup::download_words_with_audio`]) into `document_audio_dir` and adapts
/// the result into the `Serialize`-able shape `document.tera.xml` (and, via the map built in
/// `generate_mets_for_collection`, the TEI template) renders. Mirrors `document_page_images`
/// just above. Words whose download fails are omitted entirely, mirroring how words with no
/// recorded audio at all are already omitted -- see `audio_backup::download_words_with_audio`.
async fn words_with_audio(
    client: &reqwest::Client,
    pages: &[crate::tei::LoadedPage],
    document_audio_dir: &Path,
    file_stem: &str,
) -> Result<Vec<WordAudioEntry>> {
    let downloaded = crate::audio_backup::download_words_with_audio(
        client,
        pages,
        document_audio_dir,
        file_stem,
    )
    .await?;
    Ok(downloaded
        .into_iter()
        .map(|w| WordAudioEntry {
            id: w.id,
            audio_url: w.audio_url,
            ext: w.ext,
            archival_locref: w.archival_locref,
            checksum: w.checksum,
        })
        .collect())
}

/// Builds the DAILP website's base URL for the current deployment stage, matching the
/// convention already used for Terraform's own domain construction
/// (`terraform/website.nix`: `{stage}.dailp.northeastern.edu` for non-prod stages, bare
/// `dailp.northeastern.edu` for `prod`) and for reading `TF_STAGE` elsewhere in this
/// crate (`edited_collection.rs`, `main.rs`).
fn dailp_base_url() -> String {
    let stage = std::env::var("TF_STAGE").unwrap_or_default(); // "" | "dev" | "uat" | "prod"
    if stage.is_empty() || stage == "prod" {
        "https://dailp.northeastern.edu".to_owned()
    } else {
        format!("https://{stage}.dailp.northeastern.edu")
    }
}

fn build_tera() -> Result<tera::Tera> {
    let mut tera = tera::Tera::default();
    // Tera autoescapes ".xml"-named templates by default using its HTML escaper, which
    // (among other things) turns every "/" into "&#x2F;" -- appropriate for HTML/JS
    // contexts, not for plain XML. We do our own XML escaping (see `escape_xml`) on the
    // handful of fields that can contain user-authored text, so autoescaping is disabled.
    tera.autoescape_on(vec![]);
    tera.add_raw_template(MACROS_TEMPLATE_NAME, MACROS_TEMPLATE_SRC)?;
    tera.add_raw_template(MANIFEST_TEMPLATE_NAME, MANIFEST_TEMPLATE_SRC)?;
    tera.add_raw_template(COLLECTION_TEMPLATE_NAME, COLLECTION_TEMPLATE_SRC)?;
    tera.add_raw_template(DOCUMENT_TEMPLATE_NAME, DOCUMENT_TEMPLATE_SRC)?;
    Ok(tera)
}

/// Escapes the characters that are significant in both XML text content and
/// double-quoted attribute values. Safe to apply even to strings that don't need it.
/// `pub(crate)` so [`crate::tei`] can reuse it for the same purpose when rendering TEI
/// files, rather than duplicating XML-escaping logic.
pub(crate) fn escape_xml(input: &str) -> String {
    input
        .replace('&', "&amp;")
        .replace('<', "&lt;")
        .replace('>', "&gt;")
        .replace('"', "&quot;")
}

fn render_manifest_mets(ctx: &ManifestMetsContext) -> Result<String> {
    let tera = build_tera()?;
    pretty_print_xml(&tera.render(MANIFEST_TEMPLATE_NAME, &tera::Context::from_serialize(ctx)?)?)
}

fn render_collection_mets(ctx: &CollectionMetsContext) -> Result<String> {
    let tera = build_tera()?;
    pretty_print_xml(&tera.render(
        COLLECTION_TEMPLATE_NAME,
        &tera::Context::from_serialize(ctx)?,
    )?)
}

fn render_document_mets(ctx: &DocumentMetsContext) -> Result<String> {
    let tera = build_tera()?;
    pretty_print_xml(&tera.render(DOCUMENT_TEMPLATE_NAME, &tera::Context::from_serialize(ctx)?)?)
}

/// Re-serializes rendered XML with consistent, depth-based indentation and no blank or
/// stray-whitespace lines between elements.
///
/// The Tera templates loop and conditionally emit `mets:file`/`mets:div`/etc. elements
/// (per document, per word, per collection, ...); Tera's own whitespace-control
/// (`{%-`/`-%}`) can't fully eliminate the resulting blank lines and inconsistent
/// indentation across that many nested loops and macro calls, so this reparses the
/// rendered output as a stream of XML events (elements, text, comments — including the
/// `<!-- No audio for ... -->` comments and the various documentation comments in the
/// templates, all of which must survive) and rewrites it with `quick_xml`'s indenting
/// writer instead of trying to hand-tune whitespace in every template. `pub(crate)` so
/// [`crate::tei`] can reuse it for TEI files too.
pub(crate) fn pretty_print_xml(xml: &str) -> Result<String> {
    use quick_xml::events::Event;

    let mut reader = quick_xml::Reader::from_str(xml);
    reader.config_mut().trim_text(true);
    let mut writer = quick_xml::Writer::new_with_indent(Vec::new(), b' ', 2);

    loop {
        match reader.read_event()? {
            Event::Eof => break,
            event => {
                writer.write_event(event)?;
            }
        }
    }

    Ok(String::from_utf8(writer.into_inner())?)
}

/// Turns a title into a computer-navigable file/directory name: strips characters that
/// aren't safe to use in one on common filesystems, then collapses runs of whitespace
/// into single dashes (e.g. `"Story of Millie Pigeon"` -> `"Story-of-Millie-Pigeon"`).
/// Other punctuation in the title is left intact. Used only for filenames — `LABEL`,
/// `OBJID`, and other human-facing metadata keep the original, space-containing title.
/// `pub(crate)` so [`crate::audio_backup`] can reuse it for the same purpose (sanitizing a
/// word's simple-phonetics field for its archival filename) rather than duplicating this
/// logic.
pub(crate) fn sanitize_for_path(s: &str) -> String {
    s.chars()
        .filter(|c| !matches!(c, '/' | '\\' | ':' | '*' | '?' | '"' | '<' | '>' | '|'))
        .collect::<String>()
        .split_whitespace()
        .collect::<Vec<_>>()
        .join("-")
}

/// Derives a file extension (including the leading `.`) from a URL or file path, e.g.
/// `"https://example.com/audio.mp3"` -> `".mp3"`. Returns an empty string when there's no
/// discernible extension (e.g. the literal `"S3"` placeholder). `pub(crate)` so
/// [`crate::audio_backup`] can reuse it when naming downloaded audio files.
pub(crate) fn file_extension(url: &str) -> String {
    Path::new(url)
        .extension()
        .map(|ext| format!(".{}", ext.to_string_lossy()))
        .unwrap_or_default()
}

/// Derives the "remote audio key" from a URL -- its last path segment with its extension
/// stripped, e.g. `"https://cdn.example.com/some/path/w1.mp3"` -> `"w1"`. Sibling of
/// [`file_extension`], which derives the other half of the same archival filename (see
/// [`crate::audio_backup::download_document_audio`]/[`crate::audio_backup::download_words_with_audio`]).
/// Falls back to `"file"` if the URL has no discernible filename component at all
/// (defensive; not expected for real DAILP audio URLs).
pub(crate) fn remote_audio_key(url: &str) -> String {
    Path::new(url)
        .file_stem()
        .map(|stem| stem.to_string_lossy().into_owned())
        .unwrap_or_else(|| "file".to_owned())
}

#[cfg(test)]
mod tests {
    use super::*;

    // Collecting `(oid, source_id)` pairs from pages is now `images::page_image_refs`,
    // tested in `images.rs` (`page_image_refs_collects_pairs_in_page_order_and_skips_pages_without_one`)
    // since it moved there along with the rest of the download logic.

    // Likewise, gathering words with recorded audio (without downloading them) is now
    // `audio_backup::word_audio_candidates`, tested in `audio_backup.rs`
    // (`word_audio_candidates_walks_every_page_and_paragraph`) since it moved there along
    // with the rest of the audio-download logic.

    fn sample_collection_ref() -> CollectionRef {
        CollectionRef {
            slug: "willie-jumper-stories".to_owned(),
            title: "Willie Jumper Stories".to_owned(),
            mets_filename: "Willie-Jumper-Manuscripts.mets.xml".to_owned(),
            checksum: "collchecksum".to_owned(),
        }
    }

    fn sample_editorial_page_ref(id: &str, title: &str, path: &str) -> EditorialPageRef {
        EditorialPageRef {
            id: id.to_owned(),
            title: escape_xml(title),
            original_locref: escape_xml(&format!("https://dev.dailp.northeastern.edu{path}")),
            cloud_locref: escape_xml(&format!("https://cdn.example.com/{id}.md")),
            archival_locref: format!("./editorial/{id}.md"),
            checksum: format!("{id}checksum"),
        }
    }

    #[test]
    fn manifest_mets_renders_well_formed_xml() {
        let ctx = ManifestMetsContext {
            now: "2026-08-06T15:10:00".to_owned(),
            cf_url: "https://cdn.example.com".to_owned(),
            dailp_base_url: "https://dev.dailp.northeastern.edu".to_owned(),
            collections: vec![sample_collection_ref()],
            site_pages: vec![sample_editorial_page_ref(
                "about_team",
                "Our Team",
                "/about/team",
            )],
        };

        let xml = render_manifest_mets(&ctx).expect("template should render");
        // The manifest lives at the run root; its collections/ subdirectory is one level
        // down, so both the mptr and the archival FLocat use a "./collections/" prefix.
        assert!(xml.contains(
            "<mets:mptr LOCTYPE=\"URL\" LOCREF=\"./collections/Willie-Jumper-Manuscripts.mets.xml\"/>"
        ));
        assert!(
            xml.contains("LOCREF=\"https://cdn.example.com/Willie-Jumper-Manuscripts.mets.xml\"")
        );
        assert!(xml.contains("LOCREF=\"./collections/Willie-Jumper-Manuscripts.mets.xml\""));
        assert!(xml.contains(
            "LOCREF=\"https://dev.dailp.northeastern.edu/collections/willie-jumper-stories\""
        ));
        // Site-level pages (not owned by any collection) get their own fileGrp entries
        // (live URL, cloud backup, and archival, pointing into the sibling editorial/
        // directory) and a structSec div.
        assert!(xml.contains("ID=\"about_team_m\""));
        assert!(xml.contains("LOCREF=\"https://dev.dailp.northeastern.edu/about/team\""));
        assert!(xml.contains("ID=\"about_team_b\""));
        assert!(xml.contains("LOCREF=\"https://cdn.example.com/about_team.md\""));
        assert!(xml.contains("ID=\"about_team_a\""));
        assert!(xml.contains("LOCREF=\"./editorial/about_team.md\""));
        assert!(xml.contains("TYPE=\"site page\" LABEL=\"Our Team\""));
        // Every static file this pipeline wrote (collection METS file, editorial page's
        // cloud-backup/archival copies) carries a checksum...
        assert!(xml.contains("CHECKSUM=\"collchecksum\" CHECKSUMTYPE=\"SHA-256\""));
        assert!(xml.contains("CHECKSUM=\"about_teamchecksum\" CHECKSUMTYPE=\"SHA-256\""));
        // ...but the site page's `original` fileGrp entry (a live, rendered webpage, not
        // a byte-for-byte copy of the exported file) doesn't get one.
        assert!(xml.contains("<mets:file ID=\"about_team_m\">"));
        roxmltree::Document::parse(&xml).expect("output should be well-formed XML");
    }

    #[test]
    fn collection_mets_renders_well_formed_xml() {
        let ctx = CollectionMetsContext {
            collection_title: "Willie Jumper Stories".to_owned(),
            collection_label: "A collection of manuscripts and stories from Willie Jumper."
                .to_owned(),
            collection_slug: "willie-jumper-stories".to_owned(),
            cf_url: "https://cdn.example.com".to_owned(),
            now: "2026-08-06T15:10:00".to_owned(),
            contributors: vec!["Ellen Cushman".to_owned(), "Ben Frey".to_owned()],
            citation:
                "Willie Jumper Stories by Ellen Cushman, Ben Frey, is licensed under CC BY-NC 4.0"
                    .to_owned(),
            documents: vec![
                CollectionDocumentEntry {
                    title: "Story of Millie Pigeon".to_owned(),
                    slug: "story-of-millie-pigeon".to_owned(),
                    audio_locref: Some("https://example.com/audio.mp3".to_owned()),
                    ext: ".mp3".to_owned(),
                    archival_locref: Some(
                        "../audio/Story-of-Millie-Pigeon/Story-of-Millie-Pigeon_audio.mp3"
                            .to_owned(),
                    ),
                    checksum: Some("doc1checksum".to_owned()),
                    mets_filename: "Story-of-Millie-Pigeon.mets.xml".to_owned(),
                    file_stem: "Story-of-Millie-Pigeon".to_owned(),
                },
                CollectionDocumentEntry {
                    title: "Story of the Old Timer".to_owned(),
                    slug: "story-of-the-old-timer".to_owned(),
                    audio_locref: None,
                    ext: String::new(),
                    archival_locref: None,
                    checksum: None,
                    mets_filename: "Story-of-the-Old-Timer.mets.xml".to_owned(),
                    file_stem: "Story-of-the-Old-Timer".to_owned(),
                },
            ],
            editorial_pages: vec![sample_editorial_page_ref(
                "willie-jumper-stories_intro_greetings",
                "Greetings",
                "/willie_jumper_stories/greetings",
            )],
        };

        let xml = render_collection_mets(&ctx).expect("template should render");
        assert!(xml.contains("OBJID=\"Willie Jumper Stories\""));
        assert!(xml.contains("<dc:contributor>Ellen Cushman</dc:contributor>"));
        // File IDs are built from the document's slug, not its (space-containing,
        // `xs:ID`-unsafe) title. See mets-xml.md finding 6.3.
        assert!(xml.contains("ID=\"story-of-millie-pigeon_m\""));
        assert!(!xml.contains("ID=\"Story of Millie Pigeon_m\""));
        // `mptr` points into the run's documents/ directory (a sibling of collections/,
        // where this collection file itself lives) via LOCTYPE/LOCREF, not the invalid
        // FILEID attribute. See mets-xml.md finding 6.4.
        assert!(xml.contains(
            "<mets:mptr LOCTYPE=\"URL\" LOCREF=\"../documents/Story-of-Millie-Pigeon.mets.xml\"/>"
        ));
        // Cloud-backup audio reuses the original URL rather than a literal "S3"; archival
        // audio points into the run's audio/<file_stem>/ directory, named per
        // `audio_backup::document_audio_filename`, rather than an unfilled placeholder.
        assert!(xml.contains("<mets:file ID=\"story-of-millie-pigeon_b\" CHECKSUM=\"doc1checksum\" CHECKSUMTYPE=\"SHA-256\">\n        <mets:FLocat LOCTYPE=\"URL\" LOCREF=\"https://example.com/audio.mp3\" />"));
        assert!(xml.contains(
            "LOCREF=\"../audio/Story-of-Millie-Pigeon/Story-of-Millie-Pigeon_audio.mp3\""
        ));
        // A document with no audio_locref gets a comment instead of a file entry with
        // nothing real to reference, in every fileGrp.
        assert!(xml.contains("<!-- No audio for Story of the Old Timer -->"));
        assert!(!xml.contains("ID=\"story-of-the-old-timer_m\""));
        assert!(!xml.contains("ID=\"story-of-the-old-timer_b\""));
        assert!(!xml.contains("ID=\"story-of-the-old-timer_a\""));
        // Editorial chapters (backed by a `page` row rather than an AnnotatedDoc) get
        // their own fileGrp entries and a structSec div, alongside the manuscript
        // documents.
        assert!(xml.contains("ID=\"willie-jumper-stories_intro_greetings_m\""));
        assert!(xml.contains(
            "LOCREF=\"https://dev.dailp.northeastern.edu/willie_jumper_stories/greetings\""
        ));
        assert!(xml.contains("ID=\"willie-jumper-stories_intro_greetings_a\""));
        assert!(xml.contains("LOCREF=\"./editorial/willie-jumper-stories_intro_greetings.md\""));
        assert!(xml.contains("TYPE=\"editorial page\" LABEL=\"Greetings\""));
        // The editorial page's archival copy carries a checksum; its `original` (live
        // webpage) entry doesn't -- see `mets::editorial_page_refs`.
        assert!(xml.contains(
            "CHECKSUM=\"willie-jumper-stories_intro_greetingschecksum\" CHECKSUMTYPE=\"SHA-256\""
        ));
        assert!(xml.contains("<mets:file ID=\"willie-jumper-stories_intro_greetings_m\">"));
        roxmltree::Document::parse(&xml).expect("output should be well-formed XML");
    }

    #[test]
    fn document_mets_renders_well_formed_xml() {
        let ctx = DocumentMetsContext {
            document_title: "Story of Millie Pigeon".to_owned(),
            now: "2026-08-06T15:10:00".to_owned(),
            collection_slug: "willie-jumper-stories".to_owned(),
            document_slug: "story-of-millie-pigeon".to_owned(),
            cf_url: "https://cdn.example.com".to_owned(),
            dailp_base_url: "https://dev.dailp.northeastern.edu".to_owned(),
            manifest_filename: "manifest.mets.xml".to_owned(),
            manifest_checksum: "manifestchecksum".to_owned(),
            collections: vec![sample_collection_ref()],
            tei_filename: Some("Story-of-Millie-Pigeon.tei.xml".to_owned()),
            tei_checksum: Some("teichecksum".to_owned()),
            audio_url: Some("https://example.com/audio.mp3".to_owned()),
            ext: ".mp3".to_owned(),
            archival_locref: Some(
                "../audio/Story-of-Millie-Pigeon/Story-of-Millie-Pigeon_audio.mp3".to_owned(),
            ),
            checksum: Some("audiochecksum".to_owned()),
            // Two different image sources, deliberately -- proves the "original" fileGrp
            // uses each image's own resolved `source_url` rather than a single hardcoded
            // IIIF host (this document's images used to always render as if they were
            // Yale's, even the ones actually hosted on NEU's server).
            page_images: vec![
                PageImageEntry {
                    oid: "15532353".to_owned(),
                    source_url: "https://images.library.northeastern.edu/iiif/2/images/dailp"
                        .to_owned(),
                    filename: "story-of-millie-pigeon_page1_15532353.jpg".to_owned(),
                    checksum: "image1checksum".to_owned(),
                },
                PageImageEntry {
                    oid: "15532354".to_owned(),
                    source_url: "https://collections.library.yale.edu/iiif/2".to_owned(),
                    filename: "story-of-millie-pigeon_page2_15532354.jpg".to_owned(),
                    checksum: "image2checksum".to_owned(),
                },
            ],
            words_with_audio: vec![WordAudioEntry {
                id: "w1".to_owned(),
                audio_url: "https://example.com/w1.mp3".to_owned(),
                ext: ".mp3".to_owned(),
                archival_locref: "../audio/Story-of-Millie-Pigeon/1_unknown_w1.mp3".to_owned(),
                checksum: "wordchecksum".to_owned(),
            }],
        };

        let xml = render_document_mets(&ctx).expect("template should render");
        assert!(xml.contains("LOCTYPE=\"URL\""));
        assert!(xml.contains("LOCREF=\"https://example.com/audio.mp3\""));
        // Root must be in the METS namespace, matching the collection template. See
        // mets-xml.md finding 6.5.
        assert!(xml.contains("<mets:mets "));
        assert!(xml.trim_end().ends_with("</mets:mets>"));
        // Every document gets its own OBJID rather than reusing the parent
        // collection's. See mets-xml.md finding 6.6.
        assert!(xml.contains("OBJID=\"story-of-millie-pigeon\""));
        // The TEI file's ID no longer collides with the audio file's ID when `ext` is
        // empty. See mets-xml.md finding 6.3.
        assert!(xml.contains("ID=\"story-of-millie-pigeon_tei_m\""));
        // TEI lives alongside this document's own METS file, so its archival reference
        // stays in the same directory, sharing that file's filename stem (not
        // `document_slug` -- see `CollectionDocumentEntry.file_stem`).
        assert!(xml.contains("LOCREF=\"./Story-of-Millie-Pigeon.tei.xml\""));
        // The DESCRIPTIVE mdGrp points at the TEI file instead of being left empty
        // (which the METS v2 XSD disallows -- an `mdGrp` needs >=1 `md`/`mdRef` child).
        assert!(xml.contains("<mets:mdRef ID=\"story-of-millie-pigeon_tei_desc\""));
        assert!(xml.contains(
            "LOCREF=\"./Story-of-Millie-Pigeon.tei.xml\" MDTYPE=\"OTHER\" OTHERMDTYPE=\"TEI\""
        ));
        // Multiple page images each get their own file entry and structSec area, and
        // their archival references point into the run's images/ directory, named
        // `{document_slug}_page{page_number}_{oid}.jpg` (matching what
        // `images::download_page_images` actually writes to disk).
        assert!(xml.contains("15532353"));
        assert!(xml.contains("15532354"));
        assert!(xml.contains("LOCREF=\"../images/story-of-millie-pigeon_page1_15532353.jpg\""));
        assert!(xml.contains("LOCREF=\"../images/story-of-millie-pigeon_page2_15532354.jpg\""));
        // The "original" fileGrp uses each image's own resolved source URL, not a single
        // hardcoded IIIF host -- see `PageImageEntry.source_url`.
        assert!(xml.contains(
            "LOCREF=\"https://images.library.northeastern.edu/iiif/2/images/dailp/15532353/full/max/0/default.jpg\""
        ));
        assert!(xml.contains(
            "LOCREF=\"https://collections.library.yale.edu/iiif/2/15532354/full/max/0/default.jpg\""
        ));
        // The "cloud backup" fileGrp likewise reuses the same computed archival filename.
        assert!(xml.contains(
            "LOCREF=\"https://cdn.example.com/story-of-millie-pigeon_page1_15532353.jpg\""
        ));
        // Manifest and collection cross-references, with archival references pointing
        // one directory up (this document lives in documents/, a sibling of the run
        // root and of collections/).
        assert!(xml.contains("ID=\"manifest_m\""));
        assert!(xml.contains("LOCREF=\"../manifest.mets.xml\""));
        assert!(xml.contains("ID=\"willie-jumper-stories_collmets_m\""));
        assert!(xml.contains("LOCREF=\"../collections/Willie-Jumper-Manuscripts.mets.xml\""));
        // Overall audio archival points into the run's audio/<file_stem>/ directory.
        assert!(xml.contains(
            "LOCREF=\"../audio/Story-of-Millie-Pigeon/Story-of-Millie-Pigeon_audio.mp3\""
        ));
        // Word-for-word audio: one fileGrp entry plus a matching structSec word div, with
        // its archival reference also pointing into the same per-document audio/ folder.
        assert!(xml.contains("ID=\"w1_m\""));
        assert!(xml.contains("LOCREF=\"https://example.com/w1.mp3\""));
        assert!(xml.contains("LOCREF=\"../audio/Story-of-Millie-Pigeon/1_unknown_w1.mp3\""));
        assert!(xml.contains("Word Content"));
        assert!(xml.contains("TYPE=\"word\""));
        // Every referenced file -- overall audio, each page image, the TEI file (both its
        // fileSec entries and its DESCRIPTIVE mdRef), the manifest, the collection METS
        // file, and word audio -- carries a checksum. The same logical file's checksum is
        // reused across all three fileGrps (original/cloud backup/archival).
        assert_eq!(
            xml.matches("CHECKSUM=\"audiochecksum\" CHECKSUMTYPE=\"SHA-256\"")
                .count(),
            3
        );
        assert_eq!(
            xml.matches("CHECKSUM=\"image1checksum\" CHECKSUMTYPE=\"SHA-256\"")
                .count(),
            3
        );
        assert_eq!(
            xml.matches("CHECKSUM=\"image2checksum\" CHECKSUMTYPE=\"SHA-256\"")
                .count(),
            3
        );
        // TEI checksum appears on the DESCRIPTIVE mdRef plus all three fileSec entries.
        assert_eq!(
            xml.matches("CHECKSUM=\"teichecksum\" CHECKSUMTYPE=\"SHA-256\"")
                .count(),
            4
        );
        assert_eq!(
            xml.matches("CHECKSUM=\"manifestchecksum\" CHECKSUMTYPE=\"SHA-256\"")
                .count(),
            3
        );
        assert_eq!(
            xml.matches("CHECKSUM=\"collchecksum\" CHECKSUMTYPE=\"SHA-256\"")
                .count(),
            3
        );
        assert_eq!(
            xml.matches("CHECKSUM=\"wordchecksum\" CHECKSUMTYPE=\"SHA-256\"")
                .count(),
            3
        );
        roxmltree::Document::parse(&xml).expect("output should be well-formed XML");
    }

    #[test]
    fn document_mets_renders_no_audio_comment_when_document_has_no_audio() {
        let ctx = DocumentMetsContext {
            document_title: "Story of the Old Timer".to_owned(),
            now: "2026-08-06T15:10:00".to_owned(),
            collection_slug: "willie-jumper-stories".to_owned(),
            document_slug: "story-of-the-old-timer".to_owned(),
            cf_url: "https://cdn.example.com".to_owned(),
            dailp_base_url: "https://dev.dailp.northeastern.edu".to_owned(),
            manifest_filename: "manifest.mets.xml".to_owned(),
            manifest_checksum: "manifestchecksum".to_owned(),
            collections: vec![sample_collection_ref()],
            tei_filename: Some("Story-of-the-Old-Timer.tei.xml".to_owned()),
            tei_checksum: Some("teichecksum".to_owned()),
            audio_url: None,
            ext: String::new(),
            archival_locref: None,
            checksum: None,
            page_images: vec![PageImageEntry {
                oid: "15532353".to_owned(),
                source_url: "https://collections.library.yale.edu/iiif/2".to_owned(),
                filename: "story-of-the-old-timer_page1_15532353.jpg".to_owned(),
                checksum: "image1checksum".to_owned(),
            }],
            words_with_audio: vec![],
        };

        let xml = render_document_mets(&ctx).expect("template should render");
        // A comment appears in each of the three fileGrps instead of a `file` entry with
        // nothing real to reference, and no `_m`/`_b`/`_a` overall-audio file IDs exist.
        assert_eq!(
            xml.matches("<!-- No audio for Story of the Old Timer -->")
                .count(),
            3
        );
        assert!(!xml.contains("ID=\"story-of-the-old-timer_m\""));
        assert!(!xml.contains("ID=\"story-of-the-old-timer_b\""));
        assert!(!xml.contains("ID=\"story-of-the-old-timer_a\""));
        // No dangling structSec `area` referencing the (nonexistent) overall-audio file.
        assert!(!xml.contains("FILEID=\"story-of-the-old-timer_m\""));
        roxmltree::Document::parse(&xml).expect("output should be well-formed XML");
    }

    #[test]
    fn document_mets_renders_no_tei_comment_when_document_has_no_linguistic_content() {
        let ctx = DocumentMetsContext {
            document_title: "Story of the Old Timer".to_owned(),
            now: "2026-08-06T15:10:00".to_owned(),
            collection_slug: "willie-jumper-stories".to_owned(),
            document_slug: "story-of-the-old-timer".to_owned(),
            cf_url: "https://cdn.example.com".to_owned(),
            dailp_base_url: "https://dev.dailp.northeastern.edu".to_owned(),
            manifest_filename: "manifest.mets.xml".to_owned(),
            manifest_checksum: "manifestchecksum".to_owned(),
            collections: vec![sample_collection_ref()],
            tei_filename: None,
            tei_checksum: None,
            audio_url: Some("https://example.com/audio.mp3".to_owned()),
            ext: ".mp3".to_owned(),
            archival_locref: Some(
                "../audio/Story-of-the-Old-Timer/Story-of-the-Old-Timer_audio.mp3".to_owned(),
            ),
            checksum: Some("audiochecksum".to_owned()),
            page_images: vec![PageImageEntry {
                oid: "15532353".to_owned(),
                source_url: "https://collections.library.yale.edu/iiif/2".to_owned(),
                filename: "story-of-the-old-timer_page1_15532353.jpg".to_owned(),
                checksum: "image1checksum".to_owned(),
            }],
            words_with_audio: vec![],
        };

        let xml = render_document_mets(&ctx).expect("template should render");
        // The comment appears once for the DESCRIPTIVE mdGrp and once per fileGrp
        // (original/cloud backup/archival), and no `_tei_m`/`_tei_b`/`_tei_a` file IDs
        // or structSec `area` referencing them exist.
        assert_eq!(
            xml.matches("<!-- No TEI file; translation data not present during export -->")
                .count(),
            4
        );
        assert!(!xml.contains("_tei_m"));
        assert!(!xml.contains("_tei_b"));
        assert!(!xml.contains("_tei_a"));
        assert!(!xml.contains("_tei_desc"));
        roxmltree::Document::parse(&xml).expect("output should be well-formed XML");
    }

    /// Sets up `<dir>/collections/collection.mets.xml` (referencing `document_locrefs`
    /// via `mptr`) and `<dir>/documents/` for `validate_document_references` tests,
    /// mirroring the real run-directory layout. Returns
    /// `(collection_path, collections_dir)`.
    fn write_sample_bundle(dir: &Path, document_locrefs: &[&str]) -> (PathBuf, PathBuf) {
        let collections_dir = dir.join("collections");
        std::fs::create_dir_all(&collections_dir).unwrap();
        std::fs::create_dir_all(dir.join("documents")).unwrap();

        let document_divs: String = document_locrefs
            .iter()
            .enumerate()
            .map(|(i, locref)| {
                format!(
                    r#"<mets:div TYPE="document" LABEL="Sample Document {i}">
          <mets:mptr LOCTYPE="URL" LOCREF="{locref}"/>
        </mets:div>"#
                )
            })
            .collect();

        let collection_path = collections_dir.join("collection.mets.xml");
        std::fs::write(
            &collection_path,
            format!(
                r#"<?xml version="1.0" encoding="UTF-8"?>
<mets:mets xmlns:mets="http://www.loc.gov/METS/v2">
  <mets:structSec>
    <mets:structMap TYPE="logical">
      <mets:div TYPE="collection" LABEL="Sample Collection">
        {document_divs}
      </mets:div>
    </mets:structMap>
  </mets:structSec>
</mets:mets>"#
            ),
        )
        .unwrap();
        (collection_path, collections_dir)
    }

    #[test]
    fn validate_document_references_passes_for_a_consistent_bundle() {
        let dir =
            std::env::temp_dir().join(format!("dailp-mets-validate-ok-{}", std::process::id()));
        let (collection_path, collections_dir) =
            write_sample_bundle(&dir, &["../documents/Sample Document.mets.xml"]);
        std::fs::write(
            dir.join("documents/Sample Document.mets.xml"),
            "<mets:mets/>",
        )
        .unwrap();

        let result = validate_document_references(
            &collection_path,
            &collections_dir,
            &["Sample Document.mets.xml".to_owned()],
        );
        assert!(result.is_ok(), "{:?}", result.err());

        std::fs::remove_dir_all(&dir).ok();
    }

    #[test]
    fn validate_document_references_fails_when_referenced_file_is_missing() {
        let dir = std::env::temp_dir().join(format!(
            "dailp-mets-validate-missing-{}",
            std::process::id()
        ));
        let (collection_path, collections_dir) =
            write_sample_bundle(&dir, &["../documents/Sample Document.mets.xml"]);
        // Deliberately don't write the referenced document file to disk.

        let result = validate_document_references(
            &collection_path,
            &collections_dir,
            &["Sample Document.mets.xml".to_owned()],
        );
        let err = result.expect_err("missing referenced file should fail validation");
        assert!(err.to_string().contains("doesn't resolve to a file"));

        std::fs::remove_dir_all(&dir).ok();
    }

    #[test]
    fn validate_document_references_fails_when_locref_is_not_in_documents_dir() {
        let dir =
            std::env::temp_dir().join(format!("dailp-mets-validate-prefix-{}", std::process::id()));
        // A bare filename (no "../documents/" prefix) used to be correct before the
        // dailp-<timestamp>/{collections,documents}/ layout; it should now fail.
        let (collection_path, collections_dir) =
            write_sample_bundle(&dir, &["Sample Document.mets.xml"]);
        std::fs::write(
            dir.join("documents/Sample Document.mets.xml"),
            "<mets:mets/>",
        )
        .unwrap();

        let result = validate_document_references(
            &collection_path,
            &collections_dir,
            &["Sample Document.mets.xml".to_owned()],
        );
        let err =
            result.expect_err("LOCREF without the ../documents/ prefix should fail validation");
        assert!(err.to_string().contains("doesn't start with"));

        std::fs::remove_dir_all(&dir).ok();
    }

    #[test]
    fn validate_document_references_fails_when_a_document_is_missing_from_the_structmap() {
        let dir = std::env::temp_dir().join(format!(
            "dailp-mets-validate-missing-div-{}",
            std::process::id()
        ));
        let (collection_path, collections_dir) =
            write_sample_bundle(&dir, &["../documents/Sample Document.mets.xml"]);
        std::fs::write(
            dir.join("documents/Sample Document.mets.xml"),
            "<mets:mets/>",
        )
        .unwrap();

        // Expect two documents, but the structMap (and disk) only has one.
        let result = validate_document_references(
            &collection_path,
            &collections_dir,
            &[
                "Sample Document.mets.xml".to_owned(),
                "Another Document.mets.xml".to_owned(),
            ],
        );
        let err = result.expect_err("a document missing from the structMap should fail validation");
        assert!(err.to_string().contains("has no mptr referencing it"));

        std::fs::remove_dir_all(&dir).ok();
    }

    /// Writes `<dir>/documents/<tei_filename>` holding a minimal TEI-ish file with the
    /// given `xml:id`s and `corresp`/`target` references, for `validate_tei_bundle` tests.
    fn write_sample_tei_file(dir: &Path, tei_filename: &str, body: &str) -> PathBuf {
        let documents_dir = dir.join("documents");
        std::fs::create_dir_all(&documents_dir).unwrap();
        let tei_path = documents_dir.join(tei_filename);
        std::fs::write(
            &tei_path,
            format!(r#"<TEI xmlns="http://www.tei-c.org/ns/1.0">{body}</TEI>"#),
        )
        .unwrap();
        tei_path
    }

    #[test]
    fn validate_tei_bundle_passes_for_a_consistent_bundle() {
        let dir =
            std::env::temp_dir().join(format!("dailp-tei-validate-ok-{}", std::process::id()));
        write_sample_tei_file(
            &dir,
            "Sample Document.tei.xml",
            r##"<ab xml:id="pg1_para1" corresp="#pg1_para1_trans"><w xml:id="w1">osdi</w></ab>
               <ab xml:id="pg1_para1_trans"><seg>She went.</seg></ab>
               <note target="#w1">uncertain</note>"##,
        );

        let result = validate_tei_bundle(
            &dir.join("documents"),
            &[TeiValidationEntry {
                mets_filename: "Sample Document.mets.xml".to_owned(),
                tei_filename: "Sample Document.tei.xml".to_owned(),
                word_ids: vec!["w1".to_owned()],
            }],
        );
        assert!(result.is_ok(), "{:?}", result.err());

        std::fs::remove_dir_all(&dir).ok();
    }

    #[test]
    fn validate_tei_bundle_fails_when_tei_file_is_missing() {
        let dir = std::env::temp_dir().join(format!(
            "dailp-tei-validate-missing-file-{}",
            std::process::id()
        ));
        std::fs::create_dir_all(dir.join("documents")).unwrap();
        // Deliberately don't write the referenced TEI file.

        let result = validate_tei_bundle(
            &dir.join("documents"),
            &[TeiValidationEntry {
                mets_filename: "Sample Document.mets.xml".to_owned(),
                tei_filename: "Sample Document.tei.xml".to_owned(),
                word_ids: vec![],
            }],
        );
        let err = result.expect_err("a missing TEI file should fail validation");
        assert!(err.to_string().contains("doesn't exist"));

        std::fs::remove_dir_all(&dir).ok();
    }

    #[test]
    fn validate_tei_bundle_fails_when_a_corresp_or_target_is_dangling() {
        let dir = std::env::temp_dir().join(format!(
            "dailp-tei-validate-dangling-ref-{}",
            std::process::id()
        ));
        write_sample_tei_file(
            &dir,
            "Sample Document.tei.xml",
            // Points at a translation `ab` that was never written.
            r##"<ab xml:id="pg1_para1" corresp="#pg1_para1_trans"><w xml:id="w1">osdi</w></ab>"##,
        );

        let result = validate_tei_bundle(
            &dir.join("documents"),
            &[TeiValidationEntry {
                mets_filename: "Sample Document.mets.xml".to_owned(),
                tei_filename: "Sample Document.tei.xml".to_owned(),
                word_ids: vec!["w1".to_owned()],
            }],
        );
        let err = result.expect_err("a dangling corresp should fail validation");
        assert!(err.to_string().contains("doesn't resolve to any xml:id"));

        std::fs::remove_dir_all(&dir).ok();
    }

    #[test]
    fn validate_tei_bundle_fails_when_a_word_audio_id_is_missing_from_tei() {
        let dir = std::env::temp_dir().join(format!(
            "dailp-tei-validate-missing-word-{}",
            std::process::id()
        ));
        write_sample_tei_file(
            &dir,
            "Sample Document.tei.xml",
            // No `w2` anywhere in the file, but the METS file's word-audio structSec
            // references it.
            r#"<ab xml:id="pg1_para1"><w xml:id="w1">osdi</w></ab>"#,
        );

        let result = validate_tei_bundle(
            &dir.join("documents"),
            &[TeiValidationEntry {
                mets_filename: "Sample Document.mets.xml".to_owned(),
                tei_filename: "Sample Document.tei.xml".to_owned(),
                word_ids: vec!["w1".to_owned(), "w2".to_owned()],
            }],
        );
        let err =
            result.expect_err("a word-audio id missing from the TEI file should fail validation");
        assert!(err.to_string().contains("has no matching xml:id"));

        std::fs::remove_dir_all(&dir).ok();
    }

    #[test]
    fn output_root_resolves_to_workspace_root_backups_dir() {
        let root = output_root();
        assert!(root.ends_with("backups/xml/dailp"));
        // The workspace root is the migration crate's parent directory, and should
        // contain the workspace-level Cargo.toml regardless of the test's CWD.
        let workspace_root = root
            .ancestors()
            .find(|dir| dir.join("Cargo.toml").is_file() && dir.join("migration").is_dir())
            .expect("should find the workspace root above the output directory");
        assert!(workspace_root.join("types").is_dir());
    }

    #[test]
    fn file_extension_handles_urls_and_placeholders() {
        assert_eq!(file_extension("https://example.com/audio.mp3"), ".mp3");
        assert_eq!(file_extension("S3"), "");
    }

    #[test]
    fn remote_audio_key_extracts_filename_stem() {
        assert_eq!(
            remote_audio_key("https://cdn.example.com/some/path/w1.mp3"),
            "w1"
        );
        assert_eq!(remote_audio_key("S3"), "S3");
    }

    #[test]
    fn sanitize_for_path_strips_unsafe_characters_and_dashes_spaces() {
        assert_eq!(
            sanitize_for_path("Story of Millie Pigeon"),
            "Story-of-Millie-Pigeon"
        );
        assert_eq!(sanitize_for_path("A/B:C"), "ABC");
        // Collapses runs of whitespace (including leading/trailing) into single dashes,
        // rather than leaving stray/doubled dashes.
        assert_eq!(
            sanitize_for_path("1869 Story of the Old Indian "),
            "1869-Story-of-the-Old-Indian"
        );
        assert_eq!(sanitize_for_path("Two  Spaces"), "Two-Spaces");
    }

    #[test]
    fn escape_xml_handles_special_characters_and_urls() {
        assert_eq!(
            escape_xml("Tom & Jerry <the \"strip\">"),
            "Tom &amp; Jerry &lt;the &quot;strip&quot;&gt;"
        );
        // Forward slashes must NOT be escaped, unlike Tera's default HTML escaper.
        assert_eq!(
            escape_xml("https://example.com/audio.mp3"),
            "https://example.com/audio.mp3"
        );
    }

    #[test]
    fn collection_mets_escapes_special_characters_in_titles() {
        let ctx = CollectionMetsContext {
            collection_title: escape_xml("Tom & Jerry"),
            collection_label: escape_xml("Tom & Jerry"),
            collection_slug: "tom-and-jerry".to_owned(),
            cf_url: "https://cdn.example.com".to_owned(),
            now: "2026-08-06T15:10:00".to_owned(),
            contributors: vec![escape_xml("Q & A")],
            citation: escape_xml("Tom & Jerry by Q & A, is licensed under CC BY-NC 4.0"),
            documents: vec![],
            editorial_pages: vec![],
        };

        let xml = render_collection_mets(&ctx).expect("template should render");
        assert!(xml.contains("OBJID=\"Tom &amp; Jerry\""));
        assert!(xml.contains("<dc:contributor>Q &amp; A</dc:contributor>"));
        roxmltree::Document::parse(&xml).expect("output should be well-formed XML");
    }

    #[test]
    fn dailp_base_url_handles_stages() {
        // SAFETY: tests run single-threaded within this module w.r.t. this var isn't
        // guaranteed, but `cargo test` isolates env vars per-process by default here
        // since no other test reads/writes TF_STAGE.
        std::env::remove_var("TF_STAGE");
        assert_eq!(dailp_base_url(), "https://dailp.northeastern.edu");
        std::env::set_var("TF_STAGE", "prod");
        assert_eq!(dailp_base_url(), "https://dailp.northeastern.edu");
        std::env::set_var("TF_STAGE", "dev");
        assert_eq!(dailp_base_url(), "https://dev.dailp.northeastern.edu");
        std::env::set_var("TF_STAGE", "uat");
        assert_eq!(dailp_base_url(), "https://uat.dailp.northeastern.edu");
        std::env::remove_var("TF_STAGE");
    }
}
