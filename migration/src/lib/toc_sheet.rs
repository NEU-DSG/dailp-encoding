use dailp::collection::CollectionSection;
use dailp::Database;

/// Represents one validated row of the TOC Sheet from the Vec<Vec<String>> input
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Toc_Row {
    /// Depth of this chapter from column "Chapter Depth"
    pub chapter_depth: usize,
    /// URL slug for this chapter from column "URL slug"
    pub url_slug: String,
    /// Human readable chapter title from column "Chapter Name"
    pub chapter_name: String,
    /// List of authos from column "Author(s)"
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

/// 
impl Toc_Sheet {
    
    /// Parses the raw sheet data and returns a parsed Toc_Sheet
    pub fn from_spreadsheet(rows: Vec<Vec<String>>
    ) -> Result<Self, anyhow::Error> {
        /// Stub Currently
    }

    /// Determines if the row is an actual chapter or the Header and for what section
    fn classify_row(raw_row: &[String], row_number: usize
    ) -> Result<TocRowKind, anyhow::Error> {
        /// Stub Currently
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
        /// Stub Currently
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
        /// Stub Currently
    }

}

/// ** I'm unsure if this is how we do testing but I've based it off research, 
// bring up to Naomi **
/// Will also add more tests
#[cfg(test)]
mod tests {
    use super::*;

    /// Build Vec<Vect<String>> mock from examples to test
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
        /// Duplicated url slugs
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
        /// Missing url slug and chapte rname
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
        /// String instead of integer
        let sheet = rows(&[
            &["Chapter Depth", "URL slug", "Chapter Name"],
            &["", "Intro Chapters", ""],
            &["one", "introduction", "Introduction"],
        ]);
        
        assert!(Toc_Sheet::from_spreadsheet(sheet).is_err());
    }
}