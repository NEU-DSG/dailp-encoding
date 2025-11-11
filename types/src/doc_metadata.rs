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
#[derive(Clone, SimpleObject)]
pub struct SubjectHeading {
    /// UUID for the subject heading
    pub id: Uuid,
    /// Documents associated with the subject heading
    pub documents: Vec<DocumentReference>,
    /// Name of the subject heading
    pub name: String,
    /// Status (pending, approved, rejected) of a subject heading
    pub status: ApprovalStatus,
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
#[derive(Clone, Debug, Serialize, Deserialize, FromRow, SimpleObject)]
#[graphql(complex)]
pub struct Genre {
    /// UUID for the genre
    pub id: Uuid,
    /// Name of the genre
    pub name: String,
    /// Status (pending, approved, rejected) of a genre
    pub status: ApprovalStatus,
}

/// Get all approved genres
#[async_graphql::ComplexObject]
impl Genre {
    async fn approved(&self) -> bool {
        matches!(self.status, ApprovalStatus::Approved)
    }
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

/// Stores citation information for a document
/// TODO: Add more fields to cover a variety of format types
#[derive(Clone, Serialize, Deserialize, SimpleObject)]
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