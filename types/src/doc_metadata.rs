/// Document metadata
use async_graphql::{Enum, SimpleObject};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use sqlx::decode::Decode;
use sqlx::Postgres;
use sqlx::postgres::PgValueRef;
use uuid::Uuid;

/// Represents the status of a suggestion made by a contributor
#[derive(Serialize, Deserialize, Enum, Debug, Clone, Copy, PartialEq, Eq)]
pub enum ApprovalStatus {
    /// Suggestion is still waiting for or undergoing review
    Pending, 
    /// Suggestion has been approved
    Approved,
    /// Suggestion has been rejected
    Rejected,
}

/// Allows SQLx to convert Postgres "approval_status" enum values into the corresponding Rust "ApprovalStatus"
impl<'r> Decode<'r, Postgres> for ApprovalStatus {
    fn decode(value: PgValueRef<'r>) -> Result<Self, Box<dyn std::error::Error + Send + Sync>> {
        let s: &str = <&str as Decode<'r, Postgres>>::decode(value)?;
        match s {
            "pending" => Ok(Self::Pending),
            "approved" => Ok(Self::Approved),
            "rejected" => Ok(Self::Rejected),
            _ => Err(format!("invalid approval status: {}", s).into()),
        }
    }
}

/// Converts a string value ("approved", "pending", or "rejected") into an ApprovalStatus enum variant
impl TryFrom<String> for ApprovalStatus {
    type Error = anyhow::Error;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        match value.as_str() {
            "approved" => Ok(ApprovalStatus::Approved),
            "pending" => Ok(ApprovalStatus::Pending),
            "rejected" => Ok(ApprovalStatus::Rejected),
            _ => Err(anyhow::anyhow!("Invalid approval status: {}", value)),
        }
    }
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
    pub status: Option<ApprovalStatus>,
}

/// Get all approved genres
#[async_graphql::ComplexObject]
impl Genre {
    async fn approved(&self) -> bool {
        matches!(self.status, Some(ApprovalStatus::Approved))
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
    pub status: Option<ApprovalStatus>,
}

/// Get all approved formats
#[async_graphql::ComplexObject]
impl Format {
    async fn approved(&self) -> bool {
        matches!(self.status, Some(ApprovalStatus::Approved))
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
    pub status: Option<ApprovalStatus>,
}

/// Get all approved keywords
#[async_graphql::ComplexObject]
impl Keyword {
    async fn approved(&self) -> bool {
        matches!(self.status, Some(ApprovalStatus::Approved))
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
    pub status: Option<ApprovalStatus>,
}

/// Get all approved subject headings
#[async_graphql::ComplexObject]
impl SubjectHeading {
    async fn approved(&self) -> bool {
        matches!(self.status, Some(ApprovalStatus::Approved))
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
    pub status: Option<ApprovalStatus>,
}

/// Get all approved languages
#[async_graphql::ComplexObject]
impl Language {
    async fn approved(&self) -> bool {
        matches!(self.status, Some(ApprovalStatus::Approved))
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
    pub status: Option<ApprovalStatus>,
}

/// Get all approved spatial coverages
#[async_graphql::ComplexObject]
impl SpatialCoverage {
    async fn approved(&self) -> bool {
        matches!(self.status, Some(ApprovalStatus::Approved))
    }
}

/// Converts SpatialCoverage struct to corresponding Uuid
impl From<&SpatialCoverage> for Uuid {
    fn from(s: &SpatialCoverage) -> Self {
        s.id
    }
}
