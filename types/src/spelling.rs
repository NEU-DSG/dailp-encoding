use serde::{Deserialize, Serialize};

/// A spelling system definition (stored in database, admin-managed)
/// Wrapper around a name string
#[derive(Clone, Debug, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub struct SpellingSystem(pub String);

/// A word's spelling value for a particular spelling system
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Spelling {
    pub system: SpellingSystem,
    pub value: String,
}

impl SpellingSystem {
    pub fn new(name: impl Into<String>) -> Self {
        Self(name.into())
    }

    pub fn name(&self) -> &str {
        &self.0
    }

    pub fn source() -> Self {
        Self::new("Source")
    }
    pub fn simple_phonetics() -> Self {
        Self::new("Simple Phonetics")
    }
}
