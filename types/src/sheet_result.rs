//! Provides the struct `SheetResult` which represents a
//! Google Sheets spreadsheet. Also provides functions to
//! retrieve a sheet from Google Sheets.
use anyhow::Result;
use log::info;
use serde::{Deserialize, Serialize};
use std::time::Duration;
use tokio::time::sleep;

/// Result obtained directly from the raw Google sheet.
#[derive(Debug, Serialize, Deserialize)]
pub struct SheetResult {
    /// Each element here represents one row.
    pub values: Vec<Vec<String>>,
}

impl SheetResult {
    /// Calls the Google Sheets API a number of times.
    /// Deserializes the first successful result, then stops attempting.
    pub async fn from_sheet(sheet_id: &str, sheet_name: Option<&str>) -> Result<Self> {
        info!("parsing sheet {}, {:?}...", sheet_id, sheet_name);
        let mut tries = 0;
        loop {
            let r = Self::from_sheet_weak(sheet_id, sheet_name).await;
            // Try a few times before giving up.
            if r.is_ok() || tries > 3 {
                break r;
            }
            sleep(Duration::from_millis(2000 * 2_u64.pow(tries))).await;
            tries += 1;
        }
    }
    /// Calls the Sheets API once and deserializes the response body.
    async fn from_sheet_weak(sheet_id: &str, sheet_name: Option<&str>) -> Result<Self> {
        let api_key = std::env::var("GOOGLE_API_KEY")?;
        let sheet_name = sheet_name.map_or_else(String::new, |n| format!("{}!", n));
        let response = reqwest::get(&format!(
            "https://sheets.googleapis.com/v4/spreadsheets/{}/values/{}A1:ZZ?key={}",
            sheet_id, sheet_name, api_key
        ))
        .await?;
        Ok(response.json::<SheetResult>().await?)
    }
}
