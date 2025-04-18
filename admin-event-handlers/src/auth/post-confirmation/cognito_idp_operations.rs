use aws_config::SdkConfig;
use aws_sdk_cognitoidentityprovider::{
    types::{AttributeType, MessageActionType},
    Client,
};
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
            .map_err(|e| anyhow::Error::new(e))
            .map(|_x| ())
    }

    /// Creates a new user in Cognito with the provided details
    /// and adds them to the specified group.
    pub async fn admin_create_user(
        self,
        display_name: String,
        email: String,
        temporary_password: String,
        group: UserGroup,
    ) -> Result<(), anyhow::Error> {
        self.client
            .admin_create_user()
            .user_pool_id(&self.pool_id)
            .username(&email)
            .temporary_password(temporary_password)
            .user_attributes(
                AttributeType::builder()
                    .name("username")
                    .value(display_name)
                    .build()?,
            )
            .message_action(MessageActionType::Suppress) // Suppress automatic welcome email
            .send()
            .await
            .map_err(|e| anyhow::Error::new(e))?;

        // Add user to the appropriate group
        self.add_user_to_group(email, group).await?;

        Ok(())
    }
}
