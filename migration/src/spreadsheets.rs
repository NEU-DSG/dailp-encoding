//! This module handles the retrieval of data from Google Drive Spreadsheets and
//! transforming that data into a usable format based on the data types
//! specified in modules under `dailp`.

use crate::translations::DocResult;
use anyhow::Result;
use dailp::{
    convert_udb, root_noun_surface_forms, root_verb_surface_forms, AnnotatedDoc, AnnotatedForm,
    AnnotatedPhrase, AnnotatedSeg, BlockType, Contributor, DateTime, DocumentMetadata,
    LexicalConnection, LineBreak, MorphemeId, MorphemeSegment, PageBreak,
};
use dailp::{PositionInDocument, SourceAttribution};
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, fs::File, io::Write, time::Duration};

// Define the delimiters used in spreadsheets for marking phrases, blocks,
// lines, and pages.
const PHRASE_START: &str = "[";
const PHRASE_END: &str = "]";
const LINE_BREAK: &str = "\\";
const PAGE_BREAK: &str = "\\\\";
const BLOCK_START: &str = "{";
const BLOCK_END: &str = "}";
const OUTPUT_DIR: &str = "../xml";

pub struct LexicalEntryWithForms {
    pub entry: AnnotatedForm,
    pub forms: Vec<AnnotatedForm>,
}

/// Converts a set of annotated documents into our preferred access format, then
/// pushes that data into the underlying database.
/// Existing versions of these documents are overwritten with the new data.
pub async fn migrate_documents_to_db(
    docs: &[(AnnotatedDoc, Vec<LexicalConnection>)],
) -> Result<()> {
    // Write the contents of each document to our database.

    crate::update_document(docs.iter().map(|(d, _)| d)).await?;
    crate::update_connection(docs.iter().flat_map(|(_, r)| r)).await?;

    Ok(())
}

/// Takes an unprocessed document with metadata, passing it through our TEI
/// template to produce an xml document named like the given title.
pub fn write_to_file(doc: &AnnotatedDoc) -> Result<()> {
    let mut tera = tera::Tera::new("*.tera.xml")?;
    let file_name = format!("{}/{}.xml", OUTPUT_DIR, doc.meta.id);
    println!("writing to {}", file_name);
    tera.register_filter("convert_breaks", convert_breaks);
    let contents = tera.render("template.tera.xml", &tera::Context::from_serialize(doc)?)?;
    // Make sure the output folder exists.
    std::fs::create_dir_all(OUTPUT_DIR)?;
    let mut f = File::create(file_name)?;
    f.write(contents.as_bytes())?;
    Ok(())
}

/// Result obtained directly from the raw Google sheet.
#[derive(Debug, Serialize, Deserialize)]
pub struct SheetResult {
    /// Each element here represents one row.
    /// Semantic lines in our documents are delimited by empty rows.
    /// The line number sits in the first cell of the first row of each semantic line.
    pub values: Vec<Vec<String>>,
}

impl SheetResult {
    pub async fn from_sheet(sheet_id: &str, sheet_name: Option<&str>) -> Result<Self> {
        use futures_retry::{FutureRetry, RetryPolicy};
        let mut tries = 0;
        let (t, _attempt) = FutureRetry::new(
            || Self::from_sheet_weak(sheet_id, sheet_name.clone()),
            |e| {
                // Try up to five times before giving up.
                if tries > 5 {
                    RetryPolicy::<anyhow::Error>::ForwardError(e)
                } else {
                    tries += 1;
                    println!("Retrying for the {}th time...", tries);
                    RetryPolicy::<anyhow::Error>::WaitRetry(Duration::from_millis(2500))
                }
            },
        )
        .await
        .map_err(|(e, _attempts)| e)?;
        Ok(t)
    }
    async fn from_sheet_weak(sheet_id: &str, sheet_name: Option<&str>) -> Result<Self> {
        let api_key = std::env::var("GOOGLE_API_KEY")?;
        let sheet_name = sheet_name.map_or_else(|| String::new(), |n| format!("{}!", n));
        Ok(reqwest::get(&format!(
            "https://sheets.googleapis.com/v4/spreadsheets/{}/values/{}A1:ZZ?key={}",
            sheet_id, sheet_name, api_key
        ))
        .await?
        .json::<SheetResult>()
        .await?)
    }
    /// Parse a Google Drive file ID from a full link to it.
    fn drive_url_to_id(input: &str) -> &str {
        if let Some(start) = input.find("/d/") {
            // This is, in fact, a file path.
            let start = start + 3;
            let (_, rest) = input.split_at(start);
            let end = rest.find("/").unwrap_or(rest.len());
            rest.split_at(end).0
        } else {
            // This is probably already a bare ID. Anyway, we couldn't parse it.
            input
        }
    }
    /// Parse this sheet as the document index.
    pub fn into_index(self) -> Result<DocumentIndex> {
        Ok(DocumentIndex {
            sheet_ids: self
                .values
                .iter()
                .skip(1)
                .filter(|row| row.len() > 11 && !row[11].is_empty())
                .map(|row| Self::drive_url_to_id(&row[11]).to_owned())
                .collect(),
        })
    }

    pub fn into_adjs(self, doc_id: &str, year: i32) -> Result<Vec<LexicalEntryWithForms>> {
        use chrono::TimeZone as _;
        use rayon::prelude::*;
        Ok(self
            .values
            .into_par_iter()
            // First two rows are simply headers.
            .skip(2)
            .enumerate()
            .filter(|(_idx, cols)| cols.len() > 4 && !cols[1].is_empty())
            // The rest are relevant to the noun itself.
            .filter_map(|(idx, columns)| {
                // The columns are as follows: key, root, root gloss, page ref,
                // category, tags, surface forms.

                // Skip reference numbers for now.
                let mut root_values = columns.into_iter();
                let _key = root_values.next()?;
                let root = root_values.next()?;
                let root_gloss = root_values.next()?;
                // Skip page ref.
                let page_number = root_values.next()?;
                let mut form_values = root_values;
                let date = DateTime::new(chrono::Utc.ymd(year, 1, 1).and_hms(0, 0, 0));
                let position = PositionInDocument {
                    document_id: doc_id.to_owned(),
                    index: idx as i32 + 1,
                    page_number,
                };
                Some(LexicalEntryWithForms {
                    forms: root_verb_surface_forms(
                        &position,
                        &date,
                        &root,
                        &root_gloss,
                        &mut form_values,
                        3,
                        true,
                        true,
                        false,
                    ),
                    entry: AnnotatedForm {
                        id: position.make_id(&root_gloss),
                        normalized_source: None,
                        simple_phonetics: None,
                        phonemic: None,
                        commentary: None,
                        line_break: None,
                        page_break: None,
                        segments: Some(vec![MorphemeSegment::new(
                            convert_udb(&root).to_dailp(),
                            root_gloss.clone(),
                            None,
                        )]),
                        english_gloss: vec![root_gloss],
                        date_recorded: Some(date),
                        source: root,
                        position,
                    },
                })
            })
            .collect())
    }
    pub fn into_nouns(
        self,
        doc_id: &str,
        year: i32,
        after_root: usize,
        has_comment: bool,
    ) -> Result<Vec<LexicalEntryWithForms>> {
        use chrono::TimeZone as _;
        use rayon::prelude::*;
        Ok(self
            .values
            .into_par_iter()
            // First two rows are simply headers.
            .skip(2)
            // The rest are relevant to the noun itself.
            .filter_map(|columns| {
                // The columns are as follows: key, root, root gloss, page ref,
                // category, tags, surface forms.

                if columns.len() > 4 && !columns[1].is_empty() {
                    // Skip reference numbers for now.
                    let mut root_values = columns.into_iter();
                    let index = root_values.next()?.parse().unwrap_or(1);
                    let page_number = root_values.next();
                    let root = root_values.next()?;
                    let root_gloss = root_values.next()?;
                    // Skip page ref and category.
                    let mut form_values = root_values.skip(after_root);
                    let date = DateTime::new(chrono::Utc.ymd(year, 1, 1).and_hms(0, 0, 0));
                    let position = PositionInDocument {
                        document_id: doc_id.to_owned(),
                        index,
                        page_number: page_number?,
                    };
                    Some(LexicalEntryWithForms {
                        forms: root_noun_surface_forms(
                            &position,
                            &date,
                            &mut form_values,
                            has_comment,
                        ),
                        entry: AnnotatedForm {
                            id: position.make_id(&root_gloss),
                            position,
                            normalized_source: None,
                            simple_phonetics: None,
                            phonemic: None,
                            segments: Some(vec![MorphemeSegment::new(
                                convert_udb(&root).to_dailp(),
                                root_gloss.clone(),
                                None,
                            )]),
                            english_gloss: vec![root_gloss],
                            source: root,
                            commentary: None,
                            date_recorded: Some(date),
                            line_break: None,
                            page_break: None,
                        },
                    })
                } else {
                    None
                }
            })
            .collect())
    }

    pub async fn into_references(self, doc_id: &str) -> Vec<dailp::LexicalConnection> {
        self.values
            .into_iter()
            // First column is the name of the field, useless when parsing so we ignore it.
            .skip(1)
            .filter_map(|row| {
                let mut row = row.into_iter();
                Some(dailp::LexicalConnection::new(
                    MorphemeId {
                        document_id: Some(doc_id.to_owned()),
                        gloss: row.next()?,
                        index: None,
                    },
                    MorphemeId::parse(&row.next()?)?,
                ))
            })
            .collect()
    }

    /// Parse this sheet as a document metadata listing.
    pub async fn into_metadata(self, is_reference: bool) -> Result<DocumentMetadata> {
        use chrono::TimeZone as _;

        // Meta order: genre, source, title, source page #, page count, translation
        // First column is the name of the field, useless when parsing so we ignore it.
        let mut values = self.values.into_iter();
        let mut doc_id = values
            .next()
            .ok_or_else(|| anyhow::format_err!("No Document ID"))?;
        let mut genre = values
            .next()
            .ok_or_else(|| anyhow::format_err!("No genre"))?;
        genre.remove(0);
        let mut source = values
            .next()
            .ok_or_else(|| anyhow::format_err!("No source"))?;
        source.remove(0);
        let mut title = values
            .next()
            .ok_or_else(|| anyhow::format_err!("No title"))?;
        let _page_num = values
            .next()
            .ok_or_else(|| anyhow::format_err!("No Page number"))?;
        let _page_count = values
            .next()
            .ok_or_else(|| anyhow::format_err!("No Page Count"))?;
        let mut translations = values
            .next()
            .ok_or_else(|| anyhow::format_err!("No Translations"))?;
        let page_images = values
            .next()
            // Remove the row title.
            .map(|mut x| {
                x.remove(0);
                x
            })
            // Assume no images if the row is missing.
            .unwrap_or_default();
        let date = values.next();
        let person_names = values.next();
        let person_roles = values.next();
        let people = if let (Some(names), Some(roles)) = (person_names, person_roles) {
            names
                .into_iter()
                .skip(1)
                .zip(roles.into_iter().skip(1))
                .map(|(name, role)| Contributor { name, role })
                .collect()
        } else {
            Vec::new()
        };
        let sources = if let (Some(names), Some(links)) = (values.next(), values.next()) {
            names
                .into_iter()
                .skip(1)
                .zip(links.into_iter().skip(1))
                .map(|(name, link)| SourceAttribution { name, link })
                .collect()
        } else {
            Vec::new()
        };

        Ok(DocumentMetadata {
            id: doc_id.remove(1),
            title: title.remove(1),
            sources,
            collection: source.pop().filter(|s| !s.is_empty()),
            contributors: people,
            genre: genre.pop(),
            translation: Some(
                DocResult::new(Self::drive_url_to_id(&translations[1]))
                    .await?
                    .to_translation(),
            ),
            page_images,
            date: date
                .as_ref()
                .and_then(|d| d.get(1))
                .and_then(|s| chrono::Utc.datetime_from_str(s, "%Y-%m-%d %H:%M:%S").ok())
                .map(|d| DateTime::new(d)),
            is_reference,
        })
    }

    /// Parse as an annotation sheet with several lines.
    pub fn split_into_lines(self) -> Vec<SemanticLine> {
        if self.values.len() <= 0 {
            return Vec::new();
        }

        // Firstly, split up groups of rows delimited by an empty row.
        let mut current_result: Vec<Vec<String>> = Vec::new();
        let mut all_lines = Vec::<SemanticLine>::new();
        // The header line is useless in encoding.
        for row in self.values.into_iter().skip(1) {
            // Empty rows mark a line break.
            // Rows starting with one cell containing just "\\" mark a page break.
            // All other rows are part of an annotated line.
            let is_page_break = !row.is_empty() && row[0].starts_with("No Document ID");
            if row.is_empty() || is_page_break {
                if !current_result.is_empty() {
                    all_lines.push(SemanticLine {
                        number: current_result[0][0].clone(),
                        rows: current_result
                            .into_iter()
                            .map(|mut row| {
                                if row.len() > 1 {
                                    row.remove(0);
                                }
                                AnnotationRow {
                                    title: row.remove(0),
                                    items: row,
                                }
                            })
                            .collect(),
                        ends_page: is_page_break,
                    });
                }
                current_result = Vec::new();
            } else {
                current_result.push(row);
            }
        }
        // Add the last line to the output.
        if !current_result.is_empty() {
            all_lines.push(SemanticLine {
                number: current_result[0][0].clone(),
                rows: current_result
                    .into_iter()
                    .map(|mut row| {
                        if row.len() > 1 {
                            row.remove(0);
                        }
                        AnnotationRow {
                            title: row.remove(0),
                            items: row,
                        }
                    })
                    .collect(),
                ends_page: false,
            });
        }
        // Remove trailing empty lines.
        let last_best = all_lines.iter().rposition(|l| !l.is_empty()).unwrap_or(0);
        all_lines.truncate(last_best + 1);
        all_lines
    }
}

#[derive(Debug, Serialize)]
pub struct DocumentIndex {
    pub sheet_ids: Vec<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct AnnotationRow {
    pub title: String,
    pub items: Vec<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct SemanticLine {
    pub number: String,
    pub rows: Vec<AnnotationRow>,
    pub ends_page: bool,
}

impl SemanticLine {
    /// Is this line devoid of any source or annotation information?
    /// Usually indicates that this is an extra line at the end of a document.
    fn is_empty(&self) -> bool {
        self.rows.iter().all(|r| r.items.is_empty())
    }
}

#[derive(Serialize, Deserialize)]
pub struct AnnotatedLine {
    pub words: Vec<AnnotatedForm>,
    ends_page: bool,
}

impl<'a> AnnotatedLine {
    pub fn many_from_semantic(lines: &[SemanticLine], meta: &DocumentMetadata) -> Vec<Self> {
        let mut word_index = 1;
        lines
            .into_iter()
            .map(|line| {
                // Number of words = length of the longest row in this line.
                let num_words = line.rows.iter().map(|row| row.items.len()).max().unwrap();
                // For each word, extract the necessary data from every row.
                let words = (0..num_words)
                    // Only use words with a syllabary source entry.
                    .filter(|i| line.rows.get(0).and_then(|r| r.items.get(*i)).is_some())
                    .map(|i| {
                        let pb = line.rows[0].items[i].find(PAGE_BREAK);
                        let morphemes = line.rows[4].items.get(i);
                        let glosses = line.rows[5].items.get(i);
                        let translation = line.rows[6].items.get(i).map(|x| x.trim().to_owned());
                        let w = AnnotatedForm {
                            // TODO Extract into public function!
                            id: if let Some(gloss) = glosses {
                                format!("{}.{}:{}", meta.id, word_index, gloss)
                            } else if let Some(t) = translation.as_ref() {
                                format!("{}.{}:{}", meta.id, word_index, t)
                            } else {
                                format!("{}.{}", meta.id, word_index)
                            },
                            position: PositionInDocument {
                                document_id: meta.id.clone(),
                                index: word_index,
                                page_number: 1.to_string(),
                            },
                            source: line.rows[0].items[i].trim().replace(LINE_BREAK, ""),
                            normalized_source: None,
                            simple_phonetics: line.rows[2]
                                .items
                                .get(i)
                                .map(|x| x.replace("ʔ", "'")),
                            phonemic: line.rows[3].items.get(i).map(|x| x.to_owned()),
                            segments: if let (Some(m), Some(g)) = (morphemes, glosses) {
                                MorphemeSegment::parse_many(m, g)
                            } else {
                                None
                            },
                            english_gloss: vec![translation]
                                .into_iter()
                                .filter_map(|x| x)
                                .collect(),
                            commentary: line.rows[7].items.get(i).map(|x| x.to_owned()),
                            page_break: pb.map(|i| i as i32),
                            line_break: pb
                                .or_else(|| line.rows[0].items[i].find(LINE_BREAK))
                                .map(|i| i as i32),
                            date_recorded: None,
                        };
                        word_index += 1;
                        w
                    })
                    .collect();
                Self {
                    words,
                    ends_page: line.ends_page,
                }
            })
            .collect()
    }

    pub fn to_segments(
        lines: Vec<Self>,
        document_id: &str,
        date: &Option<DateTime>,
    ) -> Vec<AnnotatedSeg> {
        let mut segments = Vec::<AnnotatedSeg>::new();
        let mut stack = Vec::<AnnotatedPhrase>::new();
        let mut child_segments = Vec::<AnnotatedSeg>::new();
        let mut line_num = 0;
        let mut page_num = 0;
        let mut word_idx = 1;
        let mut seg_idx = 1;
        let mut block_idx = 1;

        // The first page needs a break.
        segments.push(AnnotatedSeg::PageBreak(PageBreak { index: page_num }));

        // Process each line into a series of segments.
        for (line_idx, line) in lines.into_iter().enumerate() {
            // Only add a line break if there wasn't an explicit one mid-word.
            if line_idx == line_num {
                let lb = AnnotatedSeg::LineBreak(LineBreak {
                    index: line_num as i32,
                });
                if let Some(p) = stack.last_mut() {
                    p.parts.push(lb);
                } else {
                    child_segments.push(lb);
                }
                line_num += 1;
            }

            for word in line.words {
                // Give the word an index within the whole document.
                let word = AnnotatedForm {
                    position: PositionInDocument {
                        index: word_idx,
                        document_id: document_id.to_owned(),
                        page_number: page_num.to_string(),
                    },
                    ..word
                };

                // Keep a global word index for the whole document.
                word_idx += 1;

                // Account for mid-word line breaks.
                if word.page_break.is_some() {
                    page_num += 1;
                } else if word.line_break.is_some() {
                    line_num += 1;
                }

                let mut source = &word.source.trim()[..];
                // Check for the start of a block.
                while source.starts_with(BLOCK_START) {
                    source = &source[1..];
                    stack.push(AnnotatedPhrase {
                        ty: BlockType::Block,
                        index: block_idx,
                        parts: child_segments,
                    });
                    child_segments = Vec::new();
                    block_idx += 1;
                }
                // Check for the start of a phrase.
                while source.starts_with(PHRASE_START) {
                    source = &source[1..];
                    stack.push(AnnotatedPhrase {
                        ty: BlockType::Phrase,
                        index: seg_idx,
                        parts: Vec::new(),
                    });
                    seg_idx += 1;
                }
                // Remove all ending brackets from the source.
                let mut blocks_to_pop = 0;
                while source.ends_with(BLOCK_END) {
                    source = &source[..source.len() - 1];
                    blocks_to_pop += 1;
                }
                let mut count_to_pop = 0;
                while source.ends_with(PHRASE_END) {
                    source = &source[..source.len() - 1];
                    count_to_pop += 1;
                }
                // Add the current word to the top phrase or the root document.
                let finished_word = AnnotatedSeg::Word(AnnotatedForm {
                    source: source.to_owned(),
                    line_break: word.line_break.map(|_| line_num as i32),
                    page_break: word.page_break.map(|_| page_num as i32),
                    date_recorded: date.clone(),
                    ..word
                });
                if let Some(p) = stack.last_mut() {
                    p.parts.push(finished_word);
                } else {
                    segments.push(finished_word);
                }
                // Check for the end of phrase(s).
                for _ in 0..count_to_pop {
                    if let Some(p) = stack.pop() {
                        let finished_p = AnnotatedSeg::Block(p);
                        if let Some(top) = stack.last_mut() {
                            top.parts.push(finished_p);
                        } else {
                            segments.push(finished_p);
                        }
                    }
                }
                // Check for the end of blocks.
                for _ in 0..blocks_to_pop {
                    if let Some(p) = stack.pop() {
                        let finished_p = AnnotatedSeg::Block(p);
                        if let Some(top) = stack.last_mut() {
                            top.parts.push(finished_p);
                        } else {
                            segments.push(finished_p);
                        }
                    }
                }
            }
            if line.ends_page {
                page_num += 1;
                segments.push(AnnotatedSeg::PageBreak(PageBreak { index: page_num }));
            }
        }

        while let Some(p) = stack.pop() {
            eprintln!("dangling block!");
            segments.push(AnnotatedSeg::Block(p));
        }
        segments
    }
}

/// Encode all mid-word line breaks as `lb` tags and page breaks as `pb` tags.
pub fn convert_breaks(
    value: &tera::Value,
    context: &HashMap<String, tera::Value>,
) -> tera::Result<tera::Value> {
    if let tera::Value::String(s) = value {
        let pb_tag = context.get("pb").and_then(|page_num| {
            if let tera::Value::Number(num) = page_num {
                Some(format!("<pb n=\"{}\" />", num))
            } else {
                None
            }
        });
        let lb_tag = context.get("lb").and_then(|line_num| {
            if let tera::Value::Number(num) = line_num {
                Some(format!("<lb n=\"{}\" />", num))
            } else {
                None
            }
        });
        let mut replaced = if let Some(pb_tag) = pb_tag {
            s.replace("\\\\", &pb_tag)
        } else {
            s.to_owned()
        };
        replaced = if let Some(lb_tag) = lb_tag {
            replaced.replace("\\", &lb_tag)
        } else {
            replaced
        };
        Ok(tera::Value::String(replaced))
    } else {
        Ok(value.clone())
    }
}

mod tests {
    use super::*;

    #[test]
    fn url_parsing() {
        let url =
            "https://docs.google.com/document/d/13ELP_F95OUUW8exR2KvQzzgtcfO1w_b3wVgPQR8dggo/edit";
        let id = "13ELP_F95OUUW8exR2KvQzzgtcfO1w_b3wVgPQR8dggo";
        assert_eq!(SheetResult::drive_url_to_id(url), id);
        // Raw IDs should remain intact.
        assert_eq!(SheetResult::drive_url_to_id(id), id);
        // URLs without the "/edit" at the end should work too.
        let url = "https://docs.google.com/document/d/13ELP_F95OUUW8exR2KvQzzgtcfO1w_b3wVgPQR8dggo";
        assert_eq!(SheetResult::drive_url_to_id(url), id);
    }
}
