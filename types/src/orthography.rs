use crate::CherokeeOrthography;

/// A writing system that can convert between internal and display representations.
///
/// Each orthography provides methods to identify itself and convert phonemic
/// representations into the appropriate display format.
pub trait Orthography: Clone + Copy + PartialEq + Eq {
    /// Returns the unique identifier for this orthography.
    /// Used for database lookups and serialization.
    /// Examples: TAOC, CRG, LEARNER
    fn id(&self) -> &'static str;

    /// Converts a phonemic representation to this orthography's display format.
    ///
    /// Takes an internal DAILP phonemic string and produces the appropriate
    /// output for this orthography.
    fn convert(&self, input: &str) -> String;

    /// Romanizes a simple phonetic string according to this orthography's conventions.
    ///
    /// For Cherokee Learner orthography, this converts to Worcester romanization.
    /// For other Cherokee orthographies, returns the input unchanged.
    fn romanize(&self, phonetic: &str) -> String;
}

/// A phonological representation that can be parsed and converted to orthographies.
///
/// Implementors represent the internal phonemic structure of words in a specific
/// language, with methods to parse from and convert to various orthographies.
pub trait PhonologySystem: Sized {
    /// The orthography type associated with this phonology system.
    /// Ensures type safety so that only compatible orthographies can be used.
    type Orthography: Orthography;

    /// Parses an internal representation string into this phonology system.
    fn parse_internal(input: &str) -> Self;

    /// Converts this phonological representation to the given orthography.
    fn into_orthography(self, orthography: Self::Orthography) -> String;
}

/// Type-erased wrapper for all supported orthography systems.
///
/// This enum allows internal code to work with any orthography without
/// knowing the specific language at compile time. It implements [`Orthography`]
/// by delegating to the wrapped type.
#[derive(Clone, Copy, Eq, PartialEq, Hash, Debug)]
pub enum OrthographySystem {
    /// Cherokee orthography systems (TAOC, CRG, Learner)
    Cherokee(CherokeeOrthography),
}

/// Implements the Orthography trait for the type-erased OrthographySystem.
/// Here it is just delegating to the inner orthography's methods.
impl Orthography for OrthographySystem {
    fn id(&self) -> &'static str {
        match self {
            Self::Cherokee(o) => o.id(),
        }
    }
    fn convert(&self, input: &str) -> String {
        match self {
            Self::Cherokee(o) => o.convert(input),
        }
    }
    fn romanize(&self, phonetic: &str) -> String {
        match self {
            Self::Cherokee(o) => o.romanize(phonetic),
        }
    }
}

/// Parses an orthography identifier string into an [`OrthographySystem`].
/// Returns `Some(OrthographySystem)` if the identifier is recognized, `None` otherwise.
pub fn parse_orthography_system(name: &str) -> Option<OrthographySystem> {
    match name {
        "TAOC" => Some(OrthographySystem::Cherokee(CherokeeOrthography::Taoc)),
        "CRG" => Some(OrthographySystem::Cherokee(CherokeeOrthography::Crg)),
        "LEARNER" => Some(OrthographySystem::Cherokee(CherokeeOrthography::Learner)),
        _ => None,
    }
}
