use serde::{Deserialize, Serialize};

/// Audio for a whole manuscript document
#[derive(Serialize, Deserialize, Clone, Debug, async_graphql::SimpleObject)]

pub struct DocumentAudio {
    /// Unique identifier for this audio resource
    pub id: String,
    /// Access link for the audio file.
    pub resource: String,
    /// Subdivisions of this audio track
    pub slices: Option<Vec<AudioSlice>>
    // /// The ID for the [AnnotatedDocument] this audio resource represents
    // pub source: String,
}

/// A segment of audio representing a word, phrase,
/// or other subunit within the audio for a full document.
/// Slices should be associated with a [DocumentAudio] for the reading audio file
/// this segment is a part of.
#[derive(Serialize, Deserialize, Clone, Debug, async_graphql::SimpleObject)]
pub struct AudioSlice {
    /// The [DocumentAudio] this audio slice is taken from
    pub parent_track: DocumentAudio,
    /// This slice's relative position to other slices within an audio resource
    pub index: u32,
    /// The time (in seconds) in the parent track where this slice begins.
    pub start_time: u16,
    /// The time (in seconds) in the parent track where this slice ends.
    pub end_time: u16
}