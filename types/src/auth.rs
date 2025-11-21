use async_graphql::{Guard, MaybeUndefined};
use crate::person::ContributorRole;
use serde::{Deserialize, Serialize};
use serde_with::{rust::StringWithSeparator, CommaSeparator};
use uuid::Uuid;

/// Auth metadata on the user making the current request.
#[derive(PartialEq, Debug, async_graphql::SimpleObject)]
pub struct UserInfo {
    /// Unique ID for the User. Should be an AWS Cognito Sub.
    pub id: Uuid,
    pub name: String,
    pub role: ContributorRole,
    email: String,
    groups: Vec<UserGroup>,
}

/// serde deserialization struct for UserInfo.
///
/// AWS Cognito JWTs will encode groups as an array of strings.
/// Compare to ApiGatewayUserInfoDef
#[derive(Deserialize, Debug)]
#[serde(remote = "UserInfo")]
pub struct JWTUserInfoDef {
    #[serde(default, rename = "sub")]
    id: Uuid,
    name: String,
    role: ContributorRole,
    email: String,
    #[serde(default, rename = "cognito:groups")]
    groups: Vec<UserGroup>,
}

/// A helper type for deserializing UserInfo from a Cognito JWT
#[derive(Deserialize)]
pub struct JWTUserInfo(#[serde(with = "JWTUserInfoDef")] pub UserInfo);

/// serde deserialization struct for UserInfo.
///
/// AWS ApiGateway will always encode the groups as a comma-separated
/// string, even if the client sends a JWT with an array.
#[derive(PartialEq, Deserialize, Debug)]
#[serde(remote = "UserInfo")]
pub struct ApiGatewayUserInfoDef {
    #[serde(default, rename = "sub")]
    id: Uuid,
    email: String,
    name: String,
    role: ContributorRole,
    #[serde(
        default,
        rename = "cognito:groups",
        with = "StringWithSeparator::<CommaSeparator>"
    )]
    groups: Vec<UserGroup>,
}

/// A helper type for deserializing UserInfo from AWS ApiGateway
#[derive(Deserialize)]
pub struct ApiGatewayUserInfo(#[serde(with = "ApiGatewayUserInfoDef")] pub UserInfo);

/// A user belongs to any number of user groups, which give them various permissions.
#[derive(Eq, PartialEq, Copy, Clone, Serialize, Deserialize, Debug, async_graphql::Enum)]
pub enum UserGroup {
    /// A user that can add audio, comments, and some language data.
    Contributors,
    /// A user that can add and publicly display language data, audio, and comments.
    Editors,
    Readers,
}

impl From<String> for UserGroup {
    fn from(s: String) -> Self {
        match s.as_str() {
            "Contributors" => UserGroup::Contributors,
            "Editors" => UserGroup::Editors,
            "Readers" => UserGroup::Readers,
            "CONTRIBUTOR" => UserGroup::Contributors,
            "EDITOR" => UserGroup::Editors,
            "READER" => UserGroup::Readers,
            _ => panic!("Unknown user group: {}", s),
        }
    }
}

impl From<Option<String>> for UserGroup {
    fn from(opt_s: Option<String>) -> Self {
        match opt_s {
            Some(s) => UserGroup::from(s),
            None => UserGroup::Readers,
        }
    }
}

impl UserGroup {
    pub fn to_string(&self) -> String {
        match self {
            UserGroup::Contributors => "Contributors".to_string(),
            UserGroup::Editors => "Editors".to_string(),
            UserGroup::Readers => "Readers".to_string(),
        }
    }
}

// // Impl FromStr and Display automatically for UserGroup, using serde.
// // This allows us to (de)serialize lists of groups via a comma-separated string
// // like this: "Editor,Contributor,Translator"
serde_plain::forward_from_str_to_serde!(UserGroup);
serde_plain::forward_display_to_serde!(UserGroup);

/// Requires that the user is authenticated and a member of the given user group.
pub struct GroupGuard {
    group: UserGroup,
}

impl GroupGuard {
    /// Creates a new group guard from existing user groups.
    ///     See dailp::auth::UserGoup.
    pub fn new(group: UserGroup) -> Self {
        Self { group }
    }
}

#[async_trait::async_trait]
impl Guard for GroupGuard {
    async fn check(&self, ctx: &async_graphql::Context<'_>) -> async_graphql::Result<()> {
        let user = ctx.data_opt::<UserInfo>();
        let has_group = user.map(|user| user.groups.iter().any(|group| group == &self.group));

        match user {
            Some(user) => log::info!("Debug user info groups={:?}", user),
            None => log::info!("No user"),
        };

        if has_group == Some(true) {
            Ok(())
        } else {
            Err(format!("Forbidden, user not in group '{:?}'", self.group).into())
        }
    }
}

/// Requires that the user is authenticated.
pub struct AuthGuard;

#[async_trait::async_trait]
impl Guard for AuthGuard {
    async fn check(&self, ctx: &async_graphql::Context<'_>) -> async_graphql::Result<()> {
        let user = ctx.data_opt::<UserInfo>();
        if user.is_some() {
            Ok(())
        } else {
            Err("Forbidden, user not authenticated".into())
        }
    }
}

#[cfg(test)]
mod api_gateway_tests {
    use super::*;

    #[test]
    fn decoding_single_group_works() {
        let res: Result<ApiGatewayUserInfo, _> = serde_json::from_str(
            r#"
            {
                "cognito:groups": "Editors",
                "cognito:username": "7c455493-8e7e-47b9-abed-5f1492eb7a9b",
                "email": "charliemcvicker@protonmail.com",
                "sub": "7c455493-8e7e-47b9-abed-5f1492eb7a9b"
              }
            "#,
        );

        assert_eq!(
            res.map(|ApiGatewayUserInfo(user)| user).unwrap(),
            UserInfo {
                id: Uuid::parse_str("7c455493-8e7e-47b9-abed-5f1492eb7a9b").unwrap(),
                email: String::from("charliemcvicker@protonmail.com"),
                groups: vec![UserGroup::Editors]
            }
        )
    }

    #[test]
    fn decoding_many_groups_works() {
        let res: Result<ApiGatewayUserInfo, _> = serde_json::from_str(
            r#"
            {
                "cognito:groups": "Editors,Contributors",
                "cognito:username": "7c455493-8e7e-47b9-abed-5f1492eb7a9b",
                "email": "charliemcvicker@protonmail.com",
                "sub": "7c455493-8e7e-47b9-abed-5f1492eb7a9b"
              }
            "#,
        );

        assert_eq!(
            res.map(|ApiGatewayUserInfo(user)| user).unwrap(),
            UserInfo {
                id: Uuid::parse_str("7c455493-8e7e-47b9-abed-5f1492eb7a9b").unwrap(),
                email: String::from("charliemcvicker@protonmail.com"),
                groups: vec![UserGroup::Editors, UserGroup::Contributors]
            }
        )
    }

    #[test]
    fn decoding_no_groups_works() {
        let res: Result<ApiGatewayUserInfo, _> = serde_json::from_str(
            r#"
            {
                "cognito:username": "7c455493-8e7e-47b9-abed-5f1492eb7a9b",
                "email": "charliemcvicker@protonmail.com",
                "sub": "7c455493-8e7e-47b9-abed-5f1492eb7a9b"
              }
            "#,
        );

        assert_eq!(
            res.map(|ApiGatewayUserInfo(user)| user).unwrap(),
            UserInfo {
                id: Uuid::parse_str("7c455493-8e7e-47b9-abed-5f1492eb7a9b").unwrap(),
                email: String::from("charliemcvicker@protonmail.com"),
                groups: vec![]
            }
        )
    }
}

#[cfg(test)]
mod jwt_tests {
    use super::*;

    #[test]
    fn decoding_single_group_works() {
        let res: Result<JWTUserInfo, _> = serde_json::from_str(
            r#"
            {
                "cognito:groups": ["Editors"],
                "cognito:username": "7c455493-8e7e-47b9-abed-5f1492eb7a9b",
                "email": "charliemcvicker@protonmail.com",
                "sub": "7c455493-8e7e-47b9-abed-5f1492eb7a9b"
              }
            "#,
        );

        assert_eq!(
            res.map(|JWTUserInfo(user)| user).unwrap(),
            UserInfo {
                id: Uuid::parse_str("7c455493-8e7e-47b9-abed-5f1492eb7a9b").unwrap(),
                email: String::from("charliemcvicker@protonmail.com"),
                groups: vec![UserGroup::Editors]
            }
        )
    }

    #[test]
    fn decoding_many_groups_works() {
        let res: Result<JWTUserInfo, _> = serde_json::from_str(
            r#"
            {
                "cognito:groups": ["Editors", "Contributors"],
                "cognito:username": "7c455493-8e7e-47b9-abed-5f1492eb7a9b",
                "email": "charliemcvicker@protonmail.com",
                "sub": "7c455493-8e7e-47b9-abed-5f1492eb7a9b"
              }
            "#,
        );

        assert_eq!(
            res.map(|JWTUserInfo(user)| user).unwrap(),
            UserInfo {
                id: Uuid::parse_str("7c455493-8e7e-47b9-abed-5f1492eb7a9b").unwrap(),
                email: String::from("charliemcvicker@protonmail.com"),
                groups: vec![UserGroup::Editors, UserGroup::Contributors]
            }
        )
    }

    #[test]
    fn decoding_no_groups_works() {
        let res: Result<JWTUserInfo, _> = serde_json::from_str(
            r#"
            {
                "cognito:username": "7c455493-8e7e-47b9-abed-5f1492eb7a9b",
                "email": "charliemcvicker@protonmail.com",
                "sub": "7c455493-8e7e-47b9-abed-5f1492eb7a9b"
              }
            "#,
        );

        assert_eq!(
            res.map(|JWTUserInfo(user)| user).unwrap(),
            UserInfo {
                id: Uuid::parse_str("7c455493-8e7e-47b9-abed-5f1492eb7a9b").unwrap(),
                email: String::from("charliemcvicker@protonmail.com"),
                groups: vec![]
            }
        )
    }
}
