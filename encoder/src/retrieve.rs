use anyhow::Result;
use async_graphql::*;
use futures::future::join_all;
use futures::join;
use futures_retry::{FutureRetry, RetryPolicy};
use itertools::Itertools;
use mongodb::bson::{self, to_bson, Bson};
use rayon::prelude::*;
use regex::Regex;
use reqwest;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs::File;
use std::io::Write;
use std::time::Duration;
use tera::Tera;

use dailp::{
    convert_udb, root_noun_surface_form, root_verb_surface_forms, AnnotatedDoc, AnnotatedForm,
    AnnotatedPhrase, AnnotatedSeg, BlockType, Database, DocumentMetadata, LexicalEntry, LineBreak,
    MorphemeSegment, MorphemeTag, PageBreak, Translation, TranslationBlock,
};

pub const GOOGLE_API_KEY: &str = "AIzaSyBqqPrkht_OeYUSNkSf_sc6UzNaFhzOVNI";

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

#[derive(Deserialize)]
struct FileDetails {
    web_content_link: String,
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
        let (t, _attempt) = FutureRetry::new(
            move || Self::from_sheet_weak(sheet_id, sheet_name.clone()),
            |_| RetryPolicy::<anyhow::Error>::WaitRetry(Duration::from_millis(500)),
        )
        .await
        .map_err(|(e, _attempts)| e)?;
        Ok(t)
    }
    async fn from_sheet_weak(sheet_id: &str, sheet_name: Option<&str>) -> Result<Self> {
        let sheet_name = sheet_name.map_or_else(|| String::new(), |n| format!("{}!", n));
        Ok(reqwest::get(&format!(
            "https://sheets.googleapis.com/v4/spreadsheets/{}/values/{}A1:ZZ?key={}",
            sheet_id, sheet_name, GOOGLE_API_KEY
        ))
        .await?
        .json::<SheetResult>()
        .await?)
    }
    /// Parse this sheet as the document index.
    pub fn into_index(self) -> Result<DocumentIndex> {
        // Example URL: https://docs.google.com/spreadsheets/d/1sDTRFoJylUqsZlxU57k1Uj8oHhbM3MAzU8sDgTfO7Mk/edit#gid=0
        Ok(DocumentIndex {
            sheet_ids: self
                .values
                .into_iter()
                .skip(1)
                .filter(|row| row.len() > 11 && !row[11].is_empty())
                .map(|mut row| row.remove(11).split("/").nth(5).unwrap().to_owned())
                .collect(),
        })
    }

    pub fn into_df1975(self, doc_id: &str, year: i32, has_ppp: bool) -> Result<Vec<LexicalEntry>> {
        // First two rows are simply headers.
        // let mut values = self.values.into_iter();
        // let first_header = values.next().unwrap();
        // let second_header = values.next().unwrap();

        // The rest are relevant to the verb itself.
        Ok(self
            .values
            .into_par_iter()
            .skip(2)
            .filter_map(|columns| {
                // The columns are as follows: key, page number, root, root gloss,
                // translations 1, 2, 3, transitivity, UDB class, blank, surface forms.
                if columns.len() > 7 && !columns[2].is_empty() {
                    // Skip reference numbers for now.
                    let mut root_values = columns.into_iter();
                    let key = root_values.next()?;
                    let _page_num = root_values.next()?;
                    let root = root_values.next()?;
                    let root_gloss = root_values.next()?;
                    let mut form_values = root_values.clone().skip(5);
                    Some(LexicalEntry {
                        id: format!("{}-{}", doc_id, key),
                        surface_forms: root_verb_surface_forms(
                            doc_id,
                            &root,
                            &root_gloss,
                            &mut form_values,
                            has_ppp,
                        ),
                        root_translations: root_values
                            .take(3)
                            .map(|s| s.trim().to_owned())
                            .filter(|s| !s.is_empty())
                            .collect(),
                        root: MorphemeSegment::new(convert_udb(&root).to_dailp(), root_gloss),
                        year_recorded: year,
                    })
                } else {
                    None
                }
            })
            .collect())
    }
    pub fn into_nouns(self, doc_id: &str, year: i32) -> Result<Vec<LexicalEntry>> {
        // First two rows are simply headers.
        // let mut values = self.values.into_iter();
        // let first_header = values.next().unwrap();
        // let second_header = values.next().unwrap();

        // The rest are relevant to the noun itself.
        Ok(self
            .values
            .into_par_iter()
            .skip(2)
            .filter_map(|columns| {
                // The columns are as follows: key, root, root gloss, page ref,
                // category, tags, surface forms.

                if columns.len() > 4 && !columns[1].is_empty() {
                    // Skip reference numbers for now.
                    let mut root_values = columns.into_iter();
                    let key = root_values.next().unwrap();
                    let root = root_values.next().unwrap();
                    let root_gloss = root_values.next().unwrap();
                    // Skip page ref and category.
                    let mut form_values = root_values.skip(2);
                    Some(LexicalEntry {
                        id: format!("{}-{}", doc_id, key),
                        surface_forms: vec![root_noun_surface_form(
                            &root,
                            &root_gloss,
                            &mut form_values,
                        )]
                        .into_iter()
                        .filter_map(|x| x)
                        .collect(),
                        root: MorphemeSegment::new(convert_udb(&root).to_dailp(), root_gloss),
                        root_translations: Vec::new(),
                        year_recorded: year,
                    })
                } else {
                    None
                }
            })
            .collect())
    }
    async fn get_drive_content(file_id: &str) -> Result<String> {
        Ok(reqwest::get(&format!(
            "https://www.googleapis.com/drive/v3/files/{}?fields=webContentLink",
            file_id
        ))
        .await?
        .json::<FileDetails>()
        .await?
        .web_content_link)
    }

    /// Parse this sheet as a document metadata listing.
    pub async fn into_metadata(self) -> Result<DocumentMetadata> {
        // Meta order: genre, source, title, source page #, page count, translation
        // First column is the name of the field, useless when parsing so we ignore it.
        let mut values = self.values.into_iter();
        let mut doc_id = values
            .next()
            .ok_or_else(|| anyhow::format_err!("No Document ID"))?;
        let _genre = values
            .next()
            .ok_or_else(|| anyhow::format_err!("No genre"))?;
        let mut source = values
            .next()
            .ok_or_else(|| anyhow::format_err!("No source"))?;
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
        Ok(DocumentMetadata {
            id: doc_id.remove(1),
            title: title.remove(1),
            publication: None,
            people: Vec::new(),
            source: Some(source.remove(1)),
            translation: DocResult::new(&translations.remove(1))
                .await?
                .to_translation(),
            image_url: None,
        })
    }

    /// Parse as an annotation sheet with several lines.
    pub fn split_into_lines(mut self) -> Vec<SemanticLine> {
        if self.values.len() <= 0 {
            return Vec::new();
        }

        // The header line is useless in encoding.
        self.values.remove(0);

        // Firstly, split up groups of rows delimited by an empty row.
        let mut current_result: Vec<Vec<String>> = Vec::new();
        let mut all_lines = Vec::<SemanticLine>::new();
        for row in self.values {
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

/// Result obtained directly from the raw Google sheet.
#[derive(Deserialize)]
pub struct DocResult {
    /// Each element here represents one row.
    /// Semantic lines in our documents are delimited by empty rows.
    /// The line number sits in the first cell of the first row of each semantic line.
    body: String,
}
impl DocResult {
    pub async fn new(doc_id: &str) -> Result<Self> {
        let r = reqwest::get(&format!(
            "https://www.googleapis.com/drive/v3/files/{}/export?mimeType=text/plain&key={}",
            doc_id, GOOGLE_API_KEY
        ))
        .await?;
        Ok(Self {
            body: r.text().await?,
        })
    }

    pub fn to_translation(self) -> Translation {
        let ends_with_footnote = Regex::new(r"\[\d+\]").unwrap();
        let text_runs = self
            .body
            // Split the translation text by lines.
            .lines()
            .map(|s| s.trim())
            // Group consecutive non-empty lines together.
            .group_by(|s| s.is_empty());
        let blocks = text_runs
            .into_iter()
            // Only keep non-empty runs of text.
            .filter_map(|(empty, lines)| {
                if !empty {
                    Some(lines.collect::<Vec<&str>>())
                } else {
                    None
                }
            })
            // Ignore text past the first horizontal line.
            .take_while(|text| !text[0].starts_with("________"))
            // Split sentences into separate segments.
            .map(|text| {
                text.into_iter()
                    .flat_map(|s| s.split("."))
                    // Remove footnotes.
                    .map(|text| ends_with_footnote.replace_all(text, "").into_owned())
            })
            // Include the block index.
            .enumerate()
            .map(|(index, content)| TranslationBlock {
                index: index as i32 + 1,
                segments: content
                    .into_iter()
                    .filter(|s| !s.is_empty())
                    .map(|s| s.to_owned())
                    .collect(),
            });

        Translation {
            blocks: blocks.collect(),
        }
    }
}

/// Cherokee has many functional morphemes that are documented.
/// Pulls all the details we have about each morpheme from our spreadsheets,
/// parses it into typed data, then updates the database entry for each.
pub async fn migrate_tags(db: &Database) -> Result<()> {
    println!("Migrating tags to database...");

    let (pp_tags, combined_pp, prepronominals, modals, nominal, refl, clitics) = join!(
        SheetResult::from_sheet("1D0JZEwE-dj-fKppbosaGhT7Xyyy4lVxmgG02tpEi8nw", None),
        SheetResult::from_sheet("1OMzkbDGY1BqPR_ZwJRe4-F5_I12Ao5OJqqMp8Ej_ZhE", None),
        SheetResult::from_sheet("12v5fqtOztwwLeEaKQJGMfziwlxP4n60riMsN9dYw9Xc", None),
        SheetResult::from_sheet("1QWYWFeK6xy7zciIliizeW2hBfuRPNk6dK5rGJf2pdNc", None),
        SheetResult::from_sheet("1MCooadB1bTIKmi_uXBv93DMsv6CyF-L979XOLbFGGgM", None),
        SheetResult::from_sheet("1Q_q_1MZbmZ-g0bmj1sQouFFDnLBINGT3fzthPgqgkqo", None),
        SheetResult::from_sheet("1inyNSJSbISFLwa5fBs4Sj0UUkNhXBokuNRxk7wVQF5A", None),
    );

    let pp_tags = parse_tags(pp_tags?, 3, 7).await?;
    let combined_pp = parse_tags(combined_pp?, 2, 6).await?;
    let prepronominals = parse_tags(prepronominals?, 3, 8).await?;
    let modals = parse_tags(modals?, 4, 5).await?;
    let nominal = parse_tags(nominal?, 7, 5).await?;
    let refl = parse_tags(refl?, 4, 4).await?;
    let clitics = parse_tags(clitics?, 4, 4).await?;

    let dict = db.client.collection("tags");
    for entry in pp_tags
        .into_iter()
        .chain(combined_pp)
        .chain(modals)
        .chain(prepronominals)
        .chain(refl)
        .chain(clitics)
        .chain(nominal)
    {
        if let Bson::Document(bson_doc) = to_bson(&entry).unwrap() {
            dict.update_one(
                bson::doc! {"_id": entry.id},
                bson_doc,
                mongodb::options::UpdateOptions::builder()
                    .upsert(true)
                    .build(),
            )
            .await?;
        }
    }

    Ok(())
}

/// Transforms a spreadsheet of morpheme information into a list of type-safe tag objects.
async fn parse_tags(
    sheet: SheetResult,
    num_allomorphs: usize,
    gap_to_crg: usize,
) -> Result<Vec<MorphemeTag>> {
    Ok(sheet
        .values
        .into_par_iter()
        // The first row is headers.
        .skip(1)
        // There are a few empty spacing rows to ignore.
        .filter(|row| !row.is_empty())
        .filter_map(|row| {
            // Skip over allomorphs, and instead allow them to emerge from our texts.
            let mut cols = row.into_iter().skip(num_allomorphs);
            Some(MorphemeTag {
                id: cols.next()?,
                name: cols.next()?.trim().to_owned(),
                simple: String::new(),
                morpheme_type: cols.clone().skip(1).next()?.trim().to_owned(),
                // Each sheet has a different number of columns.
                crg: cols.skip(gap_to_crg).next()?,
            })
        })
        .collect())
}

/// Converts a set of annotated documents into our preferred access format, then
/// pushes that data into the underlying database.
/// Existing versions of these documents are overwritten with the new data.
pub async fn migrate_documents_to_db(
    inputs: Vec<(DocumentMetadata, Vec<SemanticLine>)>,
    db: &Database,
) -> Result<()> {
    println!("Migrating documents to database...");

    // Combine the documents into one object.
    let docs = inputs.into_iter().map(|(meta, lines)| {
        let annotated = lines.iter().map(|line| AnnotatedLine::from_semantic(line));
        let segments = AnnotatedLine::to_segments(annotated.collect(), &meta.id);
        AnnotatedDoc::new(meta, segments)
    });

    // Write the contents of each document to our database.
    let db = db.client.collection("annotated-documents");
    for doc in docs {
        if let bson::Bson::Document(bson_doc) = bson::to_bson(&doc)? {
            db.update_one(
                bson::doc! {"_id": doc.id},
                bson_doc,
                mongodb::options::UpdateOptions::builder()
                    .upsert(true)
                    .build(),
            )
            .await?;
        } else {
            eprintln!("Failed to make document!");
        }
    }

    Ok(())
}

/// Takes an unprocessed document with metadata, passing it through our TEI
/// template to produce an xml document named like the given title.
pub fn write_to_file(meta: DocumentMetadata, lines: &[SemanticLine]) -> Result<()> {
    let mut tera = Tera::new("*")?;
    let annotated = lines
        .iter()
        .map(|line| AnnotatedLine::from_semantic(line))
        .collect();
    let file_name = format!("{}/{}.xml", OUTPUT_DIR, meta.id);
    println!("writing to {}", file_name);
    tera.register_filter("convert_breaks", convert_breaks);
    let segments = AnnotatedLine::to_segments(annotated, &meta.id);
    let contents = tera.render(
        "template.tera.xml",
        &tera::Context::from_serialize(AnnotatedDoc::new(meta, segments))?,
    )?;
    // Make sure the output folder exists.
    std::fs::create_dir_all(OUTPUT_DIR)?;
    let mut f = File::create(file_name)?;
    f.write(contents.as_bytes())?;
    Ok(())
}

#[derive(Serialize, Deserialize)]
pub struct AnnotatedLine {
    number: String,
    pub words: Vec<AnnotatedForm>,
    ends_page: bool,
}

impl<'a> AnnotatedLine {
    pub fn from_semantic(line: &SemanticLine) -> Self {
        // Number of words = length of the longest row in this line.
        let num_words = line.rows.iter().map(|row| row.items.len()).max().unwrap();
        // For each word, extract the necessary data from every row.
        let delims: &[char] = &['-', '='];
        let words = (0..num_words)
            // Only use words with a syllabary source entry.
            .filter(|i| line.rows.get(0).and_then(|r| r.items.get(*i)).is_some())
            .map(|i| {
                let pb = line.rows[0].items[i].find(PAGE_BREAK);
                let morphemes: Vec<_> = line.rows[4]
                    .items
                    .get(i)
                    .map(|x| x.split(delims).map(|s| s.trim().to_owned()).collect())
                    .unwrap_or_default();
                let glosses: Vec<_> = line.rows[5]
                    .items
                    .get(i)
                    .map(|x| x.split(delims).map(|s| s.trim().to_owned()).collect())
                    .unwrap_or_default();
                AnnotatedForm {
                    index: i as i32 + 1,
                    source: line.rows[0].items[i].trim().to_owned(),
                    normalized_source: line.rows[0].items[i].trim().to_owned(),
                    simple_phonetics: line.rows[2].items.get(i).map(|x| x.to_owned()),
                    phonemic: line.rows[3].items.get(i).map(|x| x.to_owned()),
                    segments: morphemes
                        .into_iter()
                        .zip(glosses)
                        .filter(|(m, g)| !m.is_empty() || !g.is_empty())
                        .map(|(morpheme, gloss)| MorphemeSegment { morpheme, gloss })
                        .collect(),
                    english_gloss: vec![line.rows[6].items.get(i).map(|x| x.trim().to_owned())]
                        .into_iter()
                        .filter_map(|x| x)
                        .collect(),
                    commentary: line.rows[7].items.get(i).map(|x| x.to_owned()),
                    page_break: pb.map(|i| i as i32),
                    line_break: pb
                        .or_else(|| line.rows[0].items[i].find(LINE_BREAK))
                        .map(|i| i as i32),
                    document_id: None,
                }
            })
            .collect();
        Self {
            number: line.number.clone(),
            words,
            ends_page: line.ends_page,
        }
    }
    pub fn many_from_semantic(lines: Vec<SemanticLine>) -> Vec<Self> {
        let mut word_index = 0;
        let delims: &[char] = &['-', '='];
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
                        let morphemes: Vec<_> = line.rows[4]
                            .items
                            .get(i)
                            .map(|x| x.split(delims).map(|s| s.trim().to_owned()).collect())
                            .unwrap_or_default();
                        let glosses: Vec<_> = line.rows[5]
                            .items
                            .get(i)
                            .map(|x| x.split(delims).map(|s| s.trim().to_owned()).collect())
                            .unwrap_or_default();
                        let w = AnnotatedForm {
                            index: i as i32 + 1,
                            source: line.rows[0].items[i].trim().to_owned(),
                            normalized_source: line.rows[0].items[i].trim().to_owned(),
                            simple_phonetics: line.rows[2].items.get(i).map(|x| x.to_owned()),
                            phonemic: line.rows[3].items.get(i).map(|x| x.to_owned()),
                            segments: morphemes
                                .into_iter()
                                .zip(glosses)
                                .filter(|(m, g)| !m.is_empty() || !g.is_empty())
                                .map(|(morpheme, gloss)| MorphemeSegment { morpheme, gloss })
                                .collect(),
                            english_gloss: vec![line.rows[6]
                                .items
                                .get(i)
                                .map(|x| x.trim().to_owned())]
                            .into_iter()
                            .filter_map(|x| x)
                            .collect(),
                            commentary: line.rows[7].items.get(i).map(|x| x.to_owned()),
                            page_break: pb.map(|i| i as i32),
                            line_break: pb
                                .or_else(|| line.rows[0].items[i].find(LINE_BREAK))
                                .map(|i| i as i32),
                            document_id: None,
                        };
                        word_index += 1;
                        w
                    })
                    .collect();
                Self {
                    number: line.number,
                    words,
                    ends_page: line.ends_page,
                }
            })
            .collect()
    }
    pub fn to_segments(lines: Vec<Self>, document_id: &str) -> Vec<AnnotatedSeg> {
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
                    index: word_idx,
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
                    document_id: Some(document_id.to_owned()),
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

const PHRASE_START: &str = "[";
const PHRASE_END: &str = "]";
const LINE_BREAK: char = '\\';
const PAGE_BREAK: &str = "\\\\";
const BLOCK_START: &str = "{";
const BLOCK_END: &str = "}";
const OUTPUT_DIR: &str = "../xml";

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
