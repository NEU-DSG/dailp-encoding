use itertools::Itertools as _;
use serde::{Deserialize, Serialize};

/// One full translation broken into several [`TranslationBlock`](#struct.TranslationBlock)s.
#[derive(async_graphql::SimpleObject, Clone, Debug, Serialize, Deserialize, Default)]
pub struct Translation {
    /// List of blocks or paragraphs that, in this order, constitute the full
    /// translation.
    pub paragraphs: Vec<TranslationBlock>,
}

/// One block or paragraph of a translation document that should correspond to a
/// block of original text. One block may contain several segments (or lines).
#[derive(Clone, Debug, Serialize, Deserialize, Default)]
pub struct TranslationBlock {
    /// 0-based index of this block within the full translation.
    pub index: i32,
    /// Each segment represents a sentence or line in the translation.
    pub segments: Vec<String>,
}

impl TranslationBlock {
    pub fn get_text(&self) -> String {
        self.segments.iter().join(" ")
    }
}

#[async_graphql::Object]
impl TranslationBlock {
    /// Full text of this block
    pub async fn text(&self) -> String {
        self.get_text()
    }

    /// The text of this block split into segments (sentences or lines)
    pub async fn segments(&self) -> &Vec<String> {
        &self.segments
    }
}
