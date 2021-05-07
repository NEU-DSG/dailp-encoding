use async_graphql::{SimpleObject, Union};
use serde::{Deserialize, Serialize};

#[derive(Clone, Serialize, Deserialize, SimpleObject)]
pub struct Page {
    /// The path that this page lives at, which also uniquely identifies it.
    /// For example, "/our-team"
    #[serde(rename = "_id")]
    pub id: String,
    title: String,
    body: Vec<ContentBlock>,
}

#[derive(Clone, Serialize, Deserialize, Union)]
#[serde(tag = "type")]
pub enum ContentBlock {
    Markdown(MarkdownBlock),
    Gallery(GalleryBlock),
}

#[derive(Clone, Serialize, Deserialize, SimpleObject)]
pub struct MarkdownBlock {
    content: String,
}

#[derive(Clone, Serialize, Deserialize, SimpleObject)]
pub struct GalleryBlock {
    media_urls: Vec<String>,
}
