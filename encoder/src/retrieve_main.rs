use std::time::{Duration, Instant};

use anyhow::Result;
use dailp::retrieve::{DocumentMetadata, SemanticLine};
use dailp::{dictionary, encode, retrieve, structured, tag};
use dotenv::dotenv;
use futures::stream::FuturesUnordered;
use futures::stream::StreamExt;
use futures_retry::{FutureRetry, RetryPolicy};
use rayon::prelude::*;
use tokio::time::delay_for;

#[tokio::main]
async fn main() -> Result<()> {
    dotenv().ok();
    let db = structured::Database::new().await?;
    migrate_data(&db).await?;
    tag::migrate_tags(&db).await?;
    dictionary::migrate_dictionaries(&db).await?;
    Ok(())
}

async fn migrate_data(db: &structured::Database) -> Result<()> {
    // Pull the list of annotated documents from our index sheet.
    let index =
        retrieve::SheetResult::from_sheet("1sDTRFoJylUqsZlxU57k1Uj8oHhbM3MAzU8sDgTfO7Mk", None)
            .await?
            .into_index()?;

    let mut items = Vec::new();
    // Retrieve data for spreadsheets in sequence.
    // Because of Google API rate limits, we have to limit the number of
    // simultaneous connections to the sheets endpoint.
    for sheet_id in &index.sheet_ids {
        items.push(fetch_sheet(sheet_id).await?);
    }

    // Write out all the XML in parallel.
    let results: Vec<_> = items
        .par_iter()
        .map(|(meta, lines)| encode::write_to_file(meta.clone(), lines))
        .collect();
    // Then, propagate any errors in that process.
    for r in results {
        r?;
    }
    structured::build_json(items, db).await?;
    Ok(())
}

async fn fetch_sheet(sheet_id: &str) -> Result<(DocumentMetadata, Vec<SemanticLine>)> {
    println!("parsing sheet {}", sheet_id);

    // Split the contents of each main sheet into semantic lines with
    // several layers.
    let lines = retrieve::SheetResult::from_sheet(sheet_id, None)
        .await?
        .split_into_lines();

    // Parse the metadata on the second page of each sheet.
    // This includes publication information and a link to the translation.
    let meta = retrieve::SheetResult::from_sheet(sheet_id, Some("Metadata"))
        .await?
        .into_metadata()
        .await?;

    Ok((meta, lines))
}
