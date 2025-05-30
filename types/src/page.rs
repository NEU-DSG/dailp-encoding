//! Provides types for structuring text-based pages.
use async_graphql::{SimpleObject, Union};
use serde::{Deserialize, Serialize};

/// A website page which lives at a specific URL and has a list of blocks that
/// define its content.
#[derive(Clone, Serialize, Deserialize, SimpleObject)]
pub struct Page {
    /// The path that this page lives at, which also uniquely identifies it.
    /// For example, "/our-team"
    pub id: String,
    title: String,
    body: Vec<ContentBlock>,
}

/// A block of content, which may be one of several types.
/// Each page contains several blocks.
///
/// This type is intended to enable a custom page builder on the front-end for
/// content editors.
#[derive(Clone, Serialize, Deserialize, Union)]
#[serde(tag = "__typename")]
pub enum ContentBlock {
    /// Block of markdown prose content
    Markdown(Markdown),
    /// Gallery of images
    Gallery(Gallery),
}

/// A block of prose content, formatted with [Markdown](https://commonmark.org/).
#[derive(Clone, Serialize, Deserialize, SimpleObject)]
pub struct Markdown {
    content: String,
}

/// A gallery of images, which may be rendered as a slideshow or lightbox.
#[derive(Clone, Serialize, Deserialize, SimpleObject)]
#[serde(rename_all = "camelCase")]
pub struct Gallery {
    media_urls: Vec<String>,
}
