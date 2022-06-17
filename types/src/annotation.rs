#![allow(missing_docs)]

use crate::{DocumentId, FormId, Geometry};
use serde::{Deserialize, Serialize};

/// An annotation is a piece of information that provides details about a word,
/// document, image, slice of an image, or audio recording.
#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Annotation {
    /// Database ID
    pub id: AnnotationId,
    /// The text content of this annotation
    pub content: String,
    /// What is this annotation attached to? Perhaps a word or this could be a reply to another
    /// annotation.
    pub attached_to: AnnotationAttachment,
}

/// Database ID for a single annotation
#[derive(Serialize, Deserialize, PartialEq, Clone, Hash)]
pub struct AnnotationId(pub String);

#[derive(Serialize, Deserialize)]
#[serde(tag = "__typename")]
pub enum AnnotationAttachment {
    /// Reply to another existing annotation, referred to by ID.
    Reply(Reply),
    /// Attached to a particular word.
    WordAttachment(WordAttachment),
    /// Attached to a document or section of the document image.
    DocumentRegion(DocumentRegion),
}

#[derive(Serialize, Deserialize)]
pub struct Reply {
    to: AnnotationId,
}

#[derive(Serialize, Deserialize)]
pub struct WordAttachment {
    to: FormId,
}

#[derive(Serialize, Deserialize)]
pub struct DocumentRegion {
    pub document: DocumentId,
    /// Number of the page this annotation applies to.
    pub page: Option<u32>,
    /// An image annotation without a region applies to the whole image.
    /// A page number is required to specify a region.
    pub region: Option<Geometry>,
}
