use std::collections::HashMap;

use dailp::{Database, Uuid};

/// Represents one validated row of the Index Sheet from Vec<Vec<String input>
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Index_Row {
    /// MSID of document from column "Ms. ID"
    pub msid: String,
    /// Title from column "Title"
    pub title: String,
    /// URL of Drive folder for associated doc from column "DAILP Folder"
    pub dailp_folder: String,
    /// List of translators from column "Translators"
    pub translators: Vec<String>,
    /// List of status with line breaks from column "Status"
    pub status: Vec<String>,
    /// List of annotars for each name from column "Annotators"
    pub annotators: Vec<String>,
    /// Link to document from Beinecke Rare Book and Manuscript Library from column "Beinecke record link"
    pub beinecke_record_link: String,
    /// Optional file name of ms word doc from column "Translation file name (MS Word doc)"
    pub translation_file_name: Option<String>,
    /// from column "Transcribe@Yale link"
    pub transcribe_yale_link: Option<String>,
    /// Optional field regarding from colum "Note"
    pub note: Option<String>,
    /// from column "OID #"
    pub oid: Option<String>,
    /// URL of Drive spreadsheet for document's annotation from column "Annotation Sheet"
    pub annotation_sheet_link: Option<String>,
    /// Title of the parent section this row belongs to, from the header row above it
    pub parent_title: String,
    /// row number from spreadsheet for error messages
    pub row_number: usize,
}

/// Represents a parsed index sheet between Google API call and the Rust backend
#[derive(Debug, Clone)]
pub struct Index_Sheet {
    pub rows: Vec<Index_Row>,
}

/// Index Sheets have two types of rows (section header rows and the actual chapter),
/// thus, this enum distinguishes between the two to skip them
enum IndexRowKind {
    SectionHeader(String),
    Document(Vec<String>),
}

/// Represents the operations performed on 
impl Index_Sheet {
    /// Parses the provided spreadsheet output to a parsed Index_sheet
    pub fn from_spreadsheet(rows: Vec<Vec<String>>) -> Result<Self, anyhow::Error> {
        if rows.is_empty() {
            return Err(anyhow::anyhow!("Index sheet has no rows"));
        }

        let mut index_rows = Vec::new();
        let mut current_section: Option<String> = None;

        for (offset, raw_row) in rows.into_iter().skip(1).enumerate() {
            // Skipped row 1, and rows are 1-indexed in the spreadsheet
            let row_number = offset + 2;

            match Self::classify_row(&raw_row, row_number)? {
                IndexRowKind::SectionHeader(title) => {
                    current_section = Some(title);
                    continue;
                }

                IndexRowKind::Document(raw_row) => {
                    // Throw if document with no currect section found
                    let section_title = current_section.clone().ok_or_else(|| {
                        anyhow::anyhow!(
                            "Row {} has document data before any section header",
                            row_number
                        )
                    })?;

                    index_rows.push(Index_Row::from_row(raw_row, row_number, section_title)?);
                }
            }
        }

        // Throw if no documents
        if index_rows.is_empty() {
            return Err(anyhow::anyhow!("Index sheet has no document rows"));
        }

        Self::validate_no_duplicate_msids(&index_rows)?;

        Ok(Index_Sheet { rows: index_rows })
    }

    /// Determins if the row is an actual document or the header
    pub fn classify_row(
        raw_row: &[String],
        row_number: usize,
    ) -> Result<IndexRowKind, anyhow::Error> {
        let msid_is_blank = raw_row.first().map_or(true, |cell| cell.trim().is_empty());

        if !msid_is_blank {
            return Ok(IndexRowKind::Document(raw_row.to_vec()));
        }

        let title = raw_row.get(1).map(|cell| cell.trim()).unwrap_or("");

        // Return title as header if title with no information after
        if !title.is_empty() && raw_row.iter().skip(2).all(|cell| cell.trim().is_empty()) {
            return Ok(IndexRowKind::SectionHeader(title.to_string()));
        }

        Err(anyhow::anyhow!("Row {} has a blank msid", row_number))
    }

    /// Ensures no two document rows share the same MSID
    fn validate_no_duplicate_msids(rows: &[Index_Row]) -> Result<(), anyhow::Error> {
        let mut seen_msids = std::collections::HashSet::new();
        for row in rows {
            if !seen_msids.insert(&row.msid) {
                return Err(anyhow::anyhow!(
                    "Row {} duplicates Ms. ID '{}'",
                    row.row_number,
                    row.msid
                ));
            }
        }
        Ok(())
    }

    /// Builds the many documents from the Index_Sheet type
    pub async fn into_many_documents(
        self,
        db: &Database,
    ) -> Result<Vec<dailp::AnnotatedDoc>, anyhow::Error> {
        /// Create UUID for parent document which prevents duplicate rows when row doc created
        let mut parent_ids: HashMap<String, Uuid> = HashMap::new();
        // Map of the index in parent document group, not overall index sheet index
        let mut order_in_parent: HashMap<String, i64> = HashMap::new();

        let mut documents = Vec::with_capacity(self.rows.len());

        for row in self.rows {
            /// Create a parent document group id if not seen yet
            let parent_id = match parent_ids.get(&row.parent_title) {
                Some(id) => *id,
                None => {
                    let next_index = parent_ids.len() as i64;
                    let id = db
                        .insert_top_collection(row.parent_title.clone(), next_index)
                        .await?;
                    parent_ids.insert(row.parent_title.clone(), id);
                    id
                }
            };

            /// Read current index and updating it for row
            let order_index = {
                let counter = order_in_parent.entry(row.parent_title.clone()).or_insert(0);
                let current = *counter;
                *counter += 1;
                current
            };

            // Throw on prexisting documents
            if let Some(existing_id) = db.document_id_from_name(&row.msid).await? {
                println!(
                    "{} already exists with ID {}, skipping",
                    row.msid, existing_id.0
                );
                continue;
            }

            // TODO!!!
            // This is currently a mock which does not yet disect the document sheet since it
            // is still not implemented but with what is given from the index sheet, it is used
            // with real data.
            let placeholder_document_metadata = dailp::DocumentMetadata {
                id: dailp::DocumentId(Uuid::nil()),
                short_name: row.msid.clone(),
                title: row.title.clone(),
                is_reference: false,
                date: None,
                audio_recording: None,
                collection: None,
                contributors: None,
                creators_ids: Some(Vec::new()),
                format_id: None.into(),
                genre_id: None.into(),
                keywords_ids: Some(Vec::new()),
                languages_ids: Some(Vec::new()),
                order_index: 0,
                page_images: None,
                sources: Vec::new(),
                subject_headings_ids: Some(Vec::new()),
                spatial_coverage_ids: Some(Vec::new()),
                translation: None,
            };

            // Create document and return id to prepare for
            let document_id = db
                .insert_document(&placeholder_document_metadata, parent_id, order_index)
                .await?;

            let document_metadata = dailp::DocumentMetadata {
                id: document_id,
                ..placeholder_document_metadata
            };

            /// TO DO!!! 
            /// Wrapping with no segments since document sheet is not yet implemented
            let doc = dailp::AnnotatedDoc {
                meta: document_metadata,
                segments: None,
            };

            documents.push(doc);
        }

        Ok(documents)
    }
}

/// Represents the operations of parsing on row into the shape of a index row
impl Index_Row {
    /// Builds an Index_row from the raw sheet data Vec<String>
    fn from_row(
        raw_row: Vec<String>,
        row_number: usize,
        parent_title: String,
    ) -> Result<Self, anyhow::Error> {
        // Check if has data, then extrapolate and package into index row type
        if raw_row.is_empty() {
            return Err(anyhow::anyhow!("Row {} has no columns", row_number));
        }

        let mut cols = raw_row.into_iter();

        let msid = cols.next().unwrap_or_default();
        if msid.trim().is_empty() {
            return Err(anyhow::anyhow!("Row {} is missing an Ms. ID", row_number));
        }
        let msid = msid.trim().to_string();

        let title = cols.next().unwrap_or_default();
        if title.trim().is_empty() {
            return Err(anyhow::anyhow!("Row {} is missing a Title", row_number));
        }
        let title = title.trim().to_string();

        let dailp_folder = cols.next().unwrap_or_default();
        if dailp_folder.trim().is_empty() {
            return Err(anyhow::anyhow!(
                "Row {} is missing a DAILP Folder link",
                row_number
            ));
        }
        let dailp_folder = dailp_folder.trim().to_string();

        let translators = cols
            .next()
            .map(|raw| Self::split_lines(&raw))
            .unwrap_or_default();

        let status = cols
            .next()
            .map(|raw| Self::split_lines(&raw))
            .unwrap_or_default();

        let annotators = cols
            .next()
            .map(|raw| Self::split_lines(&raw))
            .unwrap_or_default();

        let beinecke_record_link = cols.next().unwrap_or_default();
        if beinecke_record_link.trim().is_empty() {
            return Err(anyhow::anyhow!(
                "Row {} is missing a Beinecke record link",
                row_number
            ));
        }
        let beinecke_record_link = beinecke_record_link.trim().to_string();

        let translation_file_name = cols
            .next()
            .filter(|raw| !raw.trim().is_empty())
            .map(|raw| raw.trim().to_string());

        let transcribe_yale_link = cols
            .next()
            .filter(|raw| !raw.trim().is_empty())
            .map(|raw| raw.trim().to_string());

        let note = cols
            .next()
            .filter(|raw| !raw.trim().is_empty())
            .map(|raw| raw.trim().to_string());

        let oid = cols
            .next()
            .filter(|raw| !raw.trim().is_empty())
            .map(|raw| raw.trim().to_string());

        let annotation_sheet_link = cols
            .next()
            .filter(|raw| !raw.trim().is_empty())
            .map(|raw| raw.trim().to_string());

        Ok(Index_Row {
            msid,
            title,
            dailp_folder,
            translators,
            status,
            annotators,
            beinecke_record_link,
            translation_file_name,
            transcribe_yale_link,
            note,
            oid,
            annotation_sheet_link,
            parent_title,
            row_number,
        })
    }

    fn split_lines(raw: &str) -> Vec<String> {
        raw.split('\n')
            .map(|s| s.trim().to_string())
            .filter(|s| !s.is_empty())
            .collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Build Vec<Vec<String>> mock from examples to test
    fn rows(data: &[&[&str]]) -> Vec<Vec<String>> {
        data.iter()
            .map(|row| row.iter().map(|c| c.to_string()).collect())
            .collect()
    }

    /// Mock sheet parsed with no issues
    #[test]
    fn parses_valid_sheet() {
        let sheet = rows(&[
            &[
                "Ms. ID",
                "Title",
                "DAILP Folder",
                "Translators",
                "Status",
                "Annotators",
                "Beinecke record link",
                "Translation file name (MS Word doc)",
                "Transcribe@Yale link",
                "Note",
                "OID #",
                "Annotation Sheet",
            ],
            &["", "Echota Funeral Notices", "", "", "", "", "", "", "", "", "", ""],
            &[
                "EFN1",
                "Funeral notice for Vwodi Aditasgi",
                "https://drive.google.com/drive/folders/16HWpdWZ9n1-68vw5O1hSBCKN1-mcmD7H?usp=sharing",
                "Proctor, Clara\nKilpatrick, Jack",
                "Translated \nTranscribed \nAnnotated",
                "Jeffrey Bourns",
                "https://brbl-dl.library.yale.edu/vufind/Record/4128646",
                "",
                "http://transcribe.library.yale.edu/projects/transcribe/696/1060",
                "Transcribe@Yale has Syllabary transcription",
                "OID   15491744",
                "https://docs.google.com/spreadsheets/d/1JrDfU2RMJfwWiP03VzwKt8DIk1I_Xb7glEZV3ZNdwls/edit",
            ],
            &[
                "EFN2",
                "Funeral notice for a child of Igaka'la",
                "https://drive.google.com/drive/folders/1H9lf2xBIk-4I23NMxZyesc8peTgS1WDW?usp=sharing",
                "Proctor, Clara\nKilpatrick, Jack",
                "Translated \nTranscribed \nAnnotated",
                "Jeffrey Bourns",
                "https://brbl-dl.library.yale.edu/vufind/Record/4128647",
                "",
                "http://transcribe.library.yale.edu/projects/transcribe/697/1064",
                "Transcribe@Yale has Syllabary transcription",
                "OID   15491745",
                "",
            ],
        ]);

        let index = Index_Sheet::from_spreadsheet(sheet).expect("should parse");
        assert_eq!(index.rows.len(), 2);
        assert_eq!(index.rows[0].msid, "EFN1");
        assert_eq!(index.rows[0].parent_title, "Echota Funeral Notices");
        assert_eq!(
            index.rows[0].translators,
            vec!["Proctor, Clara", "Kilpatrick, Jack"]
        );
        assert_eq!(
            index.rows[0].status,
            vec!["Translated", "Transcribed", "Annotated"]
        );
        assert_eq!(index.rows[0].translation_file_name, None);
        assert_eq!(
            index.rows[0].annotation_sheet_link.as_deref(),
            Some("https://docs.google.com/spreadsheets/d/1JrDfU2RMJfwWiP03VzwKt8DIk1I_Xb7glEZV3ZNdwls/edit")
        );

        assert_eq!(index.rows[1].msid, "EFN2");
        assert_eq!(index.rows[1].annotation_sheet_link, None);
        assert_eq!(index.rows[1].oid.as_deref(), Some("OID   15491745"));
    }

    /// Mock sheet empty
    #[test]
    fn parsing_an_empty_sheet_fails() {
        let sheet = rows(&[]);
        assert!(Index_Sheet::from_spreadsheet(sheet).is_err());
    }

    /// Mock sheet missing an msid
    #[test]
    fn parsing_with_missing_msid_fails() {
        let sheet = rows(&[
            &["Ms. ID", "Title", "DAILP Folder"],
            &["", "Echota Funeral Notices", ""],
            &[
                "",
                "Funeral notice for Vwodi Aditasgi",
                "https://drive.google.com/...",
            ],
        ]);
        assert!(Index_Sheet::from_spreadsheet(sheet).is_err());
    }

    /// Mock sheet with document before headers
    #[test]
    fn parsing_before_any_section_header_fails() {
        let sheet = rows(&[
            &["Ms. ID", "Title", "DAILP Folder"],
            &[
                "EFN1",
                "Funeral notice for Vwodi Aditasgi",
                "https://drive.google.com/...",
            ],
        ]);
        assert!(Index_Sheet::from_spreadsheet(sheet).is_err());
    }

    /// Mock sheet missing a few needed fields
    #[test]
    fn parsing_with_missing_required_field_fails() {
        let sheet = rows(&[
            &["Ms. ID", "Title", "DAILP Folder"],
            &["", "Echota Funeral Notices", ""],
            &["EFN1", "", "https://drive.google.com/..."],
        ]);
        assert!(Index_Sheet::from_spreadsheet(sheet).is_err());
    }
}