/// Represents the column layout of a Dictionary Sheet for a given year
#[derive(Debug, Clone, Copy)]
pub struct DictionarySheetConfig {
    pub year: i32, /// Year recorded
    pub translation_count: usize, /// Number of English translations
    pub has_numeric: bool, /// If includes a numeric column
    pub has_comment: bool,  /// If includes a comment
    pub after_root: usize, /// Number of columns after translations, before the form columns
    pub translations: usize, /// Number of English translation
}

/// Represents one dictionary entry, merged from every row sharing its key
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct DictionaryEntry {
    pub key: i64, /// Entry number from column "All Entries Key"
    pub page_number: String, /// Page of the dictionary the entry appears on from column "page ref."
    pub root: String, /// Root of the entry from column "Root Morhpheme Break"
    pub root_gloss: String, /// Short gloss of the root from column "Morpheme Gloss"
    pub root_translations: Vec<String>, /// English translations of the root from the columns after "Root Gloss"
    pub transitivity: Option<String>, /// Transitivity of the root from column "Transitivity"
    pub udb_class: Option<String>, /// UDB class of the root from column "UDB Class"
    pub raw_form_columns: Vec<String>, /// Undecoded form columns from every row of the entry
    pub row_numbers: Vec<usize>, /// Sheet row numbers the entry was merged from
}

/// Represents a parsed, validated Dictionary Sheet
#[derive(Debug, Clone)]
pub struct DictionarySheet {
    /// Validated entries in the order they appear in the sheet
    pub entries: Vec<DictionaryEntry>,
}

impl DictionarySheet {
    /// Parses the raw sheet rows into a validated `DictionarySheet`
    pub fn from_spreadsheet(
        rows: Vec<Vec<String>>,
        config: &DictionarySheetConfig,
    ) -> Result<Self, anyhow::Error> {
        if rows.len() <= 2 {
            return Err(anyhow::anyhow!(
                "Dictionary sheet has no entry rows past its 2 header rows"
            ));
        }

        let admitted: Vec<(usize, Vec<String>)> = rows
            .into_iter()
            .enumerate()
            .skip(2)
            .map(|(idx, row)| (idx + 1, row))
            .filter(|(_, cols)| cols.len() > 4 && !cols[2].trim().is_empty())
            .collect();

        if admitted.is_empty() {
            return Err(anyhow::anyhow!(
                "Dictionary sheet has no rows with a non-empty root"
            ));
        }

        let mut groups: Vec<Vec<(usize, Vec<String>)>> = Vec::new();
        let mut current_key: Option<Option<i64>> = None;
        for (row_number, cols) in admitted {
            let key = Self::parse_leading_key(&cols);
            if current_key == Some(key) {
                groups.last_mut().unwrap().push((row_number, cols));
            } else {
                groups.push(vec![(row_number, cols)]);
                current_key = Some(key);
            }
        }

        let mut entries = Vec::new();
        for (index, group) in groups.into_iter().enumerate() {
            entries.push(DictionaryEntry::from_group(group, index, config)?);
        }

        Self::validate_no_duplicate_keys(&entries)?;

        Ok(DictionarySheet { entries })
    }

    /// Maps every entry into a real `LexicalEntryWithForms`
    pub fn into_entries_with_forms(
        self,
        doc_id: dailp::DocumentId,
        config: &DictionarySheetConfig,
    ) -> Vec<crate::spreadsheets::LexicalEntryWithForms> {
        self.entries
            .into_iter()
            .map(|entry| entry.into_entry_with_forms(doc_id, config))
            .collect()
    }

    /// Parses the entry key from the first column, ignoring text after a comma
    fn parse_leading_key(cols: &[String]) -> Option<i64> {
        cols.first()?.split(',').next()?.trim().parse::<i64>().ok()
    }

    /// Validates that there are no duplicate keys to prevent overlapping entries being ingested
    fn validate_no_duplicate_keys(entries: &[DictionaryEntry]) -> Result<(), anyhow::Error> {
        let mut seen = std::collections::HashSet::new();
        for entry in entries {
            if !seen.insert(entry.key) {
                return Err(anyhow::anyhow!(
                    "Rows {:?} duplicate entry key '{}' (as a separate, non-adjacent entry)",
                    entry.row_numbers,
                    entry.key
                ));
            }
        }
        Ok(())
    }
}

impl DictionaryEntry {
    /// Builds one `DictionaryEntry` from a group of raw sheet rows
    fn from_group(
        group: Vec<(usize, Vec<String>)>,
        index: usize,
        config: &DictionarySheetConfig,
    ) -> Result<Self, anyhow::Error> {
        let row_numbers: Vec<usize> = group.iter().map(|(n, _)| *n).collect();
        let (first_row_number, first_cols) = group.first().expect("a group is never empty");

        let key = DictionarySheet::parse_leading_key(first_cols).unwrap_or(index as i64 + 1);

        let mut root_values = first_cols.iter().skip(1);

        let page_number = root_values.next().cloned().unwrap_or_default();

        let root = root_values
            .next()
            .cloned()
            .filter(|s| !s.trim().is_empty())
            .ok_or_else(|| anyhow::anyhow!("Row {} is missing a root", first_row_number))?;

        let root_gloss = root_values
            .next()
            .cloned()
            .filter(|s| !s.trim().is_empty())
            .ok_or_else(|| anyhow::anyhow!("Row {} is missing a root gloss", first_row_number))?;

        let root_translations: Vec<String> = root_values
            .by_ref()
            .take(config.translations)
            .map(|s| s.trim().to_string())
            .filter(|s| !s.is_empty())
            .collect();

        let transitivity = root_values
            .next()
            .filter(|s| !s.trim().is_empty())
            .map(|s| s.trim().to_string());
        let udb_class = root_values
            .next()
            .filter(|s| !s.trim().is_empty())
            .map(|s| s.trim().to_string());

        let skip_count = 4 + config.translations + config.after_root;
        let raw_form_columns: Vec<String> = group
            .iter()
            .flat_map(|(_, cols)| cols.iter().skip(skip_count).cloned())
            .collect();

        Ok(DictionaryEntry {
            key,
            page_number,
            root,
            root_gloss,
            root_translations,
            transitivity,
            udb_class,
            raw_form_columns,
            row_numbers,
        })
    }

    /// Decodes the raw form columns into per-paradigm forms
    pub fn decode_forms(
        &self,
        doc_id: dailp::DocumentId,
        config: &DictionarySheetConfig,
    ) -> Vec<dailp::AnnotatedForm> {
        let date = dailp::Date::from_ymd(config.year, 1, 1);
        let position = dailp::PositionInDocument::new(doc_id, self.page_number.clone(), self.key);
        let mut cols = self.raw_form_columns.clone().into_iter();

        crate::lexical::seg_verb_surface_forms(
            &position,
            &date,
            &mut cols,
            config.translation_count,
            config.has_numeric,
            config.has_comment,
        )
    }

    /// Map the entry into the Rust backend type
    pub fn into_entry_with_forms(
        self,
        doc_id: dailp::DocumentId,
        config: &DictionarySheetConfig,
    ) -> crate::spreadsheets::LexicalEntryWithForms {
        let date = dailp::Date::from_ymd(config.year, 1, 1);
        let position = dailp::PositionInDocument::new(doc_id, self.page_number.clone(), self.key);

        let root_segment = dailp::WordSegment::new(
            crate::lexical::convert_udb(&self.root).into_dailp(),
            self.root_gloss.clone(),
            None,
        );

        let entry = dailp::AnnotatedForm {
            id: None,
            simple_phonetics: None,
            normalized_source: None,
            phonemic: None,
            commentary: None,
            line_break: None,
            page_break: None,
            english_gloss: self.root_translations.clone(),
            segments: Some(vec![root_segment]),
            date_recorded: Some(date.clone()),
            source: self.root.clone(),
            position: position.clone(),
            ingested_audio_track: None,
        };

        let mut cols = self.raw_form_columns.into_iter();
        let forms = crate::lexical::seg_verb_surface_forms(
            &position,
            &date,
            &mut cols,
            config.translation_count,
            config.has_numeric,
            config.has_comment,
        );

        crate::spreadsheets::LexicalEntryWithForms { entry, forms }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Build Vec<Vec<String>> mock from examples to test
    fn rows(data: Vec<Vec<&str>>) -> Vec<Vec<String>> {
        data.into_iter()
            .map(|row| row.into_iter().map(|c| c.to_string()).collect())
            .collect()
    }

    /// Mock config matching the DF1975 sheet layout
    fn df1975_config() -> DictionarySheetConfig {
        DictionarySheetConfig {
            year: 1975,
            translation_count: 3,
            has_numeric: true,
            has_comment: false,
            after_root: 3,
            translations: 3,
        }
    }

    /// Mock row from the real "atate: bounce(I)" entry (key 8)
    fn bounce_row() -> Vec<&'static str> {
        vec![
            "8", "1", "atate:", "bounce(I)", "bounce (intransitive)", "", "", "I", "AND. ii", "",
            "k-atate:-'k-a", "1SG.A-bounce(I)-PRS-IND", "gadade:!ga", "gạ²dạ²de³ga", "gadadega",
            "ᎦᏓᏕᎦ", "it's bouncing", "", "", "",
            "Ø-atate:-'k-a", "3SG.A-bounce(I)-PRS-IND", "a:`dade:!ga", "a¹dạ²de³ga", "adadega",
            "ᎠᏓᏕᎦ", "it's bouncing", "", "", "",
            "Ø-atate:-'k-o:!'i", "3SG.A-bounce(I)-IMPF-HAB", "a:`dade:!go:!'i", "a¹dạ²de³go³ʔi",
            "adadegoʔi", "ᎠᏓᏕᎪᎢ", "it always bounces", "", "", "",
            "u:-atate:-i:nv:'s-v:*'i", "3SG.B-bounce(I)-PFT-ASR", "u:`dadi:*nv:^sv:*'i",
            "u¹dạ²di²³nv³²sv²³ʔi", "udadinvsvʔi", "ᎤᏓᏗᏅᏒᎢ", "it bounced", "", "", "",
            "h-atate:-u'k-a", "2SG.A-bounce(I)-PCT-IND", "hadadu:`ga", "hạ²dạ²du¹ga", "hadaduga",
            "ᎭᏓᏚᎦ", "Bounce!", "", "", "",
            "u:-atate:-i:nv't-i", "3SG.B-bounce(I)-INF-NOM", "u:dadi:*nv:^di", "u²dạ²di²³nv³²di",
            "udadinvdi", "ᎤᏓᏗᏅᏗ", "for it to bounce", "", "",
        ]
    }

    /// Mock sheet parsed with no issues
    #[test]
    fn parses_a_single_row_entry() {
        let header1: Vec<&str> = vec!["header row 1"];
        let header2: Vec<&str> = vec!["header row 2"];
        let sheet = rows(vec![header1, header2, bounce_row()]);

        let parsed = DictionarySheet::from_spreadsheet(sheet, &df1975_config()).expect("should parse");
        assert_eq!(parsed.entries.len(), 1);

        let entry = &parsed.entries[0];
        assert_eq!(entry.key, 8);
        assert_eq!(entry.page_number, "1");
        assert_eq!(entry.root, "atate:");
        assert_eq!(entry.root_gloss, "bounce(I)");
        assert_eq!(entry.root_translations, vec!["bounce (intransitive)"]);
        assert_eq!(entry.transitivity.as_deref(), Some("I"));
        assert_eq!(entry.udb_class.as_deref(), Some("AND. ii"));
        assert_eq!(entry.row_numbers, vec![3]);
        assert_eq!(entry.raw_form_columns.len(), 59);
        assert_eq!(entry.raw_form_columns[0], "k-atate:-'k-a");
    }

    /// Mock sheet parsed merges consecutive rows sharing a key into one entry
    #[test]
    fn consecutive_rows_sharing_a_key_are_merged_synthetic() {
        let header1: Vec<&str> = vec!["h1"];
        let header2: Vec<&str> = vec!["h2"];
        let row_a = vec!["8", "1", "atate:", "bounce(I)", "g1", "", "", "I", "AND", "", "FORM-A"];
        let row_b = vec!["8", "1", "atate:", "bounce(I)", "g1", "", "", "I", "AND", "", "FORM-B"];

        let sheet = rows(vec![header1, header2, row_a, row_b]);
        let parsed = DictionarySheet::from_spreadsheet(sheet, &df1975_config()).expect("should parse");

        assert_eq!(parsed.entries.len(), 1);
        assert_eq!(parsed.entries[0].row_numbers, vec![3, 4]);
        assert_eq!(parsed.entries[0].raw_form_columns, vec!["FORM-A", "FORM-B"]);
    }

    /// Mock sheet parsed fails on sheet with only header rows
    #[test]
    fn parsing_with_too_few_rows_fails() {
        let sheet = rows(vec![vec!["h1"], vec!["h2"]]);
        assert!(DictionarySheet::from_spreadsheet(sheet, &df1975_config()).is_err());
    }

    /// Mock sheet parsed fails on row with missing root
    #[test]
    fn parsing_with_missing_root_fails() {
        let row = vec!["8", "1", "", "bounce(I)", "g"];
        let sheet = rows(vec![vec!["h1"], vec!["h2"], row]);
        assert!(DictionarySheet::from_spreadsheet(sheet, &df1975_config()).is_err());
    }

    /// Mock sheet parsed fails when its only row has too few columns
    #[test]
    fn parsing_with_a_row_failing_the_admission_filter_fails() {
        let row = vec!["8", "1", "atate:", "bounce(I)"];
        let sheet = rows(vec![vec!["h1"], vec!["h2"], row]);
        assert!(DictionarySheet::from_spreadsheet(sheet, &df1975_config()).is_err());
    }

    /// Mock sheet parsed fails on sheet with duplicate non-adjacent keys
    #[test]
    fn parsing_with_duplicate_non_adjacent_keys_fails() {
        let row_8a = vec!["8", "1", "atate:", "bounce(I)", "g"];
        let row_9 = vec!["9", "1", "atate:", "limp", "g"];
        let row_8b = vec!["8", "1", "atate:", "bounce(I)", "g"];
        let sheet = rows(vec![vec!["h1"], vec!["h2"], row_8a, row_9, row_8b]);
        assert!(DictionarySheet::from_spreadsheet(sheet, &df1975_config()).is_err());
    }

    /// Mock entry decodes one form per populated paradigm block
    #[test]
    fn decode_forms_produces_one_form_per_populated_paradigm_block() {
        let header1: Vec<&str> = vec!["h1"];
        let header2: Vec<&str> = vec!["h2"];
        let sheet = rows(vec![header1, header2, bounce_row()]);
        let parsed = DictionarySheet::from_spreadsheet(sheet, &df1975_config()).expect("should parse");

        let doc_id = dailp::DocumentId(dailp::Uuid::nil());
        let forms = parsed.entries[0].decode_forms(doc_id, &df1975_config());

        assert_eq!(forms.len(), 6);
        assert_eq!(forms[0].source, "ᎦᏓᏕᎦ");
        assert_eq!(forms[0].simple_phonetics.as_deref(), Some("gadadega"));
        assert_eq!(forms[0].english_gloss, vec!["it's bouncing"]);
        assert!(forms[0].segments.is_some());
    }

    /// Parsing the leading key ignores text after a comma
    #[test]
    fn leading_key_ignores_text_after_a_comma() {
        let cols: Vec<String> = vec!["8,extra".to_string()];
        assert_eq!(DictionarySheet::parse_leading_key(&cols), Some(8));
    }
}