use crate::*;
use async_graphql::FieldResult;
use serde::{Deserialize, Serialize};

/// A single unit of meaning and its corresponding English gloss.
#[derive(Serialize, Clone, Deserialize, Debug)]
pub struct MorphemeSegment {
    pub morpheme: String,
    pub gloss: String,
    pub followed_by: Option<SegmentType>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub enum SegmentType {
    /// -
    Morpheme,
    /// =
    Clitic,
}

impl MorphemeSegment {
    pub fn new(morpheme: String, gloss: String, followed_by: Option<SegmentType>) -> Self {
        Self {
            morpheme,
            gloss,
            followed_by,
        }
    }

    pub fn parse_many(
        morpheme_layer: &str,
        gloss_layer: &str,
        document_id: Option<&str>,
    ) -> Option<Vec<Self>> {
        let (_, result) = parse_gloss_layers(morpheme_layer, gloss_layer, document_id).ok()?;
        Some(result)
    }
}

#[async_graphql::Object(cache_control(max_age = 60))]
impl MorphemeSegment {
    /// Phonemic representation of the morpheme
    async fn morpheme(&self, system: Option<CherokeeOrthography>) -> String {
        match system {
            Some(CherokeeOrthography::Dt) => convert_tth_to_dt(&self.morpheme, false),
            _ => self.morpheme.clone(),
        }
    }

    /// English gloss for display
    async fn display_gloss(&self, context: &async_graphql::Context<'_>) -> FieldResult<String> {
        Ok(context
            .data::<Database>()?
            .lexical_entry(&self.gloss)
            .await?
            .and_then(|entry| entry.form.english_gloss.get(0).map(|x| x.clone()))
            .unwrap_or_else(|| {
                if self.gloss.contains(|c: char| c.is_lowercase()) {
                    self.gloss.splitn(2, ":").last().unwrap().to_owned()
                } else {
                    self.gloss.clone()
                }
            })
            .to_owned())
    }

    /// English gloss in standard DAILP format that refers to a lexical item
    async fn gloss(&self) -> &str {
        &self.gloss
    }

    async fn next_separator(&self) -> Option<&str> {
        use SegmentType::*;
        self.followed_by.as_ref().map(|ty| match ty {
            Morpheme => "-",
            Clitic => "=",
        })
    }

    /// If this morpheme represents a functional tag that we have further
    /// information on, this is the corresponding database entry.
    async fn matching_tag(
        &self,
        context: &async_graphql::Context<'_>,
    ) -> FieldResult<Option<MorphemeTag>> {
        Ok(context
            .data::<Database>()?
            .morpheme_tag(&self.gloss)
            .await
            .ok()
            .flatten())
    }

    /// All lexical entries that share the same gloss text as this morpheme.
    /// This generally works for root morphemes.
    async fn lexical_entry(
        &self,
        context: &async_graphql::Context<'_>,
    ) -> FieldResult<Option<AnnotatedForm>> {
        Ok(context
            .data::<Database>()?
            .lexical_entry(&self.gloss)
            .await?
            .map(|x| x.form))
    }
}

#[derive(async_graphql::Enum, Clone, Copy, Eq, PartialEq)]
enum CherokeeOrthography {
    /// The d/t system for transcribing the Cherokee syllabary.
    /// This orthography is favored by native speakers.
    /// TODO Option for /ts/ instead of /j/
    /// TODO Option for /qu/ instead of /gw/ or /kw/
    Dt,
    /// The t/th system for transcribing the Cherokee syllabary.
    /// This orthography is favored by linguists as it is segmentally more accurate.
    Tth,
}

/// TODO Unit tests!!
fn convert_tth_to_dt(input: &str, keep_glottal_stops: bool) -> String {
    use {
        lazy_static::*,
        regex::{Captures, Regex},
        unicode_normalization::UnicodeNormalization,
    };

    // Strip all unicode diacritics from the string.
    const ACCEPTABLE_NON_ASCII: &str = "ʔØ";
    let input = input
        .nfkd()
        .filter(|c| c.is_ascii() || ACCEPTABLE_NON_ASCII.contains(*c))
        .collect::<String>();

    // Convert t/th to d/t and make all vowels short.
    lazy_static! {
        static ref TTH_PATTERN: Regex = Regex::new(r"(kh|th|k|t|c|ʔ|ii|ee|aa|oo|uu|vv)").unwrap();
    }
    let result = TTH_PATTERN.replace_all(&input, |cap: &Captures| match &cap[0] {
        "ʔ" => {
            if keep_glottal_stops {
                "ʔ"
            } else {
                "'"
            }
        }
        "kh" => "k",
        "th" => "t",
        "k" => "g",
        "t" => "d",
        "c" => "j",
        "ii" => "i",
        "ee" => "e",
        "aa" => "a",
        "oo" => "o",
        "uu" => "u",
        "vv" => "v",
        _ => unreachable!(),
    });
    result.into_owned()
}
