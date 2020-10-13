use serde::{Deserialize, Serialize};

/// One full translation broken into several blocks.
#[async_graphql::SimpleObject]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Translation {
    pub blocks: Vec<TranslationBlock>,
}

/// One block or paragraph of a translation document that should correspond to a
/// block of original text. One block may contain several segments (or sentences).
#[async_graphql::SimpleObject]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct TranslationBlock {
    pub index: i32,
    /// Each segment represents a sentence or line in the translation.
    pub segments: Vec<String>,
}
