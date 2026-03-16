//! Provides types for defining and structuring edited collections.
use uuid::Uuid;

use crate::AnnotatedDoc;
use {
    crate::async_graphql::{self, dataloader::DataLoader, Context, FieldResult},
    crate::slugify,
    crate::Database,
    crate::DocumentCollection,
    crate::DocumentId,
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
    /// Description of the collection (optional)
    pub description: Option<String>,
    /// ID of WordPress menu for navigating the collection
    pub wordpress_menu_id: Option<i64>,
    #[graphql(skip)]
    /// URL slug for the collection, like "cwkw"
    pub slug: String,
    /// Cover image URL
    pub thumbnail_url: Option<String>,
}

/// Input object for creating a new collection
#[derive(async_graphql::InputObject)]
pub struct EditedCollectionInput {
    /// Full title of the collection
    pub title: String,
    /// URL slug for the collection, like "cwkw"
    pub slug: String,
    /// ID of WordPress menu for navigating the collection
    pub wordpress_menu_id: Option<i64>,
}

/// Structure to represent a single chapter. Used to send data to the front end.
#[derive(Debug, Clone, async_graphql::SimpleObject)]
#[graphql(complex)]
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
    /// Document id
    #[graphql(skip)]
    pub document_id: Option<DocumentId>,
    #[graphql(skip)]
    /// Full path of the chapter
    pub path: Vec<String>,
}

/// Enum to represent the sections in an edited collection
#[derive(async_graphql::Enum, Clone, Copy, PartialEq, Eq, Debug, sqlx::Type)]
#[sqlx(type_name = "collection_section")]
pub enum CollectionSection {
    /// Intro chapter
    Intro,
    /// Body chapter
    Body,
    /// Credit
    Credit,
}

/// Enum to represent whether a chapter in a collection's table of contents is a page or a document
#[derive(
    async_graphql::Enum, Clone, Copy, PartialEq, Eq, Debug, serde::Serialize, serde::Deserialize,
)]
pub enum ChapterContents {
    Document,
    Page,
    Unknown,
}

#[async_graphql::ComplexObject]
impl EditedCollection {
    /// URL slug for the collection, like "cwkw"
    async fn slug(&self) -> String {
        slugify(&self.slug)
    }

    async fn chapters(&self, context: &Context<'_>) -> FieldResult<Option<Vec<CollectionChapter>>> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .load_one(crate::ChaptersInCollection(self.slug.clone()))
            .await?)
    }
}

#[async_graphql::ComplexObject]
impl CollectionChapter {
    /// Full path of the chapter
    async fn path(&self) -> Vec<String> {
        self.path.iter().map(slugify).collect()
    }

    async fn slug(&self) -> String {
        slugify(self.path.last().unwrap())
    }

    async fn document(&self, context: &Context<'_>) -> FieldResult<Option<AnnotatedDoc>> {
        if let Some(doc_id) = &self.document_id {
            Ok(context
                .data::<DataLoader<Database>>()?
                .load_one(*doc_id)
                .await?)
        } else {
            Ok(None)
        }
    }
    /// Breadcrumbs from the top-level archive down to where this document lives.
    async fn breadcrumbs(
        &self,
        context: &async_graphql::Context<'_>,
    ) -> FieldResult<Vec<DocumentCollection>> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .loader()
            .chapter_breadcrumbs(self.path.clone())
            .await?)
    }

    async fn content_type(&self, context: &Context<'_>) -> FieldResult<ChapterContents> {
        match (self.document_id.is_some(), self.wordpress_id.is_some()) {
            (true, false) => Ok(ChapterContents::Document),
            (false, true) => Ok(ChapterContents::Page),
            (false, false) => Ok(ChapterContents::Unknown),
            // having both ids is an impossible case as of 2/19/2026, but just to make sure
            (true, true) => Ok(ChapterContents::Unknown),
        }
    }
}

/// Input for creating an edited collection
#[derive(async_graphql::InputObject)]
pub struct CreateEditedCollectionInput {
    /// The title of the collection
    pub title: String,
    /// Description of the collection
    pub description: String,
    /// URL of the thumbnail image for the collection
    pub thumbnail_url: String,
}
