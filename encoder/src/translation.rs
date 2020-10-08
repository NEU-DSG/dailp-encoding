use anyhow::Result;
use async_graphql::*;
use itertools::Itertools;
use regex::Regex;
use reqwest;
use serde::{Deserialize, Serialize};

#[SimpleObject]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Translation {
    pub blocks: Vec<TranslationBlock>,
}

#[SimpleObject]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct TranslationBlock {
    pub index: i32,
    /// Each segment represents a sentence or line in the translation.
    pub segments: Vec<String>,
}
