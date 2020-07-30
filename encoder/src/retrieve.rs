use crate::translation::{DocResult, Translation};
use crate::GOOGLE_API_KEY;
use anyhow::Result;
use reqwest;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize)]
pub struct DocumentMetadata {
    /// Title of the annotated document.
    pub title: String,
    pub publication: Option<String>,
    /// Where the source document came from, maybe the name of a collection.
    pub source: Option<String>,
    /// The people involved in collecting, translating, annotating.
    pub people: Vec<String>,
    pub translation: Translation,
}
#[derive(Debug, Serialize, Deserialize)]
pub struct AnnotationRow {
    pub title: String,
    pub items: Vec<String>,
}
#[derive(Debug, Serialize, Deserialize)]
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

/// Result obtained directly from the raw Google sheet.
#[derive(Debug, Serialize, Deserialize)]
pub struct SheetResult {
    /// Each element here represents one row.
    /// Semantic lines in our documents are delimited by empty rows.
    /// The line number sits in the first cell of the first row of each semantic line.
    values: Vec<Vec<String>>,
}
impl SheetResult {
    pub async fn from_sheet(sheet_id: &str, sheet_name: Option<&str>) -> Result<Self> {
        let sheet_name = sheet_name.map_or_else(|| String::new(), |n| format!("{}!", n));
        Ok(reqwest::get(&format!(
            "https://sheets.googleapis.com/v4/spreadsheets/{}/values/{}A1:Z?key={}",
            sheet_id, sheet_name, GOOGLE_API_KEY
        ))
        .await?
        .json::<SheetResult>()
        .await?)
    }
    pub async fn into_metadata(mut self) -> Result<DocumentMetadata> {
        // Meta order: genre, source, title, source page #, page count, translation
        // First column is the name of the field, useless when parsing so we ignore it.
        let _genre = self.values.remove(0);
        let mut source = self.values.remove(0);
        let mut title = self.values.remove(0);
        let _page_num = self.values.remove(0);
        let _page_count = self.values.remove(0);
        let mut translations = self.values.remove(0);
        Ok(DocumentMetadata {
            title: title.remove(1),
            publication: None,
            people: Vec::new(),
            source: Some(source.remove(1)),
            translation: DocResult::new(&translations.remove(1))
                .await?
                .to_translation(),
        })
    }
    pub fn split_into_lines(mut self) -> Vec<SemanticLine> {
        // The header line is useless in encoding.
        self.values.remove(0);

        // Firstly, split up groups of rows delimited by an empty row.
        let mut current_result: Vec<Vec<String>> = Vec::new();
        let mut all_lines = Vec::<SemanticLine>::new();
        for row in self.values {
            // Empty rows mark a line break.
            // Rows starting with one cell containing just "\\" mark a page break.
            // All other rows are part of an annotated line.
            let is_page_break = !row.is_empty() && row[0].starts_with("\\\\");
            if row.is_empty() || is_page_break {
                if !current_result.is_empty() {
                    all_lines.push(SemanticLine {
                        number: current_result[0][0].clone(),
                        rows: current_result
                            .into_iter()
                            .map(|mut row| {
                                row.remove(0);
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
                        row.remove(0);
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
