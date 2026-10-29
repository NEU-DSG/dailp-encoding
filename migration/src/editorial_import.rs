//! Re-imports editorial page content (`collections/editorial/*.{md,html}` and
//! `editorial/<heading>/*.{md,html}`) via [`Database::upsert_page`] -- the inverse of
//! `crate::editorial`. This direction is actually *less* lossy than export: a file's own
//! extension (`.md` vs `.html`) already unambiguously encodes the content format
//! `editorial.rs` otherwise has to sniff from the concatenated body text.

use std::path::Path;

use anyhow::{bail, Context, Result};
use dailp::page::NewPageInput;
use dailp::{CollectionSection, Database};
use log::warn;

use crate::checksum::sha256_hex;

/// One editorial page/chapter reference, parsed out of a manifest or collection METS
/// file's `fileSec`/`structSec` (see `crate::mets_import`). `archival_locref` is always
/// `"./editorial/..."`, but relative to a different base directory depending on which
/// file it was parsed from -- `mets_import::import_bundle` resolves it (via
/// [`read_and_verify`]) against the right base directory before this ref's content is
/// ever used.
pub(crate) struct EditorialPageRef {
    pub(crate) title: String,
    pub(crate) archival_locref: String,
    /// This content's live website URL (the `original`-fileGrp locref), if the bundle
    /// still had one. Used to recover a standalone site page's real `page.path` exactly
    /// -- see [`import_editorial_page`]. Not needed for a collection-owned chapter,
    /// whose path is always derivable by convention instead (see
    /// [`import_collection_chapter_page`]).
    pub(crate) original_locref: Option<String>,
    pub(crate) checksum: Option<String>,
}

/// The result of importing one collection-owned chapter page -- everything
/// `mets_import::import_one_collection` needs to build this chapter's
/// [`dailp::raw::CollectionChapter`] entry.
pub(crate) struct ImportedChapterPage {
    pub(crate) title: String,
    pub(crate) chapter_slug: String,
    pub(crate) section: CollectionSection,
}

/// Imports one standalone site page (from the manifest's `site_pages` list) at its
/// original website path, recovered from the bundle's own live-URL locref when present.
/// `content` is this page's already read-and-checksum-verified file content (see
/// [`read_and_verify`]) -- read once, eagerly, during `mets_import::import_bundle`'s
/// validation pass, rather than re-read here.
pub(crate) async fn import_editorial_page(
    db: &Database,
    page: &EditorialPageRef,
    content: &str,
) -> Result<()> {
    let path = page
        .original_locref
        .as_deref()
        .and_then(path_from_url)
        .unwrap_or_else(|| {
            warn!(
                "Could not recover site page \"{}\"'s original website path from its bundle \
                 entry; synthesizing one from its title instead",
                page.title
            );
            format!("/{}", dailp::slugify(&page.title))
        });
    db.upsert_page(NewPageInput {
        title: page.title.clone(),
        body: vec![content.to_owned()],
        path,
    })
    .await?;
    Ok(())
}

/// Imports one collection-owned chapter page. Unlike a standalone site page, its real
/// website path is always `"/{collection_slug}/{chapter_slug}"` by convention (see
/// `editorial.rs`'s `export_collection_chapters`/`website/src/pages/edited-collections/
/// chapter.page.tsx`), so it's reconstructed directly rather than needing a live-URL
/// locref. `chapter_slug` and `section` are recovered from the exported filename itself
/// (`"{slugified collection title}_{section}_{slugified chapter title}.{ext}"`, see
/// `editorial.rs::export_collection_chapters`), since neither is otherwise present in
/// the collection METS file's `structSec` entry for this chapter. `content` is this
/// page's already read-and-checksum-verified file content -- see
/// [`import_editorial_page`]'s doc comment for why it's passed in rather than read here.
pub(crate) async fn import_collection_chapter_page(
    db: &Database,
    collection_title: &str,
    collection_slug: &str,
    page: &EditorialPageRef,
    content: &str,
) -> Result<ImportedChapterPage> {
    let filename = Path::new(&page.archival_locref)
        .file_name()
        .and_then(|f| f.to_str())
        .with_context(|| {
            format!(
                "Editorial page locref {:?} has no filename",
                page.archival_locref
            )
        })?;
    let (section_label, chapter_slug) = parse_chapter_filename(filename, collection_title)?;
    let section = section_from_label(&section_label)?;

    db.upsert_page(NewPageInput {
        title: page.title.clone(),
        body: vec![content.to_owned()],
        path: format!("/{collection_slug}/{chapter_slug}"),
    })
    .await?;

    Ok(ImportedChapterPage {
        title: page.title.clone(),
        chapter_slug,
        section,
    })
}

/// Reads `page`'s exported file (resolved against `base_dir`) and, if the bundle
/// recorded a checksum for it, verifies it before returning the content. `pub(crate)`
/// so `mets_import::import_bundle` can call this eagerly, during its validation pass,
/// rather than leaving it to run lazily inside [`import_editorial_page`]/
/// [`import_collection_chapter_page`] at write time -- see
/// `migration/import-from-xml.md`'s note on `--verify-only`/`--dry-run` coverage.
pub(crate) fn read_and_verify(base_dir: &Path, page: &EditorialPageRef) -> Result<String> {
    let relative = page
        .archival_locref
        .strip_prefix("./")
        .unwrap_or(&page.archival_locref);
    let path = base_dir.join(relative);
    let bytes =
        std::fs::read(&path).with_context(|| format!("Failed to read {}", path.display()))?;
    if let Some(expected) = &page.checksum {
        let actual = sha256_hex(&bytes);
        if &actual != expected {
            bail!(
                "Checksum mismatch for {}: expected {expected}, got {actual}",
                path.display()
            );
        }
    }
    String::from_utf8(bytes).with_context(|| format!("{} is not valid UTF-8", path.display()))
}

/// Strips an absolute URL down to its path component (e.g.
/// `"https://dailp.northeastern.edu/about/team"` -> `"/about/team"`), so a live-URL
/// locref (always `{dailp_base_url}{page.path}`, see `mets::editorial_page_refs`) can be
/// turned back into the bare `page.path` `upsert_page` expects.
fn path_from_url(url: &str) -> Option<String> {
    let after_scheme = url.split_once("://")?.1;
    let path_start = after_scheme.find('/')?;
    Some(after_scheme[path_start..].to_owned())
}

/// Recovers `(section_label, chapter_slug)` from
/// `"{slugified collection title}_{section}_{slugified chapter title}.{ext}"` --
/// `dailp::slugify` never introduces an underscore (it uses `-` for word breaks), so
/// splitting on `_` unambiguously separates the three components even though the
/// collection/chapter slugs themselves may contain hyphens.
fn parse_chapter_filename(filename: &str, collection_title: &str) -> Result<(String, String)> {
    let stem = Path::new(filename)
        .file_stem()
        .and_then(|s| s.to_str())
        .with_context(|| format!("Editorial page filename {filename:?} has no stem"))?;
    let prefix = format!("{}_", dailp::slugify(collection_title));
    let rest = stem.strip_prefix(&prefix).with_context(|| {
        format!(
            "Editorial page filename {filename:?} doesn't start with expected prefix {prefix:?}"
        )
    })?;
    let (section_label, chapter_slug) = rest.split_once('_').with_context(|| {
        format!("Editorial page filename {filename:?} doesn't match \"<collection>_<section>_<chapter>\"")
    })?;
    Ok((section_label.to_owned(), chapter_slug.to_owned()))
}

fn section_from_label(label: &str) -> Result<CollectionSection> {
    match label {
        "intro" => Ok(CollectionSection::Intro),
        "body" => Ok(CollectionSection::Body),
        "credit" => Ok(CollectionSection::Credit),
        other => bail!("Unrecognized collection chapter section label {other:?}"),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn path_from_url_strips_scheme_and_host() {
        assert_eq!(
            path_from_url("https://dailp.northeastern.edu/about/team"),
            Some("/about/team".to_string())
        );
        assert_eq!(
            path_from_url("https://dailp.northeastern.edu/"),
            Some("/".to_string())
        );
        assert_eq!(path_from_url("not-a-url"), None);
    }

    #[test]
    fn parse_chapter_filename_splits_collection_section_and_chapter() {
        let (section, chapter) = parse_chapter_filename(
            "willie-jumper-stories_intro_greetings.md",
            "Willie Jumper Stories",
        )
        .expect("should parse");
        assert_eq!(section, "intro");
        assert_eq!(chapter, "greetings");
    }

    #[test]
    fn parse_chapter_filename_handles_hyphenated_chapter_titles() {
        let (section, chapter) = parse_chapter_filename(
            "willie-jumper-stories_body_the-old-timer.html",
            "Willie Jumper Stories",
        )
        .expect("should parse");
        assert_eq!(section, "body");
        assert_eq!(chapter, "the-old-timer");
    }

    #[test]
    fn section_from_label_rejects_unknown_labels() {
        assert!(section_from_label("intro").is_ok());
        assert!(section_from_label("bogus").is_err());
    }
}
