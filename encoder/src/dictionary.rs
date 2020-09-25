use crate::annotation::{AnnotatedWord, MorphemeSegment};
use crate::retrieve::SheetResult;
use crate::structured::Database;
use anyhow::Result;
use futures::future::join_all;
use futures::join;
use itertools::Itertools;
use mongodb::bson;
use regex::Regex;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct DictionaryEntry {
    #[serde(rename = "_id")]
    pub id: String,
    pub root: String,
    pub root_gloss: String,
    pub root_translations: Vec<String>,
    pub surface_forms: Vec<AnnotatedWord>,
    pub year_recorded: i32,
}

pub async fn migrate_dictionaries(db: &Database) -> Result<()> {
    println!("Migrating DF1975 and DF2003 to database...");
    let (df1975, df2003, root_nouns) = join!(
        SheetResult::from_sheet("11ssqdimOQc_hp3Zk8Y55m6DFfKR96OOpclUg5wcGSVE", None),
        SheetResult::from_sheet("18cKXgsfmVhRZ2ud8Cd7YDSHexs1ODHo6fkTPrmnwI1g", None),
        SheetResult::from_sheet("1XuQIKzhGf_mGCH4-bHNBAaQqTAJDNtPbNHjQDhszVRo", None)
    );

    let df1975 = df1975?.into_df1975("DF1975", 1975, true)?;
    let df2003 = df2003?.into_df1975("DF2003", 2003, false)?;
    let root_nouns = root_nouns?.into_nouns("DF1975", 1975)?;

    let dict = db.client.collection("dictionary");
    let entries = df1975.into_iter().chain(df2003).chain(root_nouns);
    join_all(entries.filter_map(|entry| {
        if let bson::Bson::Document(bson_doc) = bson::to_bson(&entry).unwrap() {
            Some(
                dict.update_one(
                    bson::doc! {"_id": entry.id},
                    bson_doc,
                    mongodb::options::UpdateOptions::builder()
                        .upsert(true)
                        .build(),
                ),
            )
        } else {
            None
        }
    }))
    .await;

    Ok(())
}

pub fn root_verb_surface_forms(
    doc_id: &str,
    root: &str,
    root_gloss: &str,
    cols: &mut impl Iterator<Item = String>,
    has_ppp: bool,
) -> Vec<AnnotatedWord> {
    let mut forms = Vec::new();
    while let Some(form) = root_verb_surface_form(doc_id, root, root_gloss, cols, has_ppp) {
        forms.push(form);
    }
    forms
}

fn all_tags(cols: &mut impl Iterator<Item = String>) -> (Vec<(String, String)>, Option<String>) {
    let mut tags = Vec::new();
    let mut cols = cols.by_ref().peekable();
    // Tags are all uppercase, followed by the corresponding morpheme.
    while let Some(true) = cols
        .peek()
        .map(|x| x.contains(|c: char| c.is_ascii_uppercase()))
    {
        if let (Some(a), Some(b)) = (cols.next(), cols.next()) {
            tags.push((a, b));
        }
    }
    (tags, cols.next())
}

pub fn root_verb_surface_form(
    doc_id: &str,
    root: &str,
    root_gloss: &str,
    cols: &mut impl Iterator<Item = String>,
    has_ppp: bool,
) -> Option<AnnotatedWord> {
    // Each form has an empty column before it.
    // let _empty = cols.next()?;
    // Then follows the morphemic segmentation.
    // All tags except the last one come before the root.
    let (mut morpheme_tags, phonemic) = all_tags(&mut cols.filter(|x| !x.is_empty()));
    let mod_morpheme = morpheme_tags.pop()?;
    let morphemes = morpheme_tags
        .iter()
        .map(|(_tag, src)| src.trim())
        .chain(vec![root, &mod_morpheme.1])
        .filter(|s| !s.is_empty())
        .map(|s| convert_udb(s).to_dailp());
    let morpheme_glosses = morpheme_tags
        .iter()
        .map(|(tag, _src)| tag.trim().to_owned())
        .chain(vec![root_gloss.to_owned(), mod_morpheme.0])
        .filter(|s| !s.is_empty());
    // Then, the representations of the full word.
    let phonemic = phonemic?;
    let _numeric = if has_ppp { cols.next()? } else { String::new() };
    let phonetic = cols.next()?;
    let syllabary = cols.next()?;
    // Finally, up to three translations of the word.
    let translations = if has_ppp {
        cols.take(3).filter(|s| !s.is_empty()).collect()
    } else {
        vec![cols.next()?]
    };

    Some(AnnotatedWord {
        index: 0,
        source: syllabary.clone(),
        normalized_source: syllabary,
        simple_phonetics: Some(phonetic),
        phonemic: Some(convert_udb(&phonemic).to_dailp()),
        segmentation: morphemes
            .zip(morpheme_glosses)
            .map(|(m, g)| MorphemeSegment::new(m, g))
            .collect(),
        english_gloss: translations,
        commentary: None,
        line_break: None,
        page_break: None,
        document_id: Some(doc_id.to_owned()),
    })
}

/// TODO Convert all phonemic representations into the TAOC/DAILP format.
/// TODO Store forms in any format with a tag defining the format so that
/// GraphQL can do the conversion instead of the migration process.
pub fn root_noun_surface_form(
    root: &str,
    root_gloss: &str,
    cols: &mut impl Iterator<Item = String>,
) -> Option<AnnotatedWord> {
    let ppp_tag = cols.next()?;
    let ppp_src = cols.next()?;
    let pp_tag = cols.next()?;
    let pp_src = cols.next()?;
    let phonemic = cols.next()?;
    let _numeric = cols.next()?;
    let phonetic = cols.next()?;
    let syllabary = cols.next()?;
    let translations = cols.take(3).filter(|s| !s.is_empty());

    let morphemes = vec![&ppp_src as &str, &pp_src as &str, root]
        .into_iter()
        .map(|s| s.trim())
        .filter(|s| !s.is_empty())
        .map(|s| convert_udb(s).to_dailp());
    let glosses = vec![ppp_tag, pp_tag, root_gloss.to_owned()]
        .into_iter()
        .map(|s| s.trim().to_owned())
        .filter(|s| !s.is_empty());

    Some(AnnotatedWord {
        index: 0,
        source: syllabary.clone(),
        normalized_source: syllabary,
        simple_phonetics: Some(phonetic),
        phonemic: Some(convert_udb(&phonemic).to_dailp()),
        segmentation: morphemes
            .zip(glosses)
            .map(|(m, g)| MorphemeSegment::new(m, g))
            .collect(),
        english_gloss: translations.collect(),
        commentary: None,
        line_break: None,
        page_break: None,
        document_id: None,
    })
}

/// Converts a given phonemic string from the Uchihara representation to the
/// DAILP representation.
/// For example: "a:!" => "áá"
pub fn convert_udb(input: &str) -> PhonemicString {
    // UDB represents glottal stops with the single quote.
    // TODO Move this to the output conversion step.
    let input = input.replace("'", "ʔ");
    let pat = Regex::new("([^aeiouv]*)([aeiouv]:?)([!*`^\"])?").unwrap();
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
