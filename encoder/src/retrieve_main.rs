mod annotation;
mod encode;
mod retrieve;
mod structured;
mod translation;

use anyhow::Result;
use futures::future::join_all;
use itertools::process_results;
use retrieve::{DocumentMetadata, SemanticLine};
use serde_json::json;
use structured::{Database, Query};

pub const GOOGLE_API_KEY: &str = "AIzaSyBqqPrkht_OeYUSNkSf_sc6UzNaFhzOVNI";

#[tokio::main]
async fn main() -> Result<()> {
    migrate_data().await?;
    Ok(())
}

async fn migrate_data() -> Result<()> {
    // Pull the list of annotated documents from our master index sheet.
    let index =
        retrieve::SheetResult::from_sheet("1sDTRFoJylUqsZlxU57k1Uj8oHhbM3MAzU8sDgTfO7Mk", None)
            .await?
            .into_index()?;

    let items: Vec<_> = join_all(
        index
            .sheet_ids
            .into_iter()
            .map(|sheet_id| fetch_sheet(sheet_id))
            .collect::<Vec<_>>(),
    )
    .await
    .into_iter()
    .filter_map(|x| x.ok())
    .collect();

    for (meta, lines) in &items {
        encode::write_to_file(meta.clone(), lines.clone())?;
    }
    structured::build_json(items).await?;
    Ok(())
}

async fn fetch_sheet(sheet_id: String) -> Result<(DocumentMetadata, Vec<SemanticLine>)> {
    // Split the contents of each main sheet into semantic lines with
    // several layers.
    let lines = retrieve::SheetResult::from_sheet(&sheet_id, None)
        .await?
        .split_into_lines();

    println!("parsing sheet {}", sheet_id);

    // Parse the metadata on the second page of each sheet.
    // This includes publication information and a link to the translation.
    let meta = retrieve::SheetResult::from_sheet(&sheet_id, Some("Metadata"))
        .await?
        .into_metadata()
        .await?;

    Ok((meta, lines))
}
