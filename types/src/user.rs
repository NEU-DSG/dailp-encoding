//! Provides a type representing a user.
use crate::Date;
use async_graphql::MaybeUndefined;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::auth::UserGroup;

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

/// A user record including password hash, for internal use only.
#[derive(Clone, Serialize, Deserialize, Debug, async_graphql::SimpleObject)]
#[serde(rename_all = "camelCase")]
pub struct UserWithPassword {
    pub id: Uuid,
    pub email: String,
    pub password_hash: String,
    pub email_verified: bool,
    pub role: Option<UserGroup>,
    pub display_name: String,
}

/// A refresh token record including token hash, for internal use only.
#[derive(Clone, Serialize, Deserialize, Debug, async_graphql::SimpleObject)]
#[serde(rename_all = "camelCase")]
pub struct RefreshTokenData {
    pub id: Uuid,
    pub user_id: Uuid,
    pub token_hash: String,
    pub expires_at: chrono::DateTime<chrono::Utc>,
    pub email: String,
    pub role: Option<UserGroup>,
    pub display_name: String,
}

/// An email verification token record, for internal use only.
#[derive(Clone, Serialize, Deserialize, Debug, async_graphql::SimpleObject)]
#[serde(rename_all = "camelCase")]
pub struct EmailVerificationTokenData {
    pub id: Uuid,
    pub user_id: Uuid,
    pub token_hash: String,
    pub expires_at: chrono::DateTime<chrono::Utc>,
    pub used: bool,
    pub email: String,
}

/// Password reset token data from database
#[derive(Debug)]
pub struct PasswordResetTokenData {
    pub id: Uuid,
    pub user_id: Uuid,
    pub token_hash: String,
    pub expires_at: chrono::DateTime<chrono::Utc>,
    pub used: bool,
    pub email: String,
}