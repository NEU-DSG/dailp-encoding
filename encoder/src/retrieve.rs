use crate::translation::{DocResult, Translation};
use crate::GOOGLE_API_KEY;
use crate::{
    annotation::MorphemeSegment,
    dictionary::{convert_udb, root_noun_surface_form, root_verb_surface_forms, LexicalEntry},
};
use anyhow::Result;
use async_graphql::*;
use rayon::prelude::*;
use reqwest;
use serde::{Deserialize, Serialize};

/// All the metadata associated with one particular document.
#[SimpleObject]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct DocumentMetadata {
    /// Official short identifier.
    pub id: String,
    /// Full title of the document.
    pub title: String,
    /// The publication that included this document.
    pub publication: Option<String>,
    /// Where the source document came from, maybe the name of a collection.
    pub source: Option<String>,
    /// The people involved in collecting, translating, annotating.
    pub people: Vec<String>,
    /// Rough translation of the document, broken down by paragraph.
    pub translation: Translation,
    /// URL for an image of the original physical document.
    pub image_url: Option<String>,
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
