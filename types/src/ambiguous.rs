use crate::{AnnotatedForm, DocumentId, Geometry};
use serde::{Deserialize, Serialize};

/// This entity may have zero or more interpretations.
/// There may be a specific reason for or agent of the ambiguity between the choices.
#[derive(async_graphql::SimpleObject, Clone, Debug, Deserialize, Serialize, PartialEq)]
#[graphql(concrete(name = "AmbiguousString", params(String)))]
#[graphql(concrete(name = "AmbiguousChar", params(char)))]
#[graphql(concrete(name = "AmbiguousForm", params(AnnotatedForm)))]
pub struct Ambiguous<T: async_graphql::OutputType> {
    /// Indicates why the material is hard to transcribe.
    reason: Option<String>,
    /// Where the difficulty in transcription arises from damage, categorizes the cause of the damage, if it can be identified.
    agent: Option<String>,
    /// A list of choices, each of which may be either a singleton list (one
    /// entity) or a multi-element list (many entities).
    ///
    /// This representation allows things like a segment of a document being
    /// interpreted as either a single word or multiple words.
    choices: Vec<Vec<T>>,
}

impl<T: async_graphql::OutputType> Ambiguous<T> {
    pub fn from_certain(choice: T) -> Self {
        Self {
            reason: None,
            agent: None,
            choices: vec![vec![choice]],
        }
    }

    /// Does this ambiguity represent an entity that we have no guesses about yet?
    pub fn is_none(&self) -> bool {
        self.choices.len() == 0
    }

    /// Does this ambiguity represent an entity that we only have one
    /// interpretation of so far?
    pub fn is_certain(&self) -> bool {
        self.reason.is_none() && self.agent.is_none() && self.choices.len() == 1
    }

    /// Either the one interpretation that we are so far certain of, or `None`.
    pub fn get_certain(&self) -> Option<&[T]> {
        if self.is_certain() {
            self.choices.get(0).map(|x| &x[..])
        } else {
            None
        }
    }

    pub fn get_choices(&self) -> &[Vec<T>] {
        &self.choices[..]
    }
}

#[derive(async_graphql::NewType, Serialize, Deserialize, Debug, PartialEq, Clone)]
pub struct CharId(String);

impl CharId {
    pub fn for_index(index: i32) -> Self {
        Self(index.to_string())
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct DocumentCharacter {
    #[serde(rename = "_id")]
    id: CharId,
    // What page number is this character on?
    page: i32,
    /// What number line is this character on?
    ///
    /// Used for automatically constructing image regions from a range of
    /// characters. If two characters are on different lines, their regions
    /// should not be merged.
    line: i32,
    /// Handles multiple possible interpretations of one character
    transcription: Ambiguous<String>,
    region: Option<Geometry>,
}

impl DocumentCharacter {
    pub fn new(
        id: CharId,
        page: i32,
        line: i32,
        transcription: Ambiguous<String>,
        region: Option<Geometry>,
    ) -> Self {
        Self {
            id,
            page,
            line,
            transcription,
            region,
        }
    }
}

#[derive(async_graphql::SimpleObject)]
struct DocumentWord {
    id: String,
    range: CharacterRange,
}

#[derive(async_graphql::SimpleObject, Clone, Serialize, Deserialize, Debug, PartialEq)]
#[serde(rename_all = "camelCase")]
#[graphql(complex)]
pub struct CharacterRange {
    pub document_id: crate::DocumentId,
    pub index: i32,
    pub first_char: CharId,
    pub last_char: CharId,
}

impl CharacterRange {
    pub fn new(document_id: DocumentId, index: i32, first_char: CharId, last_char: CharId) -> Self {
        Self {
            document_id,
            index,
            first_char,
            last_char,
        }
    }
    pub async fn get_region(&self, db: &crate::Database) -> Option<Geometry> {
        None
    }
}

#[async_graphql::ComplexObject]
impl CharacterRange {
    /// Compute the region based on the regions of all the characters making up
    /// this range.
    pub async fn region(&self, context: &async_graphql::Context<'_>) -> Option<Geometry> {
        None
    }

    /// Compute the page number or range from the page numbers of the first and
    /// last characters.
    pub async fn page_number(&self, context: &async_graphql::Context<'_>) -> String {
        String::new()
    }
}
