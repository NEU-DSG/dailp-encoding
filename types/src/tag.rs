use serde::{Deserialize, Serialize};

/// Represents a morphological gloss tag without committing to a single representation.
///
/// - TODO: Use a more generic representation than fields for learner, TAOC, and CRG.
#[derive(Serialize, Deserialize, Debug, Clone, async_graphql::SimpleObject)]
#[serde(rename_all = "camelCase")]
pub struct MorphemeTag {
    /// Unique identifier for this morpheme which should be used in raw
    /// interlinear glosses of a word containing this morpheme.
    /// Standard annotation tag for this morpheme, defined by DAILP.
    pub id: String,
    /// The "learner" representation of this morpheme, a compromise between no
    /// interlinear glossing and standard linguistic terms.
    pub learner: Option<TagForm>,
    /// Representation of this morpheme that closely aligns with _Tone and
    /// Accent in Oklahoma Cherokee_.
    pub taoc: Option<TagForm>,
    /// Representation of this morpheme that closely aligns with _Cherokee
    /// Reference Grammar_.
    pub crg: Option<TagForm>,
    /// What kind of functional morpheme is this?
    /// A few examples: "Prepronominal Prefix", "Clitic"
    pub morpheme_type: String,
}

/// A concrete representation of a particular functional morpheme.
#[derive(async_graphql::SimpleObject, Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct TagForm {
    /// How this morpheme is represented in a gloss
    pub tag: String,
    /// Plain English title of the morpheme tag
    pub title: String,
    /// How this morpheme looks in original language data
    pub shape: Option<String>,
    /// URL to an external page with more details about this morpheme.
    pub details_url: Option<String>,
    /// A prose description of what this morpheme means and how it works in
    /// context.
    pub definition: String,
    pub morpheme_type: String,
}
