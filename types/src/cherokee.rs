use crate::Orthography;
use crate::*;
use lazy_static::lazy_static;
use sqlx::postgres::*;

/// One representation of Cherokee phonology.
/// There are several different writing systems for Cherokee phonology and we
/// want to convert between them.
/// This type enumerates all of the systems that we support and provides
/// conversion from our internal orthography into any of these.
#[derive(async_graphql::Enum, Clone, Copy, Eq, PartialEq, Hash, Debug)]
pub enum CherokeeOrthography {
    /// The t/th system for transcribing the Cherokee syllabary.
    /// This orthography is favored by linguists as it is segmentally more accurate.
    Taoc,
    /// The d/t system for transcribing the Cherokee syllabary.
    /// This orthography is favored by speakers.
    /// TODO Option for /ts/ instead of /j/
    /// TODO Option for /qu/ instead of /gw/ or /kw/
    Crg,
    /// Simplified system that uses d/t without tones, a compromise intended for
    /// language learners. qu and ts
    Learner,
}

impl PgHasArrayType for CherokeeOrthography {
    fn array_type_info() -> PgTypeInfo {
        <&str as PgHasArrayType>::array_type_info()
    }

    fn array_compatible(ty: &PgTypeInfo) -> bool {
        <&str as PgHasArrayType>::array_compatible(ty)
    }
}

impl Orthography for CherokeeOrthography {
    fn identifier(&self) -> &'static str {
        match self {
            Self::Taoc => "TAOC",
            Self::Crg => "CRG",
            Self::Learner => "LEARNER",
        }
    }
    fn convert(&self, input: &str) -> String {
        // Delegates to existing CherokeeOrthography::convert()
        CherokeeOrthography::convert(self, input)
    }
    fn language_code(&self) -> &'static str {
        "chr"
    }
    fn display_name(&self) -> &'static str {
        match self {
            Self::Taoc => "TAOC",
            Self::Crg => "CRG",
            Self::Learner => "LEARNER",
        }
    }
    fn romanize(&self, phonetic: &str) -> String {
        match self {
            Self::Learner => crate::lexical::simple_phonetics_to_worcester(phonetic),
            Self::Taoc | Self::Crg => phonetic.to_string(),
        }
    }
}

impl CherokeeOrthography {
    /// Convert from the input string in DAILP internal orthography (which is
    /// similar to TAOC) into this orthography.
    pub fn convert(&self, input: &str) -> String {
        use CherokeeOrthography::*;
        let ast = PhonemicString::parse_dailp(input);
        match self {
            Taoc => ast.into_dailp(),
            Crg => ast.into_crg(),
            Learner => ast.into_learner(),
        }
    }

    /// Return a list of possible misspellings of the given syllabary string,
    /// based on which characters look the most similar.
    pub fn similar_syllabary_strings(original: &str) -> Vec<String> {
        // For each character of the string, list out similar looking characters.
        // This yields from "GFT" => [['G', 'C', 'O'], ['F', 'E'], ['T', 'I']]
        let potential_chars: Vec<Vec<char>> = original
            .chars()
            .map(Self::similar_syllabary_chars)
            .collect();

        // Now produce the list of combinations.
        // [['G', 'C', 'O'], ['F', 'E'], ['T', 'I']] => ["GFT", "CFT", "OFT", ...]
        let mut results: Vec<String> = Vec::new();
        for group in potential_chars {
            if results.is_empty() {
                results = group.into_iter().map(|c| c.to_string()).collect();
            } else {
                // For each string in the list, make a new version for each next character.
                // ["G", "C", "O"] => ["GF", "GE", "CF", "CE", "OF", "OE"]
                results = results
                    .into_iter()
                    .flat_map(|in_progress| {
                        group.iter().map(move |c| {
                            let mut new_thing = in_progress.clone();
                            new_thing.push(*c);
                            new_thing
                        })
                    })
                    .collect();
            }
        }

        results
    }

    /// Return all syllabary characters that look similar to the given one.
    fn similar_syllabary_chars(c: char) -> Vec<char> {
        let group = CherokeeSyllabaryVisualGroups::from_char(c);
        if let Some(chars) = CHEROKEE_FALSE_FRIENDS.get(&group) {
            chars.to_vec()
        } else {
            vec![c]
        }
    }
}

use std::collections::HashMap;

lazy_static! {
    static ref CHEROKEE_FALSE_FRIENDS: HashMap<CherokeeSyllabaryVisualGroups, Vec<char>> = {
        let mut m = HashMap::new();
        let all_syllabary_chars = 'Ꭰ'..'Ᏽ';
        for c in all_syllabary_chars {
            let group = CherokeeSyllabaryVisualGroups::from_char(c);
            if group != CherokeeSyllabaryVisualGroups::Other {
                let items: &mut Vec<char> = m.entry(group).or_default();
                items.push(c);
            }
        }
        m
    };
}

#[derive(Hash, PartialEq, Eq, Clone, Copy)]
enum CherokeeSyllabaryVisualGroups {
    Lightning,
    Fork,
    Hills,
    Angles,
    Head,
    LargeHook,
    Post,
    Hook,
    Lip,
    Belly,
    Chair,
    Trough,
    StormCloud,
    Bicycle,
    Swirl,
    Horns,
    Scythe,
    LetterBigR,
    LetterBigB,
    Bowl,
    LetterL,
    Waves,
    Valleys,
    Slope,
    Bridge,
    Other,
}
impl CherokeeSyllabaryVisualGroups {
    fn from_char(input: char) -> Self {
        use CherokeeSyllabaryVisualGroups::*;
        match input {
            'Ꭴ' | 'Ꮕ' | 'Ꮫ' => Lightning,
            'Ꭸ' | 'Ꭼ' | 'Ꮀ' | 'Ꮛ' | 'Ꮉ' => Fork,
            'Ꮥ' | 'Ꭶ' | 'Ꮪ' => Hills,
            'Ꮞ' | 'Ꭽ' => Angles,
            'Ꮈ' | 'Ꮔ' | 'Ꭾ' => Scythe,
            'Ꮯ' | 'Ꮆ' | 'Ꮳ' => Bowl,
            'Ꮸ' | 'Ᏻ' | 'Ꮹ' | 'Ꮏ' => LargeHook,
            'Ꮐ' | 'Ꮭ' => LetterL,
            'Ꮁ' | 'Ꮦ' | 'Ꭲ' => Post,
            'Ꮧ' | 'Ꮨ' => Hook,
            'Ꭻ' | 'Ꮷ' | 'Ꮄ' => Lip,
            'Ꮣ' | 'Ꮟ' => Belly,
            'Ꮵ' | 'Ꮒ' => Chair,
            'Ꭹ' | 'Ꮍ' => Trough,
            'Ꮲ' | 'Ꮅ' => Head,
            'Ꭱ' | 'Ꮢ' => LetterBigR,
            'Ᏼ' | 'Ᏸ' => LetterBigB,
            'Ꭷ' | 'Ꮼ' | 'Ꮾ' | 'Ꮽ' => Swirl,
            'Ꮘ' | 'Ꮱ' => Horns,
            'Ꮂ' | 'Ꮺ' | 'Ꮚ' | 'Ꮗ' | 'Ꮝ' | 'Ꮿ' => Waves,
            'Ꮃ' | 'Ꮤ' => Valleys,
            'Ꮩ' | 'Ꮙ' => Slope,
            'Ꭺ' | 'Ꭿ' | 'Ꮜ' => Bridge,
            'Ꮎ' | 'Ꮻ' => StormCloud,
            'Ꭳ' | 'Ꮌ' | 'Ᏹ' => Bicycle,
            _ => Other,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn conversion() {
        // This value came straight from the DD1 spreadsheet.
        let orig = "ùùnatoótákwààskvv̋ʔi";
        // Test the learner orthography.
        assert_eq!(
            CherokeeOrthography::Learner.convert(orig),
            "unadodaquasgv'i"
        );
        // Test the CRG orthography.
        assert_eq!(
            CherokeeOrthography::Crg.convert(orig),
            "uùnadoódágwaàsgv́v́ʔi"
        );
    }

    #[test]
    fn edge_cases() {
        assert_eq!(
            CherokeeOrthography::Learner.convert("Ø-ali-sul(v)-hvsk-vv̋ʔi=hnoo"),
            "Ø-ali-sul(v)-hvsg-v'i=hno"
        );

        assert_eq!(
            CherokeeOrthography::Learner.convert("t-uu-alihthat-:iinvvʔs-ééʔi"),
            "d-u-alihtad-invs-e'i"
        );

        assert_eq!(
            CherokeeOrthography::Learner.convert("Ø-ataweelakʔ-?-i"),
            "Ø-adawelag'-?-i"
        );

        assert_eq!(CherokeeOrthography::Learner.convert(""), "");
        assert_eq!(CherokeeOrthography::Learner.convert("n"), "n");
        assert_eq!(CherokeeOrthography::Learner.convert("uu"), "u");
        assert_eq!(
            CherokeeOrthography::Learner.convert("(a)listaʔyvv"),
            "(a)lisdayv"
        );
    }

    #[test]
    fn colons() {
        assert_eq!(
            CherokeeOrthography::Crg.convert("uwa–:ciískáhlvv̋ʔi"),
            "uwa–xxjiísgáhlv́v́ʔi"
        )
    }

    #[test]
    fn false_friends() {
        assert_eq!(
            CherokeeOrthography::similar_syllabary_strings("ᎤᎾᏗ"),
            &[
                "ᎤᎾᏗ",
                "ᎤᎾᏘ",
                "ᎤᏫᏗ",
                "ᎤᏫᏘ",
                "ᏅᎾᏗ",
                "ᏅᎾᏘ",
                "ᏅᏫᏗ",
                "ᏅᏫᏘ",
                "ᏛᎾᏗ",
                "ᏛᎾᏘ",
                "ᏛᏫᏗ",
                "ᏛᏫᏘ"
            ]
        )
    }
}
