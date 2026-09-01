//! Downloads each document's manuscript page images from their real IIIF image server into
//! this run's `images/` directory (see [`crate::mets::render_one_document`]),
//! named `{document_slug}_page{page_number}_{iiif_oid}.jpg`. Extension is always `.jpg`
//! since this pipeline always requests IIIF's `default.jpg` rendering, matching the
//! convention already established in `types/src/iiif.rs` (`Manifest::from_document`).
//!
//! A single [`DocumentPage`]'s `image.oid` is sometimes a comma-separated list of more than
//! one IIIF oid (messy but real source metadata, not a bug in this pipeline) -- see
//! [`split_oids`]. Requesting a joined oid list as if it were one oid produces an invalid
//! IIIF path and a 500 from the image server, so each oid in the list is downloaded (and
//! named) as its own separate image instead.

use std::collections::{HashMap, HashSet};
use std::path::Path;
use std::time::Duration;

use anyhow::{Context, Result};
use dailp::async_graphql::dataloader::Loader;
use dailp::{Database, ImageSource, ImageSourceId};
use log::{info, warn};
use tokio::time::sleep;

use crate::checksum::sha256_hex;
use crate::tei::LoadedPage;

/// A manuscript page image, downloaded into this run's `images/` directory and carrying
/// its resolved IIIF source URL and archival filename -- see [`download_page_images`].
pub(crate) struct DownloadedImage {
    /// Bare IIIF oid, e.g. "15532353" -- used for building `xml:id`s in `document.tera.xml`.
    pub(crate) oid: String,
    /// This oid's resolved [`ImageSource::url`], e.g.
    /// "https://images.library.northeastern.edu/iiif/2/images/dailp" -- lets
    /// `document.tera.xml`'s "original" fileGrp reference each image's real IIIF host
    /// instead of a single hardcoded one (DAILP has more than one -- see
    /// `migration/src/main.rs`'s `upsert_image_source` calls).
    pub(crate) source_url: String,
    /// Filename (not a path) this image was downloaded to under `images/`,
    /// `{document_slug}_page{page_number}_{oid}.jpg` -- computed once here so every locref
    /// referencing this file agrees with what's actually on disk.
    pub(crate) filename: String,
    /// SHA-256 (see `crate::checksum`) of the downloaded bytes.
    pub(crate) checksum: String,
}

/// One individual manuscript image to download, gathered from a document's pages. *Not*
/// one-to-one with pages: a single [`DocumentPage`] can reference more than one IIIF image
/// via a comma-separated `oid` list (see [`split_oids`]), so one page can produce more than
/// one `PageImageRef`.
#[derive(Debug, Clone, PartialEq, Eq)]
struct PageImageRef {
    /// The page this image belongs to, e.g. "1" -- carried through so the downloaded
    /// filename can disambiguate multiple images on the same page (and multiple pages
    /// sharing an otherwise-identical oid, however unlikely).
    page_number: String,
    oid: String,
    source_id: ImageSourceId,
}

/// Downloads every manuscript page image referenced by `pages` (in page order) into
/// `images_dir`, resolving each image's [`ImageSourceId`] to its real base URL via the
/// [`Loader<ImageSourceId>`] impl (batched once per distinct source, not once per image)
/// rather than assuming a single IIIF host for every document.
pub(crate) async fn download_page_images(
    client: &reqwest::Client,
    db: &Database,
    pages: &[LoadedPage],
    document_slug: &str,
    images_dir: &Path,
) -> Result<Vec<DownloadedImage>> {
    let refs = page_image_refs(pages);
    if refs.is_empty() {
        return Ok(Vec::new());
    }

    let mut seen = HashSet::new();
    let distinct_source_ids: Vec<ImageSourceId> = refs
        .iter()
        .map(|r| r.source_id.clone())
        .filter(|id| seen.insert(id.clone()))
        .collect();
    let sources: HashMap<ImageSourceId, ImageSource> =
        Loader::load(db, &distinct_source_ids).await.map_err(|e| {
            anyhow::anyhow!("Failed to load image source(s) for \"{document_slug}\": {e}")
        })?;

    let mut downloaded = Vec::with_capacity(refs.len());
    for r in refs {
        let PageImageRef {
            page_number,
            oid,
            source_id,
        } = r;
        let source = sources.get(&source_id).ok_or_else(|| {
            anyhow::anyhow!(
                "Document \"{document_slug}\"'s page image \"{oid}\" references an image \
                 source that couldn't be loaded"
            )
        })?;
        let image_url = format!("{}/{}/full/max/0/default.jpg", source.url, oid);
        let filename = format!("{document_slug}_page{page_number}_{oid}.jpg");
        let path = images_dir.join(&filename);

        info!(
            "Downloading page image \"{oid}\" (page {page_number}) for \"{document_slug}\" \
             from {image_url}"
        );
        let bytes = fetch_with_retry(client, &image_url)
            .await
            .with_context(|| {
                format!(
                    "Failed to download page image \"{oid}\" (page {page_number}) for \
                 \"{document_slug}\" from {image_url}"
                )
            })?;
        let checksum = sha256_hex(&bytes);
        std::fs::write(&path, &bytes)
            .with_context(|| format!("Failed to write {}", path.display()))?;

        downloaded.push(DownloadedImage {
            oid,
            source_url: source.url.clone(),
            filename,
            checksum,
        });
    }

    info!(
        "Downloaded {} page image(s) for \"{document_slug}\" to {}",
        downloaded.len(),
        images_dir.display()
    );

    Ok(downloaded)
}

/// Collects a [`PageImageRef`] for every individual IIIF image referenced by `pages`, in
/// page order, skipping pages without an image. Kept as a small, I/O-free helper so it
/// stays unit-testable without a real database or network access, mirroring the pure
/// "gather ids" style `mets.rs` already uses elsewhere (e.g. `words_with_audio`).
fn page_image_refs(pages: &[LoadedPage]) -> Vec<PageImageRef> {
    pages
        .iter()
        .filter_map(|loaded_page| {
            loaded_page
                .page
                .image
                .as_ref()
                .map(|image| (loaded_page.page.page_number.clone(), image))
        })
        .flat_map(|(page_number, image)| {
            split_oids(&image.oid)
                .into_iter()
                .map(move |oid| PageImageRef {
                    page_number: page_number.clone(),
                    oid,
                    source_id: image.source_id.clone(),
                })
        })
        .collect()
}

/// Splits a `DocumentPage.image.oid` string on commas into individual IIIF oids, trimming
/// surrounding whitespace and dropping empty pieces. Most pages have exactly one oid, so
/// this returns a single-element `Vec` for them; some pages' `oid` is a comma-separated
/// list of more than one IIIF image (e.g. `"15532418, 15532419"`) -- each must be requested
/// (and named) as its own separate image, since IIIF servers 500 on a joined oid list
/// treated as a single path segment.
fn split_oids(oid: &str) -> Vec<String> {
    oid.split(',')
        .map(str::trim)
        .filter(|piece| !piece.is_empty())
        .map(str::to_owned)
        .collect()
}

/// Number of attempts `fetch_with_retry` makes before giving up.
const MAX_ATTEMPTS: u32 = 5;

/// Fetches `url`'s response body as raw bytes, retrying network errors and 5xx responses
/// with exponential backoff (capped at [`MAX_ATTEMPTS`] attempts total), but failing
/// immediately on 4xx responses. Mirrors the retry shape already established for
/// external-service calls in `audio.rs`'s `DrsRes::new`, simplified since this has no JSON
/// envelope to parse -- just raw image bytes.
async fn fetch_with_retry(client: &reqwest::Client, url: &str) -> Result<Vec<u8>> {
    let mut attempt = 0;
    loop {
        let response = match client.get(url).send().await {
            Ok(response) => response,
            Err(e) => {
                if attempt + 1 >= MAX_ATTEMPTS {
                    anyhow::bail!("giving up after {MAX_ATTEMPTS} attempts: {e}");
                }
                warn!(
                    "Network error fetching {url}: {e}. Retrying (attempt {}/{MAX_ATTEMPTS})",
                    attempt + 1
                );
                sleep(Duration::from_millis(500 * 2u64.pow(attempt))).await;
                attempt += 1;
                continue;
            }
        };

        let status = response.status();
        if status.is_success() {
            return Ok(response
                .bytes()
                .await
                .with_context(|| format!("Failed to read response body from {url}"))?
                .to_vec());
        }

        // Client errors (4xx) won't resolve themselves on retry (e.g. a genuinely missing
        // oid), so fail immediately rather than waste attempts.
        if status.is_client_error() {
            anyhow::bail!("server returned {status}");
        }

        if attempt + 1 >= MAX_ATTEMPTS {
            anyhow::bail!("giving up after {MAX_ATTEMPTS} attempts, last status {status}");
        }
        warn!(
            "{url} returned {status}. Retrying (attempt {}/{MAX_ATTEMPTS})",
            attempt + 1
        );
        sleep(Duration::from_millis(500 * 2u64.pow(attempt))).await;
        attempt += 1;
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::tei::LoadedParagraph;
    use dailp::{DocumentPage, PageImage, Uuid};

    fn page_with_image(page_number: &str, oid: &str, source: u128) -> LoadedPage {
        LoadedPage {
            page: DocumentPage {
                id: Uuid::from_u128(1),
                page_number: page_number.to_owned(),
                image: Some(PageImage {
                    source_id: ImageSourceId(Uuid::from_u128(source)),
                    oid: oid.to_owned(),
                }),
            },
            paragraphs: Vec::<LoadedParagraph>::new(),
        }
    }

    fn page_without_image() -> LoadedPage {
        LoadedPage {
            page: DocumentPage {
                id: Uuid::from_u128(2),
                page_number: "2".to_owned(),
                image: None,
            },
            paragraphs: Vec::new(),
        }
    }

    #[test]
    fn page_image_refs_collects_refs_in_page_order_and_skips_pages_without_one() {
        let pages = vec![
            page_with_image("1", "15532353", 1),
            page_without_image(),
            page_with_image("3", "15532354", 2),
        ];

        assert_eq!(
            page_image_refs(&pages),
            vec![
                PageImageRef {
                    page_number: "1".to_owned(),
                    oid: "15532353".to_owned(),
                    source_id: ImageSourceId(Uuid::from_u128(1)),
                },
                PageImageRef {
                    page_number: "3".to_owned(),
                    oid: "15532354".to_owned(),
                    source_id: ImageSourceId(Uuid::from_u128(2)),
                },
            ]
        );
    }

    #[test]
    fn page_image_refs_splits_a_comma_separated_oid_list_into_separate_refs_on_the_same_page() {
        // Real, messy source metadata: a single page's `image.oid` sometimes holds more
        // than one IIIF oid, comma-separated. Requesting the joined string as a single IIIF
        // path segment 500s -- each must become its own `PageImageRef` instead, sharing the
        // page's own page_number and source_id.
        let pages = vec![page_with_image("5", "15532418, 15532419", 1)];

        assert_eq!(
            page_image_refs(&pages),
            vec![
                PageImageRef {
                    page_number: "5".to_owned(),
                    oid: "15532418".to_owned(),
                    source_id: ImageSourceId(Uuid::from_u128(1)),
                },
                PageImageRef {
                    page_number: "5".to_owned(),
                    oid: "15532419".to_owned(),
                    source_id: ImageSourceId(Uuid::from_u128(1)),
                },
            ]
        );
    }

    #[test]
    fn split_oids_trims_whitespace_and_drops_empty_pieces() {
        assert_eq!(
            split_oids("15532418, 15532419"),
            vec!["15532418".to_owned(), "15532419".to_owned()]
        );
        assert_eq!(split_oids("15532353"), vec!["15532353".to_owned()]);
        assert_eq!(split_oids(""), Vec::<String>::new());
        assert_eq!(split_oids(" , "), Vec::<String>::new());
    }
}
