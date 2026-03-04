//! This program encodes spreadsheets hosted on Google Drive annotating source documents with linguistic information into equivalent database entries.

mod audio;
mod connections;
mod contributors;
mod early_vocab;
mod edited_collection;
mod lexical;
mod menu;
mod pages;
mod spreadsheets;
mod tags;
mod translations;
mod user_documents;

use anyhow::Result;
use dailp::{Database, LexicalConnection, SheetResult, Uuid};
use log::error;
use std::time::Duration;

use crate::spreadsheets::SheetInterpretation;

pub const METADATA_SHEET_NAME: &str = "Metadata";
pub const REFERENCES_SHEET_NAME: &str = "References";

/// Migrates DAILP data from several Google spreadsheets to a database.
#[tokio::main]
async fn main() -> Result<()> {
    dotenv::dotenv().ok();
    pretty_env_logger::init();

    let db = Database::connect(Some(1))?;

    //println!("Migrating Image Sources...");
    //migrate_image_sources(&db).await?;

    println!("Migrating contributors...");
    contributors::migrate_all(&db).await?;

    //println!("Migrating tags to database...");
    //tags::migrate_tags(&db).await?;

    //println!("Migrating DF1975 and DF2003...");
    //lexical::migrate_dictionaries(&db).await?;

    //println!("Migrating early vocabularies...");
    //early_vocab::migrate_all(&db).await?;

    //migrate_data(&db).await?;
    println!("Migrating pages...");
    pages::migrate_pages(&db).await?;

    //migrate_data(&db).await?;

    // println!("Migrating connections...");
    // connections::migrate_connections(&db).await?;

    println!("Migrating menu...");
    menu::migrate_menu(&db).await?;

    //println!("Migrating collections...");
    edited_collection::migrate_edited_collection(&db).await?;

    println!("Creating user documents collection...");
    user_documents::create_user_documents_collection(&db).await?;

    Ok(())
}

async fn migrate_image_sources(db: &Database) -> Result<()> {
    db.upsert_image_source("beinecke", "https://collections.library.yale.edu/iiif/2")
        .await?;
    db.upsert_image_source(
        "dailp",
        "https://images.library.northeastern.edu/iiif/2/images/dailp",
    )
    .await?;
    Ok(())
}

/// Parses our annotated document spreadsheets, migrating that data to our
/// database and writing them into TEI XML files.
async fn migrate_data(db: &Database) -> Result<()> {
    // Pull the list of annotated documents from our index sheet.
    let stage = std::env::var("TF_STAGE").unwrap_or("".to_owned()); // "" | "dev" | "uat" | "prod"
                                                                    // If env is prod, use stable prod collection. Otherwise, use development collection.
    let index_sheet = if stage == "prod" {
        "1sDTRFoJylUqsZlxU57k1Uj8oHhbM3MAzU8sDgTfO7Mk"
    } else {
        "1cjGMIPLQkOpE1f2eB11GDIODCEj2uQB9e9w2LHh-wiI"
    };
    let index = spreadsheets::SheetInterpretation {
        sheet: SheetResult::from_sheet(index_sheet, None).await?,
    }
    .into_index()?;

    println!("Migrating documents to database...");

    // Retrieve data for spreadsheets in sequence.
    // Because of Google API rate limits, we have to process them sequentially
    // rather than in parallel.
    // This process encodes the ordering in the Index sheet to allow us to
    // manually order different document collections.
    let mut morpheme_relations = Vec::new();
    let mut document_contents = Vec::new();
    for (coll_index, collection) in index.collections.into_iter().enumerate() {
        // TODO do we need to add genres to  the database like this? Do we use this anywhere??
        let collection_id = db
            .insert_top_collection(collection.title, coll_index as i64)
            .await?;

        for (order_index, sheet_id) in collection.sheet_ids.into_iter().enumerate() {
            if let Some((doc, mut refs)) =
                fetch_sheet(Some(db), &sheet_id, collection_id, order_index as i64).await?
            {
                morpheme_relations.append(&mut refs);
                // spreadsheets::write_to_file(&doc)?;
                document_contents.push(doc);
            } else {
                error!("Failed to process {}", sheet_id);
            }
        }
    }

    // Each document takes a bunch of operations to insert, so do them
    // sequentially instead of concurrently to avoid starving the tasks.
    for doc in document_contents {
        db.insert_document_contents(doc).await?;
    }

    db.insert_morpheme_relations(morpheme_relations).await?;

    Ok(())
}

/// Fetch the contents of the sheet with the given ID, validating the first page as
/// annotation lines and the "Metadata" page as [dailp::DocumentMetadata].
/// Ignores documents already present in the database.
async fn fetch_sheet(
    db: Option<&Database>,
    sheet_id: &str,
    collection_id: Uuid,
    order_index: i64,
) -> Result<Option<(dailp::AnnotatedDoc, Vec<dailp::LexicalConnection>)>> {
    use crate::spreadsheets::AnnotatedLine;

    // Parse the metadata on the second page of each sheet.
    // This includes publication information and a link to the translation.
    let meta = SheetResult::from_sheet(sheet_id, Some(METADATA_SHEET_NAME)).await;

    if meta.is_err() {
        return Ok(None);
    }

    let meta_sheet = meta.unwrap();
    let meta = SheetInterpretation { sheet: meta_sheet }
        .into_metadata(db, false, order_index)
        .await
        .map_err(|e| anyhow::anyhow!("Failed to parse metadata for sheet {}: {}", sheet_id, e))?;

    if db.is_none() {
        return Ok(None);
    }

    // Check if this document exists in the database
    let db = db.unwrap();
    let doc_id_in_db = db.document_id_from_name(&meta.short_name).await?;

    if doc_id_in_db.is_some() {
        println!(
            "{} already exists with ID {}.",
            meta.short_name,
            doc_id_in_db.unwrap().0
        );
        return Ok(None);
    }

    println!("---Processing document: {}---", meta.short_name);

    // Parse references for this particular document.
    println!("parsing references (skipping because broken currently)...");
    let refs: Vec<LexicalConnection> = Vec::new();
    // let refs = SheetResult::from_sheet(sheet_id, Some(REFERENCES_SHEET_NAME)).await;
    // let refs = if let Ok(refs) = refs {
    //     SheetInterpretation { sheet: refs }
    //         .into_references(&meta.short_name)
    //         .await
    // } else {
    //     Vec::new()
    // };

    let document_id = db
        .insert_document(&meta, collection_id, order_index)
        .await?;

    // Fill in blank UUID.
    let meta = dailp::DocumentMetadata {
        id: document_id,
        ..meta
    };

    let page_count = meta
        .page_images
        .as_ref()
        .map(|images| images.count())
        .unwrap_or(0);
    let mut all_lines = Vec::new();
    // Each document page lives in its own tab.
    for index in 0..page_count {
        let tab_name = if page_count > 1 {
            println!("Pulling Page {}...", index + 1);
            Some(format!("Page {}", index + 1))
        } else {
            None
        };

        // Split the contents of each main sheet into semantic lines with
        // several layers.
        let sheet_interpretation = SheetInterpretation {
            sheet: SheetResult::from_sheet(sheet_id, tab_name.as_deref()).await?,
        };

        let mut lines = match sheet_interpretation.split_into_lines().map_err(|e| {
            anyhow::anyhow!(
                "Failed in split_into_lines for sheet {} (tab: {:?}): {}",
                sheet_id,
                tab_name,
                e
            )
        }) {
            Ok(lines) => lines,
            Err(e) => {
                eprintln!(
                    "Warning: Failed to process sheet {} (tab: {:?}): {}",
                    sheet_id, tab_name, e
                );
                continue;
            }
        };
        // TODO Consider page breaks embedded in the last word of a page.
        lines.last_mut().unwrap().ends_page = true;

        all_lines.append(&mut lines);
        tokio::time::sleep(Duration::from_millis(1000)).await;
    }
    let annotated = AnnotatedLine::many_from_semantic(&all_lines, &meta)?;
    let segments = AnnotatedLine::lines_into_segments(annotated, &document_id, &meta.date);
    let doc = dailp::AnnotatedDoc::new(meta, segments);

    Ok(Some((doc, refs)))
}
