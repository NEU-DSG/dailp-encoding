//! Provides a type representing a user.
use crate::Date;
use async_graphql::MaybeUndefined;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::auth::UserGroup;
use aws_sdk_s3::Client;

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

/// Avatar upload functionality using AWS SDK
pub struct AvatarUploader {
    client: Client,
    bucket_name: String,
}

impl AvatarUploader {
    /// Create new uploader with S3 client
    pub async fn new() -> Result<Self, anyhow::Error> {
        let config = aws_config::load_from_env().await;
        let client = Client::new(&config);

        let tf_stage = std::env::var("TF_STAGE").unwrap_or_else(|_| "dev".to_string());
        let bucket_name = format!("dailp-{}-media-storage", tf_stage);

        Ok(Self {
            client,
            bucket_name,
        })
    }

    /// Upload avatar file to S3 and return the S3 key
    pub async fn upload_avatar(
        &self,
        file_data: Vec<u8>,
        file_extension: &str,
        user_id: &str,
    ) -> Result<String, anyhow::Error> {
        // Generate unique S3 key
        let file_id = Uuid::new_v4();
        let s3_key = format!(
            "user-uploaded-images/profile-images/{}/{}.{}",
            user_id, file_id, file_extension
        );

        // Determine content type based on file extension
        let content_type = match file_extension.to_lowercase().as_str() {
            "jpg" | "jpeg" => "image/jpeg",
            "png" => "image/png",
            "gif" => "image/gif",
            "webp" => "image/webp",
            _ => "image/jpeg",
        };

        // Upload to S3 using put_object
        self.client
            .put_object()
            .bucket(&self.bucket_name)
            .key(&s3_key)
            .body(file_data.into())
            .content_type(content_type)
            .acl("public-read".into()) // Make avatar publicly accessible
            .send()
            .await
            .map_err(|e| anyhow::anyhow!("Failed to upload to S3: {}", e))?;

        Ok(s3_key) // Return the S3 key (not the full URL)
    }
}

/// Convert S3 key to CloudFront URL, same formatting as in audio.rs AudioRes::new
pub fn key_to_url(s3_key: &str) -> Result<String, anyhow::Error> {
    let cf_domain = std::env::var("CF_URL")?;
    let url = if s3_key.starts_with('/') {
        format!("https://{}{}", cf_domain, s3_key)
    } else {
        format!("https://{}/{}", cf_domain, s3_key)
    };
    Ok(url)
}

/// Input object for uploading avatar
#[derive(async_graphql::InputObject)]
pub struct UploadAvatarInput {
    /// Base64-encoded image data
    pub image_data: String,
    /// Original filename to extract extension
    pub filename: String,
}
