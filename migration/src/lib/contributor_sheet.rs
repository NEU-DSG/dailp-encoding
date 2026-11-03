use dailp::{ContributorDetails, Database, Date, SheetResult};

/// Represents a validated row of the Contributor Sheet
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ContributorRow {
    /// User's full name of from column "Full Name"
    pub full_name: String,
    /// Name not currently used from column "Alternate Name"
    pub alternate_name: Option<String>,
    /// Date of birth not currently used from column "Date of Birth"
    pub date_of_birth: Option<String>,
    /// Enum of "contributor", "translator", "annotator" from column "Role"
    pub role: Option<String>,
    /// Email not currently used from column "Email"
    pub email: Option<String>,
    pub row_number: usize,
}

/// Represnts a parsed, validated Contributor Sheet
#[derive(Debug, Clone)]
pub struct ContributorSheet {
    pub rows: Vec<ContributorRow>,
}

/// Represents the operations performed on the Toc_Sheet from spreadsheets
impl ContributorSheet {
    /// Parses the raw sheet rows into a validated `Contributor_Sheet`
    pub fn from_spreadsheet(rows: Vec<Vec<String>>) -> Result<Self, anyhow::Error> {
        if rows.is_empty() {
            return Err(anyhow::anyhow!("Contributor sheet has no rows"));
        }

        let mut contributor_rows = Vec::new();

        /// skip(1) drops the header row
        for (offset, raw_row) in rows.into_iter().skip(1).enumerate() {
            let row_number = offset + 2;

            if raw_row.iter().all(|cell| cell.trim().is_empty()) { /// Skipping empty rows
                continue;
            }

            contributor_rows.push(ContributorRow::from_row(raw_row, row_number)?);
        }

        if contributor_rows.is_empty() {
            return Err(anyhow::anyhow!("Contributor sheet has no contributor rows"));
        }

        Self::validate_no_duplicate_emails(&contributor_rows)?;

        Ok(ContributorSheet { rows: contributor_rows })
    }

    /// Validates that there are no dulpicate emails to prevent overlapping users being ingested
    fn validate_no_duplicate_emails(rows: &[ContributorRow]) -> Result<(), anyhow::Error> {
        let mut seen_emails = std::collections::HashSet::new();
        for row in rows {
            if let Some(email) = &row.email {
                if !seen_emails.insert(email) {
                    return Err(anyhow::anyhow!(
                        "Row {} duplicates email '{}'",
                        row.row_number,
                        email
                    ));
                }
            }
        }
        Ok(())
    }

    /// Maps every row into a real dailp::ContributorDetails
    pub fn into_contributor_details_list(self) -> Vec<ContributorDetails> {
        self.rows
            .into_iter()
            .map(ContributorRow::into_contributor_details)
            .collect()
    }

    /// Performs the migration
    pub async fn migrate_all(
        db: &Database,
        rows: Vec<Vec<String>>,
    ) -> Result<Vec<anyhow::Error>, anyhow::Error> {
        let contributor_sheet = ContributorSheet::from_spreadsheet(rows)
            .map_err(|e| anyhow::anyhow!("Failed to parse Contributor sheet: {}", e))?;

        let mut failures = Vec::new();

        /// Parse each row and save row for error prop in case of failures
        for row in contributor_sheet.rows {
            let row_number = row.row_number;
            let details = row.into_contributor_details();

            if let Err(e) = db.upsert_contributor(details.clone()).await {
                let enhanced_error = anyhow::anyhow!(
                    "Failed to upsert contributor '{}' (row {}): {}",
                    details.full_name,
                    row_number,
                    e
                );

                eprintln!("DATABASE ERROR: {}", enhanced_error);
                eprintln!("Contributor details: {:?}", details);
                failures.push(enhanced_error);
            }
        }

        Ok(failures)
    }
}

impl ContributorRow {
    /// Builds one `Contributor_Row` from a raw sheet row
    fn from_row(raw_row: Vec<String>, row_number: usize) -> Result<Self, anyhow::Error> {
        let mut cols = raw_row.into_iter();

        let full_name = cols.next().unwrap_or_default();
        if full_name.trim().is_empty() {
            return Err(anyhow::anyhow!("Row {} is missing a Full Name", row_number));
        }
        let full_name = full_name.trim().to_string();

        let alternate_name = cols
            .next()
            .filter(|raw| !raw.trim().is_empty())
            .map(|raw| raw.trim().to_string());

        let date_of_birth = cols
            .next()
            .filter(|raw| !raw.trim().is_empty())
            .map(|raw| raw.trim().to_string());

        let role = cols
            .next()
            .filter(|raw| !raw.trim().is_empty())
            .map(|raw| raw.trim().to_string());

        let email = cols
            .next()
            .filter(|raw| !raw.trim().is_empty())
            .map(|raw| raw.trim().to_string());

        Ok(ContributorRow {
            full_name,
            alternate_name,
            date_of_birth,
            role,
            email,
            row_number,
        })
    }

    /// Map the row into the Rust backend type
    pub fn into_contributor_details(self) -> ContributorDetails {
        ContributorDetails {
            full_name: self.full_name,
            alternate_name: self.alternate_name,
            birth_date: self.date_of_birth.and_then(|d| Date::parse(&d).ok()),
            is_visible: false,
        }
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
            &["Full Name", "Alternate Name", "Date of Birth", "Role", "Email"],
            &["John Doe", "", "", "contributor", "ex@gmail.edu"],
            &["Jane Doe", "J. Doe", "1990-01-01", "translator", "ex2@example.com"],
        ]);

        let sheet = ContributorSheet::from_spreadsheet(sheet).expect("should parse");
        assert_eq!(sheet.rows.len(), 2);

        assert_eq!(sheet.rows[0].full_name, "John Doe");
        assert_eq!(sheet.rows[0].alternate_name, None);
        assert_eq!(sheet.rows[0].role.as_deref(), Some("contributor"));
        assert_eq!(sheet.rows[0].email.as_deref(), Some("ex@gmail.edu"));

        assert_eq!(sheet.rows[1].alternate_name.as_deref(), Some("J. Doe"));
        assert_eq!(sheet.rows[1].date_of_birth.as_deref(), Some("1990-01-01"));
    }

    /// Mock sheet parsed fails on empty sheet
    #[test]
    fn parsing_an_empty_sheet_fails() {
        let sheet = rows(&[]);
        assert!(ContributorSheet::from_spreadsheet(sheet).is_err());
    }

    /// Mock sheet parsed fails on empty sheet
    #[test]
    fn parsing_with_missing_full_name_fails() {
        let sheet = rows(&[
            &["Full Name", "Alternate Name", "Date of Birth", "Role", "Email"],
            &["", "", "", "contributor", "ex@gmail.edu"],
        ]);
        assert!(ContributorSheet::from_spreadsheet(sheet).is_err());
    }

    /// Mock sheet parsed fails on sheet with duplicate emails
    #[test]
    fn parsing_with_duplicate_email_fails() {
        let sheet = rows(&[
            &["Full Name", "Alternate Name", "Date of Birth", "Role", "Email"],
            &["John Doe", "", "", "contributor", "ex@gmail.edu"],
            &["Someone Else", "", "", "editor", "ex@gmail.edu"],
        ]);
        assert!(ContributorSheet::from_spreadsheet(sheet).is_err());
    }

    /// Mock sheet parsed fails on sheet with duplicate emails
    #[test]
    fn blank_trailing_rows_are_skipped_not_errored() {
        let sheet = rows(&[
            &["Full Name", "Alternate Name", "Date of Birth", "Role", "Email"],
            &["John Doe", "", "", "contributor", "ex@gmail.edu"],
            &["", "", "", "", ""],
        ]);
        let sheet = ContributorSheet::from_spreadsheet(sheet).expect("should parse");
        assert_eq!(sheet.rows.len(), 1);
    }
    
    /// Inserting peroperly maps name
    #[test]
    fn into_contributor_maps_name() {
        let row = ContributorRow {
            full_name: "John Doe".to_string(),
            alternate_name: None,
            date_of_birth: None,
            role: Some("contributor".to_string()),
            email: Some("ex@gmail.edu".to_string()),
            row_number: 2,
        };
        let details = row.into_contributor_details();
        assert_eq!(details.full_name, "John Doe");
        assert_eq!(details.birth_date, None);
        assert_eq!(details.is_visible, false);
    }

    /// Inserting properly parses birthday to valid one
    #[test]
    fn into_contributor_parses_birth_date() {
        let row = ContributorRow {
            full_name: "Jess Doe".to_string(),
            alternate_name: None,
            date_of_birth: Some("1990-01-01".to_string()),
            role: None,
            email: None,
            row_number: 3,
        };
        let details = row.into_contributor_details();
        assert!(details.birth_date.is_some());
    }

    /// Inserting on birthday doesn't throw and silently skips
    #[test]
    fn into_contributor_skips_birth_date() {
        let row = ContributorRow {
            full_name: "Someone".to_string(),
            alternate_name: None,
            date_of_birth: Some("not a real date".to_string()),
            role: None,
            email: None,
            row_number: 4,
        };
        let details = row.into_contributor_details();
        assert_eq!(details.birth_date, None);
    }
}