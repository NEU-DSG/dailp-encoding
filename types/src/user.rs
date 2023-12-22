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
