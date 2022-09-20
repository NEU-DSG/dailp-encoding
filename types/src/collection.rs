use uuid::Uuid;

/// Structure to represent an Edited Collection in its hierarchical form
#[derive(Debug, Clone)]
pub struct Collection {
    /// UUID for the collection
    pub title: String,
    /// Full title of the collection
    pub slug: String,
    /// ID of WordPress menu for navigating the collection
    pub wordpress_menu_id: Option<i64>,
    /// Chapters in the collection
    pub chapters: Vec<Chapter>,
}

/// Structure to represent a Chapter in an Edited Collection
#[derive(Debug, Clone)]
pub struct Chapter {
    /// UUID for the chapter
    pub id: Option<Uuid>,

    pub url_slug: String,
    /// Order within the parent chapter or collection
    pub index_in_parent: i64,

    pub chapter_name: String,

    pub document_short_name: Option<String>,
    /// ID of WordPress page with text of the chapter
    pub wordpress_id: Option<i64>,
    /// Which section of the collection this chapter lives in. Ex: Intro or Body
    pub section: CollectionSection,
}

/// Enum to represent the sections in an edited collection
#[derive(async_graphql::Enum, Clone, Copy, PartialEq, Eq, Debug, sqlx::Type)]
#[sqlx(type_name = "collection_section")]
pub enum CollectionSection {
    /// Intro chapter
    Intro,
    /// Body chapter
    Body,
}
