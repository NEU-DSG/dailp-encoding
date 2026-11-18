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
    pub async fn from_sheet(
        sheet_id: &str,
        sheet_name: Option<&str>,
    ) -> Result<Self, anyhow::Error> {
        info!("Parsing sheet {}, {:?}...", sheet_id, sheet_name);

        let mut tries = 0;
        let max_tries = 3;

        loop {
            let result = Self::from_sheet_weak(sheet_id, sheet_name).await;

            match result {
                Ok(sheet_result) => {
                    info!(
                        "Successfully fetched sheet {} ({} rows)",
                        sheet_id,
                        sheet_result.values.len()
                    );
                    return Ok(sheet_result);
                }
                Err(e) => {
                    if tries > max_tries {
                        return Err(anyhow::anyhow!(
                            "Failed to fetch Google Sheet '{}' (sheet: {:?}) after {} attempts. Last error: {}", 
                            sheet_id, sheet_name, max_tries + 1, e
                        ));
                    }

                    let delay = Duration::from_millis(2000 * 2_u64.pow(tries));
                    println!(
                        "Error fetching sheet '{}': {}. Retrying in {:?} (attempt {}/{})",
                        sheet_id,
                        e,
                        delay,
                        tries + 1,
                        max_tries + 1
                    );

                    sleep(delay).await;
                    tries += 1;
                }
            }
        }
    }
    /// Calls the Sheets API once and deserializes the response body.
    async fn from_sheet_weak(sheet_id: &str, sheet_name: Option<&str>) -> Result<Self> {
        // Get and validate API key
        let api_key = std::env::var("GOOGLE_API_KEY")
            .map_err(|_| anyhow::anyhow!("GOOGLE_API_KEY environment variable not set"))?;

        if api_key.trim().is_empty() {
            return Err(anyhow::anyhow!(
                "GOOGLE_API_KEY environment variable is empty"
            ));
        }
        let sheet_name_param = sheet_name.map_or_else(String::new, |n| format!("{}!", n));
        let url = format!(
            "https://sheets.googleapis.com/v4/spreadsheets/{}/values/{}A1:ZZ?key={}",
            sheet_id, sheet_name_param, api_key
        );

        let response = reqwest::get(&url).await.map_err(|e| {
            anyhow::anyhow!(
                "Failed to send request to Google Sheets API for sheet '{}': {}",
                sheet_id,
                e
            )
        })?;

        let status = response.status();
        if !status.is_success() {
            let error_body = response
                .text()
                .await
                .unwrap_or_else(|_| String::from("[Failed to read error response]"));

            return match status.as_u16() {
                400 => Err(anyhow::anyhow!(
                    "Bad request for Google Sheet '{}' (sheet: {:?}). Check sheet ID and sheet name. Response: {}", 
                    sheet_id, sheet_name, error_body
                )),
                401 => Err(anyhow::anyhow!(
                    "Unauthorized access to Google Sheet '{}'. Check your API key. Response: {}", 
                    sheet_id, error_body
                )),
                403 => Err(anyhow::anyhow!(
                    "Forbidden access to Google Sheet '{}' (sheet: {:?}). Check permissions or API quotas. Response: {}", 
                    sheet_id, sheet_name, error_body
                )),
                404 => Err(anyhow::anyhow!(
                    "Google Sheet '{}' (sheet: {:?}) not found. Check if the sheet exists and is publicly accessible. Response: {}", 
                    sheet_id, sheet_name, error_body
                )),
                _ => Err(anyhow::anyhow!(
                    "Google Sheets API error {} for sheet '{}' (sheet: {:?}). Response: {}", 
                    status, sheet_id, sheet_name, error_body
                ))
            };
        }

        let sheet_result: SheetResult = response.json().await.map_err(|e| {
            anyhow::anyhow!(
                "Failed to parse Google Sheets API response for sheet '{}' (sheet: {:?}): {}",
                sheet_id,
                sheet_name,
                e
            )
        })?;
        if sheet_result.values.is_empty() {
            println!(
                "Warning: Google Sheet '{}' (sheet: {:?}) appears to be empty",
                sheet_id, sheet_name
            );
        }

        Ok(sheet_result)
    }
}
