use async_graphql::{dataloader::DataLoader, FieldResult};
use uuid::Uuid;

use crate::{AnnotatedDoc, CollectionSection, Database, DocumentId};

/// A chapter within a collection, which can either contain a document or a Wordpress page.
#[derive(Clone)]
pub struct CollectionChapter {
    /// Chapter's id.
    pub id: Option<Uuid>,
    /// Chapter's url as a string.
    pub url_slug: String,
    /// Index of this chapter within its parent collection.
    pub index_in_parent: i64,
    /// Name of this chapter.
    pub chapter_name: String,
    /// Document id of this chapter if it contains a document.
    pub document_id: Option<Uuid>,
    /// Wordpress id of this chapter if it contains a Wordpress page.
    pub wordpress_id: Option<i64>,
    /// A section within this chapter.
    pub section: CollectionSection,
}

#[async_graphql::Object]
impl CollectionChapter {
    async fn document(
        &self,
        context: &async_graphql::Context<'_>,
    ) -> FieldResult<Option<AnnotatedDoc>> {
        if self.document_id.is_none() {
            return Ok(None);
        }

        Ok(context
            .data::<DataLoader<Database>>()?
            .load_one(DocumentId(self.document_id.unwrap()))
            .await?)
    }
}
