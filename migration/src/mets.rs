//! Generates METS (Metadata Encoding & Transmission Standard) XML backup manifests
//! describing an [`dailp::EditedCollection`] and its member [`dailp::AnnotatedDoc`]s.
//!
//! Two Tera templates drive this:
//! - `migration/collection.tera.xml` renders one file per collection.
//! - `migration/document.tera.xml` renders one file per member document.
//!
//! Word/paragraph-level content (which will be encoded in a separate TEI XML file) and
//! cross-collection "unifying" metadata (which will get its own future METS file) are
//! intentionally out of scope here.

use std::collections::HashMap;
use std::path::{Path, PathBuf};

use anyhow::{Context as _, Result};
use dailp::async_graphql::dataloader::Loader;
use dailp::{AnnotatedDoc, ChaptersInCollection, Database, DocumentId, EditedCollectionDetails};
use log::{info, warn};
use serde::Serialize;

/// Generates a collection-level METS file at
/// `<workspace root>/backups/xml/dailp/<collection title>_<timestamp>.mets.xml` and one
/// document-level METS file per member document at
/// `<workspace root>/backups/xml/dailp/<collection title>/<document title>_<timestamp>.mets.xml`.
pub async fn generate_mets_for_collection(db: &Database, collection_slug: &str) -> Result<()> {
    info!("Generating METS backups for collection \"{collection_slug}\"");

    let output_root = output_root();
    let now = dailp::chrono::Utc::now();
    let created_at = now.format(CREATEDATE_FORMAT).to_string();
    let file_timestamp = now.format(FILENAME_TIMESTAMP_FORMAT).to_string();

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

    let collection_dir_name = sanitize_for_path(&collection.title);
    let collection_dir = output_root.join(&collection_dir_name);
    std::fs::create_dir_all(&collection_dir)
        .with_context(|| format!("Failed to create directory {}", collection_dir.display()))?;

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

    let collection_documents: Vec<CollectionDocumentEntry> = documents
        .iter()
        .map(|doc| CollectionDocumentEntry {
            title: escape_xml(&doc.meta.title),
            // Mirrors `DocumentMetsContext.document_slug` below, so a document's own
            // METS file and its entry here use the same, `xs:ID`-safe slug rather than
            // the raw (space- and punctuation-containing) title.
            slug: dailp::slugify(&doc.meta.short_name),
            audio_locref: escape_xml(
                &doc.meta
                    .audio_recording
                    .as_ref()
                    .map(|audio| audio.resource_url.clone())
                    .unwrap_or_else(|| "S3".to_owned()),
            ),
            mets_filename: format!(
                "{}_{}.mets.xml",
                sanitize_for_path(&doc.meta.title),
                file_timestamp
            ),
        })
        .collect();

    let collection_ctx = CollectionMetsContext {
        collection_title: escape_xml(&collection.title),
        collection_label: escape_xml(
            collection
                .description
                .as_deref()
                .unwrap_or(&collection.title),
        ),
        collection_slug: collection.slug.clone(),
        now: created_at.clone(),
        contributors: contributors.iter().map(|name| escape_xml(name)).collect(),
        citation: escape_xml(&citation),
        documents: collection_documents.clone(),
    };

    let collection_xml = render_collection_mets(&collection_ctx)?;
    let collection_path = output_root.join(format!(
        "{}_{}.mets.xml",
        collection_dir_name, file_timestamp
    ));
    std::fs::write(&collection_path, collection_xml)
        .with_context(|| format!("Failed to write {}", collection_path.display()))?;
    info!(
        "Wrote collection METS file to {}",
        collection_path.display()
    );

    for (doc, entry) in documents.iter().zip(collection_documents.iter()) {
        let document_ctx = DocumentMetsContext {
            document_title: escape_xml(&doc.meta.title),
            now: created_at.clone(),
            // `collection.slug` is already the collection's compact identifier (e.g.
            // "willie_jumper_stories"); `AnnotatedDoc::slug()` is `slugify(short_name)`,
            // mirrored here since we're bypassing the GraphQL resolver.
            collection_slug: collection.slug.clone(),
            document_slug: dailp::slugify(&doc.meta.short_name),
            // `entry.audio_locref` is already XML-escaped above.
            audio_url: entry.audio_locref.clone(),
            ext: file_extension(&entry.audio_locref),
            image_oid: doc
                .meta
                .page_images
                .as_ref()
                .and_then(|images| images.ids.first().cloned())
                .unwrap_or_default(),
        };

        let document_xml = render_document_mets(&document_ctx)?;
        let document_path = collection_dir.join(&entry.mets_filename);
        std::fs::write(&document_path, document_xml)
            .with_context(|| format!("Failed to write {}", document_path.display()))?;
        info!(
            "Wrote document METS file for \"{}\" to {}",
            doc.meta.title,
            document_path.display()
        );
    }

    info!(
        "Finished generating METS backups for \"{}\": 1 collection file + {} document file(s)",
        collection.title,
        documents.len()
    );

    Ok(())
}

/// Returns the directory that backup XML files are written under. Resolved relative to
/// the workspace root (via `CARGO_MANIFEST_DIR`, set at compile time to this crate's
/// directory) rather than the current working directory, so output lands in the same
/// place regardless of where the binary is invoked from.
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
/// Format used for the `[timestamp]` component of output filenames. Colon-free so it's
/// safe on every filesystem.
const FILENAME_TIMESTAMP_FORMAT: &str = "%Y%m%dT%H%M%S";

const COLLECTION_TEMPLATE_NAME: &str = "collection.tera.xml";
const DOCUMENT_TEMPLATE_NAME: &str = "document.tera.xml";
const MACROS_TEMPLATE_NAME: &str = "mets_macros.tera.xml";
const COLLECTION_TEMPLATE_SRC: &str = include_str!("../collection.tera.xml");
const DOCUMENT_TEMPLATE_SRC: &str = include_str!("../document.tera.xml");
const MACROS_TEMPLATE_SRC: &str = include_str!("../mets_macros.tera.xml");

/// Context for rendering `collection.tera.xml`.
#[derive(Serialize)]
struct CollectionMetsContext {
    collection_title: String,
    /// Falls back to the collection's title when it has no description.
    collection_label: String,
    /// `xs:ID`-safe slug for the collection, used to build `md@ID`s.
    collection_slug: String,
    now: String,
    /// Distinct contributor names gathered from every member document, in first-seen order.
    contributors: Vec<String>,
    citation: String,
    documents: Vec<CollectionDocumentEntry>,
}

#[derive(Serialize, Clone)]
struct CollectionDocumentEntry {
    title: String,
    /// `xs:ID`-safe slug for this document, used to build `file@ID`s in the collection
    /// METS file. Mirrors `DocumentMetsContext.document_slug`.
    slug: String,
    /// The document's real audio resource URL, or the literal `"S3"` placeholder if it
    /// has no audio recording.
    audio_locref: String,
    /// Filename of the corresponding document-level METS file, written alongside this
    /// collection-level file's sibling directory.
    mets_filename: String,
}

/// Context for rendering `document.tera.xml`.
#[derive(Serialize)]
struct DocumentMetsContext {
    document_title: String,
    now: String,
    collection_slug: String,
    document_slug: String,
    /// The document's real audio resource URL, or the literal `"S3"` placeholder if it
    /// has no audio recording.
    audio_url: String,
    /// File extension (including the leading `.`) derived from `audio_url`.
    ext: String,
    /// First IIIF image id for the document's manuscript page images, or an empty
    /// string if the document has none.
    image_oid: String,
}

fn build_tera() -> Result<tera::Tera> {
    let mut tera = tera::Tera::default();
    // Tera autoescapes ".xml"-named templates by default using its HTML escaper, which
    // (among other things) turns every "/" into "&#x2F;" -- appropriate for HTML/JS
    // contexts, not for plain XML. We do our own XML escaping (see `escape_xml`) on the
    // handful of fields that can contain user-authored text, so autoescaping is disabled.
    tera.autoescape_on(vec![]);
    tera.add_raw_template(MACROS_TEMPLATE_NAME, MACROS_TEMPLATE_SRC)?;
    tera.add_raw_template(COLLECTION_TEMPLATE_NAME, COLLECTION_TEMPLATE_SRC)?;
    tera.add_raw_template(DOCUMENT_TEMPLATE_NAME, DOCUMENT_TEMPLATE_SRC)?;
    Ok(tera)
}

/// Escapes the characters that are significant in both XML text content and
/// double-quoted attribute values. Safe to apply even to strings that don't need it.
fn escape_xml(input: &str) -> String {
    input
        .replace('&', "&amp;")
        .replace('<', "&lt;")
        .replace('>', "&gt;")
        .replace('"', "&quot;")
}

fn render_collection_mets(ctx: &CollectionMetsContext) -> Result<String> {
    let tera = build_tera()?;
    Ok(tera.render(
        COLLECTION_TEMPLATE_NAME,
        &tera::Context::from_serialize(ctx)?,
    )?)
}

fn render_document_mets(ctx: &DocumentMetsContext) -> Result<String> {
    let tera = build_tera()?;
    Ok(tera.render(DOCUMENT_TEMPLATE_NAME, &tera::Context::from_serialize(ctx)?)?)
}

/// Strips characters that aren't safe to use in a file or directory name on common
/// filesystems, leaving spaces and other punctuation in titles intact.
fn sanitize_for_path(s: &str) -> String {
    s.chars()
        .filter(|c| !matches!(c, '/' | '\\' | ':' | '*' | '?' | '"' | '<' | '>' | '|'))
        .collect()
}

/// Derives a file extension (including the leading `.`) from a URL or file path, e.g.
/// `"https://example.com/audio.mp3"` -> `".mp3"`. Returns an empty string when there's no
/// discernible extension (e.g. the literal `"S3"` placeholder).
fn file_extension(url: &str) -> String {
    Path::new(url)
        .extension()
        .map(|ext| format!(".{}", ext.to_string_lossy()))
        .unwrap_or_default()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn collection_mets_renders_well_formed_xml() {
        let ctx = CollectionMetsContext {
            collection_title: "Willie Jumper Stories".to_owned(),
            collection_label: "A collection of manuscripts and stories from Willie Jumper."
                .to_owned(),
            collection_slug: "willie-jumper-stories".to_owned(),
            now: "2026-08-06T15:10:00".to_owned(),
            contributors: vec!["Ellen Cushman".to_owned(), "Ben Frey".to_owned()],
            citation:
                "Willie Jumper Stories by Ellen Cushman, Ben Frey, is licensed under CC BY-NC 4.0"
                    .to_owned(),
            documents: vec![CollectionDocumentEntry {
                title: "Story of Millie Pigeon".to_owned(),
                slug: "story-of-millie-pigeon".to_owned(),
                audio_locref: "S3".to_owned(),
                mets_filename: "Story of Millie Pigeon_20260806T151000.mets.xml".to_owned(),
            }],
        };

        let xml = render_collection_mets(&ctx).expect("template should render");
        assert!(xml.contains("OBJID=\"Willie Jumper Stories\""));
        assert!(xml.contains("<dc:contributor>Ellen Cushman</dc:contributor>"));
        assert!(xml.contains("Story of Millie Pigeon_20260806T151000.mets.xml"));
        // File IDs are built from the document's slug, not its (space-containing,
        // `xs:ID`-unsafe) title. See mets-xml.md finding 6.3.
        assert!(xml.contains("ID=\"story-of-millie-pigeon_m\""));
        assert!(!xml.contains("ID=\"Story of Millie Pigeon_m\""));
        // `mptr` points at the sibling document METS file via LOCTYPE/LOCREF, not the
        // invalid FILEID attribute. See mets-xml.md finding 6.4.
        assert!(xml.contains(
            "<mets:mptr LOCTYPE=\"URL\" LOCREF=\"Story of Millie Pigeon_20260806T151000.mets.xml\"/>"
        ));
        roxmltree::Document::parse(&xml).expect("output should be well-formed XML");
    }

    #[test]
    fn document_mets_renders_well_formed_xml() {
        let ctx = DocumentMetsContext {
            document_title: "Story of Millie Pigeon".to_owned(),
            now: "2026-08-06T15:10:00".to_owned(),
            collection_slug: "willie-jumper-stories".to_owned(),
            document_slug: "story-of-millie-pigeon".to_owned(),
            audio_url: "https://example.com/audio.mp3".to_owned(),
            ext: ".mp3".to_owned(),
            image_oid: "15532353".to_owned(),
        };

        let xml = render_document_mets(&ctx).expect("template should render");
        assert!(xml.contains("LOCTYPE=\"URL\""));
        assert!(xml.contains("LOCREF=\"https://example.com/audio.mp3\""));
        assert!(!xml.contains("Word Content"));
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
        roxmltree::Document::parse(&xml).expect("output should be well-formed XML");
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
    fn sanitize_for_path_strips_unsafe_characters() {
        assert_eq!(
            sanitize_for_path("Story of Millie Pigeon"),
            "Story of Millie Pigeon"
        );
        assert_eq!(sanitize_for_path("A/B:C"), "ABC");
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
            now: "2026-08-06T15:10:00".to_owned(),
            contributors: vec![escape_xml("Q & A")],
            citation: escape_xml("Tom & Jerry by Q & A, is licensed under CC BY-NC 4.0"),
            documents: vec![],
        };

        let xml = render_collection_mets(&ctx).expect("template should render");
        assert!(xml.contains("OBJID=\"Tom &amp; Jerry\""));
        assert!(xml.contains("<dc:contributor>Q &amp; A</dc:contributor>"));
        roxmltree::Document::parse(&xml).expect("output should be well-formed XML");
    }
}
