//! Downloads a document's overall audio and its word-for-word audio (see
//! [`crate::mets::build_document_entry`]/[`crate::mets::render_one_document`]) into this
//! run's `audio/<file_stem>/`
//! directory, named per the conventions in [`document_audio_filename`]/[`word_audio_filename`].
//! Mirrors `images.rs`'s shape (its own small `fetch_with_retry` is duplicated here rather
//! than shared, to avoid merge-conflict surface with concurrent image-download work landing
//! in that file).
//!
//! A download that fails after retries is treated identically to "this document/word never
//! had audio at all" -- see the doc comments on [`download_document_audio`]/
//! [`download_words_with_audio`]. For a document, this means its overall audio disappears
//! from *every* fileGrp (original/cloud backup/archival), not just the archival one, since
//! the caller (`mets::build_document_entry`) collapses `audio_locref`/`ext` back to
//! `None`/empty alongside `archival_locref` on failure -- a deliberate simplification, not
//! an oversight: a transient network blip will make the backup's "original"/"cloud backup"
//! references disappear too, even though the original external URL may still be perfectly
//! valid.

use std::path::Path;
use std::time::Duration;

use anyhow::{Context, Result};
use dailp::AnnotatedSeg;
use log::{info, warn};
use tokio::time::sleep;

use crate::checksum::sha256_hex;
use crate::mets::{escape_xml, file_extension, remote_audio_key, sanitize_for_path};
use crate::tei::LoadedPage;

/// A document's archived overall audio file.
pub(crate) struct DownloadedDocumentAudio {
    /// Path relative to this document's own METS/TEI files (both live in `documents/`,
    /// one level below the run root, same as `audio/`), e.g.
    /// `"../audio/Story-of-Millie-Pigeon/Story-of-Millie-Pigeon_audio.mp3"`.
    pub(crate) archival_locref: String,
    /// SHA-256 (see `crate::checksum`) of the downloaded bytes -- the same file is
    /// referenced from every fileGrp (original/cloud backup/archival) across the bundle
    /// referencing this document's audio, so this one checksum covers all of them.
    pub(crate) checksum: String,
}

/// One word's archived audio file, plus the fields `document.tera.xml`'s word fileGrps
/// need. Only produced for words whose download actually succeeded -- see
/// [`download_words_with_audio`].
pub(crate) struct DownloadedWordAudio {
    /// `"w" + position index`, unchanged from the convention `mets::words_with_audio`
    /// already established.
    pub(crate) id: String,
    /// Escaped, for the "original"/"cloud backup" fileGrps.
    pub(crate) audio_url: String,
    pub(crate) ext: String,
    pub(crate) archival_locref: String,
    /// SHA-256 (see `crate::checksum`) of the downloaded bytes.
    pub(crate) checksum: String,
}

/// Builds the filename a document's overall audio is archived under:
/// `"{file_stem}_{remote_audio_key}{ext}"`.
fn document_audio_filename(file_stem: &str, resource_url: &str) -> String {
    format!(
        "{file_stem}_{}{}",
        remote_audio_key(resource_url),
        file_extension(resource_url)
    )
}

/// Builds the filename one word's audio is archived under:
/// `"{word_index}_{simple_phonetics}_{remote_audio_key}{ext}"`. `simple_phonetics` falls
/// back to the literal `"unknown"` when the word has none recorded (or it's blank), and is
/// sanitized via `sanitize_for_path` -- not `slugify`, which lowercases and transliterates,
/// lossy for a phonetic transcription that may carry diacritics -- so the filename shape
/// stays constant and easy to parse regardless of whether phonetics were recorded.
fn word_audio_filename(word_index: i64, simple_phonetics: Option<&str>, audio_url: &str) -> String {
    let phonetics = sanitize_for_path(
        simple_phonetics
            .filter(|p| !p.trim().is_empty())
            .unwrap_or("unknown"),
    );
    format!(
        "{word_index}_{phonetics}_{}{}",
        remote_audio_key(audio_url),
        file_extension(audio_url)
    )
}

/// Downloads `resource_url` into `document_audio_dir` (creating it if needed), named per
/// [`document_audio_filename`]. On persistent failure (after retries), returns `Err` -- the
/// caller (`mets::build_document_entry`) is responsible for logging a warning and
/// falling back to "no audio" for this document, exactly mirroring what already happens
/// when `audio_recording` is `None` in the first place.
pub(crate) async fn download_document_audio(
    client: &reqwest::Client,
    resource_url: &str,
    document_audio_dir: &Path,
    file_stem: &str,
) -> Result<DownloadedDocumentAudio> {
    std::fs::create_dir_all(document_audio_dir).with_context(|| {
        format!(
            "Failed to create directory {}",
            document_audio_dir.display()
        )
    })?;

    let filename = document_audio_filename(file_stem, resource_url);
    let path = document_audio_dir.join(&filename);

    info!("Downloading document audio for \"{file_stem}\" from {resource_url}");
    let bytes = fetch_with_retry(client, resource_url)
        .await
        .with_context(|| format!("Failed to download document audio from {resource_url}"))?;
    let checksum = sha256_hex(&bytes);
    std::fs::write(&path, &bytes).with_context(|| format!("Failed to write {}", path.display()))?;

    Ok(DownloadedDocumentAudio {
        archival_locref: format!("../audio/{file_stem}/{filename}"),
        checksum,
    })
}

/// A word with recorded audio, before any download attempt -- pure/sync so it stays
/// unit-testable without a network call. `audio_url`/`simple_phonetics` here are the raw,
/// unescaped values (needed for the outbound request and the filename convention);
/// `download_words_with_audio` escapes `audio_url` only for the returned
/// [`DownloadedWordAudio`], never for the request itself.
struct WordAudioCandidate {
    id: String,
    word_index: i64,
    audio_url: String,
    simple_phonetics: Option<String>,
}

/// Walks already-loaded `pages` (see [`crate::tei::load_document_pages`]) collecting every
/// word (`AnnotatedSeg::Word`) that has a recorded `ingested_audio_track`, in document
/// order. Replaces the pure half of what used to be `mets::words_with_audio` before the
/// rest of the audio-download logic moved here -- see `mets.rs`'s test module for the
/// pointer left in its place, mirroring how `images::page_image_refs` already documents the
/// same kind of move for page images.
fn word_audio_candidates(pages: &[LoadedPage]) -> Vec<WordAudioCandidate> {
    pages
        .iter()
        .flat_map(|page| &page.paragraphs)
        .flat_map(|para| &para.words)
        .filter_map(|seg| match seg {
            AnnotatedSeg::Word(form) => {
                form.ingested_audio_track
                    .as_ref()
                    .map(|audio| WordAudioCandidate {
                        id: format!("w{}", form.position.index),
                        word_index: form.position.index,
                        audio_url: audio.resource_url.clone(),
                        simple_phonetics: form.simple_phonetics.clone(),
                    })
            }
            _ => None,
        })
        .collect()
}

/// Downloads every word-with-audio candidate in `pages`, writing successes into
/// `document_audio_dir` named per [`word_audio_filename`]. Words whose download fails after
/// retries are logged as a warning and OMITTED from the returned `Vec` entirely -- from the
/// METS/TEI templates' point of view this is indistinguishable from that word never having
/// had audio in the first place (no `file` entry, no `structSec` `div`, no TEI
/// `<ptr type="audio">`).
///
/// Returns `Err` only for fatal/environmental failures (e.g. can't create
/// `document_audio_dir`), never for an individual word's download failure.
pub(crate) async fn download_words_with_audio(
    client: &reqwest::Client,
    pages: &[LoadedPage],
    document_audio_dir: &Path,
    file_stem: &str,
) -> Result<Vec<DownloadedWordAudio>> {
    let candidates = word_audio_candidates(pages);
    if candidates.is_empty() {
        return Ok(Vec::new());
    }
    std::fs::create_dir_all(document_audio_dir).with_context(|| {
        format!(
            "Failed to create directory {}",
            document_audio_dir.display()
        )
    })?;

    let total = candidates.len();
    let mut downloaded = Vec::with_capacity(total);
    for candidate in candidates {
        let filename = word_audio_filename(
            candidate.word_index,
            candidate.simple_phonetics.as_deref(),
            &candidate.audio_url,
        );
        let path = document_audio_dir.join(&filename);

        match fetch_with_retry(client, &candidate.audio_url).await {
            Ok(bytes) => {
                let checksum = sha256_hex(&bytes);
                if let Err(e) = std::fs::write(&path, &bytes) {
                    warn!(
                        "Failed to write {}: {e:#}. Treating \"{}\" as if it had no audio.",
                        path.display(),
                        candidate.id
                    );
                    continue;
                }
                downloaded.push(DownloadedWordAudio {
                    ext: file_extension(&candidate.audio_url),
                    audio_url: escape_xml(&candidate.audio_url),
                    archival_locref: format!("../audio/{file_stem}/{filename}"),
                    checksum,
                    id: candidate.id,
                });
            }
            Err(e) => {
                warn!(
                    "Failed to download audio for word \"{}\" ({}) after retries: {e:#}. \
                     Treating it as if it had no audio.",
                    candidate.id, candidate.audio_url
                );
            }
        }
    }

    info!(
        "Downloaded {}/{total} word audio file(s) for \"{file_stem}\" to {}",
        downloaded.len(),
        document_audio_dir.display()
    );
    Ok(downloaded)
}

/// Number of attempts `fetch_with_retry` makes before giving up.
const MAX_ATTEMPTS: u32 = 4;

/// Fetches `url`'s response body as raw bytes, retrying network errors and 5xx responses
/// with exponential backoff (capped at [`MAX_ATTEMPTS`] attempts total), but failing
/// immediately on 4xx responses. Line-for-line the same shape as `images::fetch_with_retry`
/// -- duplicated rather than shared/extracted, see the module doc comment.
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
        // file), so fail immediately rather than waste attempts.
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
    use dailp::{
        AnnotatedForm, AudioSlice, DocumentId, DocumentPage, DocumentParagraph, LineBreak,
        PositionInDocument, Uuid,
    };

    fn sample_word_with_audio(
        index: i64,
        audio_url: &str,
        simple_phonetics: Option<&str>,
    ) -> AnnotatedForm {
        AnnotatedForm {
            id: None,
            source: "osdi".to_owned(),
            normalized_source: None,
            simple_phonetics: simple_phonetics.map(str::to_owned),
            phonemic: None,
            segments: None,
            english_gloss: vec![],
            commentary: None,
            line_break: None,
            page_break: None,
            position: PositionInDocument {
                document_id: DocumentId(Uuid::nil()),
                page_number: "1".to_owned(),
                index,
                geometry: None,
            },
            date_recorded: None,
            ingested_audio_track: Some(AudioSlice {
                slice_id: None,
                resource_url: audio_url.to_owned(),
                parent_track: None,
                annotations: None,
                index: 0,
                include_in_edited_collection: true,
                edited_by: None,
                recorded_at: None,
                recorded_by: None,
                start_time: None,
                end_time: None,
            }),
        }
    }

    fn sample_pages() -> Vec<LoadedPage> {
        vec![
            LoadedPage {
                page: DocumentPage {
                    id: Uuid::from_u128(1),
                    page_number: "1".to_owned(),
                    image: None,
                },
                paragraphs: vec![LoadedParagraph {
                    paragraph: DocumentParagraph {
                        id: Uuid::from_u128(2),
                        translation: "She went to the store.".to_owned(),
                        index: 1,
                    },
                    words: vec![
                        AnnotatedSeg::Word(sample_word_with_audio(
                            1,
                            "https://example.com/w1.mp3",
                            Some("o:sdi"),
                        )),
                        AnnotatedSeg::LineBreak(LineBreak { index: 1 }),
                    ],
                }],
            },
            LoadedPage {
                page: DocumentPage {
                    id: Uuid::from_u128(3),
                    page_number: "2".to_owned(),
                    image: None,
                },
                paragraphs: vec![],
            },
        ]
    }

    #[test]
    fn word_audio_candidates_walks_every_page_and_paragraph() {
        let candidates = word_audio_candidates(&sample_pages());
        assert_eq!(candidates.len(), 1);
        assert_eq!(candidates[0].id, "w1");
        assert_eq!(candidates[0].word_index, 1);
        assert_eq!(candidates[0].audio_url, "https://example.com/w1.mp3");
        assert_eq!(candidates[0].simple_phonetics.as_deref(), Some("o:sdi"));
    }

    #[test]
    fn document_audio_filename_combines_stem_key_and_extension() {
        assert_eq!(
            document_audio_filename(
                "Story-of-Millie-Pigeon",
                "https://example.com/some/path/audio.mp3"
            ),
            "Story-of-Millie-Pigeon_audio.mp3"
        );
    }

    #[test]
    fn word_audio_filename_combines_index_phonetics_key_and_extension() {
        assert_eq!(
            word_audio_filename(1, Some("o-sdi"), "https://example.com/some/path/w1.mp3"),
            "1_o-sdi_w1.mp3"
        );
    }

    #[test]
    fn word_audio_filename_falls_back_to_unknown_for_missing_or_blank_phonetics() {
        assert_eq!(
            word_audio_filename(2, None, "https://example.com/w2.mp3"),
            "2_unknown_w2.mp3"
        );
        assert_eq!(
            word_audio_filename(3, Some("   "), "https://example.com/w3.mp3"),
            "3_unknown_w3.mp3"
        );
    }

    #[test]
    fn word_audio_filename_sanitizes_phonetics_for_the_filesystem() {
        // Sanitized with `sanitize_for_path` (strips filesystem-unsafe characters, joins
        // whitespace-split words with `-`), not `slugify` (which would lowercase and
        // transliterate, mangling diacritics).
        assert_eq!(
            word_audio_filename(1, Some("a b/c"), "https://example.com/w1.mp3"),
            "1_a-bc_w1.mp3"
        );
    }
}
