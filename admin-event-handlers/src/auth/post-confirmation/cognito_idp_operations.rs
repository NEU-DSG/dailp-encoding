use aws_config::SdkConfig;
use aws_sdk_cognitoidentityprovider::Client;
use dailp::auth::UserGroup;

/// A client for conducting Cognito operations.
pub struct CognitoClient {
    client: Client,
    pool_id: String,
}

impl CognitoClient {
    /// Create a new Cognito IDP Client with the provided configuration.
    pub async fn new(config: &SdkConfig, pool_id: String) -> Result<Self, anyhow::Error> {
        Ok(Self {
            client: Client::new(config),
            pool_id,
        })
    }
    /// Attempts to add a user to a group.
    /// Fails if AdminAddUserToGroup fails.
    pub async fn add_user_to_group(
        self,
        email: String,
        group: UserGroup,
    ) -> Result<(), anyhow::Error> {
        self.client
            .admin_add_user_to_group()
            .user_pool_id(self.pool_id)
            .username(email)
            .group_name(group.to_string())
            .send()
            .await
            .map_err(anyhow::Error::new)
            .map(|_x| ())
    }
}
