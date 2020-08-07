mod encode;
mod retrieve;
mod translation;

pub const GOOGLE_API_KEY: &str = "AIzaSyBqqPrkht_OeYUSNkSf_sc6UzNaFhzOVNI";
pub const ANNOTATED_SHEETS: &[&str] = &[
    "188qlHBCMLSpuo9A1J5KIiCQv3iCuKfBpt9T0XDU_PH4",
    "1oUF0ajzc46TEgfkgh4cHBnlQovW_hCk9pgnGh3dZ-Es",
    "1x5wamVrV5W1g3rrCL5TrOkyKx0m4-d7FIlLrIbG_R2I",
];

use anyhow::Result;

#[tokio::main]
async fn main() -> Result<()> {
    for sheet_id in ANNOTATED_SHEETS {
        let sheet = retrieve::SheetResult::from_sheet(sheet_id, None)
            .await?
            .split_into_lines();
        let meta = retrieve::SheetResult::from_sheet(sheet_id, Some("Metadata"))
            .await?
            .into_metadata()
            .await?;

        encode::write_to_file(meta, sheet)?;
    }
    Ok(())
}
