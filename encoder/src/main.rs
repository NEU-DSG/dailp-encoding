mod encode;
mod retrieve;
mod translation;

pub const GOOGLE_API_KEY: &str = "AIzaSyBqqPrkht_OeYUSNkSf_sc6UzNaFhzOVNI";

use anyhow::Result;

#[tokio::main]
async fn main() -> Result<()> {
    let sheet_id = "188qlHBCMLSpuo9A1J5KIiCQv3iCuKfBpt9T0XDU_PH4";
    let sheet = retrieve::SheetResult::from_sheet(sheet_id, None)
        .await?
        .split_into_lines();
    let meta = retrieve::SheetResult::from_sheet(sheet_id, Some("Metadata"))
        .await?
        .into_metadata()
        .await?;

    encode::write_to_file(meta, sheet)?;
    Ok(())
}
