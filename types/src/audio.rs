use serde::{Deserialize, Serialize};

/// A unique identifier for audio slices
#[derive(Clone, Eq, PartialEq, Hash, Serialize, Deserialize, Debug, async_graphql::NewType)]
pub struct DocumentAudioId(pub String);

/// A segment of audio representing a document, word, phrase,
/// or other audio unit
#[derive(Serialize, Deserialize, Clone, Debug, async_graphql::SimpleObject)]
pub struct AudioSlice {
    /// The audio resource this audio slice is taken from, generally pulled from the DRS API
    pub parent_track: DocumentAudioId,
    /// This slice's relative position to other slices within an audio resource
    pub index: u32,
    /// The time (in seconds) in the parent track where this slice begins.
    pub start_time: u32,
    /// The time (in seconds) in the parent track where this slice ends.
    pub end_time: u32,
}