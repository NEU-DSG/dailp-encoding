use serde::{Deserialize, Serialize};

/// A spelling system definition (stored in database, admin-managed)
/// Wrapper around a name string
#[derive(Clone, Debug, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub struct SpellingSystem(pub String);

/// A word's spelling value for a particular spelling system
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Spelling {
    // The spelling system this value belongs to
    pub system: SpellingSystem,
    // The actual spelling value
    pub value: String,
}

impl SpellingSystem {
    // Constructor
    pub fn new(name: impl Into<String>) -> Self {
        Self(name.into())
    }

    // Accessor for the name
    pub fn name(&self) -> &str {
        &self.0
    }

    // Makes a new source spelling system
    pub fn source() -> Self {
        Self::new("Source")
    }
    // Makes a new simple phonetics spelling system
    pub fn simple_phonetics() -> Self {
        Self::new("Simple Phonetics")
    }
}
