use std::option::Option;
use uuid::Uuid;
use {
    crate::async_graphql::{self, dataloader::DataLoader, Context, FieldResult},
    crate::Database,
};


/// Structure to represent an edited collection. Missing certain fields and chapters in it.
/// Used for sending data to the front end
#[derive(Debug, Clone, async_graphql::SimpleObject)]
#[graphql(complex)]
pub struct EditedCollection {
    /// UUID for the collection
    pub id: Uuid,
    /// Full title of the collection
    pub title: String,
    /// ID of WordPress menu for navigating the collection
    pub wordpress_menu_id: Option<i64>,
    /// URL slug for the collection, like "cwkw"
    pub slug: String,
}

/// Structure to represent a single chapter. Used to send data to the front end.
#[derive(Debug, Clone, async_graphql::SimpleObject)]
pub struct CollectionChapter {
    /// UUID for the chapter
    pub id: Uuid,
    /// Full title of the chapter
    pub title: String,
    /// ID of WordPress page with text of the chapter
    pub wordpress_id: std::option::Option<i64>,
    /// Order within the parent chapter or collection
    pub index_in_parent: i64,
    /// Whether the chapter is an "Intro" or "Body" chapter
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

pub mod raw {
    use uuid::Uuid;

    /// Structure to represent an Edited Collection in its hierarchical form
    #[derive(Debug, Clone)]
    pub struct EditedCollection {
        /// UUID for the collection
        pub title: String,
        /// Full title of the collection
        pub slug: String,
        /// ID of WordPress menu for navigating the collection
        pub wordpress_menu_id: Option<i64>,
        /// Chapters in the collection
        pub chapters: Vec<CollectionChapter>,
    }

    /// Structure to represent a Chapter in an Edited Collection
    #[derive(Debug, Clone)]
    pub struct CollectionChapter {
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
        pub section: crate::CollectionSection,
    }
}

#[async_graphql::ComplexObject]
impl EditedCollection {
    async fn chapters(&self, context: &Context<'_>) -> FieldResult<Option<Vec<CollectionChapter>>> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .load_one(crate::ChaptersInCollection(self.slug.clone()))
            .await?)
    }
}
