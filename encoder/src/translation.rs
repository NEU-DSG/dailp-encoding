use crate::GOOGLE_API_KEY;
use anyhow::Result;
use itertools::Itertools;
use reqwest;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize)]
pub struct Translation {
    blocks: Vec<Block>,
}
#[derive(Debug, Serialize)]
pub struct Block {
    index: usize,
    segments: Vec<String>,
}

/// Result obtained directly from the raw Google sheet.
#[derive(Deserialize)]
pub struct DocResult {
    /// Each element here represents one row.
    /// Semantic lines in our documents are delimited by empty rows.
    /// The line number sits in the first cell of the first row of each semantic line.
    body: String,
}
impl DocResult {
    pub async fn new(doc_id: &str) -> Result<Self> {
        let r = reqwest::get(&format!(
            "https://www.googleapis.com/drive/v3/files/{}/export?mimeType=text/plain&key={}",
            doc_id, GOOGLE_API_KEY
        ))
        .await?;
        Ok(Self {
            body: r.text().await?,
        })
    }

    pub fn to_translation(self) -> Translation {
        let text_runs = self
            .body
            // Split the translation text by lines.
            .split_terminator("\r\n")
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
            .take_while(|text| !text[0].starts_with("__________"))
            // Split sentences into separate segments.
            .map(|text| text.into_iter().flat_map(|s| s.split(".")))
            // Include the block index.
            .enumerate()
            .map(|(index, content)| Block {
                index: index + 1,
                segments: content.into_iter().map(|s| s.to_owned()).collect(),
            });

        Translation {
            blocks: blocks.collect(),
        }
    }
}
