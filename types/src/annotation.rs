use crate::{DocumentId, Geometry};
use serde::{Deserialize, Serialize};

/// An annotation is a piece of information that provides details about a word,
/// document, image, slice of an image, or audio recording.
#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Annotation {
    #[serde(rename = "_id")]
    pub id: AnnotationId,
    content: String,
    attached_to: AnnotationAttachment,
}

#[derive(Serialize, Deserialize, PartialEq, Clone, Hash)]
pub struct AnnotationId(pub String);

#[derive(Serialize, Deserialize)]
#[serde(tag = "__typename")]
enum AnnotationAttachment {
    /// Reply to another existing annotation, referred to by ID.
    Reply(AnnotationId),
    /// Attached to a particular word.
    Word(String),
    /// Attached to a document or section of the document image.
    Document(DocumentRegion),
}

#[derive(Serialize, Deserialize)]
struct DocumentRegion {
    document: DocumentId,
    /// Index of the page this annotation applies to.
    page: Option<u32>,
    /// An image annotation without a region applies to the whole image.
    /// A page number is required to specify a region.
    region: Option<Geometry>,
}
