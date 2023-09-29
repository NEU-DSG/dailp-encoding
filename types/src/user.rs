use async_graphql::MaybeUndefined;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

/// A user id tied back to AWS Cognito `sub` claim.
#[derive(Clone, Eq, PartialEq, Hash, Serialize, Deserialize, Debug, async_graphql::NewType)]
pub struct UserId(pub String);

impl From<Uuid> for UserId {
    fn from(id: Uuid) -> Self {
        UserId(id.to_string())
    }
}

/// A user record, for a contributor, editor, etc.
#[derive(Clone, Serialize, Deserialize, Debug, async_graphql::SimpleObject)]
#[serde(rename_all = "camelCase")]
pub struct User {
    /// Id of the user, which must be a AWS Cognito `sub` claim
    pub id: UserId,
    /// User-facing name for this contributor/curator
    pub display_name: String,
}

/// Adds a bookmarked document to the user's list of bookmarks
#[derive(async_graphql::InputObject)]
pub struct AddBookmark {
    /// ID of the document to add bookmark
    pub document_id: Uuid,
    /// Whether the document is already bookmarked
    pub bookmark_bool: bool,
}
