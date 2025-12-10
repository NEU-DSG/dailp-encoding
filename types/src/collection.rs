//! Provides types for defining and structuring edited collections.
use uuid::Uuid;

use crate::AnnotatedDoc;
use {
    crate::async_graphql::{self, dataloader::DataLoader, Context, FieldResult, MaybeUndefined},
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
    #[graphql(name = "INTRO")]
    Intro,
    /// Body chapter
    #[graphql(name = "BODY")]
    Body,
    /// Credit
    #[graphql(name = "CREDIT")]
    Credit,
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

/// Input for upserting an edited collection
#[derive(async_graphql::InputObject)]
pub struct UpsertChapterInput {
    /// The id of the chapter
    pub id: Uuid,
    /// The title of the collection
    pub title: MaybeUndefined<String>,
    /// The slug of the collection
    pub slug: MaybeUndefined<String>,
    /// Description of the collection
    pub description: MaybeUndefined<String>,
    /// URL of the thumbnail image for the collection
    pub thumbnail_url: MaybeUndefined<String>,
    /// The section of the collection, Intro | Body | Credit
    pub section: MaybeUndefined<CollectionSection>,
    /// The index of this chapter within its parent
    pub index_in_parent: MaybeUndefined<i64>,
}

/// Input for updating a single chapter's order
#[derive(async_graphql::InputObject)]
pub struct ChapterOrderInput {
    /// The id of the chapter
    pub id: Uuid,
    /// The new index of this chapter within its parent (1-indexed)
    pub index_in_parent: i64,
    /// The section of the collection, Intro | Body | Credit
    pub section: CollectionSection,
}

/// Input for bulk updating collection chapter order
#[derive(async_graphql::InputObject)]
pub struct UpdateCollectionChapterOrderInput {
    /// The slug of the collection
    pub collection_slug: String,
    /// Ordered list of chapters with their new indices
    pub chapters: Vec<ChapterOrderInput>,
}

/// Input for adding a new chapter to a collection
#[derive(async_graphql::InputObject)]
pub struct AddChapterInput {
    /// The slug of the collection this chapter belongs to
    pub collection_slug: String,
    /// The title of the chapter
    pub title: String,
    /// The slug of the chapter (used in the URL path)
    pub slug: String,
    /// The section of the collection, Intro | Body | Credit
    pub section: CollectionSection,
    /// Optional parent chapter ID if this is a subchapter (defaults to top-level)
    pub parent_id: Option<Uuid>,
    /// Optional document ID to link this chapter to an existing document
    pub document_id: Option<Uuid>,
}
