use serde::{Deserialize, Serialize};
use serde_with::{rust::StringWithSeparator, CommaSeparator};
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

/// Auth metadata on the user making the current request.
#[derive(PartialEq, Deserialize, Debug, async_graphql::SimpleObject)]
pub struct UserInfo {
    /// Unique ID for the User. Should be an AWS Cognito Sub.
    #[serde(default, rename = "sub")]
    pub id: Uuid,
    email: String,
    #[serde(
        default,
        rename = "cognito:groups",
        with = "StringWithSeparator::<CommaSeparator>"
    )]
    pub groups: Vec<UserGroup>,
}

impl UserInfo {
    pub fn new_test_admin() -> Self {
        Self {
            id: Uuid::parse_str("5f22a8bf-46c8-426c-a104-b4faf7c2d608").unwrap(),
            email: "test@dailp.northeastern.edu".to_string(),
            groups: vec![UserGroup::Editors],
        }
    }
}
#[derive(Eq, PartialEq, Copy, Clone, Serialize, Deserialize, Debug, async_graphql::Enum)]
pub enum UserGroup {
    Contributors,
    Editors,
}
// // Impl FromStr and Display automatically for UserGroup, using serde.
// // This allows us to (de)serialize lists of groups via a comma-separated string
// // like this: "Editor,Contributor,Translator"
serde_plain::forward_from_str_to_serde!(UserGroup);
serde_plain::forward_display_to_serde!(UserGroup);

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn decoding_single_group_works() {
        let res: Result<UserInfo, _> = serde_json::from_str(
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
            res.unwrap(),
            UserInfo {
                id: Uuid::parse_str("7c455493-8e7e-47b9-abed-5f1492eb7a9b").unwrap(),
                email: String::from("charliemcvicker@protonmail.com"),
                groups: vec![UserGroup::Editors]
            }
        )
    }

    #[test]
    fn decoding_many_groups_works() {
        let res: Result<UserInfo, _> = serde_json::from_str(
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
            res.unwrap(),
            UserInfo {
                id: Uuid::parse_str("7c455493-8e7e-47b9-abed-5f1492eb7a9b").unwrap(),
                email: String::from("charliemcvicker@protonmail.com"),
                groups: vec![UserGroup::Editors, UserGroup::Contributors]
            }
        )
    }

    #[test]
    fn decoding_no_groups_works() {
        let res: Result<UserInfo, _> = serde_json::from_str(
            r#"
            {
                "cognito:username": "7c455493-8e7e-47b9-abed-5f1492eb7a9b",
                "email": "charliemcvicker@protonmail.com",
                "sub": "7c455493-8e7e-47b9-abed-5f1492eb7a9b"
              }
            "#,
        );

        assert_eq!(
            res.unwrap(),
            UserInfo {
                id: Uuid::parse_str("7c455493-8e7e-47b9-abed-5f1492eb7a9b").unwrap(),
                email: String::from("charliemcvicker@protonmail.com"),
                groups: vec![]
            }
        )
    }
}
