//! This module handles the retrieval of data from Google Drive Spreadsheets and
//! transforming that data into a usable format based on the data types
//! specified in modules under `dailp`.

use crate::audio::AudioRes;
use crate::translations::DocResult;
use std::result::Result::Ok;
use anyhow::Result;
use dailp::collection::CollectionSection::Body;
use dailp::collection::CollectionSection::Credit;
use dailp::collection::CollectionSection::Intro;

use dailp::{
    convert_udb, root_noun_surface_forms, root_verb_surface_forms, slugify_ltree, AnnotatedForm,
    AnnotatedSeg, Contributor, Date, DocumentId, DocumentMetadata, LineBreak, MorphemeId,
    WordSegment,
};
use dailp::{PositionInDocument, SourceAttribution};
use itertools::Itertools;
use serde::{Deserialize, Serialize};

// Define the delimiters used in spreadsheets for marking phrases, blocks,
// lines, and pages.
const LINE_BREAK: &str = "\\";
const PAGE_BREAK: &str = "\\\\";
const BLOCK_START: &str = "{";
const BLOCK_END: &str = "}";

pub struct LexicalEntryWithForms {
    pub entry: AnnotatedForm,
    pub forms: Vec<AnnotatedForm>,
}

/// Provides functions interpreting Google Sheets data into more
/// meaningful structures that are useful for pushing data to the database.
pub struct SheetInterpretation {
    pub sheet: dailp::SheetResult,
}

impl SheetInterpretation {
    fn drive_url_to_id(input: &str) -> &str {
        if let Some(start) = input.find("/d/") {
            // This is, in fact, a file path.
            let start = start + 3;
            let (_, rest) = input.split_at(start);
            let end = rest.find('/').unwrap_or(rest.len());
            rest.split_at(end).0
        } else {
            // This is probably already a bare ID. Anyway, we couldn't parse it.
            input
        }
    }
    /// Parse this sheet as the document index.
    pub fn into_index(self) -> Result<DocumentIndex, anyhow::Error> {
        if self.sheet.values.is_empty() {
            return Err(anyhow::anyhow!("Cannot parse document index from empty sheet"));
        }
        
        let mut sections = Vec::new();
        
        // Skip header row (row 0)
        for (row_index, row) in self.sheet.values.into_iter().skip(1).enumerate() {
            let spreadsheet_row_number = row_index + 2; // +2 because we skip header and are 0-indexed
            
            // Check if this is a new section (empty first column, non-empty second column)
            if row.len() >= 2 && row[0].is_empty() {
                let section_title = row.get(1)
                    .ok_or_else(|| anyhow::anyhow!(
                        "Row {} appears to start a new section but has no title in column B", 
                        spreadsheet_row_number
                    ))?;
                
                if section_title.trim().is_empty() {
                    return Err(anyhow::anyhow!(
                        "Row {} has empty section title in column B", 
                        spreadsheet_row_number
                    ));
                }
                
                sections.push(DocumentIndexCollection {
                    title: section_title.clone(),
                    sheet_ids: Vec::new(),
                });
                
            } else if row.len() > 11 {
                let sheet_url_cell = &row[11];
                
                if !sheet_url_cell.trim().is_empty() {
                    // Make sure a section has already been defined so we can add to it.
                    if sections.is_empty() {
                        return Err(anyhow::anyhow!(
                            "Row {} contains a sheet ID '{}' but no section has been defined yet. Expected a section header first.", 
                            spreadsheet_row_number, sheet_url_cell
                        ));
                    }
                    
                    // Extract the sheet ID from the URL/ID
                    let sheet_id = Self::drive_url_to_id(sheet_url_cell);
                                            
                    // Add to the most recent section
                    sections
                        .last_mut()
                        .expect("We already checked sections is not empty")
                        .sheet_ids
                        .push(sheet_id.to_string());
                }
            }
        }
        
        // Validate the result
        if sections.is_empty() {
            return Err(anyhow::anyhow!(
                "No document index sections found in sheet. Expected rows with empty column A and non-empty column B for section headers."
            ));
        }
        
        Ok(DocumentIndex {
            collections: sections,
        })
    }

    // pub fn into_collection_index(
    //     self,
    //     self_title: &String,
    //     self_wordpress_menu_id: &i64,
    //     self_slug: &str,
    // ) -> Result<dailp::raw::EditedCollection> {
    //     let mut collection_chapters = Vec::new();
    //     let mut row = self.sheet.values.into_iter();
    //     let _first_value = row
    //         .next()
    //         .ok_or_else(|| anyhow::format_err!("Missing first value"))?;
    //     let _second_value = row
    //         .next()
    //         .ok_or_else(|| anyhow::format_err!("Missing second value"))?;
    //     // 0 for Intro, 1 for Body, 2 for Credit
    //     let mut chapter_type = 0;
    //     for cur_row in row {
    //         if cur_row[0].is_empty() {
    //             chapter_type += 1;
    //         } else {
    //             let mut row_values = cur_row.into_iter().peekable();

    //             // Chapter Depth, URL Slug, and Chapter Name are all required
    //             let index_i64 = row_values.next().unwrap().parse()?;
    //             let chapter_url_slug = row_values.next().unwrap();
    //             let cur_chapter_name = row_values.next().unwrap();

    //             // Next field is author, which is optional, and not stored
    //             if row_values.peek().is_some() {
    //                 row_values.next().unwrap();
    //             }

    //             // Both of these fields are optional, and will panic if out of bounds

    //             let wp_id = if row_values.peek().is_some() {
    //                 row_values.next().unwrap().parse::<i64>().ok()
    //             } else {
    //                 None
    //             };

    //             let doc_string = if row_values.peek().is_some() {
    //                 row_values.next()
    //             } else {
    //                 None
    //             };

    //             let chapter_type_name = if chapter_type == 0 {
    //                 Intro
    //             } else if chapter_type == 1 {
    //                 Body
    //             } else {
    //                 Credit
    //             };

    //             let new_chapter = dailp::raw::CollectionChapter {
    //                 index_in_parent: index_i64,
    //                 url_slug: slugify_ltree(chapter_url_slug),
    //                 chapter_name: cur_chapter_name,
    //                 document_short_name: doc_string,
    //                 id: None,
    //                 wordpress_id: wp_id,
    //                 section: chapter_type_name,
    //             };

    //             collection_chapters.push(new_chapter);
    //         }
    //     }

    //     Ok(dailp::raw::EditedCollection {
    //         title: self_title.to_string(),
    //         wordpress_menu_id: Some(*self_wordpress_menu_id),
    //         slug: self_slug.to_ascii_lowercase(),
    //         chapters: collection_chapters,
    //     })
    // }
    pub fn into_collection_index(
        self,
        self_title: &String,
        self_wordpress_menu_id: &i64,
        self_slug: &str,
    ) -> Result<dailp::raw::EditedCollection, anyhow::Error> {
        // Validate inputs
        if self_title.trim().is_empty() {
            return Err(anyhow::anyhow!("Collection title cannot be empty"));
        }
        if self_slug.trim().is_empty() {
            return Err(anyhow::anyhow!("Collection slug cannot be empty"));
        }
        if self.sheet.values.len() < 3 {
            return Err(anyhow::anyhow!(
                "Sheet must have at least 3 rows (2 headers + data), got {}", 
                self.sheet.values.len()
            ));
        }

        let mut collection_chapters = Vec::new();
        let mut row_iter = self.sheet.values.into_iter();
        
        // Skip first two rows (headers/metadata)
        let _first_value = row_iter.next()
            .ok_or_else(|| anyhow::anyhow!("Missing first header row"))?;
        let _second_value = row_iter.next()
            .ok_or_else(|| anyhow::anyhow!("Missing second header row"))?;
        
        // Track chapter sections: 0 = Intro, 1 = Body, 2+ = Credit
        let mut chapter_type = 0;
        const MAX_CHAPTER_TYPE: i32 = 2;
        
        for (row_index, cur_row) in row_iter.enumerate() {
            let spreadsheet_row_number = row_index + 3; // +3 because we skipped 2 header rows and are 0-indexed
            
            // Check if row is empty or first column is empty (section separator)
            if cur_row.is_empty() || cur_row.get(0).map_or(true, |cell| cell.is_empty()) {
                chapter_type += 1;
                if chapter_type > MAX_CHAPTER_TYPE {
                    eprintln!("Warning: More than 3 sections found at row {}. Additional sections will be treated as Credit.", 
                        spreadsheet_row_number);
                    chapter_type = MAX_CHAPTER_TYPE; // Cap at Credit section
                }
                continue;
            }

            // Validate minimum required columns (Chapter Depth, URL slug, Chapter Name)
            if cur_row.len() < 3 {
                return Err(anyhow::anyhow!(
                    "Row {} has insufficient columns (expected at least 3 for depth, slug, name, got {})", 
                    spreadsheet_row_number, cur_row.len()
                ));
            }

            let mut row_values = cur_row.into_iter().peekable();

            // Parse Chapter Depth (Column 0)
            let depth_str = row_values.next()
                .ok_or_else(|| anyhow::anyhow!("Row {} missing chapter depth", spreadsheet_row_number))?;
            let index_i64 = depth_str.parse::<f64>()
                .map_err(|e| anyhow::anyhow!(
                    "Row {} has invalid chapter depth '{}': {}", 
                    spreadsheet_row_number, depth_str, e
                ))?
                .round() as i64;

            // Parse URL slug (Column 1)
            let chapter_url_slug = row_values.next()
                .ok_or_else(|| anyhow::anyhow!("Row {} missing URL slug", spreadsheet_row_number))?;
            if chapter_url_slug.trim().is_empty() {
                return Err(anyhow::anyhow!(
                    "Row {} has empty URL slug", 
                    spreadsheet_row_number
                ));
            }

            // Parse Chapter Name (Column 2)
            let cur_chapter_name = row_values.next()
                .ok_or_else(|| anyhow::anyhow!("Row {} missing chapter name", spreadsheet_row_number))?;
            if cur_chapter_name.trim().is_empty() {
                return Err(anyhow::anyhow!(
                    "Row {} has empty chapter name", 
                    spreadsheet_row_number
                ));
            }

            // Skip Author field (Column 3) - not stored but advance iterator
            if row_values.peek().is_some() {
                row_values.next(); // Skip author, don't need to validate
            }

            // Parse optional WordPress Page ID (Column 4)
            let wp_id = if row_values.peek().is_some() {
                let wp_id_str = row_values.next().unwrap();
                if wp_id_str.trim().is_empty() {
                    None
                } else {
                    match wp_id_str.parse::<f64>() {
                        Ok(float_id) => Some(float_id.round() as i64),
                        Err(_) => {
                            eprintln!("Warning: Row {} has invalid WordPress ID '{}', ignoring", 
                                spreadsheet_row_number, wp_id_str);
                            None
                        }
                    }
                }
            } else {
                None
            };

            // Parse optional MSID (Column 5)
            let doc_string = if row_values.peek().is_some() {
                let msid_str = row_values.next().unwrap();
                if msid_str.trim().is_empty() {
                    None
                } else {
                    Some(msid_str)
                }
            } else {
                None
            };

            // Column 6 (Audio Punchlist) is ignored - no need to process

            // Determine chapter section type
            let chapter_type_name = match chapter_type {
                0 => Intro,
                1 => Body,
                2 => Credit,
                _ => unreachable!("chapter_type should never exceed 2 due to capping logic"),
            };

            let new_chapter = dailp::raw::CollectionChapter {
                index_in_parent: index_i64,
                url_slug: slugify_ltree(chapter_url_slug),
                chapter_name: cur_chapter_name,
                document_short_name: doc_string,
                id: None,
                wordpress_id: wp_id,
                section: chapter_type_name,
            };

            collection_chapters.push(new_chapter);
        }

        // Validate result
        if collection_chapters.is_empty() {
            return Err(anyhow::anyhow!(
                "No chapters found in collection. Expected at least one non-empty row with chapter data."
            ));
        }

        Ok(dailp::raw::EditedCollection {
            title: self_title.to_string(),
            wordpress_menu_id: Some(*self_wordpress_menu_id),
            slug: self_slug.to_ascii_lowercase(),
            chapters: collection_chapters,
        })
    }

    // pub fn into_adjs(self, doc_id: DocumentId, year: i32) -> Result<Vec<LexicalEntryWithForms>> {
    //     use rayon::prelude::*;
    //     Ok(self
    //         .sheet
    //         .values
    //         .into_par_iter()
    //         // First two rows are simply headers.
    //         .skip(1)
    //         .enumerate()
    //         .filter(|(_idx, cols)| cols.len() > 4 && !cols[1].is_empty())
    //         // The rest are relevant to the noun itself.
    //         .filter_map(|(idx, columns)| {
    //             // The columns are as follows: key, root, root gloss, page ref,
    //             // category, tags, surface forms.

    //             // Skip reference numbers for now.
    //             let mut root_values = columns.into_iter();
    //             let key = root_values.next()?.parse().unwrap_or(idx as i64 + 1);
    //             let root = root_values.next()?;
    //             let root_gloss = root_values.next()?;
    //             // Skip page ref.
    //             let page_number = root_values.next()?;
    //             let mut form_values = root_values;
    //             let date = Date::from_ymd(year, 1, 1);
    //             let position = PositionInDocument::new(doc_id, page_number, key);
    //             Some(LexicalEntryWithForms {
    //                 forms: root_verb_surface_forms(
    //                     &position,
    //                     &date,
    //                     &root,
    //                     &root_gloss,
    //                     &mut form_values,
    //                     3,
    //                     true,
    //                     true,
    //                     false,
    //                 ),
    //                 entry: AnnotatedForm {
    //                     id: None,
    //                     normalized_source: None,
    //                     simple_phonetics: None,
    //                     phonemic: None,
    //                     commentary: None,
    //                     line_break: None,
    //                     page_break: None,
    //                     segments: Some(vec![WordSegment::new(
    //                         convert_udb(&root).into_dailp(),
    //                         root_gloss.clone(),
    //                         None,
    //                     )]),
    //                     english_gloss: vec![root_gloss],
    //                     date_recorded: Some(date),
    //                     source: root,
    //                     position,
    //                     ingested_audio_track: None,
    //                 },
    //             })
    //         })
    //         .collect())
    // }

    pub fn into_adjs(self, doc_id: DocumentId, year: i32) -> Result<Vec<LexicalEntryWithForms>, anyhow::Error> {
        // Validate inputs
        if self.sheet.values.is_empty() {
            return Err(anyhow::anyhow!("Cannot parse adjectives from empty sheet"));
        }
        if self.sheet.values.len() < 2 {
            return Err(anyhow::anyhow!(
                "Adjectives sheet must have at least 2 rows (header + data), got {}", 
                self.sheet.values.len()
            ));
        }

        let mut results = Vec::new();
        let mut warnings = Vec::new();
        let mut skipped_rows = 0;

        let total_rows = self.sheet.values.len();

        // Skip first row (header)
        for (row_index, columns) in self.sheet.values.into_iter().skip(1).enumerate() {
            let spreadsheet_row_number = row_index + 2; // +2 because we skip header and are 0-based
            
            // Skip rows that don't meet minimum criteria
            if columns.len() <= 4 {
                    warnings.push(format!("Row {} has insufficient columns (expected > 4 for adjectives format, got {}), skipping", 
                        spreadsheet_row_number, columns.len()));
                skipped_rows += 1;
                continue;
            }
            
            // Check if root column (index 1) is empty - this indicates a non-data row
            if columns.get(1).map_or(true, |col| col.is_empty()) {
                skipped_rows += 1;
                continue;
            }

            let mut root_values = columns.into_iter();

            // Parse key (Column 0: "All Entries Key")
            let key_str = match root_values.next() {
                Some(key) => key,
                None => {
                    warnings.push(format!("Row {} missing entry key column, skipping", spreadsheet_row_number));
                    skipped_rows += 1;
                    continue;
                }
            };
            
            let key = if key_str.trim().is_empty() {
                warnings.push(format!("Row {} has empty entry key, skipping", spreadsheet_row_number));
                skipped_rows += 1;
                continue;
            } else {
                match key_str.parse::<i64>() {
                    Ok(parsed) => parsed,
                    Err(_) => {
                        warnings.push(format!("Row {} has invalid entry key '{}', skipping", 
                            spreadsheet_row_number, key_str));
                        skipped_rows += 1;
                        continue;
                    }
                }
            };

            // Parse root (Column 1: "Root")
            let root = match root_values.next() {
                Some(root) if !root.trim().is_empty() => root,
                _ => {
                    warnings.push(format!("Row {} missing or empty root, skipping", spreadsheet_row_number));
                    skipped_rows += 1;
                    continue;
                }
            };

            // Parse root gloss (Column 2: "morpheme.Gloss") 
            let root_gloss = match root_values.next() {
                Some(gloss) if !gloss.trim().is_empty() => gloss,
                _ => {
                    warnings.push(format!("Row {} missing or empty morpheme gloss, skipping", spreadsheet_row_number));
                    skipped_rows += 1;
                    continue;
                }
            };

            // Parse page reference (Column 3: "DF1975 page ref")
            let page_number = match root_values.next() {
                Some(page) if !page.trim().is_empty() => page,
                _ => {
                    warnings.push(format!("Row {} missing or empty page reference, skipping", spreadsheet_row_number));
                    skipped_rows += 1;
                    continue;
                }
            };

            // If we get here, all required data is valid - create the entry
            let mut form_values = root_values;
            
            // Create date and position
            let date = Date::from_ymd(year, 1, 1);
            let position = PositionInDocument::new(doc_id, page_number, key);
            
            // Generate surface forms for adjectives (SG, PL AN, PL INAN)
            let forms = root_verb_surface_forms(
                &position,
                &date,
                &root,
                &root_gloss,
                &mut form_values,
                3,
                true,
                true,
                false,
            );
            
            if forms.is_empty() {
                warnings.push(format!("Row {} generated no surface forms for adjective entry {} with root '{}', skipping", 
                    spreadsheet_row_number, key, root));
                skipped_rows += 1;
                continue;
            }

            // Create word segment
            let segment = WordSegment::new(
                convert_udb(&root).into_dailp(),
                root_gloss.clone(),
                None,
            );

            let entry = AnnotatedForm {
                id: None,
                normalized_source: None,
                simple_phonetics: None,
                phonemic: None,
                commentary: None,
                line_break: None,
                page_break: None,
                segments: Some(vec![segment]),
                english_gloss: vec![root_gloss.clone()],
                date_recorded: Some(date),
                source: root,
                position,
                ingested_audio_track: None,
            };

            // Successfully created entry
            results.push(LexicalEntryWithForms {
                forms,
                entry,
            });
        }

        // Report warnings about skipped data
        if !warnings.is_empty() {
            eprintln!("Processing warnings for adjectives sheet:");
            for warning in warnings.iter().take(10) {
                eprintln!("  {}", warning);
            }
            if warnings.len() > 10 {
                eprintln!("  ... and {} more warnings", warnings.len() - 10);
            }
            eprintln!("Total rows skipped: {}", skipped_rows);
        }

        if results.is_empty() {
            return Err(anyhow::anyhow!(
                "No valid adjective entries found in sheet. All {} processed rows had invalid data.",
                total_rows - 1 // -1 for header
            ));
        }

        Ok(results)
    }

    // pub fn into_nouns(
    //     self,
    //     doc_id: DocumentId,
    //     year: i32,
    //     after_root: usize,
    //     has_comment: bool,
    // ) -> Result<Vec<LexicalEntryWithForms>> {
    //     Ok(self
    //         .sheet
    //         .values
    //         .into_iter()
    //         // First two rows are simply headers.
    //         .skip(2)
    //         .filter(|cols| cols.len() > 4 && !cols[2].is_empty())
    //         .group_by(|cols| cols.first().and_then(|s| s.parse::<i64>().ok()))
    //         .into_iter()
    //         .enumerate()
    //         // The rest are relevant to the noun itself.
    //         .filter_map(|(index, (_key, rows))| {
    //             let rows: Vec<_> = rows.collect();
    //             let columns = rows.first()?.clone();
    //             // The columns are as follows: key, root, root gloss, page ref,
    //             // category, tags, surface forms.

    //             // Skip reference numbers for now.
    //             let mut root_values = columns.into_iter();
    //             let index = root_values
    //                 .next()?
    //                 .split(",")
    //                 .next()?
    //                 .parse()
    //                 .unwrap_or(index as i64 + 1);
    //             let page_number = root_values.next();
    //             let root = root_values.next()?;
    //             let root_gloss = root_values.next()?;
    //             // Skip page ref and category.
    //             let mut form_values = rows
    //                 .into_iter()
    //                 .flat_map(|row| row.into_iter().skip(4 + after_root));
    //             let date = Date::from_ymd(year, 1, 1);
    //             let position = PositionInDocument::new(doc_id, page_number?, index);
    //             Some(LexicalEntryWithForms {
    //                 forms: root_noun_surface_forms(&position, &date, &mut form_values, has_comment),
    //                 entry: AnnotatedForm {
    //                     id: None,
    //                     position,
    //                     normalized_source: None,
    //                     simple_phonetics: None,
    //                     phonemic: None,
    //                     segments: Some(vec![WordSegment::new(
    //                         convert_udb(&root).into_dailp(),
    //                         root_gloss.clone(),
    //                         None,
    //                     )]),
    //                     english_gloss: vec![root_gloss],
    //                     source: root,
    //                     commentary: None,
    //                     date_recorded: Some(date),
    //                     line_break: None,
    //                     page_break: None,
    //                     ingested_audio_track: None,
    //                 },
    //             })
    //         })
    //         .collect())
    // }

    pub fn into_nouns(
        self,
        doc_id: DocumentId,
        year: i32,
        after_root: usize,
        has_comment: bool,
    ) -> Result<Vec<LexicalEntryWithForms>, anyhow::Error> {
        // Validate inputs
        if self.sheet.values.is_empty() {
            return Err(anyhow::anyhow!("Cannot parse nouns from empty sheet"));
        }
        if self.sheet.values.len() < 3 {
            return Err(anyhow::anyhow!(
                "Nouns sheet must have at least 3 rows (2 headers + data), got {}", 
                self.sheet.values.len()
            ));
        }

        let mut results = Vec::new();
        let mut skipped_rows = 0;
        let mut warnings = Vec::new();

        // Skip first two rows (headers) and track row numbers through grouping
        let rows_with_numbers: Vec<_> = self.sheet.values
            .into_iter()
            .skip(2)
            .enumerate()
            .filter_map(|(row_idx, cols)| {
                let actual_row_number = row_idx + 3; // +3 for 2 skipped headers + 0-based indexing
                
                if cols.len() <= 4 {
                    eprintln!("Warning: Row {} has insufficient columns (expected > 4 for nouns format, got {}), skipping", 
                        actual_row_number, cols.len());
                    return None;
                }
                
                if cols.get(2).map_or(true, |col| col.is_empty()) {
                    eprintln!("Warning: Row {} has empty root column, skipping", actual_row_number);
                    return None;
                }
                
                Some((actual_row_number, cols))
            })
            .collect();

        // Group by key while preserving row numbers
        let grouped_rows = rows_with_numbers
            .into_iter()
            .group_by(|(_, cols)| cols.first().and_then(|s| s.parse::<i64>().ok()));

        // Process each group of rows
        for (group_index, (_parsed_key, rows_with_numbers)) in grouped_rows.into_iter().enumerate() {
            let rows_data: Vec<_> = rows_with_numbers.collect();
            
            if rows_data.is_empty() {
                continue;
            }

            // Extract row numbers and columns separately
            let spreadsheet_row_numbers: Vec<_> = rows_data.iter().map(|(row_num, _)| *row_num).collect();
            let rows: Vec<_> = rows_data.into_iter().map(|(_, cols)| cols).collect();

            let entry_result: Result<LexicalEntryWithForms, anyhow::Error> = {
                let columns = match rows.first() {
                    Some(cols) => cols.clone(),
                    None => {
                        warnings.push(format!("Empty row group {}, skipping", group_index + 1));
                        continue;
                    }
                };

                // Parse the noun data inline
                let mut root_values = columns.into_iter();
                
                // Parse key (Column 0: "ALL ENTRIES KEY") - skip if invalid
                let key_str = match root_values.next() {
                    Some(key) => key,
                    None => {
                        warnings.push(format!("Row {} missing entry key column, skipping group", spreadsheet_row_numbers[0]));
                        continue;
                    }
                };
                
                let index = if key_str.trim().is_empty() {
                    warnings.push(format!("Row {} has empty key, skipping group", spreadsheet_row_numbers[0]));
                    continue;
                } else {
                    let clean_key = match key_str.split(',').next() {
                        Some(key) => key.trim(),
                        None => {
                            warnings.push(format!("Row {} has malformed key '{}', skipping group", spreadsheet_row_numbers[0], key_str));
                            continue;
                        }
                    };
                    
                    if clean_key.is_empty() {
                        warnings.push(format!("Row {} key contains only commas '{}', skipping group", spreadsheet_row_numbers[0], key_str));
                        continue;
                    }
                    
                    match clean_key.parse::<i64>() {
                        Ok(parsed) => parsed,
                        Err(_) => {
                            warnings.push(format!("Row {} cannot parse key '{}' as number, skipping group", spreadsheet_row_numbers[0], key_str));
                            continue;
                        }
                    }
                };

                // Parse page reference (Column 1) - skip if invalid
                let page_number = match root_values.next() {
                    Some(page) if !page.trim().is_empty() => page,
                    _ => {
                        warnings.push(format!("Row {} missing or empty page reference, skipping group", spreadsheet_row_numbers[0]));
                        continue;
                    }
                };

                // Parse root (Column 2) - skip if invalid
                let root = match root_values.next() {
                    Some(root) if !root.trim().is_empty() => root,
                    _ => {
                        warnings.push(format!("Row {} missing or empty root, skipping group", spreadsheet_row_numbers[0]));
                        continue;
                    }
                };

                // Parse root gloss (Column 3) - skip if invalid
                let root_gloss = match root_values.next() {
                    Some(gloss) if !gloss.trim().is_empty() => gloss,
                    _ => {
                        warnings.push(format!("Row {} missing or empty morpheme gloss, skipping group", spreadsheet_row_numbers[0]));
                        continue;
                    }
                };

                // If we get here, all required data is valid - create the entry
                let mut form_values = rows
                    .into_iter()
                    .flat_map(|row| row.into_iter().skip(4 + after_root));
                
                let date = Date::from_ymd(year, 1, 1);
                let position = PositionInDocument::new(doc_id, page_number, index);
                let forms = root_noun_surface_forms(&position, &date, &mut form_values, has_comment);
                
                let segment = WordSegment::new(
                    convert_udb(&root).into_dailp(),
                    root_gloss.clone(),
                    None,
                );

                let entry = AnnotatedForm {
                    id: None,
                    position,
                    normalized_source: None,
                    simple_phonetics: None,
                    phonemic: None,
                    segments: Some(vec![segment]),
                    english_gloss: vec![root_gloss.clone()],
                    source: root,
                    commentary: None,
                    date_recorded: Some(date),
                    line_break: None,
                    page_break: None,
                    ingested_audio_track: None,
                };

                Ok(LexicalEntryWithForms { forms, entry })
            };

            // Add successful entries to results
            match entry_result {
                Ok(entry) => results.push(entry),
                Err(_) => {
                    skipped_rows += spreadsheet_row_numbers.len();
                }
            }
        }

        // Report warnings about skipped data
        if !warnings.is_empty() {
            eprintln!("Processing warnings for noun sheet:");
            for warning in warnings.iter().take(10) {
                eprintln!("  {}", warning);
            }
            if warnings.len() > 10 {
                eprintln!("  ... and {} more warnings", warnings.len() - 10);
            }
            eprintln!("Total rows skipped: {}", skipped_rows);
        }

        if results.is_empty() {
            return Err(anyhow::anyhow!(
                "No valid noun entries found in sheet. All {} processed rows had invalid data.",
                skipped_rows
            ));
        }

        Ok(results)
    }

    pub async fn into_references(self, doc_name: &str) -> Vec<dailp::LexicalConnection> {
        self.sheet
            .values
            .into_iter()
            // First column is the name of the field, useless when parsing so we ignore it.
            .skip(1)
            .filter_map(|row| {
                let mut row = row.into_iter();
                Some(dailp::LexicalConnection::new(
                    MorphemeId {
                        document_name: Some(doc_name.to_owned()),
                        gloss: row.next()?,
                        index: None,
                    },
                    MorphemeId::parse(&row.next()?)?,
                ))
            })
            .collect()
    }

    // /// Parse this sheet as a document metadata listing.
    // pub async fn into_metadata(
    //     self,
    //     db: Option<&dailp::Database>,
    //     is_reference: bool,
    //     order_index: i64,
    // ) -> Result<DocumentMetadata> {
    //     // Field order: genre, source, title, source page #, page count, translation
    //     // First column is the name of the field, useless when parsing so we ignore it.
    //     let mut values = self.sheet.values.into_iter();
    //     let mut doc_id = values
    //         .next()
    //         .ok_or_else(|| anyhow::format_err!("No Document ID"))?;
    //     let mut genre = values
    //         .next()
    //         .ok_or_else(|| anyhow::format_err!("No genre"))?;
    //     genre.remove(0);
    //     let mut source = values
    //         .next()
    //         .ok_or_else(|| anyhow::format_err!("No source"))?;
    //     source.remove(0);
    //     let mut title = values
    //         .next()
    //         .ok_or_else(|| anyhow::format_err!("No title"))?;
    //     let _page_num = values
    //         .next()
    //         .ok_or_else(|| anyhow::format_err!("No Page number"))?;
    //     let _page_count = values
    //         .next()
    //         .ok_or_else(|| anyhow::format_err!("No Page Count"))?;
    //     let translations = values
    //         .next()
    //         .ok_or_else(|| anyhow::format_err!("No Translations"))?;
    //     let image_source = values
    //         .next()
    //         .ok_or_else(|| anyhow::format_err!("Missing image source row"))?
    //         .into_iter()
    //         .nth(1)
    //         .map(|src| src.to_ascii_lowercase());
    //     let image_ids = values
    //         .next()
    //         // Remove the row title.
    //         .map(|mut x| {
    //             x.remove(0);
    //             x
    //         });
    //     let date = values
    //         .next()
    //         .ok_or_else(|| anyhow::format_err!("No Date"))?;
    //     let names = values
    //         .next()
    //         .ok_or_else(|| anyhow::format_err!("No contributor names"))?;
    //     let roles = values
    //         .next()
    //         .ok_or_else(|| anyhow::format_err!("No contributor roles"))?;
    //     let people = names
    //         .into_iter()
    //         .skip(1)
    //         .zip(roles.into_iter().skip(1))
    //         .map(|(name, role)| Contributor { name, role })
    //         .collect();
    //     let sources = if let (Some(names), Some(links)) = (values.next(), values.next()) {
    //         names
    //             .into_iter()
    //             .skip(1)
    //             .zip(links.into_iter().skip(1))
    //             .map(|(name, link)| SourceAttribution { name, link })
    //             .collect()
    //     } else {
    //         Vec::new()
    //     };
    //     let audio_files = values
    //         .next()
    //         .ok_or_else(|| anyhow::format_err!("No audio resources"))?;

    //     Ok(DocumentMetadata {
    //         id: Default::default(),
    //         short_name: doc_id.remove(1),
    //         title: title.remove(1),
    //         sources,
    //         collection: source.pop().filter(|s| !s.is_empty()),
    //         contributors: people,
    //         genre: genre.pop(),
    //         translation: Some(
    //             DocResult::new(Self::drive_url_to_id(&translations[1]))
    //                 .await?
    //                 .into_translation()?,
    //         ),
    //         page_images: if let (Some(db), Some(ids), Some(source)) = (db, image_ids, image_source)
    //         {
    //             db.image_source_by_title(&source)
    //                 .await?
    //                 .map(|source| dailp::IiifImages {
    //                     source: source.id,
    //                     ids,
    //                 })
    //         } else {
    //             None
    //         },
    //         date: date
    //             .get(1)
    //             .and_then(|s| dailp::chrono::NaiveDate::parse_from_str(s, "%Y-%m-%d").ok())
    //             .map(Date::new),
    //         is_reference,
    //         audio_recording: if audio_files.get(1).is_none() {
    //             None
    //         } else {
    //             Some(
    //                 AudioRes::new(audio_files.get(1).unwrap(), audio_files.get(2))
    //                     .await?
    //                     .into_document_audio(),
    //             )
    //         },
    //         order_index,
    //     })
    // }

    /// Parse this sheet as a document metadata listing.
    pub async fn into_metadata(
        self,
        db: Option<&dailp::Database>,
        is_reference: bool,
        order_index: i64,
    ) -> Result<DocumentMetadata, anyhow::Error> {
        // Validate minimum sheet structure
        if self.sheet.values.len() < 12 {
            return Err(anyhow::anyhow!(
                "Metadata sheet must have at least 12 rows for required fields, got {}", 
                self.sheet.values.len()
            ));
        }

        let mut values = self.sheet.values.into_iter();

        // Row 0: Document ID
        let doc_id = values
            .next()
            .ok_or_else(|| anyhow::anyhow!("Missing document ID row"))?;

        // Row 1: Genre
        let mut genre = values
            .next()
            .ok_or_else(|| anyhow::anyhow!("Missing genre row"))?;
        
        if genre.is_empty() {
            return Err(anyhow::anyhow!("Genre row is empty"));
        }
        genre.remove(0); // Remove field name

        // Row 2: Source
        let mut source = values
            .next()
            .ok_or_else(|| anyhow::anyhow!("Missing source row"))?;
        
        if source.is_empty() {
            return Err(anyhow::anyhow!("Source row is empty"));
        }
        source.remove(0); // Remove field name

        // Row 3: Title
        let title = values
            .next()
            .ok_or_else(|| anyhow::anyhow!("Missing title row"))?;

        // Row 4: Page number (skip but validate exists)
        let _page_num = values
            .next()
            .ok_or_else(|| anyhow::anyhow!("Missing page number row"))?;

        // Row 5: Page count (skip but validate exists)  
        let _page_count = values
            .next()
            .ok_or_else(|| anyhow::anyhow!("Missing page count row"))?;

        // Row 6: Translations
        let translations = values
            .next()
            .ok_or_else(|| anyhow::anyhow!("Missing translations row"))?;

        // Row 7: Image source
        let image_source = values
            .next()
            .ok_or_else(|| anyhow::anyhow!("Missing image source row"))?
            .get(1)
            .map(|src| src.to_ascii_lowercase());

        // Row 8: Image IDs (optional)
        let image_ids = values.next().and_then(|mut x| {
            if x.is_empty() {
                None
            } else {
                x.remove(0); // Remove field name
                Some(x)
            }
        });

        // Row 9: Date
        let date = values
            .next()
            .ok_or_else(|| anyhow::anyhow!("Missing date row"))?;

        // Row 10: Contributor names
        let names = values
            .next()
            .ok_or_else(|| anyhow::anyhow!("Missing contributor names row"))?;

        // Row 11: Contributor roles
        let roles = values
            .next()
            .ok_or_else(|| anyhow::anyhow!("Missing contributor roles row"))?;

        // Process contributors with validation
        let people = names
            .into_iter()
            .skip(1)
            .zip(roles.into_iter().skip(1))
            .filter(|(name, role)| !name.trim().is_empty() || !role.trim().is_empty())
            .map(|(name, role)| Contributor { name, role })
            .collect();

        // Row 12-13: Source attributions with validation
        let sources = if let (Some(source_names), Some(source_links)) = (values.next(), values.next()) {
            source_names
                .into_iter()
                .skip(1)
                .zip(source_links.into_iter().skip(1))
                .filter(|(name, link)| !name.trim().is_empty() || !link.trim().is_empty())
                .map(|(name, link)| SourceAttribution { name, link })
                .collect()
        } else {
            Vec::new()
        };

        // Row 14: Audio files
        let audio_files = values
            .next()
            .ok_or_else(|| anyhow::anyhow!("Missing audio resources row"))?;

        // Process translation with better error context
        let translation = if translations.get(1).map_or(true, |t| t.trim().is_empty()) {
            None
        } else {
            let translation_url = &translations[1];
            let doc_result = DocResult::new(Self::drive_url_to_id(translation_url))
                .await
                .map_err(|e| anyhow::anyhow!("Failed to fetch translation document '{}': {}", translation_url, e))?;
            
            Some(doc_result.into_translation()
                .map_err(|e| anyhow::anyhow!("Failed to parse translation from '{}': {}", translation_url, e))?)
        };

        // Process page images with validation
        let page_images = if let (Some(db), Some(ids), Some(source)) = (db, image_ids, image_source) {
            if !source.trim().is_empty() {
                db.image_source_by_title(&source)
                    .await
                    .map_err(|e| anyhow::anyhow!("Failed to find image source '{}': {}", source, e))?
                    .map(|source| dailp::IiifImages {
                        source: source.id,
                        ids,
                    })
            } else {
                None
            }
        } else {
            None
        };

        // Parse date with better error handling
        let parsed_date = date.get(1)
            .and_then(|s| {
                if s.trim().is_empty() {
                    None
                } else {
                    dailp::chrono::NaiveDate::parse_from_str(s, "%Y-%m-%d")
                        .map_err(|e| {
                            eprintln!("Warning: Failed to parse date '{}': {}", s, e);
                            e
                        })
                        .ok()
                }
            })
            .map(Date::new);

        // Process audio recording with validation
        let audio_recording = if audio_files.get(1).map_or(true, |f| f.trim().is_empty()) {
            None
        } else {
            let audio_result = AudioRes::new(
                audio_files.get(1).unwrap(),
                audio_files.get(2)
            ).await
            .map_err(|e| anyhow::anyhow!("Failed to create audio resource: {}", e))?;

            Some(audio_result.into_document_audio())
        };

        // Extract required fields safely
        let short_name = doc_id.get(1)
            .ok_or_else(|| anyhow::anyhow!("Document ID missing value in column 2"))?
            .clone();
        
        let document_title = title.get(1)
            .ok_or_else(|| anyhow::anyhow!("Title missing value in column 2"))?
            .clone();

        Ok(DocumentMetadata {
            id: Default::default(),
            short_name,
            title: document_title,
            sources,
            collection: source.pop().filter(|s| !s.trim().is_empty()),
            contributors: people,
            genre: genre.pop().filter(|s| !s.trim().is_empty()),
            translation,
            page_images,
            date: parsed_date,
            is_reference,
            audio_recording,
            order_index,
        })
    }

    // /// Parse as an annotation sheet with several lines.
    // pub fn split_into_lines(self) -> Vec<SemanticLine> {
    //     if self.sheet.values.is_empty() {
    //         return Vec::new();
    //     }

    //     // Firstly, split up groups of rows delimited by an empty row.
    //     let mut current_result: Vec<Vec<String>> = Vec::new();
    //     let mut all_lines = Vec::<SemanticLine>::new();
    //     // The header line is useless in encoding.
    //     for row in self.sheet.values.into_iter().skip(1) {
    //         // Empty rows mark a line break.
    //         // Rows starting with one cell containing just "\\" mark a page break.
    //         // All other rows are part of an annotated line.
    //         let is_blank = row.is_empty() || row.iter().all(|x| x.trim().is_empty());
    //         if is_blank {
    //             if !current_result.is_empty() {
    //                 all_lines.push(SemanticLine {
    //                     number: current_result[0][0].clone(),
    //                     rows: current_result
    //                         .into_iter()
    //                         .map(|mut row| {
    //                             if row.len() > 1 {
    //                                 row.remove(0);
    //                             }
    //                             AnnotationRow {
    //                                 title: row.remove(0),
    //                                 items: row,
    //                             }
    //                         })
    //                         .collect(),
    //                     ends_page: false,
    //                 });
    //             }
    //             current_result = Vec::new();
    //         } else {
    //             current_result.push(row);
    //         }
    //     }

    //     // Add the last line to the output.
    //     if !current_result.is_empty() {
    //         all_lines.push(SemanticLine {
    //             number: current_result[0][0].clone(),
    //             rows: current_result
    //                 .into_iter()
    //                 .map(|mut row| {
    //                     if row.len() > 1 {
    //                         row.remove(0);
    //                     }
    //                     AnnotationRow {
    //                         title: row.remove(0),
    //                         items: row,
    //                     }
    //                 })
    //                 .collect(),
    //             ends_page: false,
    //         });
    //     }
    //     // Remove trailing empty lines.
    //     let last_best = all_lines.iter().rposition(|l| !l.is_empty()).unwrap_or(0);
    //     all_lines.truncate(last_best + 1);
    //     all_lines
    // }

    /// Parse as an annotation sheet with several lines.
    pub fn split_into_lines(self) -> Result<Vec<SemanticLine>, anyhow::Error> {
        if self.sheet.values.is_empty() {
            return Ok(Vec::new());
        }

        let mut current_result: Vec<Vec<String>> = Vec::new();
        let mut all_lines = Vec::<SemanticLine>::new();
        let mut errors = Vec::new();

        // Skip header line
        for (row_index, row) in self.sheet.values.into_iter().skip(1).enumerate() {
            let actual_row_number = row_index + 2;
            
            // Check for blank rows (line separators)
            let is_blank = row.is_empty() || row.iter().all(|x| x.trim().is_empty());
            
            if is_blank {
                if !current_result.is_empty() {
                    let process_result = {
                        if current_result[0].is_empty() {
                            Err(anyhow::anyhow!("First row in semantic line is empty"))
                        } else {
                            let line_number = current_result[0][0].clone();
                            let annotation_rows: Result<Vec<_>, _> = current_result
                                .into_iter()
                                .enumerate()
                                .map(|(idx, mut row)| {
                                    if row.len() < 2 {
                                        return Err(anyhow::anyhow!(
                                            "Row {} has insufficient columns (expected ≥ 2, got {})", 
                                            idx + 1, row.len()
                                        ));
                                    }
                                    
                                    row.remove(0);
                                    let title = row.remove(0);
                                    
                                    Ok(AnnotationRow {
                                        title,
                                        items: row,
                                    })
                                })
                                .collect();
                            
                            annotation_rows.map(|rows| SemanticLine {
                                number: line_number,
                                rows,
                                ends_page: false,
                            })
                        }
                    };

                    match process_result {
                        Ok(semantic_line) => all_lines.push(semantic_line),
                        Err(e) => errors.push(format!("Line ending at row {}: {}", actual_row_number, e)),
                    }
                    
                    current_result = Vec::new();
                }
            } else {
                if row.len() < 2 {
                    errors.push(format!("Row {} has insufficient columns, skipping", actual_row_number));
                    continue;
                }
                current_result.push(row);
            }
        }

        // Add last line because no more blank row follows
        if !current_result.is_empty() {
            let process_result = {
                if current_result[0].is_empty() {
                    Err(anyhow::anyhow!("Final semantic line has empty first row"))
                } else {
                    let line_number = current_result[0][0].clone();
                    let annotation_rows: Result<Vec<_>, _> = current_result
                        .into_iter()
                        .enumerate()
                        .map(|(idx, mut row)| {
                            if row.len() < 2 {
                                return Err(anyhow::anyhow!(
                                    "Row {} has insufficient columns", idx + 1
                                ));
                            }
                            row.remove(0);
                            let title = row.remove(0);
                            Ok(AnnotationRow { title, items: row })
                        })
                        .collect();
                    
                    annotation_rows.map(|rows| SemanticLine {
                        number: line_number,
                        rows,
                        ends_page: false,
                    })
                }
            };

            match process_result {
                Ok(semantic_line) => all_lines.push(semantic_line),
                Err(e) => errors.push(format!("Final line: {}", e)),
            }
        }

        // Report up to 3 errors in case too many errors occurred
        if !errors.is_empty() {
            eprintln!("Warnings during annotation processing:");
            for error in errors.iter().take(3) {
                eprintln!("  {}", error);
            }
            if errors.len() > 3 {
                eprintln!("  ... and {} more errors", errors.len() - 3);
            }
        }

        if all_lines.is_empty() {
            return Err(anyhow::anyhow!("No valid semantic lines found in annotation sheet"));
        }

        // Remove trailing empty lines
        let last_best = all_lines.iter().rposition(|l| !l.is_empty()).unwrap_or(0);
        all_lines.truncate(last_best + 1);

        Ok(all_lines)
    }
}

#[derive(Debug, Serialize)]
pub struct DocumentIndex {
    pub collections: Vec<DocumentIndexCollection>,
}

#[derive(Debug, Serialize)]
pub struct DocumentIndexCollection {
    pub title: String,
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

#[derive(Debug, Serialize, Deserialize)]
pub struct AnnotatedLine {
    pub words: Vec<AnnotatedForm>,
    ends_page: bool,
}

impl AnnotatedLine {
    pub fn many_from_semantic(
        lines: &[SemanticLine],
        meta: &DocumentMetadata,
    ) -> Result<Vec<Self>> {
        let mut word_index = 1;
        lines
            .iter()
            .enumerate()
            .map(|(line_idx, line)| {
                // Number of words = length of the longest row in this line.
                let num_words = line.rows.iter().map(|row| row.items.len()).max().unwrap();
                let line_num = line_idx + 1;
                let source_row = line
                    .rows
                    .first()
                    .unwrap_or_else(|| panic!("No source row for line {}", line_num));
                let simple_phonetics_row = line
                    .rows
                    .get(2)
                    .unwrap_or_else(|| panic!("No simple phonetics for line {}", line_num));
                let phonemic_row = line
                    .rows
                    .get(3)
                    .unwrap_or_else(|| panic!("No phonemic representation for line {}", line_num));
                let morpheme_row = line
                    .rows
                    .get(4)
                    .unwrap_or_else(|| panic!("No morphemic segmentation for line {}", line_num));
                let gloss_row = line
                    .rows
                    .get(5)
                    .unwrap_or_else(|| panic!("No morphemic gloss for line {}", line_num));
                let translation_row = line
                    .rows
                    .get(6)
                    .unwrap_or_else(|| panic!("No translation for line {}", line_num));
                let commentary_row = line
                    .rows
                    .get(7)
                    .unwrap_or_else(|| panic!("No commentary for line {}", line_num));
                // For each word, extract the necessary data from every row.
                let words: Result<Vec<_>> = (0..num_words)
                    // Only use words with a syllabary source entry.
                    .filter(|i| source_row.items.get(*i).is_some())
                    .map(|i| -> Result<AnnotatedForm> {
                        let source_text = &source_row.items[i];
                        let pb = source_text.find(PAGE_BREAK);
                        let morphemes = morpheme_row.items.get(i);
                        let glosses = gloss_row.items.get(i);
                        let translation = translation_row.items.get(i).map(|x| x.trim().to_owned());
                        let w = AnnotatedForm {
                            // TODO Extract into public function!
                            // id: format!("{}.{}", meta.id.0, word_index),
                            id: None,
                            position: PositionInDocument::new(meta.id, "1".to_owned(), word_index),
                            source: source_text.trim().replace(LINE_BREAK, ""),
                            normalized_source: None,
                            simple_phonetics: simple_phonetics_row
                                .items
                                .get(i)
                                .map(|x| x.replace("ʔ", "'")),
                            phonemic: phonemic_row.items.get(i).map(|x| x.to_owned()),
                            segments: if let (Some(m), Some(g)) = (morphemes, glosses) {
                                WordSegment::parse_many(m, g)
                            } else {
                                None
                            },
                            english_gloss: vec![translation].into_iter().flatten().collect(),
                            commentary: commentary_row.items.get(i).map(|x| x.to_owned()),
                            page_break: pb.map(|i| i as i32),
                            line_break: pb
                                .or_else(|| source_text.find(LINE_BREAK))
                                .map(|i| i as i32),
                            date_recorded: None,
                            ingested_audio_track: if let Some(annotations) = meta
                                .audio_recording
                                .as_ref()
                                .and_then(|audio| audio.annotations.as_ref())
                            {
                                Some(
                                    annotations
                                        .get((word_index - 1) as usize)
                                        .cloned()
                                        .ok_or_else(|| {
                                            anyhow::anyhow!(
                                                "Missing audio for word {} in {}",
                                                word_index - 1,
                                                meta.short_name
                                            )
                                        })?,
                                )
                            } else {
                                None
                            },
                        };
                        word_index += 1;
                        Ok(w)
                    })
                    .collect();
                Ok(Self {
                    words: words?,
                    ends_page: line.ends_page,
                })
            })
            .collect()
    }

    pub fn lines_into_segments(
        lines: Vec<Self>,
        document_id: &dailp::DocumentId,
        date: &Option<Date>,
    ) -> Vec<Vec<Vec<AnnotatedSeg>>> {
        // The first page needs a break.
        let mut line_num = 0;
        let mut page_num = 0;
        let mut word_idx = 1;
        let mut pages = vec![vec![vec![]]];

        // Process each line into a series of segments.
        for (line_idx, line) in lines.into_iter().enumerate() {
            // Only add a line break if there wasn't an explicit one mid-word.
            if line_idx == line_num {
                let lb = AnnotatedSeg::LineBreak(LineBreak {
                    index: line_num as i32,
                });
                if let Some(p) = pages.last_mut() {
                    if let Some(p) = p.last_mut() {
                        p.push(lb);
                    }
                }
                line_num += 1;
            }

            for word in line.words {
                // Give the word an index within the whole document.
                let word = AnnotatedForm {
                    position: PositionInDocument::new(
                        *document_id,
                        (page_num + 1).to_string(),
                        word_idx,
                    ),
                    ..word
                };

                // Keep a global word index for the whole document.
                word_idx += 1;

                // Account for mid-word line breaks.
                if word.line_break.is_some() {
                    line_num += 1;
                }

                let mut source = word.source.trim();
                // Check for the start of a block.
                while source.starts_with(BLOCK_START) {
                    source = &source[1..];
                    pages.last_mut().unwrap().push(Vec::new());
                }
                // Remove all ending brackets from the source.
                while source.ends_with(BLOCK_END) {
                    source = &source[..source.len() - 1];
                }
                // Construct the final word.
                let finished_word = AnnotatedSeg::Word(AnnotatedForm {
                    source: source.to_owned(),
                    line_break: word.line_break.map(|_| line_num as i32),
                    page_break: word.page_break.map(|_| page_num),
                    date_recorded: date.clone(),
                    ..word
                });
                // Add the current word to the current phrase or the root document.
                if let Some(paragraphs) = pages.last_mut() {
                    if let Some(p) = paragraphs.last_mut() {
                        p.push(finished_word);
                    }
                }
            }
            if line.ends_page {
                page_num += 1;
                pages.push(Vec::new());
            }
        }

        // If the document ends in a page break, remove it.
        // This prevents having an extra page break at the end of each document.
        if pages.last().map_or(false, |s| s.is_empty()) {
            pages.pop();
        }

        pages
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn url_parsing() {
        let url =
            "https://docs.google.com/document/d/13ELP_F95OUUW8exR2KvQzzgtcfO1w_b3wVgPQR8dggo/edit";
        let id = "13ELP_F95OUUW8exR2KvQzzgtcfO1w_b3wVgPQR8dggo";
        assert_eq!(SheetInterpretation::drive_url_to_id(url), id);
        // Raw IDs should remain intact.
        assert_eq!(SheetInterpretation::drive_url_to_id(id), id);
        // URLs without the "/edit" at the end should work too.
        let url = "https://docs.google.com/document/d/13ELP_F95OUUW8exR2KvQzzgtcfO1w_b3wVgPQR8dggo";
        assert_eq!(SheetInterpretation::drive_url_to_id(url), id);
    }
}
