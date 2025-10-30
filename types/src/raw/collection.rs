//! Provides a stripped-down version of `dailp::collection`
use std::option::Option;
use uuid::Uuid;

/// Structure to represent an Edited Collection in its hierarchical form
#[derive(Debug, Clone)]
pub struct EditedCollection {
    /// UUID for the collection
    pub title: String,
    /// Description of the collection (optional)
    pub description: Option<String>,
    /// Full title of the collection
    pub slug: String,
    /// ID of WordPress menu for navigating the collection
    pub wordpress_menu_id: Option<i64>,
    /// Chapters in the collection
    pub chapters: Vec<CollectionChapter>,
    /// URL of the cover image for the collection
    pub thumbnail_url: Option<String>,
}

/// Structure to represent a Chapter in an Edited Collection
#[derive(Debug, Clone)]
pub struct CollectionChapter {
    /// UUID for the chapter
    pub id: Option<Uuid>,
    /// URL slug for the chapter, like "story-switch-striker" or "syllabary-study"
    pub url_slug: String,
    /// Order within the parent chapter or collection
    pub index_in_parent: i64,
    /// The name of this chapter
    pub chapter_name: String,
    /// The DAILP shortname identifier for this chapter, like "EFN2"
    pub document_short_name: Option<String>,
    /// ID of WordPress page with text of the chapter
    pub wordpress_id: Option<i64>,
    /// Which section of the collection this chapter lives in. Ex: Intro or Body
    pub section: crate::CollectionSection,
}
