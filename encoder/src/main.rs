mod encode;
mod retrieve;
mod translation;

pub const GOOGLE_API_KEY: &str = "AIzaSyBqqPrkht_OeYUSNkSf_sc6UzNaFhzOVNI";

use anyhow::Result;

#[tokio::main]
async fn main() -> Result<()> {
    // Pull the list of annotated documents from our master index sheet.
    let index =
        retrieve::SheetResult::from_sheet("1sDTRFoJylUqsZlxU57k1Uj8oHhbM3MAzU8sDgTfO7Mk", None)
            .await?
            .into_index()?;

    for sheet_id in index.sheet_ids.into_iter() {
        // Split the contents of each main sheet into semantic lines with
        // several layers.
        let sheet = retrieve::SheetResult::from_sheet(&sheet_id, None)
            .await?
            .split_into_lines();

        // Parse the metdata on the second page of each sheet.
        // This includes publication information and a link to the translation.
        if let Ok(res) = retrieve::SheetResult::from_sheet(&sheet_id, Some("Metadata")).await {
            if let Ok(meta) = res.into_metadata().await {
                // Pass all of this into the TEI output.
                encode::write_to_file(meta, sheet)?;
            }
        }
    }

    Ok(())
}
