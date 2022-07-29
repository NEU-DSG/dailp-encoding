use dailp::{Translation, TranslationBlock};
use itertools::Itertools;
use serde::Deserialize;
use std::time::Duration;
use tokio::time::sleep;

/// Result obtained directly from the raw Google document.
#[derive(Deserialize)]
pub struct DocResult {
    body: String,
}
impl DocResult {
    pub async fn new(doc_id: &str) -> Result<Self, anyhow::Error> {
        let api_key = std::env::var("GOOGLE_API_KEY")?;
        let url = format!(
            "https://www.googleapis.com/drive/v3/files/{}/export?mimeType=text/plain&key={}",
            doc_id, api_key
        );
        let mut tries = 0;
        let t = loop {
            let r = reqwest::get(&url).await;

            // Try up to ten times before giving up.
            if r.is_ok() || tries > 9 {
                break r;
            }
            sleep(Duration::from_millis(1000 * 2_u64.pow(tries))).await;
            tries += 1;
        }?;

        Ok(Self {
            body: t.text().await?,
        })
    }

    pub fn into_translation(self) -> Translation {
        let ends_with_footnote = regex::Regex::new(r"\[\d+\]").unwrap();
        let text_runs = self
            .body
            // Split the translation text by lines.
            .lines()
            .map(|s| s.trim())
            // Group consecutive non-empty lines together.
            .group_by(|s| s.is_empty());
        let blocks = text_runs
            .into_iter()
            // Only keep non-empty runs of text.
            .filter_map(|(empty, lines)| {
                if !empty {
                    Some(lines.collect::<Vec<&str>>())
                } else {
                    None
                }
            })
            // Ignore text past the first horizontal line.
            .take_while(|text| !text[0].starts_with("________"))
            // Split sentences into separate segments.
            .map(|text| {
                text.into_iter()
                    // .flat_map(|s| s.split("."))
                    // Remove footnotes.
                    .map(|text| ends_with_footnote.replace_all(text, "").into_owned())
            })
            // Include the block index.
            .enumerate()
            .map(|(index, content)| TranslationBlock {
                index: index as i32 + 1,
                segments: content.into_iter().filter(|s| !s.is_empty()).collect(),
            });

        Translation {
            paragraphs: blocks.collect(),
        }
    }
}
