mod annotation;
mod dictionary;
mod encode;
mod retrieve;
mod structured;
mod tag;
mod translation;

use anyhow::Result;
use dotenv::dotenv;
use futures::stream::FuturesUnordered;
use futures::stream::StreamExt;
use rayon::prelude::*;
use retrieve::{DocumentMetadata, SemanticLine};

pub const GOOGLE_API_KEY: &str = "AIzaSyBqqPrkht_OeYUSNkSf_sc6UzNaFhzOVNI";
const TASK_LIMIT: usize = 5;

#[tokio::main]
async fn main() -> Result<()> {
    dotenv().ok();
    let db = structured::Database::new().await?;
    tag::migrate_tags(&db).await?;
    dictionary::migrate_dictionaries(&db).await?;
    migrate_data(&db).await?;
    Ok(())
}

async fn migrate_data(db: &structured::Database) -> Result<()> {
    // Pull the list of annotated documents from our index sheet.
    let index =
        retrieve::SheetResult::from_sheet("1sDTRFoJylUqsZlxU57k1Uj8oHhbM3MAzU8sDgTfO7Mk", None)
            .await?
            .into_index()?;

    let mut items = Vec::new();
    let mut tasks = FuturesUnordered::new();
    // Retrieve data for spreadsheets in parallel.
    // Because of Google API rate limits, we have to limit the number of
    // simultaneous connections to the sheets endpoint.
    for sheet_id in index.sheet_ids {
        tasks.push(fetch_sheet(sheet_id));
        if tasks.len() == TASK_LIMIT {
            if let Some(Ok(item)) = tasks.next().await {
                items.push(item);
            }
        }
    }
    // Wait for remaining tasks to finish.
    while let Some(Ok(item)) = tasks.next().await {
        items.push(item);
    }

    // Write out all the XML in parallel.
    let results: Vec<_> = items
        .par_iter()
        .map(|(meta, lines)| encode::write_to_file(meta.clone(), lines.clone()))
        .collect();
    // Then, propogate any errors in that process.
    for r in results {
        r?;
    }
    structured::build_json(items, db).await?;
    Ok(())
}

async fn fetch_sheet(sheet_id: String) -> Result<(DocumentMetadata, Vec<SemanticLine>)> {
    println!("parsing sheet {}", sheet_id);

    // Split the contents of each main sheet into semantic lines with
    // several layers.
    let lines = retrieve::SheetResult::from_sheet(&sheet_id, None)
        .await?
        .split_into_lines();

    // Parse the metadata on the second page of each sheet.
    // This includes publication information and a link to the translation.
    let meta = retrieve::SheetResult::from_sheet(&sheet_id, Some("Metadata"))
        .await?
        .into_metadata()
        .await?;

    Ok((meta, lines))
}
