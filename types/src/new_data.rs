/// New document metadata
/// TODO: Move types to the appropirate files
/// TODO: Fix derive attribute macro for each type
use crate::{document::DocumentReference, person::ContributorDetails, user::User};

use async_graphql::{dataloader::DataLoader, FieldResult, MaybeUndefined};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

/// Record for a DAILP admin
#[derive(Clone, Debug, Serialize, Deserialize, async_graphql::SimpleObject)]
pub struct Admin {
    /// Inherits from User
    pub user: User,
}

/// Represents the status of a suggestion made by a contributor
#[derive(async_graphql::Enum, Clone, Copy, PartialEq, Eq)]
pub enum Status {
    Pending,
    Approved,
    Rejected,
}

/// Record to store a key term associated with a document
#[derive(Clone, Debug, Serialize, Deserialize, async_graphql::SimpleObject)]
pub struct Keyword {
    /// UUID for the keyword
    pub id: Uuid,
    /// Documents associated with the keyword
    pub documents: Vec<DocumentReference>,
    /// Name of the keyword
    pub name: String,
    /// Status (pending, approved, rejected) of a keyword
    pub status: Status,
}

/// Record to store a subject heading that reflects Indigenous knowledge
/// practices associated with a document
#[derive(Clone, Debug, Serialize, Deserialize, async_graphql::SimpleObject)]
pub struct SubjectHeading {
    /// UUID for the subject heading
    pub id: Uuid,
    /// Documents associated with the subject heading
    pub documents: Vec<DocumentReference>,
    /// Name of the subject heading
    pub name: String,
    /// Status (pending, approved, rejected) of a subject heading
    pub status: Status,
}

/// Stores the physical or digital medium associated with a document
#[derive(Clone, Debug, Serialize, Deserialize, async_graphql::SimpleObject)]
pub struct Format {
    /// UUID for the format
    pub id: Uuid,
    /// Documents associated with the format
    pub documents: Vec<DocumentReference>,
    /// Name of the format, pulling from controlled vocabulary for formats
    pub name: String,
}

/// Stores a language associated with a document
#[derive(Clone, Debug, Serialize, Deserialize, async_graphql::SimpleObject)]
pub struct Language {
    /// UUID for the language
    pub id: Uuid,
    /*
    Tag for the language within the DAILP system
    Could be useful for managing similar language names or extending this to
    adding tags for language, dialect, and script combinations later on
    */
    pub dailpTag: String,
    /// Documents associated with the language
    pub documents: Vec<DocumentReference>,
    /// UUID for the language
    pub id: Uuid,
    /// Name of the language
    pub name: String,
}

/// Stores a spatial coverage associated with a document
#[derive(Clone, Debug, Serialize, Deserialize, async_graphql::SimpleObject)]
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
#[derive(Clone, Debug, Serialize, Deserialize, async_graphql::SimpleObject)]
pub struct Citation {
    /// UUID for the citation
    pub id: Uuid,
    /// Creators of the document
    pub creators: Vec<Creator>,
    /// Format of the document being cited
    pub docFormat: DocCitationFormat,
    /// DOI of the document
    pub doi: String,
    /// Ending page of the document (inclusive)
    pub endPage: u16,
    /// Year the document was published
    pub publicationYear: u16,
    /// Publisher of the document
    pub publisher: String,
    /// Starting page of the document
    pub startPage: u16,
    /// Title of the document being cited
    pub title: String,
    /// URL of the document, if document can be accessed online
    pub url: String,
}

/// Represents the format of a citation
/// TODO: Add more formats
#[derive(async_graphql::Enum, Clone, Copy, PartialEq, Eq)]
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

/// A user belongs to any number of user groups, which give them various permissions.
#[derive(async_graphql::Enum, Clone, Copy, PartialEq, Eq)]
pub enum UserGroup {
    Admin,
    Contributors,
    Editors,
    Readers,
}
