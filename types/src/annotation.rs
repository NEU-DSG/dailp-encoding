use crate::{DocumentId, FormId, Geometry};
use serde::{Deserialize, Serialize};

/// An annotation is a piece of information that provides details about a word,
/// document, image, slice of an image, or audio recording.
#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Annotation {
    pub id: AnnotationId,
    pub content: String,
    pub attached_to: AnnotationAttachment,
}

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
