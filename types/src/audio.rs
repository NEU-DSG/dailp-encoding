use crate::date::Date;
use crate::user::User;
use serde::{Deserialize, Serialize};
use sqlx::types::Uuid;

/// A unique identifier for audio slices
#[derive(Clone, Eq, PartialEq, Hash, Serialize, Deserialize, Debug, async_graphql::NewType)]
pub struct DocumentAudioId(pub String);

/// An ID for an audio slice
#[derive(Clone, Eq, PartialEq, Hash, Serialize, Deserialize, Debug, async_graphql::NewType)]
pub struct AudioSliceId(pub String);

/// A segment of audio representing a document, word, phrase,
/// or other audio unit
#[derive(Serialize, Deserialize, Clone, Debug, async_graphql::SimpleObject)]
pub struct AudioSlice {
    /// The unique id for this audio slice. Will not be present if audio has not been inserted
    pub slice_id: Option<AudioSliceId>,
    /// The audio resource this audio slice is taken from, generally pulled from the DRS API
    pub resource_url: String,
    /// An audio slice this slice is a subunit of, if there is one
    pub parent_track: Option<DocumentAudioId>,
    /// When the track was recorded, if available
    pub recorded_at: Option<Date>,
    /// Which user recorded the tracked, if uploaded by a user
    pub recorded_by: Option<User>,
    /// True if audio should be shown to Readers.
    pub include_in_edited_collection: bool,
    ///  Last Editor to decide if audio should be included in edited collection.
    pub edited_by: Option<User>,
    /// The annotations for subunits of this slice, if there are any
    #[graphql(skip = true)]
    pub annotations: Option<Vec<AudioSlice>>,
    /// This slice's relative position to other slices within an audio resource
    pub index: i32,
    /// The time (in seconds) in the parent track where this slice begins.
    pub start_time: Option<i32>,
    /// The time (in seconds) in the parent track where this slice ends.
    pub end_time: Option<i32>,
}

/// Request to attach user-recorded audio to a word
#[derive(async_graphql::InputObject)]
pub struct AttachAudioToWordInput {
    /// Word to bind audio to
    pub word_id: Uuid,
    /// A URL to a Cloudfront-proxied user-recorded pronunciation of a word.
    /// A new resource will be created to represent the recording if one does not exist already
    pub contributor_audio_url: String,
}

/// Request to attach user-recorded audio to a document
#[derive(async_graphql::InputObject)]
pub struct AttachAudioToDocumentInput {
    /// Document to bind audio to
    pub document_id: Uuid,
    /// A URL to a Cloudfront-proxied user-recorded reading of a document.
    /// A new resource will be created to represent the recording if one does not exist already
    pub contributor_audio_url: String,
}

/// Request to update if a piece of word audio should be included in an edited collection
#[derive(async_graphql::InputObject)]
pub struct CurateWordAudioInput {
    /// Word audio is attached to
    pub word_id: Uuid,
    /// Audio to include/exclude
    pub audio_slice_id: Uuid,
    /// New value
    pub include_in_edited_collection: bool,
}

/// Request to update if a piece of document audio should be included in an edited collection
#[derive(async_graphql::InputObject)]
pub struct CurateDocumentAudioInput {
    /// Document audio is attached to
    pub document_id: Uuid,
    /// Audio to include/exclude
    pub audio_slice_id: Uuid,
    /// New value
    pub include_in_edited_collection: bool,
}
