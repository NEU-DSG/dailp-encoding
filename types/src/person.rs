use std::{fmt, str::FromStr};

use crate::{user::User, Database, PersonFullName};
use async_graphql::{SimpleObject, Union};
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, Type};

/// Record for a DAILP admin
#[derive(Clone, Debug, Serialize, Deserialize, async_graphql::SimpleObject)]
pub struct Admin {
    /// Inherits from User
    pub user: User,
}

/// An individual or organization that contributed to the creation or analysis
/// of a particular document or source. Each contributor has a name and a role
/// that specifies the type of their contributions.
#[derive(Clone, Debug, Serialize, Deserialize, async_graphql::SimpleObject, PartialEq, Eq)]
#[graphql(complex)]
pub struct Contributor {
    /// UUID of the contributor
    pub id: uuid::Uuid,
    /// Full name of the contributor
    pub name: String,
    /// The role that defines most of their contributions to the associated item
    pub role: Option<ContributorRole>,
}

#[async_graphql::ComplexObject]
impl Contributor {
    async fn details(
        &self,
        ctx: &async_graphql::Context<'_>,
    ) -> async_graphql::FieldResult<Option<ContributorDetails>> {
        use async_graphql::dataloader::*;
        Ok(ctx
            .data::<DataLoader<Database>>()?
            .load_one(PersonFullName(self.name.clone()))
            .await?)
    }
}

/// Basic personal details of an individual contributor, which can be retrieved
/// from a particular instance of [`Contributor`].
///
/// They may have transcribed a handwritten manuscript, translated it into
/// English, or analyzed it for linguistic information.
/// This information can be used to track who contributed to the development of
/// each individual document, and track contributions to the archive as a whole.
#[derive(async_graphql::SimpleObject, Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ContributorDetails {
    /// Full name of this person, this exact string must be used to identify
    /// them elsewhere, like in the attribution for a particular document.
    pub full_name: String,
    /// Alternate name of this person, may be in a different language or writing
    /// system. Used only for descriptive purposes.
    pub alternate_name: Option<String>,
    /// The optional date that this contributor was born on.
    pub birth_date: Option<crate::Date>,
    /// Whether or not the contributor's profile is linked to their contributions
    pub is_visible: bool,
}

/// A contributor can have to any number of roles, which define most of their
/// contributions to the associated item (add or revise as needed)
#[derive(Clone, Copy, Debug, Eq, PartialEq, Serialize, Deserialize, async_graphql::Enum, Type)]
#[sqlx(type_name = "contributor_role")]
#[sqlx(rename_all = "snake_case")]
pub enum ContributorRole {
    /// Typed or transcribed handwritten materials
    Transcriber,
    /// Translated text into another language
    Translator,
    /// Added linguistic, cultural, etc. annotations
    Annotator,
    /// Provided cultural context for a document
    CulturalAdvisor,
}

impl FromStr for ContributorRole {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "Transcriber" => Ok(ContributorRole::Transcriber),
            "Translator" => Ok(ContributorRole::Translator),
            "Annotator" => Ok(ContributorRole::Annotator),
            "CulturalAdvisor" => Ok(ContributorRole::CulturalAdvisor),
            other => Err(format!("Unknown contributor role: {}", other)),
        }
    }
}

impl fmt::Display for ContributorRole {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let s = match self {
            ContributorRole::Transcriber => "Transcriber",
            ContributorRole::Translator => "Translator",
            ContributorRole::Annotator => "Annotator",
            ContributorRole::CulturalAdvisor => "CulturalAdvisor",
        };
        write!(f, "{}", s)
    }
}

impl ContributorRole {
    /// Attempts to parse a string into a ContributorRole, returning None if parsing fails
    pub fn from_option_str(s: &str) -> Option<Self> {
        s.parse::<ContributorRole>().ok()
    }

    /// Converts a ContributorRole into its string representation
    pub fn to_option_string(role: &Option<ContributorRole>) -> Option<String> {
        role.as_ref().map(|r| r.to_string())
    }
}

/// Attribution for a particular source, whether an institution or an individual.
/// Most commonly, this will represent the details of a library or archive that
/// houses documents used elsewhere.
#[derive(async_graphql::SimpleObject, Clone, Debug, Serialize, Deserialize)]
pub struct SourceAttribution {
    /// Name of the source, i.e. "The Newberry Library"
    pub name: String,
    /// URL of this source's homepage, i.e. "https://www.newberry.org/"
    pub link: String,
}

/// May not need this
/// A user belongs to any number of user groups, which give them various permissions.
#[derive(async_graphql::Enum, Clone, Copy, PartialEq, Eq)]
pub enum UserGroup {
    Admin,
    Contributors,
    Editors,
    Readers,
}
