/// Document metadata
use crate::{document::DocumentReference, ContributorReference};

use async_graphql::{SimpleObject, Enum};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use uuid::Uuid;

/// Represents the status of a suggestion made by a contributor
#[derive(Deserialize, Serialize, Enum, Clone, Copy, PartialEq, Eq)]
pub enum Status {
    /// Suggestion is still waiting for or undergoing review
    Pending, 
    /// Suggestion has been approved
    Approved,
    /// Suggestion has been rejected
    Rejected,
}

/// Stores the genre associated with a document
#[derive(Clone, Debug, Serialize, Deserialize, SimpleObject)]
pub struct Genre {
    /// UUID for the genre
    pub id: Uuid,
    /// Name of the genre
    pub name: String,
    /// Status (pending, approved, rejected) of a genre
    pub status: Status,
}

/// Stores the physical or digital medium associated with a document
#[derive(Clone, Debug, Serialize, Deserialize, SimpleObject)]
pub struct Format {
    /// UUID for the format
    pub id: Uuid,
    /// Name of the format
    pub name: String,
    /// Status (pending, approved, rejected) of a format
    pub status: Status,
}

/// Record to store a keyword associated with a document
#[derive(Clone, Debug, Serialize, Deserialize, SimpleObject)]
pub struct Keyword {
    /// UUID for the keyword
    pub id: Uuid,
    /// Name of the keyword
    pub name: String,
    /// Status (pending, approved, rejected) of a keyword
    pub status: Status,
}

/// Record to store a subject heading that reflects Indigenous knowledge
/// practices associated with a document
#[derive(Clone, Debug, Serialize, Deserialize, SimpleObject)]
pub struct SubjectHeading {
    /// UUID for the subject heading
    pub id: Uuid,
    /// Name of the subject heading
    pub name: String,
    /// Status (pending, approved, rejected) of a subject heading
    pub status: Status,
}

/// Stores a language associated with a document
#[derive(Clone, Debug, Serialize, Deserialize, SimpleObject)]
pub struct Language {
    /// UUID for the language
    pub id: Uuid,
    /// Name of the language
    pub name: String,
    // Name a language uses for itself
    pub autonym Option<String>,
    /// Status (pending, approved, rejected) of a language
    pub status: Status,
}

/// Stores a spatial coverage associated with a document
#[derive(Clone, Debug, Serialize, Deserialize, SimpleObject)]
pub struct SpatialCoverage {
    /// UUID for the place
    pub id: Uuid,
    /// Name of the place
    pub name: String,
    /// Status (pending, approved, rejected) of a spatial coverage
    pub status: Status,
}

/// Stores citation information for a document
/// TODO: Add more fields to cover a variety of format types
#[derive(Clone, Debug, Serialize, Deserialize, SimpleObject)]
pub struct Citation {
    /// UUID for the citation
    pub id: Uuid,
    /// Creator(s) of the document
    pub creator: Option<Vec<Creator>>,
    /// Format of the document being cited
    pub doc_format: DocCitationFormat,
    /// DOI of the document
    pub doi: Option<String>,
    /// Ending page of the document (inclusive)
    pub end_page: Option<u16>,
    /// Year the document was published
    pub publication_year: Option<u16>,
    /// Publisher of the document
    pub publisher: Option<String>,
    /// Starting page of the document
    pub start_page: Option<u16>,
    /// Title of the document being cited
    pub title: String,
    /// URL of the document, if document can be accessed online
    pub url: Option<String>,
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
