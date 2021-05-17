use crate::{AnnotatedForm, DocumentId, Geometry};
use serde::{Deserialize, Serialize};

/// This entity may have zero or more interpretations.
/// There may be a specific reason for or agent of the ambiguity between the choices.
///
/// Let's consider a potentially ambiguous word in a document.
/// - We may think that there is a word, but we have no idea how to interpret it.
///   This situation is represented by a blank list of choices.
/// - We may be unsure about word breaks and thus interpret either one word, or two words.
///   This is represented by two choices, the first being a singleton list
///   and the second being a multi-element list.
/// - We may be certain of one interpretation of the word.
///   This situation is represented by a single choice that is a singleton list.
///
/// In any of these scenarios, explanation may be provided that indicates why
/// there is ambiguity, why a certain interpretation is present, or why others
/// have been discarded.
///
/// - TODO: Conditional ambiguity.
#[derive(async_graphql::SimpleObject, Clone, Debug, Deserialize, Serialize, PartialEq)]
#[graphql(concrete(name = "AmbiguousChar", params(char)))]
#[graphql(concrete(name = "AmbiguousString", params(String)))]
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
    pub fn new(reason: Option<String>, agent: Option<String>, choices: Vec<Vec<T>>) -> Self {
        Self {
            reason,
            agent,
            choices,
        }
    }

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
        self.choices.len() == 1
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

    pub fn get_transcription(&self) -> &Ambiguous<String> {
        &self.transcription
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn certain() {
        let amb = Ambiguous::from_certain(10);
        assert!(amb.is_certain());
    }

    #[test]
    fn certain_with_reason() {
        let amb = Ambiguous::new(Some("At first, I thought this might have been IO, but then I looked again and it was obviously 10".to_string()), None, vec![vec![10]]);
        assert!(amb.is_certain());
    }

    #[test]
    fn uncertain() {
        let amb = Ambiguous::new(None, None, vec![vec!["10"], vec!["IO"]]);
        assert_eq!(amb.is_certain(), false);
    }

    #[test]
    fn uncertain_with_reason() {
        let amb = Ambiguous::new(
            Some("10 and IO are very similar sequences in general".to_string()),
            Some("Messy handwriting".to_string()),
            vec![vec!["10"], vec!["IO"]],
        );
        assert_eq!(amb.is_certain(), false);
    }

    #[test]
    fn uncertain_with_alternate_split() {
        let amb = Ambiguous::new(
            Some("The dense letters may include an embedded h, indicating the place name Carthage. If not, then they must be referring to the cart age (golden age of carts).".to_string()),
            Some("Dense script".to_string()),
            vec![vec!["Carthage"], vec!["Cart", "age"]],
        );
        assert_eq!(amb.is_certain(), false);
    }
}
