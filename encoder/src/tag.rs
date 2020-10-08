use async_graphql;
use serde::{Deserialize, Serialize};

/// Represents a morphological gloss tag without commiting to a single representation.
#[async_graphql::SimpleObject]
#[derive(Serialize, Deserialize, Debug)]
pub struct MorphemeTag {
    /// Standard annotation tag for this morpheme, defined by DAILP.
    #[serde(rename = "_id")]
    pub id: String,
    /// Alternate form that conveys a simple English representation.
    pub simple: String,
    /// Alternate form of this morpheme from Cherokee Reference Grammar.
    pub crg: String,
    /// English title
    pub name: String,
    /// The kind of morpheme, whether prefix or suffix.
    pub morpheme_type: String,
}
