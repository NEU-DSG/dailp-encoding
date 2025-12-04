/// Document metadata
use crate::document::DocumentReference;

use async_graphql::{Enum, SimpleObject};
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, Type};
use std::collections::HashMap;
use std::str::FromStr;
use uuid::Uuid;

/// Represents the status of a suggestion made by a contributor
#[derive(Serialize, Deserialize, Enum, Debug, Clone, Copy, PartialEq, Eq, Type)]
#[sqlx(type_name = "approval_status", rename_all = "lowercase")]
pub enum ApprovalStatus {
    /// Suggestion is still waiting for or undergoing review
    Pending,
    /// Suggestion has been approved
    Approved,
    /// Suggestion has been rejected
    Rejected,
}

/// Convert from string to ApprovalStatus
impl FromStr for ApprovalStatus {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "pending" => Ok(Self::Pending),
            "approved" => Ok(Self::Approved),
            "rejected" => Ok(Self::Rejected),
            _ => Err(()),
        }
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
    pub status: ApprovalStatus,
}

// For updating subject headings
#[derive(async_graphql::InputObject)]
pub struct SubjectHeadingUpdate {
    /// UUID for the subject heading
    pub id: Uuid,
    /// Name of the subject heading
    pub name: String,
}

/// Get all approved subject headings
#[async_graphql::ComplexObject]
impl SubjectHeading {
    #[graphql(skip)]
    async fn approved(&self) -> bool {
        matches!(self.status, ApprovalStatus::Approved)
    }
}

/// Converts SubjectHeading struct to corresponding Uuid
impl From<&SubjectHeading> for Uuid {
    fn from(s: &SubjectHeading) -> Self {
        s.id
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
    pub status: ApprovalStatus,
}

// For updating formats
#[derive(async_graphql::InputObject)]
pub struct FormatUpdate {
    /// UUID for the format
    pub id: Uuid,
    /// Name of the format
    pub name: String,
}

/// Get all approved formats
#[async_graphql::ComplexObject]
impl Format {
    #[graphql(skip)]
    async fn approved(&self) -> bool {
        matches!(self.status, ApprovalStatus::Approved)
    }
}

/// Record to store a keyword associated with a document
#[derive(Clone, Debug, Serialize, Deserialize, FromRow, SimpleObject)]
#[sqlx(rename_all = "lowercase")]
#[graphql(complex)]
pub struct Keyword {
    /// UUID for the keyword
    pub id: Uuid,
    /// Name of the keyword
    pub name: String,
    /// Status (pending, approved, rejected) of a keyword
    pub status: ApprovalStatus,
}

// For updating keywords
#[derive(async_graphql::InputObject)]
pub struct KeywordUpdate {
    /// UUID for the keyword
    pub id: Uuid,
    /// Name of the keyword
    pub name: String,
}

/// Get all approved keywords
#[async_graphql::ComplexObject]
impl Keyword {
    #[graphql(skip)]
    async fn approved(&self) -> bool {
        matches!(self.status, ApprovalStatus::Approved)
    }
}

/// Converts Keyword struct to corresponding Uuid
impl From<&Keyword> for Uuid {
    fn from(k: &Keyword) -> Self {
        k.id
    }
}

/// Stores the genre associated with a document
#[derive(Clone, SimpleObject)]
pub struct Genre {
    /// UUID for the genre
    pub id: Uuid,
    /// Documents associated with the genre
    pub documents: Vec<DocumentReference>,
    /// Name of the genre
    pub name: String,
}

/// Stores a language associated with a document
#[derive(Clone, Debug, Serialize, Deserialize, FromRow, SimpleObject)]
#[graphql(complex)]
pub struct Language {
    /// UUID for the language
    pub id: Uuid,
    /// Name of the language
    pub name: String,
    /// Status (pending, approved, rejected) of a language
    pub status: ApprovalStatus,
}

/// For updating languages
#[derive(async_graphql::InputObject)]
pub struct LanguageUpdate {
    /// UUID for the language
    pub id: Uuid,
    /// Name of the language
    pub name: String,
}

/// Get all approved languages
#[async_graphql::ComplexObject]
impl Language {
    #[graphql(skip)]
    async fn approved(&self) -> bool {
        matches!(self.status, ApprovalStatus::Approved)
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
    pub status: ApprovalStatus,
}

// For updating spatial coverages
#[derive(async_graphql::InputObject)]
pub struct SpatialCoverageUpdate {
    /// UUID for the spatial coverage
    pub id: Uuid,
    /// Name of the spatial coverage
    pub name: String,
}

/// Get all approved spatial coverages
#[async_graphql::ComplexObject]
impl SpatialCoverage {
    #[graphql(skip)]
    async fn approved(&self) -> bool {
        matches!(self.status, ApprovalStatus::Approved)
    }
}

/// Converts SpatialCoverage struct to corresponding Uuid
impl From<&SpatialCoverage> for Uuid {
    fn from(s: &SpatialCoverage) -> Self {
        s.id
    }
}
