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
        let client = self.client.clone();
        let pool_id = self.pool_id.clone();

        client
            .admin_create_user()
            .user_pool_id(&pool_id)
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

        // Add user to the appropriate group. If this fails, the user has already
        // been created with a working temporary password, so roll back the
        // creation to avoid leaving a stray account behind.
        if let Err(group_err) = self.add_user_to_group(email.clone(), group).await {
            if let Err(cleanup_err) = client
                .admin_delete_user()
                .user_pool_id(&pool_id)
                .username(&email)
                .send()
                .await
            {
                // If the rollback fails, we have a user with a working temporary password but no group membership.
                // At this point just log the error.
                return Err(anyhow::Error::new(cleanup_err).context(format!(
                    "Failed to add user to group and failed to roll back user creation: {}",
                    group_err
                )));
            }
            return Err(group_err);
        }

        Ok(())
    }
}
