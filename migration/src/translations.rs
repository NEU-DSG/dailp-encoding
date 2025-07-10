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
        if doc_id.trim().is_empty() {
            return Err(anyhow::anyhow!("Empty Google Doc ID provided"));
        }

        let api_key = std::env::var("GOOGLE_API_KEY")
            .map_err(|_| anyhow::anyhow!("GOOGLE_API_KEY environment variable not set"))?;

        if api_key.trim().is_empty() {
            return Err(anyhow::anyhow!(
                "GOOGLE_API_KEY environment variable is empty"
            ));
        }

        let url = format!(
            "https://www.googleapis.com/drive/v3/files/{}/export?mimeType=text/plain&key={}",
            doc_id, api_key
        );

        let mut tries = 0;
        let max_tries = 9;

        let response = loop {
            let request_result = reqwest::get(&url).await;

            let response = match request_result {
                Ok(resp) => resp,
                Err(e) => {
                    if tries > max_tries {
                        return Err(anyhow::anyhow!(
                            "Failed to connect to Google Drive API after {} attempts for doc ID '{}': {}", 
                            max_tries + 1, doc_id, e
                        ));
                    }

                    println!(
                        "Network error fetching Google Doc '{}': {}. Retrying (attempt {}/{})",
                        doc_id,
                        e,
                        tries + 1,
                        max_tries + 1
                    );

                    let delay = Duration::from_millis(1000 * 2_u64.pow(tries));
                    sleep(delay).await;
                    tries += 1;
                    continue;
                }
            };

            let status = response.status();
            if status.is_success() {
                break response;
            }

            let error_body = response
                .text()
                .await
                .unwrap_or_else(|_| String::from("[Failed to read error response]"));

            if status.as_u16() >= 400 && status.as_u16() < 500 {
                return match status.as_u16() {
                    401 => Err(anyhow::anyhow!(
                        "Unauthorized access to Google Doc '{}'. Check your API key. Response: {}", 
                        doc_id, error_body
                    )),
                    403 => Err(anyhow::anyhow!(
                        "Forbidden access to Google Doc '{}'. Check permissions or API quotas. Response: {}", 
                        doc_id, error_body
                    )),
                    404 => Err(anyhow::anyhow!(
                        "Google Doc '{}' not found. Check if the document exists and is publicly accessible. Response: {}", 
                        doc_id, error_body
                    )),
                    _ => Err(anyhow::anyhow!(
                        "Client error {} accessing Google Doc '{}'. Response: {}", 
                        status, doc_id, error_body
                    ))
                };
            }

            if tries > max_tries {
                return Err(anyhow::anyhow!(
                    "Google Drive API failed with status {} after {} attempts for doc ID '{}'. Response: {}", 
                    status, max_tries + 1, doc_id, error_body
                ));
            }

            println!(
                "Server error {} fetching Google Doc '{}'. Retrying (attempt {}/{})",
                status,
                doc_id,
                tries + 1,
                max_tries + 1
            );

            let delay = Duration::from_millis(1000 * 2_u64.pow(tries));
            sleep(delay).await;
            tries += 1;
        };

        let body = response.text().await.map_err(|e| {
            anyhow::anyhow!(
                "Failed to read response body for Google Doc '{}': {}",
                doc_id,
                e
            )
        })?;

        if body.trim().is_empty() {
            println!("Warning: Google Doc '{}' appears to be empty", doc_id);
        }

        Ok(Self { body })
    }

    pub fn into_translation(self) -> Result<Translation, anyhow::Error> {
        if self.body.trim().is_empty() {
            return Err(anyhow::anyhow!(
                "Cannot create translation from empty document body"
            ));
        }

        let ends_with_footnote = regex::Regex::new(r"\[\d+\]")
            .map_err(|e| anyhow::anyhow!("Failed to compile footnote regex: {}", e))?;

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
                    let collected_lines: Vec<&str> = lines.collect();
                    if !collected_lines.is_empty() {
                        Some(collected_lines)
                    } else {
                        None
                    }
                } else {
                    None
                }
            })
            // Ignore text past the first horizontal line.
            .take_while(|text| match text.first() {
                Some(first_line) => !first_line.starts_with("________"),
                None => {
                    eprintln!("Warning: Found empty text block during translation processing");
                    false
                }
            })
            // Split sentences into separate segments.
            .map(|text| {
                text.into_iter()
                    // Remove footnotes.
                    .map(|text| ends_with_footnote.replace_all(text, "").into_owned())
            })
            // Include the block index.
            .enumerate()
            .map(|(index, content)| {
                let segments: Vec<String> = content
                    .into_iter()
                    .filter(|s| !s.trim().is_empty())
                    .collect();

                TranslationBlock {
                    index: index as i32 + 1,
                    segments,
                }
            });

        let paragraphs: Vec<TranslationBlock> = blocks.collect();

        if paragraphs.is_empty() {
            return Err(anyhow::anyhow!("No translation content found in document. Document may be empty or contain only horizontal lines."));
        }

        let total_segments: usize = paragraphs.iter().map(|p| p.segments.len()).sum();
        if total_segments == 0 {
            return Err(anyhow::anyhow!(
                "Translation contains no text segments after processing"
            ));
        }

        Ok(Translation { paragraphs })
    }
}
