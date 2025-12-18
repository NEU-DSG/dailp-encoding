use crate::CherokeeOrthography;

pub trait Orthography: Clone + Copy + PartialEq + Eq {
    fn identifier(&self) -> &'static str; // "TAOC", "CRG", etc.
    fn display_name(&self) -> &'static str; // "TAOC (Linguist)"
    fn convert(&self, input: &str) -> String; // Conversion logic
    fn language_code(&self) -> &'static str; // "chr", "jpn", etc.
    fn romanize(&self, phonetic: &str) -> String; // Language specific
}

pub trait PhonologySystem: Sized {
    type Orthography: Orthography;
    fn parse_internal(input: &str) -> Self;
    fn into_orthography(self, orthography: Self::Orthography) -> String;
}

#[derive(Clone, Copy, Eq, PartialEq, Hash, Debug)]
pub enum OrthographySystem {
    Cherokee(CherokeeOrthography),
}

impl Orthography for OrthographySystem {
    fn identifier(&self) -> &'static str {
        match self {
            Self::Cherokee(o) => o.identifier(),
        }
    }
    fn convert(&self, input: &str) -> String {
        match self {
            Self::Cherokee(o) => o.convert(input),
        }
    }
    fn language_code(&self) -> &'static str {
        match self {
            Self::Cherokee(o) => o.language_code(),
        }
    }
    fn display_name(&self) -> &'static str {
        match self {
            Self::Cherokee(o) => o.display_name(),
        }
    }
    fn romanize(&self, phonetic: &str) -> String {
        match self {
            Self::Cherokee(o) => o.romanize(phonetic),
        }
    }
}

pub fn parse_orthography_system(name: &str) -> Option<OrthographySystem> {
    match name {
        "TAOC" => Some(OrthographySystem::Cherokee(CherokeeOrthography::Taoc)),
        "CRG" => Some(OrthographySystem::Cherokee(CherokeeOrthography::Crg)),
        "LEARNER" => Some(OrthographySystem::Cherokee(CherokeeOrthography::Learner)),
        _ => None,
    }
}
