use crate::{user::User, AnnotatedForm};
use crate::{Database, DateTime, DocumentParagraph};
use async_graphql::Context;
use async_graphql::{dataloader::DataLoader, FieldResult};
use serde::{Deserialize, Serialize};
use sqlx::types::Uuid;

/// A comment a user has made on some piece of a document.
#[derive(Clone, Serialize, Deserialize, Debug, async_graphql::SimpleObject)]
#[serde(rename_all = "camelCase")]
// #[graphql(complex)]
pub struct Comment {
    /// Unique identifier of this comment
    pub id: Option<Uuid>,

    /// When the comment was posted
    pub posted_at: DateTime,
    /// Who posted the comment
    pub posted_by: User,

    /// The text of the comment
    pub text_content: String,
    /// An optional classification of the comment's content
    pub comment_type: Option<CommentType>,

    /// The id of the word or paragraph this comment is attached to
    #[graphql(skip = true)]
    pub parent_id: Uuid,
    /// The kind of entity parent ID points to
    #[graphql(skip = true)]
    pub parent_type: CommentParentType,
}

/// An enum listing the possible types that a comment could be attached to
#[derive(async_graphql::Enum, Copy, Clone, Eq, PartialEq, Debug, Serialize, Deserialize)]
pub enum CommentParentType {
    /// A comment attached to a word
    WordParent,
    /// A comment attached to a paragraph
    ParagraphParent,
}

#[async_graphql::ComplexObject]
impl Comment {
    /// The parent entity of this comment
    pub async fn parent(&self, context: &Context<'_>) -> FieldResult<CommentParent> {
        let db = context.data::<DataLoader<Database>>()?.loader();
        match &self.parent_type {
            CommentParentType::WordParent => Ok(CommentParent::WordParent(
                db.word_by_id(&self.parent_id).await?,
            )),
            CommentParentType::ParagraphParent => Ok(CommentParent::ParagraphParent(
                db.paragraph_by_id(&self.parent_id).await?,
            )),
        }
    }
}

/// A type describing the kind of comment being made
#[derive(async_graphql::Enum, Clone, Copy, Eq, PartialEq, Hash, Debug, Serialize, Deserialize)]
pub enum CommentType {
    Story,
    Correction,
    Concern,
    LingusticAnalysis,
}

/// Type representing the object that a comment is attached to
#[derive(async_graphql::Union)]
pub enum CommentParent {
    /// The word that the given comment is attached to
    WordParent(AnnotatedForm),
    /// The paragraph that the given comment is attached to
    ParagraphParent(DocumentParagraph),
}
