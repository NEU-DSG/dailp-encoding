use anyhow::Result;
use dailp::auth::UserGroup;
use serde::{Deserialize, Serialize};
use std::{str::FromStr, time::Duration};
use tokio::time::sleep;

/// Represents one user's predetermined role.
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UserPermission {
    /// The user's role
    pub role: UserGroup,
    /// The user's group
    pub email: String,
}

/// Result obtained directly from the raw Google sheet.
#[derive(Debug, Serialize, Deserialize)]
pub struct SheetResult {
    /// Each element here represents one row.
    pub values: Vec<Vec<String>>,
}

impl SheetResult {
    /// Calls the Google Sheets API a number of times.
    /// Deserializes the first successful result, then stops attempting.
    pub async fn from_sheet() -> Result<Self> {
        let mut tries = 0;
        loop {
            let r = Self::from_sheet_weak().await;
            // Try a few times before giving up.
            if r.is_ok() || tries > 3 {
                break r;
            }
            sleep(Duration::from_millis(2000 * 2_u64.pow(tries))).await;
            tries += 1;
        }
    }
    /// Calls the Sheets API once and deserializes the response body.
    async fn from_sheet_weak() -> Result<Self> {
        let api_key = std::env::var("GOOGLE_API_KEY")?;
        let sheet_id = "1ATTekY411Jz63k6VMDn3ISFu8_f75LYFErCGY-pxVkQ"; // TODO get from env (upcoming PR)
        let response = reqwest::get(&format!(
            "https://sheets.googleapis.com/v4/spreadsheets/{}/values/A1:ZZ?key={}",
            sheet_id, api_key
        ))
        .await?;
        Ok(response.json::<SheetResult>().await?)
    }
    /// Reads each line of the spreadsheet and encodes any roles defined in it.
    pub fn into_permission_list(self) -> Result<Vec<UserPermission>> {
        let mut sections: Vec<UserPermission> = Vec::new();
        // First row is headers "Full Name" "Alt name" "DOB" "Role" "email"
        for row in self.values.into_iter().skip(1) {
            if row.len() > 4 && !row[3].is_empty() && !row[4].is_empty() {
                let role = UserGroup::from_str(&format!("{}s", uppercase_first_letter(&row[3])))?;
                sections.push(UserPermission {
                    role,
                    email: row[4].clone(),
                })
            }
        }
        Ok(sections)
    }
}

/// Capitalizes the first letter of a string.
fn uppercase_first_letter(s: &str) -> String {
    let mut c = s.chars();
    match c.next() {
        None => String::new(),
        Some(f) => f.to_uppercase().collect::<String>() + c.as_str(),
    }
}
