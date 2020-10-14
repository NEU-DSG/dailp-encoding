mod retrieve;

use anyhow::Result;

/// Migrates DAILP data from several Google spreadsheets to a MongoDB instance.
#[tokio::main]
async fn main() -> Result<()> {
    dotenv::dotenv().ok();
    let db = dailp::Database::new().await?;
    migrate_data(&db).await?;
    retrieve::migrate_tags(&db).await?;
    retrieve::migrate_dictionaries(&db).await?;
    Ok(())
}

/// Parses our annotated document spreadsheets, migrating that data to our
/// database and writing them into TEI XML files.
async fn migrate_data(db: &dailp::Database) -> Result<()> {
    use rayon::prelude::*;

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
        .map(|(meta, lines)| retrieve::write_to_file(meta.clone(), lines))
        .collect();
    // Then, propagate any errors in that process.
    for r in results {
        r?;
    }
    retrieve::migrate_documents_to_db(items, db).await?;
    Ok(())
}

/// Fetch the contents of the sheet with the given ID, validating the first page as
/// annotation lines and the "Metadata" page as [DocumentMetadata].
async fn fetch_sheet(
    sheet_id: &str,
) -> Result<(dailp::DocumentMetadata, Vec<retrieve::SemanticLine>)> {
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
