/// Document metadata
use crate::{document::DocumentReference, ContributorReference};

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
#[derive(Clone, SimpleObject)]
pub struct Format {
    /// UUID for the format
    pub id: Uuid,
    /// Documents associated with the format
    pub documents: Vec<DocumentReference>,
    /// Name of the format
    pub name: String,
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
#[derive(Clone, SimpleObject)]
pub struct Language {
    /// UUID for the language
    pub id: Uuid,
    /*
    Tag for the language within the DAILP system
    Could be useful for managing similar language names or extending this to
    adding tags for language, dialect, and script combinations later on
    */
    pub dailp_tag: String,
    /// Documents associated with the language
    pub documents: Vec<DocumentReference>,
    /// Name of the language
    pub name: String,
}

/// Stores a spatial coverage associated with a document
#[derive(Clone, SimpleObject)]
pub struct SpatialCoverage {
    /// UUID for the place
    pub id: Uuid,
    /*
    Tag for the spatial coverage within the DAILP system
    Could be useful for managing places with similar names or places
    with multiple names
    */
    pub dailpTag: String,
    /// Documents associated with the spatial coverage
    pub documents: Vec<DocumentReference>,
    /// Name of the place
    pub name: String,
}
