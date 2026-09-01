//! Exports "editorial" content -- human-authored page bodies stored in DAILP's `page`
//! table -- at both the collection level and the site level, into this run's
//! `collections/editorial/` and `editorial/` directories respectively (see
//! [`crate::mets::generate_mets_for_collection`]).
//!
//! The `page` table has no column distinguishing "this page is an edited collection's
//! chapter content" from "this is a standalone site page," and no column recording
//! whether a page's `content` is Markdown or HTML -- both are computed by convention
//! here, mirroring how the website frontend already computes them:
//! - Collection vs. site page: a [`dailp::CollectionChapter`] with `wordpress_id` set has
//!   its body fetched by path, `"/{collection_slug}/{chapter_slug}"`
//!   (`website/src/pages/edited-collections/chapter.page.tsx`). A page belongs to a
//!   collection iff some chapter's `wordpress_id` is set and its computed path matches --
//!   there's no foreign key.
//! - Markdown vs. HTML: sniffed from whether the content's first non-whitespace character
//!   is `<` (`website/src/pages/dailp.page.tsx`), same heuristic used here in
//!   [`page_body_and_extension`].
//!
//! A future migration is expected to formally split `page` into site-page and
//! collection-page tables; until then this module computes the distinction from existing
//! data rather than a schema change.

use std::collections::{HashMap, HashSet};
use std::path::Path;

use anyhow::{Context, Result};
use dailp::page::ContentBlock;
use dailp::{CollectionChapter, CollectionSection, Database, EditedCollection, MenuItem};
use log::{info, warn};

use crate::checksum::sha256_hex;

/// The single site navigation menu that `page`s not owned by any collection are grouped
/// under, by their top-level heading -- see [`build_menu_heading_map`]. Mirrors
/// `website/src/menu.tsx`'s `useMenuBySlugQuery({ slug: "default-nav" })`.
const SITE_MENU_SLUG: &str = "default-nav";

/// One editorial page/chapter written by [`export_collection_chapters`]/
/// [`export_site_pages`], with enough information for a caller (`mets.rs`) to reference
/// it from a METS file, without needing to re-derive any of this from the filesystem.
pub struct EditorialPageEntry {
    /// The page's/chapter's title, unescaped -- callers XML-escape it themselves,
    /// mirroring every other `*MetsContext`/`*Entry` type in `mets.rs`.
    pub title: String,
    /// This file's path relative to the `out_dir` it was written into (a single filename
    /// for a collection chapter; `"{heading}/{page}.{ext}"` for a site page), so a caller
    /// only needs to know its own relationship to `out_dir` to build a full locref.
    pub relative_path: String,
    /// The path this content is actually served at on the live DAILP website (e.g.
    /// `"/about/team"` or `"/cwkw/greetings"`), used by callers to build an "original"
    /// (live URL) METS reference.
    pub site_path: String,
    /// SHA-256 (see `crate::checksum`) of the exported file's content. Covers the
    /// `cloud_locref`/`archival_locref` fileGrps only -- `original_locref` points at this
    /// content's live, rendered webpage, not this exact file's bytes, so no checksum
    /// applies there (see `mets::editorial_page_refs`).
    pub checksum: String,
}

/// Exports every chapter in `chapters` that's backed by a `page` row rather than (or in
/// addition to) an [`dailp::AnnotatedDoc`] -- i.e. every chapter with `wordpress_id` set,
/// mirroring `chapter.page.tsx`'s own check -- into `out_dir` (this run's
/// `collections/editorial/` directory), one file per chapter, named
/// `"{collection title}_{section}_{chapter title}.{ext}"`.
///
/// A chapter with `wordpress_id` set but no matching `page` row is logged and skipped
/// rather than failing the whole run, since that's the same "content not migrated yet"
/// gap `EditedCollection`'s own doc comment already calls out.
pub async fn export_collection_chapters(
    db: &Database,
    collection: &EditedCollection,
    chapters: &[CollectionChapter],
    out_dir: &Path,
) -> Result<Vec<EditorialPageEntry>> {
    let mut entries = Vec::new();
    for chapter in chapters {
        if chapter.wordpress_id.is_none() {
            continue;
        }

        let Some(chapter_slug) = chapter.path.last() else {
            warn!(
                "Chapter \"{}\" in \"{}\" has wordpress_id set but an empty path; skipping",
                chapter.title, collection.title
            );
            continue;
        };
        let page_path = format!("/{}/{}", collection.slug, dailp::slugify(chapter_slug));

        let page = db
            .page_by_path(&page_path)
            .await
            .with_context(|| format!("Failed to look up page at path {page_path}"))?;
        let Some(page) = page else {
            warn!(
                "Chapter \"{}\" in \"{}\" has wordpress_id set, but no page exists at {page_path}; skipping",
                chapter.title, collection.title
            );
            continue;
        };

        let (content, ext) = page_body_and_extension(&page.body);
        let filename = format!(
            "{}_{}_{}.{ext}",
            dailp::slugify(&collection.title),
            collection_section_label(chapter.section),
            dailp::slugify(&chapter.title),
        );
        let path = out_dir.join(&filename);
        let checksum = sha256_hex(content.as_bytes());
        std::fs::write(&path, content)
            .with_context(|| format!("Failed to write {}", path.display()))?;
        entries.push(EditorialPageEntry {
            title: chapter.title.clone(),
            relative_path: filename,
            site_path: page_path,
            checksum,
        });
    }
    info!(
        "Exported {} editorial chapter(s) for collection \"{}\"",
        entries.len(),
        collection.title
    );
    Ok(entries)
}

/// Exports every `page` row that doesn't belong to an edited collection (see the module
/// doc comment) into `out_dir` (this run's top-level `editorial/` directory), grouped
/// into a subdirectory per top-level site-nav heading, one file per page, named
/// `"{page title}.{ext}"`.
pub async fn export_site_pages(db: &Database, out_dir: &Path) -> Result<Vec<EditorialPageEntry>> {
    let collections = db
        .all_edited_collections()
        .await
        .context("Failed to load edited collections (needed to exclude their pages)")?;
    // Dash-normalized, matching the convention `page.path` segments use -- mirrors
    // `website/src/pages/dailp.page.tsx`'s `isInCollection` check.
    let collection_slugs: HashSet<String> = collections
        .iter()
        .map(|c| c.slug.replace('_', "-"))
        .collect();

    let pages = db
        .all_pages()
        .await
        .context("Failed to load pages for site-level editorial export")?;

    let heading_by_path = match db.get_menu_by_slug(SITE_MENU_SLUG.to_string()).await {
        Ok(menu) => build_menu_heading_map(&menu.items),
        Err(e) => {
            warn!(
                "Failed to load site menu \"{SITE_MENU_SLUG}\" ({e:#}); site pages will fall \
                 back to their own path for a heading instead of their real nav grouping."
            );
            HashMap::new()
        }
    };

    let mut entries = Vec::new();
    for page in &pages {
        let mut segments = page.path.split('/').filter(|s| !s.is_empty());
        let first_segment = segments.next();

        if let Some(first_segment) = first_segment {
            if collection_slugs.contains(&first_segment.replace('_', "-")) {
                // Owned by a collection; exported by `export_collection_chapters` instead.
                continue;
            }
        }

        let heading = heading_by_path
            .get(&page.path)
            .cloned()
            .or_else(|| (page.path == "/").then(|| "home".to_string()))
            .or_else(|| first_segment.map(str::to_string))
            .unwrap_or_else(|| "uncategorized".to_string());

        let (content, ext) = page_body_and_extension(&page.body);
        let heading_slug = dailp::slugify(&heading);
        let page_dir = out_dir.join(&heading_slug);
        std::fs::create_dir_all(&page_dir)
            .with_context(|| format!("Failed to create directory {}", page_dir.display()))?;
        let filename = format!("{}.{ext}", dailp::slugify(&page.title));
        let path = page_dir.join(&filename);
        let checksum = sha256_hex(content.as_bytes());
        std::fs::write(&path, content)
            .with_context(|| format!("Failed to write {}", path.display()))?;
        entries.push(EditorialPageEntry {
            title: page.title.clone(),
            relative_path: format!("{heading_slug}/{filename}"),
            site_path: page.path.clone(),
            checksum,
        });
    }
    info!("Exported {} site-level editorial page(s)", entries.len());
    Ok(entries)
}

/// Maps every page path reachable from `items` (the top-level items themselves, and every
/// descendant reachable through nested `items`) to the label of its top-level ancestor,
/// so a deeply nested nav entry is still grouped under the same heading a site visitor
/// would see it under.
fn build_menu_heading_map(items: &[MenuItem]) -> HashMap<String, String> {
    fn walk(items: &[MenuItem], heading: &str, map: &mut HashMap<String, String>) {
        for item in items {
            map.insert(item.path.clone(), heading.to_string());
            if let Some(children) = &item.items {
                walk(children, heading, map);
            }
        }
    }

    let mut map = HashMap::new();
    for top_level in items {
        map.insert(top_level.path.clone(), top_level.label.clone());
        if let Some(children) = &top_level.items {
            walk(children, &top_level.label, &mut map);
        }
    }
    map
}

/// Lowercased filename component for a [`CollectionSection`], e.g. `Intro` -> `"intro"`.
fn collection_section_label(section: CollectionSection) -> &'static str {
    match section {
        CollectionSection::Intro => "intro",
        CollectionSection::Body => "body",
        CollectionSection::Credit => "credit",
    }
}

/// Concatenates a page's content blocks into one string, and picks a filename extension
/// for it: `"html"` if the concatenated text's first non-whitespace character is `<`,
/// `"md"` otherwise -- mirrors `website/src/pages/dailp.page.tsx`'s own sniffing.
///
/// Kept pure/I/O-free so it stays unit-testable, mirroring `images.rs`'s "pure gather"
/// helpers.
fn page_body_and_extension(body: &[ContentBlock]) -> (String, &'static str) {
    let mut text = String::new();
    for block in body {
        match block {
            ContentBlock::Markdown(markdown) => {
                if !text.is_empty() {
                    text.push_str("\n\n");
                }
                text.push_str(&markdown.content);
            }
            // No DB query populates a `Gallery` block today (both `all_pages` and
            // `page_by_path` always wrap raw `page.content` in a single `Markdown`
            // block), but the type exists, so fail forward rather than silently
            // dropping it if that ever changes. `media_urls` is a private field with no
            // accessor, so `Debug` is the only thing available to note it happened.
            ContentBlock::Gallery(gallery) => {
                if !text.is_empty() {
                    text.push_str("\n\n");
                }
                text.push_str(&format!(
                    "<!-- Gallery block not yet exported by this tool: {gallery:?} -->"
                ));
            }
        }
    }

    let ext = match text.trim_start().chars().next() {
        Some('<') => "html",
        _ => "md",
    };
    (text, ext)
}

#[cfg(test)]
mod tests {
    use dailp::page::Markdown;

    use super::*;

    #[test]
    fn markdown_content_gets_md_extension() {
        let body = vec![ContentBlock::Markdown(Markdown {
            content: "# Hello\n\nSome *markdown*.".to_string(),
        })];
        let (content, ext) = page_body_and_extension(&body);
        assert_eq!(ext, "md");
        assert!(content.contains("Some *markdown*."));
    }

    #[test]
    fn html_content_gets_html_extension() {
        let body = vec![ContentBlock::Markdown(Markdown {
            content: "<div class=\"page\">Hello</div>".to_string(),
        })];
        let (content, ext) = page_body_and_extension(&body);
        assert_eq!(ext, "html");
        assert!(content.starts_with("<div"));
    }

    #[test]
    fn leading_whitespace_is_ignored_when_sniffing() {
        let body = vec![ContentBlock::Markdown(Markdown {
            content: "  \n<p>Hello</p>".to_string(),
        })];
        let (_, ext) = page_body_and_extension(&body);
        assert_eq!(ext, "html");
    }

    #[test]
    fn empty_body_defaults_to_md() {
        let (content, ext) = page_body_and_extension(&[]);
        assert_eq!(ext, "md");
        assert_eq!(content, "");
    }

    #[test]
    fn menu_heading_map_groups_nested_items_under_top_level_label() {
        let items = vec![MenuItem {
            label: "About".to_string(),
            path: "/about".to_string(),
            items: Some(vec![MenuItem {
                label: "Team".to_string(),
                path: "/about/team".to_string(),
                items: None,
            }]),
        }];
        let map = build_menu_heading_map(&items);
        assert_eq!(map.get("/about").map(String::as_str), Some("About"));
        assert_eq!(
            map.get("/about/team").map(String::as_str),
            Some("About"),
            "nested item should be grouped under its top-level ancestor's label, not its own"
        );
    }
}
