use serde::{Deserialize, Serialize};

/// One full translation broken into several blocks.
#[derive(async_graphql::SimpleObject, Clone, Debug, Serialize, Deserialize, Default)]
pub struct Translation {
    pub blocks: Vec<TranslationBlock>,
}

/// One block or paragraph of a translation document that should correspond to a
/// block of original text. One block may contain several segments (or lines).
#[derive(Clone, Debug, Serialize, Deserialize, Default)]
pub struct TranslationBlock {
    pub index: i32,
    /// Each segment represents a sentence or line in the translation.
    pub segments: Vec<String>,
}

#[async_graphql::Object]
impl TranslationBlock {
    /// Full text of this block
    async fn text(&self) -> String {
        use itertools::Itertools as _;
        self.segments.iter().join(" ")
    }

    /// The text of this block split into segments (sentences or lines)
    async fn segments(&self) -> &Vec<String> {
        &self.segments
    }
}
