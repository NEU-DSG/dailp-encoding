/// Document metadata
use async_graphql::{Enum as GqlEnum, SimpleObject};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use sqlx::Type;
use uuid::Uuid;

/// Represents the status of a suggestion made by a contributor
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Type, GqlEnum)]
#[sqlx(type_name = "approval_status")]
#[sqlx(rename_all = "lowercase")]
pub enum Status {
    /// Suggestion is still waiting for or undergoing review
    Pending, 
    /// Suggestion has been approved
    Approved,
    /// Suggestion has been rejected
    Rejected,
}

/// Stores the genre associated with a document
#[derive(Clone, Debug, Serialize, Deserialize, FromRow, SimpleObject)]
#[graphql(complex)]
pub struct Genre {
    /// UUID for the genre
    pub id: Uuid,
    /// Name of the genre
    pub name: String,
    /// Status (pending, approved, rejected) of a genre
    pub status: Status,
}

/// Get all approved genres
#[async_graphql::ComplexObject]
impl Genre {
    async fn approved(&self) -> bool {
        matches!(self.status, Some(Status::Approved))
    }
}

/// Stores the physical or digital medium associated with a document
#[derive(Clone, Debug, Serialize, Deserialize, FromRow, SimpleObject)]
#[graphql(complex)]
pub struct Format {
    /// UUID for the format
    pub id: Uuid,
    /// Name of the format
    pub name: String,
    /// Status (pending, approved, rejected) of a format
    pub status: Status,
}

/// Get all approved formats
#[async_graphql::ComplexObject]
impl Format {
    async fn approved(&self) -> bool {
        matches!(self.status, Some(Status::Approved))
    }
}

/// Record to store a keyword associated with a document
#[derive(Clone, Debug, Serialize, Deserialize, FromRow, SimpleObject)]
#[graphql(complex)]
pub struct Keyword {
    /// UUID for the keyword
    pub id: Uuid,
    /// Name of the keyword
    pub name: String,
    /// Status (pending, approved, rejected) of a keyword
    pub status: Status,
}

/// Get all approved keywords
#[async_graphql::ComplexObject]
impl Keyword {
    async fn approved(&self) -> bool {
        matches!(self.status, Some(Status::Approved))
    }
}

/// Converts Keyword struct to corresponding Uuid
impl From<&Keyword> for Uuid {
    fn from(k: &Keyword) -> Self {
        k.id
    }
}

/// Record to store a subject heading that reflects Indigenous knowledge
/// practices associated with a document
#[derive(Clone, Debug, Serialize, Deserialize, FromRow, SimpleObject)]
#[graphql(complex)]
pub struct SubjectHeading {
    /// UUID for the subject heading
    pub id: Uuid,
    /// Name of the subject heading
    pub name: String,
    /// Status (pending, approved, rejected) of a subject heading
    pub status: Status,
}

/// Get all approved subject headings
#[async_graphql::ComplexObject]
impl SubjectHeading {
    async fn approved(&self) -> bool {
        matches!(self.status, Some(Status::Approved))
    }
}

/// Converts SubjectHeading struct to corresponding Uuid
impl From<&SubjectHeading> for Uuid {
    fn from(s: &SubjectHeading) -> Self {
        s.id
    }
}

/// Stores a language associated with a document
#[derive(Clone, Debug, Serialize, Deserialize, FromRow, SimpleObject)]
#[graphql(complex)]
pub struct Language {
    /// UUID for the language
    pub id: Uuid,
    /// Name of the language
    pub name: String,
    // Name a language uses for itself
    pub autonym: Option<String>,
    /// Status (pending, approved, rejected) of a language
    pub status: Status,
}

/// Get all approved languages
#[async_graphql::ComplexObject]
impl Language {
    async fn approved(&self) -> bool {
        matches!(self.status, Some(Status::Approved))
    }
}

/// Converts Language struct to corresponding Uuid
impl From<&Language> for Uuid {
    fn from(l: &Language) -> Self {
        l.id
    }
}

/// Stores a spatial coverage associated with a document
#[derive(Clone, Debug, Serialize, Deserialize, FromRow, SimpleObject)]
#[graphql(complex)]
pub struct SpatialCoverage {
    /// UUID for the place
    pub id: Uuid,
    /// Name of the place
    pub name: String,
    /// Status (pending, approved, rejected) of a spatial coverage
    pub status: Status,
}

/// Get all approved spatial coverages
#[async_graphql::ComplexObject]
impl SpatialCoverage {
    async fn approved(&self) -> bool {
        matches!(self.status, Some(Status::Approved))
    }
}

/// Converts SpatialCoverage struct to corresponding Uuid
impl From<&SpatialCoverage> for Uuid {
    fn from(s: &SpatialCoverage) -> Self {
        s.id
    }
}
