use serde::{Deserialize, Serialize};

/// A unique identifier for audio slices
#[derive(Clone, Eq, PartialEq, Hash, Serialize, Deserialize, Debug, async_graphql::NewType)]
pub struct DocumentAudioId(pub String);

/// A segment of audio representing a document, word, phrase,
/// or other audio unit
#[derive(Serialize, Deserialize, Clone, Debug, async_graphql::SimpleObject)]
pub struct AudioSlice {
    /// The audio resource this audio slice is taken from, generally pulled from the DRS API
    pub resource_url: String,
    /// An audio slice this slice is a subunit of, if there is one
    pub parent_track: Option<DocumentAudioId>,
    /// The annotations for subunits of this slice, if there are any
    #[graphql(skip = true)]
    pub annotations: Option<Vec<AudioSlice>>,
    /// This slice's relative position to other slices within an audio resource
    pub index: usize,
    /// The time (in seconds) in the parent track where this slice begins.
    pub start_time: Option<u32>,
    /// The time (in seconds) in the parent track where this slice ends.
    pub end_time: Option<u32>,
}