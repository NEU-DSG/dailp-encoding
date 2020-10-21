use crate::{AnnotatedForm, DateTime, MorphemeSegment};
use serde::{Deserialize, Serialize};

/// A lexical entry is a form whose meaning cannot be created solely through
/// semantic composition. In linguistic theory terms, our lexemes are
/// semantically atomic forms rather than semantically complex forms.
/// In English, lexical entries may be afforded for "kick," "the," and "bucket."
/// By our definition, "kick the bucket" might have its own lexical entry
/// because it has meaning beyond forcing your foot into a container.
#[async_graphql::SimpleObject]
#[derive(Serialize, Deserialize, Debug)]
pub struct LexicalEntry {
    #[serde(rename = "_id")]
    pub id: String,
    /// The original source text in whatever orthography was used there
    pub original: String,
    /// The phonemic shape of the root and it's semi-unique gloss tag
    pub root: MorphemeSegment,
    /// Plain English translations of root's meaning
    pub root_translations: Vec<String>,
    /// An owned collection of surface forms containing this root
    pub surface_forms: Vec<AnnotatedForm>,
    /// The year this form was recorded
    pub date_recorded: DateTime,
    /// This form's position in its containing document
    pub position: Option<PositionInDocument>,
}

impl LexicalEntry {
    pub fn make_id(doc_id: &str, gloss: &str) -> String {
        use regex::{Captures, Regex};
        lazy_static::lazy_static! {
            static ref GLOSS_PAT: Regex = Regex::new(r"[\s:\-,\[\]]+").unwrap();
        }
        // Unify gloss formats into a lowercase dot-separated string: "multi.word.gloss"
        let gloss_tag = GLOSS_PAT.replace_all(&gloss, |_: &Captures| ".");
        format!("{}:{}", doc_id, gloss_tag.trim_end_matches("."))
    }
}

/// The reference position within a document of one specific form
#[derive(Serialize, Deserialize, Debug)]
pub struct PositionInDocument {
    document_id: String,
    page_number: i64,
    index: i64,
}
impl PositionInDocument {
    pub fn new(document_id: String, page_number: i64, index: i64) -> Self {
        Self {
            document_id,
            page_number,
            index,
        }
    }
}

#[async_graphql::Object]
impl PositionInDocument {
    /// Standard page reference for this position, which can be used in citation.
    /// Generally formatted like ID:PAGE, i.e "DF2018:55"
    async fn page_reference(&self) -> String {
        format!("{}:{}", self.document_id, self.page_number)
    }

    /// Index reference for this position, more specific than `page_reference`.
    /// Generally used in corpus documents where there are few pages containing
    /// many forms each. Example: "WJ23:#21"
    async fn index_reference(&self) -> String {
        format!("{}:#{}", self.document_id, self.index)
    }

    /// Unique identifier of the source document
    async fn document_id(&self) -> &str {
        &self.document_id
    }

    /// 1-indexed page number
    async fn page_number(&self) -> i64 {
        self.page_number
    }

    /// 1-indexed position indicating where the form sits in the ordering of all
    /// forms in the document. Used for relative ordering of forms from the
    /// same document.
    async fn index(&self) -> i64 {
        self.index
    }
}

/// Gather many verb surface forms from the given row.
pub fn root_verb_surface_forms(
    doc_id: &str,
    root: &str,
    root_gloss: &str,
    cols: &mut impl Iterator<Item = String>,
    translation_count: usize,
    has_numeric: bool,
    has_comment: bool,
    has_spacer: bool,
) -> Vec<AnnotatedForm> {
    let mut forms = Vec::new();
    while let Some(form) = root_verb_surface_form(
        doc_id,
        root,
        root_gloss,
        cols,
        translation_count,
        has_numeric,
        has_comment,
        has_spacer,
    ) {
        forms.push(form);
    }
    forms
}

/// Build a single verb surface form from the given row.
pub fn root_verb_surface_form(
    doc_id: &str,
    root: &str,
    root_gloss: &str,
    cols: &mut impl Iterator<Item = String>,
    translation_count: usize,
    has_numeric: bool,
    has_comment: bool,
    has_spacer: bool,
) -> Option<AnnotatedForm> {
    use itertools::Itertools as _;

    // Each form has an empty column before it.
    // Then follows the morphemic segmentation.
    // All tags except the last one come before the root.
    let (mut morpheme_tags, phonemic) = all_tags(&mut cols.filter(|x| !x.is_empty()));
    if morpheme_tags.is_empty() {
        return None;
    }
    let asp_morpheme = morpheme_tags.remove(0);
    let mod_morpheme = morpheme_tags.pop()?;
    let mut morphemes = morpheme_tags
        .iter()
        .map(|(_tag, src)| src.trim())
        .chain(vec![root, &asp_morpheme.1, &mod_morpheme.1])
        .filter(|s| !s.is_empty())
        .map(|s| convert_udb(s).to_dailp());
    let morpheme_layer = morphemes.join("-");
    let mut morpheme_glosses = morpheme_tags
        .iter()
        .map(|(tag, _src)| tag.trim().to_owned())
        .chain(vec![root_gloss.to_owned(), asp_morpheme.0, mod_morpheme.0])
        .filter(|s| !s.is_empty());
    let gloss_layer = morpheme_glosses.join("-");
    // Then, the representations of the full word.
    let phonemic = phonemic?;
    let _numeric = if has_numeric {
        cols.next()?
    } else {
        String::new()
    };
    let phonetic = cols.next()?;
    let syllabary = cols.next()?;
    // Finally, up to three translations of the word.
    let mut translations = Vec::new();
    for _ in 0..translation_count {
        let t = cols.next()?;
        if !t.is_empty() {
            translations.push(t);
        }
    }

    let commentary = if has_comment {
        Some(cols.next()?)
    } else {
        None
    };
    if has_spacer {
        cols.next();
    }

    Some(AnnotatedForm {
        index: 0,
        source: syllabary.clone(),
        normalized_source: syllabary,
        simple_phonetics: Some(phonetic),
        phonemic: Some(convert_udb(&phonemic).to_dailp()),
        segments: MorphemeSegment::parse_many(&morpheme_layer, &gloss_layer)?,
        english_gloss: translations,
        commentary,
        line_break: None,
        page_break: None,
        document_id: Some(doc_id.to_owned()),
    })
}

/// Group all the morpheme shapes with their paired glosses, return them along
/// with the phonemic shape of the whole root.
fn all_tags(cols: &mut impl Iterator<Item = String>) -> (Vec<(String, String)>, Option<String>) {
    let mut tags = Vec::new();
    let mut cols = cols.by_ref().peekable();
    // Tags are all uppercase, followed by the corresponding morpheme.
    while let Some(true) = cols
        .peek()
        .map(|x| !x.starts_with(|c: char| c.is_lowercase()) || x.is_empty())
    {
        if let (Some(a), Some(b)) = (cols.next(), cols.next()) {
            if !a.is_empty() || !b.is_empty() {
                tags.push((a, b));
            }
        }
    }
    (tags, cols.next())
}

/// TODO Convert all phonemic representations into the TAOC/DAILP format.
/// TODO Store forms in any format with a tag defining the format so that
/// GraphQL can do the conversion instead of the migration process.
pub fn root_noun_surface_form(
    doc_id: &str,
    root: &str,
    root_gloss: &str,
    cols: &mut impl Iterator<Item = String>,
) -> Option<AnnotatedForm> {
    use itertools::Itertools as _;

    let ppp_tag = cols.next()?;
    let ppp_src = cols.next()?;
    let pp_tag = cols.next()?;
    let pp_src = cols.next()?;
    let phonemic = cols.next()?;
    let _numeric = cols.next()?;
    let phonetic = cols.next()?;
    let syllabary = cols.next()?;
    let translations = cols.take(3).filter(|s| !s.is_empty());

    let mut morphemes = vec![&ppp_src as &str, &pp_src as &str, root]
        .into_iter()
        .map(|s| s.trim())
        .filter(|s| !s.is_empty())
        .map(|s| convert_udb(s).to_dailp());
    let morpheme_layer = morphemes.join("-");
    let mut glosses = vec![ppp_tag, pp_tag, root_gloss.to_owned()]
        .into_iter()
        .map(|s| s.trim().to_owned())
        .filter(|s| !s.is_empty());
    let gloss_layer = glosses.join("-");

    Some(AnnotatedForm {
        index: 0,
        source: syllabary.clone(),
        normalized_source: syllabary,
        simple_phonetics: Some(phonetic),
        phonemic: Some(convert_udb(&phonemic).to_dailp()),
        segments: MorphemeSegment::parse_many(&morpheme_layer, &gloss_layer)?,
        english_gloss: translations.collect(),
        commentary: None,
        line_break: None,
        page_break: None,
        document_id: Some(doc_id.to_owned()),
    })
}

/// Converts a given phonemic string from the Uchihara representation to the
/// DAILP representation.
/// For example: "a:!" => "áá"
pub fn convert_udb(input: &str) -> PhonemicString {
    // UDB represents glottal stops with the single quote.
    // TODO Move this to the output conversion step.
    let input = input.replace("'", "ʔ");
    let pat = regex::Regex::new("([^aeiouv]*)([aeiouv]:?)([!*`^\"])?").unwrap();
    let mut syllables = Vec::new();
    for caps in pat.captures_iter(&input) {
        let consonant = &caps[1];
        syllables.push(PhonemicString::Consonant(consonant.to_owned()));
        let vowel = &caps[2];
        let is_long = vowel.ends_with(":");
        let accent = caps.get(3).map(|x| x.as_str()).unwrap_or("");
        let vowel_type = match accent {
            "" => {
                if is_long {
                    VowelType::LongLow
                } else {
                    VowelType::ShortLow
                }
            }
            "!" => {
                if is_long {
                    VowelType::LongHigh
                } else {
                    VowelType::ShortHigh
                }
            }
            "*" => VowelType::Rising,
            "^" => VowelType::Falling,
            "`" => {
                if is_long {
                    VowelType::Lowfall
                } else {
                    VowelType::ShortLowfall
                }
            }
            "\"" => {
                if is_long {
                    VowelType::Superhigh
                } else {
                    VowelType::ShortSuperhigh
                }
            }
            _ => unreachable!("Undefined accent."),
        };
        syllables.push(PhonemicString::Vowel(vowel[..1].to_owned(), vowel_type));
    }

    if syllables.is_empty() {
        PhonemicString::Consonant(input)
    } else {
        PhonemicString::Form(syllables)
    }
}

pub enum PhonemicString {
    Form(Vec<PhonemicString>),
    /// For example, "hn"
    Consonant(String),
    /// For example, "a:!"
    Vowel(String, VowelType),
}
impl PhonemicString {
    pub fn to_dailp(self) -> String {
        use itertools::Itertools;
        match self {
            PhonemicString::Form(all) => all.into_iter().map(|x| x.to_dailp()).join(""),
            PhonemicString::Consonant(s) => s,
            PhonemicString::Vowel(v, ty) => match ty {
                VowelType::ShortLow => v,
                VowelType::ShortHigh => format!("{}\u{0301}", v),
                VowelType::ShortLowfall => format!("{}\u{0300}", v),
                VowelType::ShortSuperhigh => format!("{}\u{030B}", v),
                VowelType::LongLow => format!("{}{}", v, v),
                VowelType::LongHigh => format!("{}\u{0301}{}\u{0301}", v, v),
                VowelType::Rising => format!("{}{}\u{0301}", v, v),
                VowelType::Falling => format!("{}\u{0301}{}", v, v),
                VowelType::Lowfall => format!("{}\u{0300}{}\u{0300}", v, v),
                VowelType::Superhigh => format!("{}{}\u{030B}", v, v),
            },
        }
    }
}

pub enum VowelType {
    ShortLow,
    ShortHigh,
    ShortLowfall,
    ShortSuperhigh,
    LongLow,
    LongHigh,
    Rising,
    Falling,
    Lowfall,
    Superhigh,
}
