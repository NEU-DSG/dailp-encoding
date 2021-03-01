use crate::{AnnotatedForm, Date, MorphemeSegment};
use serde::{Deserialize, Serialize};

/// The reference position within a document of one specific form
#[derive(Clone, Serialize, Deserialize, Debug, PartialEq, Eq)]
pub struct PositionInDocument {
    pub document_id: String,
    pub page_number: String,
    pub index: i32,
}
impl PositionInDocument {
    pub fn new(document_id: String, page_number: String, index: i32) -> Self {
        Self {
            document_id,
            page_number,
            index,
        }
    }
}

impl PositionInDocument {
    pub fn make_id(&self, gloss: &str, use_index: bool) -> String {
        if use_index {
            format!("{}.{}:{}", self.document_id, self.index, gloss)
        } else {
            format!("{}:{}", self.document_id, gloss)
        }
    }

    /// Converts the input into a suitable ID format by stripping whitespace and
    /// punctuation before putting the document ID before it.
    pub fn make_raw_id(&self, raw_gloss: &str, use_index: bool) -> String {
        use itertools::Itertools as _;
        // Remove punctuation all together.
        let gloss = raw_gloss.replace(&[',', '+', '(', ')', '[', ']'] as &[char], "");
        // Replace whitespace with dots.
        let gloss = gloss.split_whitespace().join(".");
        self.make_id(&gloss, use_index)
    }

    pub fn make_form_id(&self, segments: &[MorphemeSegment]) -> String {
        format!(
            "{}.{}:{}",
            self.document_id,
            self.index,
            MorphemeSegment::gloss_layer(segments)
        )
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
        format!("{}.{}", self.document_id, self.index)
    }

    /// Unique identifier of the source document
    async fn document_id(&self) -> &str {
        &self.document_id
    }

    /// 1-indexed page number
    async fn page_number(&self) -> &str {
        &self.page_number
    }

    /// 1-indexed position indicating where the form sits in the ordering of all
    /// forms in the document. Used for relative ordering of forms from the
    /// same document.
    async fn index(&self) -> i32 {
        self.index
    }
}

/// A connection between two lexical entries from the same or different sources
#[derive(Serialize, Deserialize)]
pub struct LexicalConnection {
    #[serde(rename = "_id")]
    pub id: String,
    pub links: Vec<MorphemeId>,
}
impl LexicalConnection {
    pub fn new(from: MorphemeId, to: MorphemeId) -> Self {
        Self {
            id: format!("{}-{}", from, to),
            links: vec![from, to],
        }
    }
    pub fn parse(from: &str, to: &str) -> Option<Self> {
        let from = MorphemeId::parse(from)?;
        let to = MorphemeId::parse(to)?;
        Some(Self::new(from, to))
    }
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq, Hash)]
pub struct MorphemeId {
    pub document_id: Option<String>,
    pub gloss: String,
    pub index: Option<i32>,
}
impl MorphemeId {
    pub fn new(document_id: Option<String>, index: Option<i32>, gloss: String) -> Self {
        Self {
            document_id,
            index,
            gloss,
        }
    }
    pub fn parse(input: &str) -> Option<Self> {
        // Trim any potential whitespace from the edges.
        let input = input.trim();
        // Toss out anything with a newline in it, because it's probably garbage.
        if input.contains('\n') {
            return None;
        }
        // Split by colon.
        let mut parts: Vec<_> = input.splitn(2, ':').collect();
        let gloss = parts.pop()?;
        let (document_id, index) = if let Some(x) = parts.pop() {
            // Check for an index after the document ID, like "DF1975.23"
            let mut parts = x.splitn(2, '.');
            (parts.next(), parts.next())
        } else {
            (None, None)
        };
        Some(Self {
            document_id: document_id.map(str::to_owned),
            gloss: gloss.to_owned(),
            index: index.and_then(|i| i.parse().ok()),
        })
    }
}
impl std::fmt::Display for MorphemeId {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        if let Some(index) = &self.index {
            write!(
                f,
                "{}.{}:{}",
                self.document_id.as_ref().unwrap(),
                index,
                self.gloss
            )
        } else if let Some(doc_id) = &self.document_id {
            write!(f, "{}:{}", doc_id, self.gloss)
        } else {
            write!(f, "{}", self.gloss)
        }
    }
}

pub fn seg_verb_surface_forms(
    position: &PositionInDocument,
    date: &Date,
    cols: &mut impl Iterator<Item = String>,
    translation_count: usize,
    has_numeric: bool,
    has_comment: bool,
) -> Vec<AnnotatedForm> {
    let mut forms = Vec::new();
    while let Some(form) = seg_verb_surface_form(
        position.clone(),
        date,
        cols,
        translation_count,
        has_numeric,
        has_comment,
    ) {
        forms.push(form);
    }
    forms
}

pub fn seg_verb_surface_form(
    position: PositionInDocument,
    date: &Date,
    cols: &mut impl Iterator<Item = String>,
    translation_count: usize,
    has_numeric: bool,
    has_comment: bool,
) -> Option<AnnotatedForm> {
    // Skip empty cells until we find a form.
    let mut morpheme_layer = cols.next()?;
    while morpheme_layer.is_empty() {
        morpheme_layer = cols.next()?;
    }
    let gloss_layer = cols.next().filter(|s| !s.is_empty())?;

    // Then, the representations of the full word.
    let phonemic = cols.next().filter(|s| !s.is_empty())?;
    let _numeric = if has_numeric { cols.next() } else { None };
    let phonetic = cols.next().filter(|s| !s.is_empty())?;
    let syllabary = cols.next().filter(|s| !s.is_empty())?;

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

    let segments = MorphemeSegment::parse_many(&morpheme_layer, &gloss_layer)?;

    Some(AnnotatedForm {
        id: position.make_form_id(&segments),
        position,
        source: syllabary,
        normalized_source: None,
        simple_phonetics: Some(phonetic),
        phonemic: Some(convert_udb(&phonemic).into_dailp()),
        segments: Some(segments),
        english_gloss: translations,
        commentary,
        line_break: None,
        page_break: None,
        date_recorded: Some(date.clone()),
    })
}

/// Gather many verb surface forms from the given row.
pub fn root_verb_surface_forms(
    position: &PositionInDocument,
    date: &Date,
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
        position,
        date,
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
    position: &PositionInDocument,
    date: &Date,
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
        .map(|s| convert_udb(s).into_dailp());
    let morpheme_layer = morphemes.join("-");
    let mut morpheme_glosses = morpheme_tags
        .iter()
        .map(|(tag, _src)| tag.trim())
        .chain(vec![root_gloss, &*asp_morpheme.0, &*mod_morpheme.0])
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

    let segments = MorphemeSegment::parse_many(&morpheme_layer, &gloss_layer)?;

    Some(AnnotatedForm {
        id: position.make_form_id(&segments),
        position: position.clone(),
        source: syllabary,
        normalized_source: None,
        simple_phonetics: Some(phonetic),
        phonemic: Some(convert_udb(&phonemic).into_dailp()),
        segments: Some(segments),
        english_gloss: translations,
        commentary,
        line_break: None,
        page_break: None,
        date_recorded: Some(date.clone()),
    })
}

/// Group all the morpheme shapes with their paired glosses, return them along
/// with the phonemic shape of the whole root.
fn all_tags(cols: &mut impl Iterator<Item = String>) -> (Vec<(String, String)>, Option<String>) {
    let mut tags = Vec::new();
    let mut cols = cols.by_ref().peekable();
    // Tags are all uppercase ascii and numbers, followed by the corresponding morpheme.
    while let Some(true) = cols
        .peek()
        .map(|x| x.starts_with(|c: char| c.is_ascii_uppercase() || c.is_numeric()) || x.is_empty())
    {
        if let (Some(a), Some(b)) = (cols.next(), cols.next()) {
            if !a.is_empty() || !b.is_empty() {
                tags.push((a, b));
            }
        }
    }
    (tags, cols.next())
}

pub fn root_noun_surface_forms(
    position: &PositionInDocument,
    date: &Date,
    cols: &mut impl Iterator<Item = String>,
    has_comment: bool,
) -> Vec<AnnotatedForm> {
    let mut result = Vec::new();
    while let Some(form) = root_noun_surface_form(position, date, cols, has_comment) {
        result.push(form);
    }
    result
}

/// TODO Convert all phonemic representations into the TAOC/DAILP format.
/// TODO Store forms in any format with a tag defining the format so that
/// GraphQL can do the conversion instead of the migration process.
pub fn root_noun_surface_form(
    position: &PositionInDocument,
    date: &Date,
    cols: &mut impl Iterator<Item = String>,
    has_comment: bool,
) -> Option<AnnotatedForm> {
    let mut morpheme_layer = cols.next()?;
    while morpheme_layer.is_empty() {
        morpheme_layer = cols.next()?;
    }
    let gloss_layer = cols.next()?;
    let phonemic = cols.next()?;
    let _numeric = cols.next()?;
    let phonetic = cols.next()?;
    let syllabary = cols.next()?;
    let mut translations = Vec::new();
    for _ in 0..3 {
        if let Some(s) = cols.next() {
            if !s.is_empty() {
                translations.push(s);
            }
        }
    }
    let commentary = if has_comment { cols.next() } else { None };
    let segments = MorphemeSegment::parse_many(&morpheme_layer, &gloss_layer)?;
    let id = position.make_form_id(&segments);

    Some(AnnotatedForm {
        id,
        position: position.clone(),
        source: syllabary,
        normalized_source: None,
        simple_phonetics: Some(phonetic),
        phonemic: Some(convert_udb(&phonemic).into_dailp()),
        segments: Some(segments),
        english_gloss: translations,
        commentary,
        line_break: None,
        page_break: None,
        date_recorded: Some(date.clone()),
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
        let is_long = vowel.ends_with(':');
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

/// Storage format for Cherokee phonetics.
/// Consonants: t/th in storage, converted to d/t on output.
/// Vowels: struct-defined
#[derive(Debug)]
pub enum PhonemicString {
    Form(Vec<PhonemicString>),
    /// For example, "hn"
    Consonant(String),
    /// For example, "a:!"
    Vowel(String, VowelType),
}
impl PhonemicString {
    pub fn parse_dailp(input: &str) -> Self {
        use {
            lazy_static::lazy_static, maplit::hashmap, std::collections::HashMap,
            unicode_normalization::UnicodeNormalization,
        };
        lazy_static! {
            static ref SHORT_VOWELS: HashMap<&'static str, (&'static str, VowelType)> = hashmap! {
                "a" => ("a", VowelType::ShortLow),
                "á" => ("a", VowelType::ShortHigh),
                "à" => ("a", VowelType::ShortLowfall),
                "a̋" => ("a", VowelType::ShortSuperhigh),
                "e" => ("e", VowelType::ShortLow),
                "é" => ("e", VowelType::ShortHigh),
                "è" => ("e", VowelType::ShortLowfall),
                "e̋" => ("e", VowelType::ShortSuperhigh),
                "i" => ("i", VowelType::ShortLow),
                "í" => ("i", VowelType::ShortHigh),
                "ì" => ("i", VowelType::ShortLowfall),
                "i̋" => ("i", VowelType::ShortSuperhigh),
                "o" => ("o", VowelType::ShortLow),
                "ó" => ("o", VowelType::ShortHigh),
                "ò" => ("o", VowelType::ShortLowfall),
                "ő" => ("o", VowelType::ShortSuperhigh),
                "u" => ("u", VowelType::ShortLow),
                "ú" => ("u", VowelType::ShortHigh),
                "ù" => ("u", VowelType::ShortLowfall),
                "ű" => ("u", VowelType::ShortSuperhigh),
                "v" => ("v", VowelType::ShortLow),
                "v́" => ("v", VowelType::ShortHigh),
                "v̀" => ("v", VowelType::ShortLowfall),
                "v̋" => ("v", VowelType::ShortSuperhigh),
            };
            static ref LONG_VOWELS: HashMap<&'static str, (&'static str, VowelType)> = hashmap! {
                "aa" => ("a", VowelType::LongLow),
                "áá" => ("a", VowelType::LongHigh),
                "aá" => ("a", VowelType::Rising),
                "áa" => ("a", VowelType::Falling),
                "àà" => ("a", VowelType::Lowfall),
                "aa̋" => ("a", VowelType::Superhigh),
                "ee" => ("e", VowelType::LongLow),
                "éé" => ("e", VowelType::LongHigh),
                "eé" => ("e", VowelType::Rising),
                "ée" => ("e", VowelType::Falling),
                "èè" => ("e", VowelType::Lowfall),
                "ee̋" => ("e", VowelType::Superhigh),
                "ii" => ("i", VowelType::LongLow),
                "íí" => ("i", VowelType::LongHigh),
                "ií" => ("i", VowelType::Rising),
                "íi" => ("i", VowelType::Falling),
                "ìì" => ("i", VowelType::Lowfall),
                "ii̋" => ("i", VowelType::Superhigh),
                "oo" => ("o", VowelType::LongLow),
                "óó" => ("o", VowelType::LongHigh),
                "oó" => ("o", VowelType::Rising),
                "óo" => ("o", VowelType::Falling),
                "òò" => ("o", VowelType::Lowfall),
                "oő" => ("o", VowelType::Superhigh),
                "uu" => ("u", VowelType::LongLow),
                "úú" => ("u", VowelType::LongHigh),
                "uú" => ("u", VowelType::Rising),
                "úu" => ("u", VowelType::Falling),
                "ùù" => ("u", VowelType::Lowfall),
                "uű" => ("u", VowelType::Superhigh),
                "vv" => ("v", VowelType::LongLow),
                "v́v́" => ("v", VowelType::LongHigh),
                "vv́" => ("v", VowelType::Rising),
                "v́v" => ("v", VowelType::Falling),
                "v̀v̀" => ("v", VowelType::Lowfall),
                "vv̋" => ("v", VowelType::Superhigh),
            };
            static ref PAT: regex::Regex = {
                // NOTE This contains the list of acceptable consonants and symbols.
                let consonants = "1-9tdkghcjmnswrylq'ʔØ\\(\\)\\.\\-=:?";
                regex::Regex::new(&format!(
                    "([{}]+)?([^{}]+)?",
                    consonants, consonants
                )).unwrap()
            };
        }

        let mut syllables = Vec::new();
        let mut input = input.nfc().to_string();
        input.make_ascii_lowercase();
        for caps in PAT.captures_iter(&input) {
            if let Some(consonant) = caps.get(1) {
                syllables.push(PhonemicString::Consonant(consonant.as_str().to_owned()));
            }

            if let Some(vowel_one) = caps.get(2) {
                let vowel_one = vowel_one.as_str();
                if let Some(e) = LONG_VOWELS
                    .get(vowel_one)
                    .or_else(|| SHORT_VOWELS.get(vowel_one))
                {
                    syllables.push(PhonemicString::Vowel(e.0.to_owned(), e.1));
                } else {
                    syllables.push(PhonemicString::Consonant(vowel_one.to_owned()));
                }
            }
        }

        if syllables.is_empty() {
            PhonemicString::Consonant(input)
        } else {
            PhonemicString::Form(syllables)
        }
    }
    pub fn parse_crg(input: &str) -> Self {
        use {
            lazy_static::lazy_static, maplit::hashmap, std::collections::HashMap,
            unicode_normalization::UnicodeNormalization,
        };
        lazy_static! {
            static ref SHORT_VOWELS: HashMap<&'static str, (&'static str, VowelType)> = hashmap! {
                "a" => ("a", VowelType::ShortLow),
                "á" => ("a", VowelType::ShortHigh),
                "à" => ("a", VowelType::ShortLowfall),
                "a̋" => ("a", VowelType::ShortSuperhigh),
                "e" => ("e", VowelType::ShortLow),
                "é" => ("e", VowelType::ShortHigh),
                "è" => ("e", VowelType::ShortLowfall),
                "e̋" => ("e", VowelType::ShortSuperhigh),
                "i" => ("i", VowelType::ShortLow),
                "í" => ("i", VowelType::ShortHigh),
                "ì" => ("i", VowelType::ShortLowfall),
                "i̋" => ("i", VowelType::ShortSuperhigh),
                "o" => ("o", VowelType::ShortLow),
                "ó" => ("o", VowelType::ShortHigh),
                "ò" => ("o", VowelType::ShortLowfall),
                "ő" => ("o", VowelType::ShortSuperhigh),
                "u" => ("u", VowelType::ShortLow),
                "ú" => ("u", VowelType::ShortHigh),
                "ù" => ("u", VowelType::ShortLowfall),
                "ű" => ("u", VowelType::ShortSuperhigh),
                "v" => ("v", VowelType::ShortLow),
                "v́" => ("v", VowelType::ShortHigh),
                "v̀" => ("v", VowelType::ShortLowfall),
                "v̋" => ("v", VowelType::ShortSuperhigh),
            };
            static ref LONG_VOWELS: HashMap<&'static str, (&'static str, VowelType)> = hashmap! {
                "aa" => ("a", VowelType::LongLow),
                "áá" => ("a", VowelType::LongHigh),
                "aá" => ("a", VowelType::Rising),
                "áa" => ("a", VowelType::Falling),
                "àà" => ("a", VowelType::Lowfall),
                "aa̋" => ("a", VowelType::Superhigh),
                "ee" => ("e", VowelType::LongLow),
                "éé" => ("e", VowelType::LongHigh),
                "eé" => ("e", VowelType::Rising),
                "ée" => ("e", VowelType::Falling),
                "èè" => ("e", VowelType::Lowfall),
                "ee̋" => ("e", VowelType::Superhigh),
                "ii" => ("i", VowelType::LongLow),
                "íí" => ("i", VowelType::LongHigh),
                "ií" => ("i", VowelType::Rising),
                "íi" => ("i", VowelType::Falling),
                "ìì" => ("i", VowelType::Lowfall),
                "ii̋" => ("i", VowelType::Superhigh),
                "oo" => ("o", VowelType::LongLow),
                "óó" => ("o", VowelType::LongHigh),
                "oó" => ("o", VowelType::Rising),
                "óo" => ("o", VowelType::Falling),
                "òò" => ("o", VowelType::Lowfall),
                "oő" => ("o", VowelType::Superhigh),
                "uu" => ("u", VowelType::LongLow),
                "úú" => ("u", VowelType::LongHigh),
                "uú" => ("u", VowelType::Rising),
                "úu" => ("u", VowelType::Falling),
                "ùù" => ("u", VowelType::Lowfall),
                "uű" => ("u", VowelType::Superhigh),
                "vv" => ("v", VowelType::LongLow),
                "v́v́" => ("v", VowelType::LongHigh),
                "vv́" => ("v", VowelType::Rising),
                "v́v" => ("v", VowelType::Falling),
                "v̀v̀" => ("v", VowelType::Lowfall),
                "vv̋" => ("v", VowelType::Superhigh),
            };
            static ref PAT: regex::Regex = {
                // NOTE This contains the list of acceptable consonants and symbols.
                let consonants = "1-9tdkghcjmnswrylq'ʔØ\\(\\)\\.\\-=:?";
                regex::Regex::new(&format!(
                    "([{}]+)?([^{}]+)?",
                    consonants, consonants
                )).unwrap()
            };
        }

        let mut syllables = Vec::new();
        let mut input = input.nfc().to_string();
        input.make_ascii_lowercase();
        for caps in PAT.captures_iter(&input) {
            if let Some(consonant) = caps.get(1) {
                syllables.push(PhonemicString::Consonant(dt_to_tth(
                    consonant.as_str(),
                    true,
                    None,
                )));
            }

            if let Some(vowel_one) = caps.get(2) {
                let vowel_one = vowel_one.as_str();
                if let Some(e) = LONG_VOWELS
                    .get(vowel_one)
                    .or_else(|| SHORT_VOWELS.get(vowel_one))
                {
                    syllables.push(PhonemicString::Vowel(e.0.to_owned(), e.1));
                } else {
                    syllables.push(PhonemicString::Consonant(dt_to_tth(vowel_one, true, None)));
                }
            }
        }

        if syllables.is_empty() {
            PhonemicString::Consonant(input)
        } else {
            PhonemicString::Form(syllables)
        }
    }

    pub fn into_dailp(self) -> String {
        use {itertools::Itertools, unicode_normalization::UnicodeNormalization};
        match self {
            PhonemicString::Form(all) => all
                .into_iter()
                .map(|x| x.into_dailp())
                .join("")
                .nfc()
                .to_string(),
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

    pub fn into_crg(self) -> String {
        use {itertools::Itertools, unicode_normalization::UnicodeNormalization, VowelType::*};
        match self {
            PhonemicString::Form(all) => all
                .into_iter()
                // Join all decomposed unicode.
                .map(|x| x.into_crg())
                .join("")
                .nfc()
                .to_string(),
            PhonemicString::Consonant(s) => tth_to_dt(&s, true, Some("xx")),
            PhonemicString::Vowel(v, ty) => match ty {
                // Short vowels in CRG match TAOC.
                ShortLow => v,
                ShortHigh | ShortSuperhigh => format!("{}\u{0301}", v),
                ShortLowfall => format!("{}\u{0300}", v),
                // The long vowels are slightly different.
                LongLow => format!("{}{}", v, v),
                LongHigh => format!("{}\u{0301}{}", v, v),
                Rising => format!("{}{}\u{0301}", v, v),
                Falling => format!("{}\u{0301}{}\u{0300}", v, v),
                Lowfall => format!("{}{}\u{0300}", v, v),
                Superhigh => format!("{}\u{0301}{}\u{0301}", v, v),
            },
        }
    }

    /// Simplify all vowels by stripping out tone and length.
    /// Convert t/th consonants to the d/t representation with apostrophe for
    /// the glottal stop.
    pub fn into_learner(self) -> String {
        use itertools::Itertools;
        match self {
            PhonemicString::Form(all) => all.into_iter().map(|x| x.into_learner()).join(""),
            PhonemicString::Consonant(s) => tth_to_dt(&s, false, Some("")),
            PhonemicString::Vowel(v, _ty) => v,
        }
    }
}

fn dt_to_tth(input: &str, keep_glottal_stops: bool, replace_colons: Option<&str>) -> String {
    use {
        lazy_static::lazy_static,
        regex::{Captures, Regex},
    };
    // Convert the t/th consonants to d/t
    lazy_static! {
        static ref DT_PATTERN: Regex = Regex::new(r"(ts|ks|tl|kw|gw|k|t|c|g|d|j|'|ʔ|:)").unwrap();
    }
    let result = DT_PATTERN.replace_all(input, |cap: &Captures| match &cap[0] {
        "tl" => "tlh",
        "kw" => "kwh",
        "gw" => "kw",
        "k" => "kh",
        "t" => "th",
        "c" => "ch",
        "j" => "c",
        "g" => "k",
        "d" => "t",
        "'" | "ʔ" => {
            if keep_glottal_stops {
                "ʔ"
            } else {
                "'"
            }
        }
        ":" => {
            if let Some(r) = replace_colons {
                r
            } else {
                ":"
            }
        }
        // Any other matches we should leave as-is, retaining for example "ts"
        // and "ks" in the t/th representation.
        "ts" => "ts",
        "ks" => "ks",
        _ => unreachable!(),
    });
    result.into_owned()
}

fn tth_to_dt(input: &str, keep_glottal_stops: bool, replace_colons: Option<&str>) -> String {
    use {
        lazy_static::lazy_static,
        regex::{Captures, Regex},
    };
    // Convert the t/th consonants to d/t
    lazy_static! {
        static ref TTH_PATTERN: Regex =
            Regex::new(r"(qu|ts|ks|tlh|kwh|kw|kh|th|ch|k|t|c|ʔ|:)").unwrap();
    }
    let result = TTH_PATTERN.replace_all(input, |cap: &Captures| match &cap[0] {
        "tlh" => "tl",
        "qu" => "gw",
        "kwh" => "kw",
        "kw" => "gw",
        "kh" => "k",
        "th" => "t",
        "ch" => "ch", // Not sure I've ever seen this segment in data before.
        "k" => "g",
        "t" => "d",
        "c" => "j",
        "ʔ" => {
            if keep_glottal_stops {
                "ʔ"
            } else {
                "'"
            }
        }
        ":" => {
            if let Some(r) = replace_colons {
                r
            } else {
                ":"
            }
        }
        // Any other matches we should leave as-is, retaining for example "ts"
        // and "ks" in the d/t representation.
        "ts" => "j",
        "ks" => "ks",
        _ => unreachable!(),
    });
    result.into_owned()
}

#[derive(Debug, Clone, Copy)]
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn morpheme_id_page_number() {
        let id = MorphemeId::parse("DF2018:55");
        assert_ne!(id, None);
        let id = id.unwrap();
        assert_eq!(id.document_id.as_ref().map(|x| &**x), Some("DF2018"));
        assert_eq!(id.gloss, "55");
    }

    #[test]
    fn morpheme_id_page_range() {
        let id = MorphemeId::parse("IN1861:1-24");
        assert_ne!(id, None);
        let id = id.unwrap();
        assert_eq!(id.document_id.as_ref().map(|x| &**x), Some("IN1861"));
        assert_eq!(id.gloss, "1-24");
    }

    #[test]
    fn morpheme_id_nonsense() {
        let id = MorphemeId::parse(
            "DF2018:33;
DF2018:54",
        );
        assert_eq!(id, None);
    }

    #[test]
    fn morpheme_id_raw() {
        let raw = "as for me (1SG.PRO + CS)";
        let pos = PositionInDocument {
            document_id: "AK1997".to_owned(),
            page_number: "116".to_owned(),
            index: 1,
        };
        assert_eq!(pos.make_raw_id(raw, true), "AK1997.1:as.for.me.1SG.PRO.CS");
        assert_eq!(pos.make_raw_id(raw, false), "AK1997:as.for.me.1SG.PRO.CS");
    }
}
