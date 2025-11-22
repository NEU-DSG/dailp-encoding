//! Provides a type representing a user.
use crate::auth::UserGroup;
use crate::Date;
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

impl From<UserId> for Uuid {
    fn from(id: UserId) -> Self {
        Uuid::parse_str(&id.0).unwrap()
    }
}

impl From<&UserId> for Uuid {
    fn from(id: &UserId) -> Self {
        Uuid::parse_str(&id.0).unwrap()
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
    /// The date this user was created (optional)
    pub created_at: Option<Date>,
    /// URL to the avatar of the user (optional)
    pub avatar_url: Option<String>,
    /// Biography of the user (optional)
    pub bio: Option<String>,
    /// Organization of the user (optional)
    pub organization: Option<String>,
    /// Location of the user (optional)
    pub location: Option<String>,
    /// Role of the user (optional)
    pub role: Option<UserGroup>,
}

#[derive(async_graphql::InputObject)]
pub struct UserUpdate {
    /// Id of the user, which must be a AWS Cognito `sub` claim
    pub id: UserId,
    /// User-facing name for this contributor/curator
    pub display_name: MaybeUndefined<String>,
    /// URL to the avatar of the user (optional)
    pub avatar_url: MaybeUndefined<String>,
    /// Biography of the user (optional)
    pub bio: MaybeUndefined<String>,
    /// Organization of the user (optional)
    pub organization: MaybeUndefined<String>,
    /// Location of the user (optional)
    pub location: MaybeUndefined<String>,
    /// Role of the user (optional)
    pub role: MaybeUndefined<UserGroup>,
}

/// Converts a `CurrentUserUpdate` into a `UserUpdate`.
impl UserUpdate {
    /// This is useful for updating the user profile with the current user's data because the id is not known in the `CurrentUserUpdate`.
    pub fn from_current_user_update(id: UserId, update: CurrentUserUpdate) -> Self {
        Self {
            id,
            display_name: update.display_name,
            avatar_url: update.avatar_url,
            bio: update.bio,
            organization: update.organization,
            location: update.location,
            role: MaybeUndefined::Null, // Role is not updated from CurrentUserUpdate
        }
    }
}

#[derive(async_graphql::InputObject)]
pub struct CurrentUserUpdate {
    /// User-facing name for this contributor/curator
    pub display_name: MaybeUndefined<String>,
    /// URL to the avatar of the user (optional)
    pub avatar_url: MaybeUndefined<String>,
    /// Biography of the user (optional)
    pub bio: MaybeUndefined<String>,
    /// Organization of the user (optional)
    pub organization: MaybeUndefined<String>,
    /// Location of the user (optional)
    pub location: MaybeUndefined<String>,
}
