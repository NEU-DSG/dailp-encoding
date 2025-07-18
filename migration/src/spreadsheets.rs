//! This module handles the retrieval of data from Google Drive Spreadsheets and
//! transforming that data into a usable format based on the data types
//! specified in modules under `dailp`.

use crate::audio::AudioRes;
use crate::translations::DocResult;
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
    pub fn into_index(self) -> Result<DocumentIndex> {
        let mut sections = Vec::new();
        for row in self.sheet.values.into_iter().skip(1) {
            if row.len() >= 2 && row[0].is_empty() {
                // This is a new section.
                sections.push(DocumentIndexCollection {
                    title: row[1].clone(),
                    sheet_ids: Vec::new(),
                });
            } else if row.len() > 11 && !row[11].is_empty() {
                sections
                    .last_mut()
                    .unwrap()
                    .sheet_ids
                    .push(Self::drive_url_to_id(&row[11]).to_owned());
            }
        }
        Ok(DocumentIndex {
            collections: sections,
        })
    }
    pub fn into_collection_index(
        self,
        self_title: &String,
        self_wordpress_menu_id: &i64,
        self_slug: &str,
    ) -> Result<dailp::raw::EditedCollection> {
        let mut collection_chapters = Vec::new();
        let mut row = self.sheet.values.into_iter();
        let _first_value = row
            .next()
            .ok_or_else(|| anyhow::format_err!("Missing first value"))?;
        let _second_value = row
            .next()
            .ok_or_else(|| anyhow::format_err!("Missing second value"))?;
        // 0 for Intro, 1 for Body, 2 for Credit
        let mut chapter_type = 0;
        for cur_row in row {
            if cur_row[0].is_empty() {
                chapter_type += 1;
            } else {
                let mut row_values = cur_row.into_iter().peekable();

                // Chapter Depth, URL Slug, and Chapter Name are all required
                let index_i64 = row_values.next().unwrap().parse()?;
                let chapter_url_slug = row_values.next().unwrap();
                let cur_chapter_name = row_values.next().unwrap();

                // Next field is author, which is optional, and not stored
                if row_values.peek().is_some() {
                    row_values.next().unwrap();
                }

                // Both of these fields are optional, and will panic if out of bounds

                let wp_id = if row_values.peek().is_some() {
                    row_values.next().unwrap().parse::<i64>().ok()
                } else {
                    None
                };

                let doc_string = if row_values.peek().is_some() {
                    row_values.next()
                } else {
                    None
                };

                let chapter_type_name = if chapter_type == 0 {
                    Intro
                } else if chapter_type == 1 {
                    Body
                } else {
                    Credit
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
        }

        Ok(dailp::raw::EditedCollection {
            title: self_title.to_string(),
            wordpress_menu_id: Some(*self_wordpress_menu_id),
            slug: self_slug.to_ascii_lowercase(),
            chapters: collection_chapters,
        })
    }

    pub fn into_adjs(self, doc_id: DocumentId, year: i32) -> Result<Vec<LexicalEntryWithForms>> {
        use rayon::prelude::*;
        Ok(self
            .sheet
            .values
            .into_par_iter()
            // First two rows are simply headers.
            .skip(1)
            .enumerate()
            .filter(|(_idx, cols)| cols.len() > 4 && !cols[1].is_empty())
            // The rest are relevant to the noun itself.
            .filter_map(|(idx, columns)| {
                // The columns are as follows: key, root, root gloss, page ref,
                // category, tags, surface forms.

                // Skip reference numbers for now.
                let mut root_values = columns.into_iter();
                let key = root_values.next()?.parse().unwrap_or(idx as i64 + 1);
                let root = root_values.next()?;
                let root_gloss = root_values.next()?;
                // Skip page ref.
                let page_number = root_values.next()?;
                let mut form_values = root_values;
                let date = Date::from_ymd(year, 1, 1);
                let position = PositionInDocument::new(doc_id, page_number, key);
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
                        id: None,
                        normalized_source: None,
                        simple_phonetics: None,
                        phonemic: None,
                        commentary: None,
                        line_break: None,
                        page_break: None,
                        segments: Some(vec![WordSegment::new(
                            convert_udb(&root).into_dailp(),
                            root_gloss.clone(),
                            None,
                        )]),
                        english_gloss: vec![root_gloss],
                        date_recorded: Some(date),
                        source: root,
                        position,
                        ingested_audio_track: None,
                    },
                })
            })
            .collect())
    }
    pub fn into_nouns(
        self,
        doc_id: DocumentId,
        year: i32,
        after_root: usize,
        has_comment: bool,
    ) -> Result<Vec<LexicalEntryWithForms>> {
        Ok(self
            .sheet
            .values
            .into_iter()
            // First two rows are simply headers.
            .skip(2)
            .filter(|cols| cols.len() > 4 && !cols[2].is_empty())
            .group_by(|cols| cols.first().and_then(|s| s.parse::<i64>().ok()))
            .into_iter()
            .enumerate()
            // The rest are relevant to the noun itself.
            .filter_map(|(index, (_key, rows))| {
                let rows: Vec<_> = rows.collect();
                let columns = rows.first()?.clone();
                // The columns are as follows: key, root, root gloss, page ref,
                // category, tags, surface forms.

                // Skip reference numbers for now.
                let mut root_values = columns.into_iter();
                let index = root_values
                    .next()?
                    .split(",")
                    .next()?
                    .parse()
                    .unwrap_or(index as i64 + 1);
                let page_number = root_values.next();
                let root = root_values.next()?;
                let root_gloss = root_values.next()?;
                // Skip page ref and category.
                let mut form_values = rows
                    .into_iter()
                    .flat_map(|row| row.into_iter().skip(4 + after_root));
                let date = Date::from_ymd(year, 1, 1);
                let position = PositionInDocument::new(doc_id, page_number?, index);
                Some(LexicalEntryWithForms {
                    forms: root_noun_surface_forms(&position, &date, &mut form_values, has_comment),
                    entry: AnnotatedForm {
                        id: None,
                        position,
                        normalized_source: None,
                        simple_phonetics: None,
                        phonemic: None,
                        segments: Some(vec![WordSegment::new(
                            convert_udb(&root).into_dailp(),
                            root_gloss.clone(),
                            None,
                        )]),
                        english_gloss: vec![root_gloss],
                        source: root,
                        commentary: None,
                        date_recorded: Some(date),
                        line_break: None,
                        page_break: None,
                        ingested_audio_track: None,
                    },
                })
            })
            .collect())
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

    /// Parse this sheet as a document metadata listing.
    pub async fn into_metadata(
        self,
        db: Option<&dailp::Database>,
        is_reference: bool,
        order_index: i64,
    ) -> Result<DocumentMetadata> {
        // Field order: genre, source, title, source page #, page count, translation
        // First column is the name of the field, useless when parsing so we ignore it.
        let mut values = self.sheet.values.into_iter();
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
        let translations = values
            .next()
            .ok_or_else(|| anyhow::format_err!("No Translations"))?;
        let image_source = values
            .next()
            .ok_or_else(|| anyhow::format_err!("Missing image source row"))?
            .into_iter()
            .nth(1)
            .map(|src| src.to_ascii_lowercase());
        let image_ids = values
            .next()
            // Remove the row title.
            .map(|mut x| {
                x.remove(0);
                x
            });
        let date = values
            .next()
            .ok_or_else(|| anyhow::format_err!("No Date"))?;
        let names = values
            .next()
            .ok_or_else(|| anyhow::format_err!("No contributor names"))?;
        let roles = values
            .next()
            .ok_or_else(|| anyhow::format_err!("No contributor roles"))?;
        let people = names
            .into_iter()
            .skip(1)
            .zip(roles.into_iter().skip(1))
            .map(|(name, role)| Contributor { name, role })
            .collect();
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
        let audio_files = values
            .next()
            .ok_or_else(|| anyhow::format_err!("No audio resources"))?;

        Ok(DocumentMetadata {
            id: Default::default(),
            short_name: doc_id.remove(1),
            title: title.remove(1),
            sources,
            collection: source.pop().filter(|s| !s.is_empty()),
            contributors: people,
            genre: genre.pop(),
            translation: if translations.len() < 2 {
                // if only the header is present, ignore translations
                None
            } else {
                Some(
                    DocResult::new(Self::drive_url_to_id(&translations[1]))
                        .await?
                        .into_translation()?,
                )
            },
            page_images: if let (Some(db), Some(ids), Some(source)) = (db, image_ids, image_source)
            {
                db.image_source_by_title(&source)
                    .await?
                    .map(|source| dailp::IiifImages {
                        source: source.id,
                        ids,
                    })
            } else {
                None
            },
            date: date
                .get(1)
                .and_then(|s| dailp::chrono::NaiveDate::parse_from_str(s, "%Y-%m-%d").ok())
                .map(Date::new),
            is_reference,
            audio_recording: if audio_files.get(1).is_none() {
                None
            } else {
                Some(
                    AudioRes::new(audio_files.get(1).unwrap(), audio_files.get(2))
                        .await?
                        .into_document_audio(),
                )
            },
            order_index,
        })
    }

    /// Parse as an annotation sheet with several lines.
    pub fn split_into_lines(self) -> Vec<SemanticLine> {
        if self.sheet.values.is_empty() {
            return Vec::new();
        }

        // Firstly, split up groups of rows delimited by an empty row.
        let mut current_result: Vec<Vec<String>> = Vec::new();
        let mut all_lines = Vec::<SemanticLine>::new();
        // The header line is useless in encoding.
        for row in self.sheet.values.into_iter().skip(1) {
            // Empty rows mark a line break.
            // Rows starting with one cell containing just "\\" mark a page break.
            // All other rows are part of an annotated line.
            let is_blank = row.is_empty() || row.iter().all(|x| x.trim().is_empty());
            if is_blank {
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
