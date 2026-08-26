use dailp::collection::CollectionSection;
use dailp::{slugify_ltree, Database};

/// Represents one validated row of the TOC Sheet from the Vec<Vec<String>> input
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Toc_Row {
    /// Depth of this chapter from column "Chapter Depth"
    pub chapter_depth: usize,
    /// URL slug for this chapter from column "URL slug"
    pub url_slug: String,
    /// Human readable chapter title from column "Chapter Name"
    pub chapter_name: String,
    /// List of authors from column "Author(s)"
    pub authors: Vec<String>,
    /// Optional Wordpress Id of document from column "WordPress Page ID (optional)"
    pub wordpress_page_id: Option<i64>,
    /// Id for chapters with backend document from column "MSID"
    pub msid: Option<String>,
    /// Section that this chapter belongs to from Intro/Credit/Body
    pub section: CollectionSection,
    /// row number from spreadsheet for error messages
    pub row_number: usize,
}

/// Represents a parsed TOC Sheet between the Google Drive API call and
/// the Rust backend type
#[derive(Debug, Clone)]
pub struct Toc_Sheet {
    pub rows: Vec<Toc_Row>,
}

/// TOC Sheets have two types of rows (section header rows and the actual chapter),
/// thus, this enum distinguishes between the two to skip them
enum TocRowKind {
    SectionHeader(CollectionSection),
    Chapter(Vec<String>),
}

/// Represents the operations performed on the Toc_Sheet from spreadsheets
impl Toc_Sheet {
    /// Parses the raw sheet data and returns a parsed Toc_Sheet
    pub fn from_spreadsheet(rows: Vec<Vec<String>>) -> Result<Self, anyhow::Error> {
        // Throw if no rows present
        if rows.is_empty() return Err(anyhow::anyhow!("TOC sheet has no rows"));

        let mut toc_rows = Vec::new();
        let mut current_section: Option<CollectionSection> = None;

        for (offset, raw_row) in rows.into_iter().skip(1).enumerate() {
            // Skipped row 1, and rows are 1-indexed in the spreadsheet
            let current_row_idx = offset + 2;

            match Self::classify_row(&raw_row, current_row_idx)? {
                TocRowKind::SectionHeader(section) => {
                    current_section = Some(section);
                    continue;
                }

                TocRowKind::Chapter(raw_row) => {
                    // Assign the section to the chapter, or throw if no
                    // section header has been seen yet
                    let section = current_section.ok_or_else(|| {
                        anyhow::anyhow!(
                            "Row {} has chapter data before any section header",
                            current_row_idx
                        )
                    })?;

                    toc_rows.push(Toc_Row::from_row(raw_row, current_row_idx, section)?);
                }
            }
        }

        if toc_rows.is_empty() 
            return Err(anyhow::anyhow!("TOC sheet has no chapter rows"));

        Ok(Toc_Sheet { rows: toc_rows })
    }

    /// Determines if the row is an actual chapter or the header, and for what section
    fn classify_row(
        raw_row: &[String], 
        row_number: usize
    ) -> Result<TocRowKind, anyhow::Error> {
        // If the first cell in the row is not blank, it can be assumed to be
        // a chapter row
        if !raw_row.first().is_empty()
            return Ok(TocRowKind::Chapter(raw_row.to_vec()));

        // Either a section-header label or broken data
        let label = raw_row.get(1).map(|cell| cell.trim()).unwrap_or("");

        match label {
            l if l.eq_ignore_ascii_case("Intro Chapters") => {
                Ok(TocRowKind::SectionHeader(CollectionSection::Intro))
            }
            l if l.eq_ignore_ascii_case("Body Chapters") => {
                Ok(TocRowKind::SectionHeader(CollectionSection::Body))
            }
            l if l.eq_ignore_ascii_case("Credit Chapters") => {
                Ok(TocRowKind::SectionHeader(CollectionSection::Credit))
            }
            _ => Err(anyhow::anyhow!(
                "Row {} is not recognized as any valid row type",
                row_number
            )),
        }
    }

    /// Builds the edited collection from the parsed Toc_Sheet type
    pub async fn into_edited_collection(
        self,
        db: &Database,
        title: String,
        description: String,
        wordpress_menu_id: i64,
        slug: String,
    ) -> Result<dailp::raw::EditedCollection, anyhow::Error> {
        if title.trim().is_empty() 
            return Err(anyhow::anyhow!("Collection title cannot be empty"));
        if slug.trim().is_empty()
            return Err(anyhow::anyhow!("Collection slug cannot be empty"));

        let mut chapters = Vec::with_capacity(self.rows.len());

        for row in self.rows {
            /// Ensure document exists based on msid
            if let Some(msid) = &row.msid {
                let doc_exists = db.document_id_from_name(msid).await?.is_some();

                if !doc_exists 
                    return Err(anyhow::anyhow!(
                        "Row {} references MSID '{}', but no document with that name exists in the database",
                        row.row_number,
                        msid
                    ));
            }

            /// Add the chapter as a raw type to list
            chapters.push(dailp::raw::CollectionChapter {
                id: None,
                url_slug: slugify_ltree(&row.url_slug),
                index_in_parent: row.chapter_depth as i64,
                chapter_name: row.chapter_name,
                document_short_name: row.msid,
                wordpress_id: row.wordpress_page_id,
                section: row.section,
            });
        }

        if chapters.is_empty() 
            return Err(anyhow::anyhow!(
                "No chapters found for collection '{}'",
                title
            ));

        Ok(dailp::raw::EditedCollection {
            title,
            description: Some(description),
            slug: slug.to_ascii_lowercase(),
            wordpress_menu_id: Some(wordpress_menu_id),
            chapters,
            thumbnail_url: Some(String::new()),
        })
    }
}

/// Represents operations done for one Toc_Row
impl Toc_Row {
    /// Builds Toc_Row from the raw sheet data Vec<String>
    fn from_row(
        raw_row: Vec<String>,
        row_number: usize,
        section: CollectionSection,
    ) -> Result<Self, anyhow::Error> {
        // Throw if a chapter is missing depth, title, or slug
        if raw_row.len() < 3
            return Err(anyhow::anyhow!(
                "Row {} is missing a required column (depth, title, or slug)",
                row_number
            ));

        // Iterate through row and save all values
        let mut cols = raw_row.into_iter();

        let depth_str = cols.next().unwrap();
        if depth_str.trim().is_empty() 
            return Err(anyhow::anyhow!(
                "Row {} is missing chapter depth",
                row_number
            ));

        let chapter_depth = depth_str.trim().parse::<usize>().map_err(|e| {
            anyhow::anyhow!(
                "Row {} has non-numeric chapter depth '{}': {}",
                row_number,
                depth_str,
                e
            )
        })?;

        let url_slug = cols.next().unwrap();
        if url_slug.trim().is_empty() {
            return Err(anyhow::anyhow!("Row {} is missing a URL slug", row_number));
        }

        let chapter_name = cols.next().unwrap();
        if chapter_name.trim().is_empty() {
            return Err(anyhow::anyhow!(
                "Row {} is missing a chapter name",
                row_number
            ));
        }

        let authors = cols
            .next()
            .map(|raw| {
                raw.split(',')
                    .map(|a| a.trim().to_string())
                    .filter(|a| !a.is_empty())
                    .collect()
            })
            .unwrap_or_default();

        let wordpress_page_id = match cols.next() {
            Some(raw) if !raw.trim().is_empty() => Some(raw.trim().parse::<i64>().map_err(|e| {
                anyhow::anyhow!(
                    "Row {} has non-numeric WordPress Page ID '{}': {}",
                    row_number,
                    raw,
                    e
                )
            })?),
            _ => None,
        };

        let msid = cols
            .next()
            .filter(|raw| !raw.trim().is_empty())
            .map(|raw| raw.trim().to_string());

        Ok(Toc_Row {
            chapter_depth,
            url_slug,
            chapter_name,
            authors,
            wordpress_page_id,
            msid,
            section,
            row_number,
        })
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
                "Chapter Depth",
                "URL slug",
                "Chapter Name",
                "Author(s)",
                "WordPress Page ID (optional)",
                "MSID",
                "Audio Punchlist",
            ],
            &["", "Intro Chapters", "", "", "", "", ""],
            &[
                "1",
                "introduction",
                "Introduction",
                "Ellen Cushman",
                "1059",
                "",
                "",
            ],
            &["", "Body Chapters", "", "", "", "", ""],
            &[
                "1",
                "echota_funeral_notices",
                "Echota Funeral Notices",
                "Ben Frey",
                "1849",
                "",
                "",
            ],
            &[
                "2",
                "notice_vwodi_aditasgi",
                "Funeral notice for Vwodi Aditasgi",
                "",
                "",
                "EFN1",
                "",
            ],
        ]);

        let toc = Toc_Sheet::from_spreadsheet(sheet).expect("should parse");
        assert_eq!(toc.rows.len(), 3);
        assert_eq!(toc.rows[0].section, CollectionSection::Intro);
        assert_eq!(toc.rows[1].section, CollectionSection::Body);
        assert_eq!(toc.rows[2].msid.as_deref(), Some("EFN1"));
        assert_eq!(toc.rows[2].chapter_depth, 2);
    }

    /// Mock sheet empty
    #[test]
    fn parsing_an_empty_sheet_fails() {
        let sheet = rows(&[]);

        assert!(Toc_Sheet::from_spreadsheet(sheet).is_err());
    }

    /// Mock sheet with missing chapter depth
    #[test]
    fn parsing_with_missing_depth_fails() {
        let sheet = rows(&[
            &["Chapter Depth", "URL slug", "Chapter Name"],
            &["", "Intro Chapters", ""],
            &["", "introduction", "Introduction"],
        ]);

        assert!(Toc_Sheet::from_spreadsheet(sheet).is_err());
    }

    /// Mock sheet with duplicate fields
    #[test]
    fn parsing_with_duplicate_required_fields_fails() {
        // Duplicated url slugs
        let sheet = rows(&[
            &["Chapter Depth", "URL slug", "Chapter Name"],
            &["", "Intro Chapters", ""],
            &["1", "introduction", "Introduction"],
            &["1", "introduction", "Introduction Again"],
        ]);

        assert!(Toc_Sheet::from_spreadsheet(sheet).is_err());
    }

    /// Mock sheet missing required field
    #[test]
    fn parsing_with_missing_required_fields_fails() {
        // Missing url slug
        let sheet = rows(&[
            &["Chapter Depth", "URL slug", "Chapter Name"],
            &["", "Intro Chapters", ""],
            &["1", "", "Introduction"],
        ]);

        assert!(Toc_Sheet::from_spreadsheet(sheet).is_err());
    }

    /// Mock sheet with incorrect typing
    #[test]
    fn parsing_with_mismatched_type_fields_fails() {
        // String instead of integer
        let sheet = rows(&[
            &["Chapter Depth", "URL slug", "Chapter Name"],
            &["", "Intro Chapters", ""],
            &["one", "introduction", "Introduction"],
        ]);

        assert!(Toc_Sheet::from_spreadsheet(sheet).is_err());
    }
}