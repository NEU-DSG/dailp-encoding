/// Document metadata
use async_graphql::{Enum, SimpleObject, ComplexObject};
use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgValueRef, Decode, FromRow, Postgres};
use std::collections::HashMap;
use uuid::Uuid;

use crate::ContributorReference;

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
#[derive(Clone, Debug, Serialize, Deserialize, FromRow)]
#[graphql(complex)]
pub struct Genre {
    /// UUID for the Genre
    pub id: Uuid,
    /// Name of the genre
    pub name: String,
    /// Status (pending, approved, rejected) of a genre
    pub status: ApprovalStatus,
}

/// Stores the physical or digital medium associated with a document
#[derive(Clone, Debug, Serialize, Deserialize, FromRow)]
#[graphql(complex)]
pub struct Format {
    /// UUID for the format
    pub id: Uuid,
    /// Name of the format
    pub name: String,
    /// Status (pending, approved, rejected) of a format
    pub status: ApprovalStatus,
}
/// Record to store a keyword associated with a document
#[derive(Clone, Debug, Serialize, Deserialize, FromRow)]
#[graphql(complex)]
pub struct Keyword {
    /// UUID for the keyword
    pub id: Uuid,
    /// Name of the keyword
    pub name: String,
    /// Status (pending, approved, rejected) of a keyword
    pub status: ApprovalStatus,
}

/// Record to store a subject heading that reflects Indigenous knowledge
/// practices associated with a document
#[derive(Clone, Debug, Serialize, Deserialize, FromRow)]
#[graphql(complex)]
pub struct SubjectHeading {
    /// UUID for the subject heading
    pub id: Uuid,
    /// Name of the subject heading
    pub name: String,
    /// Status (pending, approved, rejected) of a subject heading
    pub status: ApprovalStatus,
}

/// Stores a language associated with a document
#[derive(Clone, Debug, Serialize, Deserialize, FromRow)]
#[graphql(complex)]
pub struct Language {
    /// UUID for the language
    pub id: Uuid,
    /// Name of the language
    pub name: String,
    // Name a language uses for itself
    pub autonym: Option<String>,
    /// Status (pending, approved, rejected) of a language
    pub status: ApprovalStatus,
}

/// Stores a spatial coverage associated with a document
#[derive(Clone, Debug, Serialize, Deserialize, FromRow)]
#[graphql(complex)]
pub struct SpatialCoverage {
    /// UUID for the place
    pub id: Uuid,
    /// Name of the place
    pub name: String,
    /// Status (pending, approved, rejected) of a spatial coverage
    pub status: ApprovalStatus,
}

/// Stores citation information for a document
/// TODO: Add more fields to cover a variety of format types
#[derive(Clone, Serialize, Deserialize)]
pub struct Citation {
    /// UUID for the citation
    pub id: Uuid,
    /// Creators of the document
    pub creators: Vec<ContributorReference>,
    /// Format of the document being cited
    pub doc_format: DocCitationFormat,
    /// DOI of the document
    pub doi: String,
    /// Ending page of the document (inclusive)
    pub end_page: u16,
    /// Year the document was published
    pub publication_year: u16,
    /// Publisher of the document
    pub publisher: String,
    /// Starting page of the document
    pub start_page: u16,
    /// Title of the document being cited
    pub title: String,
    /// URL of the document, if document can be accessed online
    pub url: String,
}

/// Represents the format of a citation
/// TODO: Add more formats
#[derive(Serialize, Deserialize, Enum, Clone, Copy, PartialEq, Eq)]
pub enum DocCitationFormat {
    /// Website, BlogPost, Database
    Website,
    /// Book, EBook
    Book,
    /// JournalArticle, Newsletter
    Journal,
    /// Podcast, RadioClip, OralHistory
    Audio,
    /// YouTubeVideo, Film
    Video,
}

/// Used to automatically assign broader citation format to a document
/// from its more specific format
/// TODO: Add more format mappings to cover a variety of format types
pub fn format_to_citation_format() -> HashMap<&'static str, DocCitationFormat> {
    use DocCitationFormat::*;

    let mut map = HashMap::new();
    map.insert("Book", Book);
    map.insert("EBook", Book);
    map.insert("JournalArticle", Journal);
    map.insert("Newsletter", Journal);
    map.insert("Website", Website);
    map.insert("BlogPost", Website);
    map.insert("Database", Website);
    map.insert("Podcast", Audio);
    map.insert("RadioClip", Audio);
    map.insert("OralHistory", Audio);
    map.insert("YouTubeVideo", Video);
    map.insert("Film", Video);

    map
}