use serde::{Deserialize, Serialize};

#[async_graphql::SimpleObject]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Translation {
    pub blocks: Vec<TranslationBlock>,
}

#[async_graphql::SimpleObject]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct TranslationBlock {
    pub index: i32,
    /// Each segment represents a sentence or line in the translation.
    pub segments: Vec<String>,
}
