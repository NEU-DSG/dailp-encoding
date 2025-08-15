use crate::{Database, PersonFullName};
use serde::{Deserialize, Serialize};

/// An individual or organization that contributed to the creation or analysis
/// of a particular document or source. Each contributor has a name and a role
/// that specifies the type of their contributions.
#[derive(Clone, Debug, Serialize, Deserialize, async_graphql::SimpleObject)]
#[graphql(complex)]
pub struct Contributor {
    /// Full name of the contributor
    pub name: String,
    /// The role that defines most of their contributions to the associated item
    pub role: ContributorRole,
}
impl Contributor {
    /// Create new contributor with the role "Author"
    pub fn new_author(name: String) -> Self {
        Self {
            name,
            role: "Author".to_owned(),
        }
    }
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
    pub isVisible: bool,
}

/// A contributor can have to any number of roles, which define most of their
/// contributions to the associated item
#[derive(async_graphql::Enum, Clone, Copy, PartialEq, Eq)]
pub enum ContributorRole {
    /// Typed or transcribed handwritten materials
    Transcriber, 
    /// Translated text into another language
    Translator,
    /// Edited the text or translation for clarity or structure
    Editor,
    /// Added linguistic, cultural, etc. annotations 
    Annotator, 
    /// Provided cultural context for a document
    CulturalAdvisor 
    /// Add or revise as needed
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
