//! Types that power our features for reading / leaving comments on words and
//! paragraphs
use crate::{user::User, AnnotatedForm};
use crate::{Database, DateTime, DocumentParagraph};
use async_graphql::Context;
use async_graphql::{dataloader::DataLoader, FieldResult, MaybeUndefined};
use serde::{Deserialize, Serialize};
use sqlx::types::Uuid;

/// A comment a user has made on some piece of a document.
#[derive(Clone, Serialize, Deserialize, Debug, async_graphql::SimpleObject)]
#[serde(rename_all = "camelCase")]
// #[graphql(complex)]
pub struct Comment {
    /// Unique identifier of this comment
    pub id: Uuid,

    /// When the comment was posted
    pub posted_at: DateTime,
    /// Who posted the comment
    pub posted_by: User,

    /// The text of the comment
    pub text_content: String,
    /// An optional classification of the comment's content
    pub comment_type: Option<CommentType>,

    /// Whether the comment has been edited since it was posted
    pub edited: bool,

    /// The id of the word or paragraph this comment is attached to
    #[graphql(skip = true)]
    pub parent_id: Uuid,
    /// The kind of entity parent ID points to
    #[graphql(skip = true)]
    pub parent_type: CommentParentType,
}

/// An enum listing the possible types that a comment could be attached to
#[derive(
    sqlx::Type, async_graphql::Enum, Copy, Clone, Eq, PartialEq, Debug, Serialize, Deserialize,
)]
#[sqlx(type_name = "comment_parent_type")]
pub enum CommentParentType {
    /// A comment attached to a word
    Word,
    /// A comment attached to a paragraph
    Paragraph,
}

impl CommentParentType {
    /// Get the actual object referenced by this type, given an id
    pub async fn resolve(&self, db: &Database, parent_id: &Uuid) -> FieldResult<CommentParent> {
        match &self {
            CommentParentType::Word => {
                Ok(CommentParent::WordParent(db.word_by_id(parent_id).await?))
            }
            CommentParentType::Paragraph => Ok(CommentParent::ParagraphParent(
                db.paragraph_by_id(parent_id).await?,
            )),
        }
    }
}

#[async_graphql::ComplexObject]
impl Comment {
    /// The parent entity of this comment
    pub async fn parent(&self, context: &Context<'_>) -> FieldResult<CommentParent> {
        let db = context.data::<DataLoader<Database>>()?.loader();
        self.parent_type.resolve(db, &self.parent_id).await
    }
}

/// A type describing the kind of comment being made
#[derive(
    sqlx::Type, async_graphql::Enum, Clone, Copy, Eq, PartialEq, Hash, Debug, Serialize, Deserialize,
)]
#[sqlx(type_name = "comment_type_enum")]
pub enum CommentType {
    /// A comment sharing a story or similar information related to the parent object
    Story,
    /// A comment with a suggestion to improve the information shown about the parent object
    Suggestion,
    /// A comment asking a question about our information regarding the parent object
    Question,
}

/// PgHasArrayType for CommentType
impl sqlx::postgres::PgHasArrayType for CommentType {
    fn array_type_info() -> sqlx::postgres::PgTypeInfo {
        // The array type name in PostgreSQL is prefixed with an underscore
        sqlx::postgres::PgTypeInfo::with_name("_comment_type_enum")
    }
}

/// Type representing the object that a comment is attached to
#[derive(async_graphql::Union)]
pub enum CommentParent {
    /// The word that the given comment is attached to
    WordParent(AnnotatedForm),
    /// The paragraph that the given comment is attached to
    ParagraphParent(DocumentParagraph),
}

/// Input object for posting a new comment on some object
#[derive(async_graphql::InputObject)]
pub struct PostCommentInput {
    /// ID of the object that is being commented on
    pub parent_id: Uuid,
    /// Type of the object being commented on
    pub parent_type: CommentParentType,
    /// Content of the comment
    pub text_content: String,
    /// A classifcation for the comment (optional)
    pub comment_type: Option<CommentType>,
}

/// Input object for deleting an existing comment
#[derive(async_graphql::InputObject)]
pub struct DeleteCommentInput {
    /// ID of the comment to delete
    pub comment_id: Uuid,
}

/// Used for updating comments.
/// All fields except id are optional.
#[derive(async_graphql::InputObject)]
pub struct CommentUpdate {
    /// The UUID of the comment to perform this operation on.
    pub id: Uuid,
    /// The text of the comment.
    pub text_content: MaybeUndefined<String>,
    /// The type of content in this comment. See dailp::comment::CommentType.
    pub comment_type: MaybeUndefined<Option<CommentType>>,
    /// Whether this comment has been edited in the past
    pub edited: bool,
}
