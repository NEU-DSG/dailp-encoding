//! Provides types for structuring text-based pages.
use async_graphql::{InputObject, SimpleObject, Union};
use serde::{Deserialize, Serialize};

/// A website page which lives at a specific URL and has a list of blocks that
/// define its content.
#[derive(Clone, Serialize, Deserialize, SimpleObject, Debug)]
pub struct Page {
    /// The path that this page lives at, which also uniquely identifies it.
    /// For example, "/our-team"
    pub id: String,
    title: String,
    body: Vec<ContentBlock>,
}

impl Page {
    pub fn build(title: String, slug: String, body: Vec<ContentBlock>) -> Self {
        Self {
            id: format!("/{}", slug),
            title,
            body,
        }
    }
}

/// Input struct for a page.
#[derive(Clone, Serialize, Deserialize, SimpleObject, InputObject)]
pub struct NewPageInput {
    /// title of new page
    pub title: String,
    /// content for page, needs to be sanitized
    pub body: Vec<String>,
    /// path of new page
    pub path: String,
}

/// A block of content, which may be one of several types.
/// Each page contains several blocks.
///
/// This type is intended to enable a custom page builder on the front-end for
/// content editors.
#[derive(Clone, Serialize, Deserialize, Union, Debug)]
#[serde(tag = "__typename")]
pub enum ContentBlock {
    /// Block of markdown prose content
    Markdown(Markdown),
    /// Gallery of images
    Gallery(Gallery),
}

/// A block of prose content, formatted with [Markdown](https://commonmark.org/).
#[derive(Clone, Serialize, Deserialize, SimpleObject, Debug)]
pub struct Markdown {
    pub content: String,
}

/// A gallery of images, which may be rendered as a slideshow or lightbox.
#[derive(Clone, Serialize, Deserialize, SimpleObject, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Gallery {
    media_urls: Vec<String>,
}
