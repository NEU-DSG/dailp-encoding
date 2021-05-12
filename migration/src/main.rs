//! This program encodes spreadsheets hosted on Google Drive annotating source documents with linguistic information into equivalent database entries.

mod connections;
mod contributors;
mod early_vocab;
mod lexical;
mod spreadsheets;
mod tags;
mod translations;

use anyhow::{bail, Result};
use log::{error, info};
use std::time::Duration;

pub const METADATA_SHEET_NAME: &str = "Metadata";
pub const REFERENCES_SHEET_NAME: &str = "References";

/// Migrates DAILP data from several Google spreadsheets to a MongoDB instance.
#[tokio::main]
async fn main() -> Result<()> {
    dotenv::dotenv().ok();

    pretty_env_logger::init();

    migrate_image_sources().await?;

    contributors::migrate_all().await?;

    info!("Migrating connections...");
    connections::migrate_connections().await?;

    migrate_data().await?;

    info!("Migrating early vocabularies...");
    early_vocab::migrate_all().await?;

    info!("Migrating DF1975 and DF2003...");
    lexical::migrate_dictionaries().await?;

    info!("Migrating tags to database...");
    tags::migrate_tags().await?;

    Ok(())
}

async fn migrate_image_sources() -> Result<()> {
    use dailp::{ImageSource, ImageSourceId};
    update_image_source(&[
        ImageSource {
            id: ImageSourceId("beinecke".to_owned()),
            url: "https://collections.library.yale.edu/iiif/2".to_owned(),
        },
        ImageSource {
            id: ImageSourceId("dailp".to_owned()),
            url: "https://wd0ahsivs3.execute-api.us-east-1.amazonaws.com/latest/iiif/2".to_owned(),
        },
    ])
    .await
}

/// Parses our annotated document spreadsheets, migrating that data to our
/// database and writing them into TEI XML files.
async fn migrate_data() -> Result<()> {
    // Pull the list of annotated documents from our index sheet.
    let index =
        spreadsheets::SheetResult::from_sheet("1sDTRFoJylUqsZlxU57k1Uj8oHhbM3MAzU8sDgTfO7Mk", None)
            .await?
            .into_index()?;

    info!("Migrating documents to database...");

    // Retrieve data for spreadsheets in sequence.
    // Because of Google API rate limits, we have to limit the number of
    // simultaneous connections to the sheets endpoint.
    for sheet_id in &index.sheet_ids {
        if let Some((doc, refs)) = fetch_sheet(sheet_id).await? {
            spreadsheets::write_to_file(&doc)?;
            spreadsheets::migrate_documents_to_db(&[(doc, refs)]).await?;
        } else {
            error!("Failed to process {}", sheet_id);
        }
    }
    Ok(())
}

/// Fetch the contents of the sheet with the given ID, validating the first page as
/// annotation lines and the "Metadata" page as [dailp::DocumentMetadata].
async fn fetch_sheet(
    sheet_id: &str,
) -> Result<Option<(dailp::AnnotatedDoc, Vec<dailp::LexicalConnection>)>> {
    use crate::spreadsheets::AnnotatedLine;

    // Parse the metadata on the second page of each sheet.
    // This includes publication information and a link to the translation.
    let meta = spreadsheets::SheetResult::from_sheet(sheet_id, Some(METADATA_SHEET_NAME)).await;
    if let Ok(meta_sheet) = meta {
        let meta = meta_sheet.into_metadata(false).await?;

        // Parse references for this particular document.
        info!("parsing references...");
        let refs =
            spreadsheets::SheetResult::from_sheet(sheet_id, Some(REFERENCES_SHEET_NAME)).await;
        let refs = if let Ok(refs) = refs {
            refs.into_references(&meta.id).await
        } else {
            Vec::new()
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
                info!("Pulling Page {}...", index + 1);
                Some(format!("Page {}", index + 1))
            } else {
                None
            };

            // Split the contents of each main sheet into semantic lines with
            // several layers.
            let mut lines = spreadsheets::SheetResult::from_sheet(sheet_id, tab_name.as_deref())
                .await?
                .split_into_lines();
            // TODO Consider page breaks embedded in the last word of a page.
            lines.last_mut().unwrap().ends_page = true;

            all_lines.append(&mut lines);
            tokio::time::sleep(Duration::from_millis(1700)).await;
        }
        let annotated = AnnotatedLine::many_from_semantic(&all_lines, &meta);
        let segments = AnnotatedLine::lines_into_segments(annotated, &meta.id, &meta.date);
        let doc = dailp::AnnotatedDoc::new(meta, segments);

        Ok(Some((doc, refs)))
    } else {
        Ok(None)
    }
}

async fn graphql_mutate(
    method: &str,
    content_list: impl IntoIterator<Item = String>,
) -> Result<()> {
    use itertools::Itertools as _;
    lazy_static::lazy_static! {
        static ref CLIENT: reqwest::Client = reqwest::Client::new();
        static ref ENDPOINT: String = std::env::var("DAILP_GRAPHQL_URL").unwrap();
        static ref PASSWORD: String = std::env::var("MONGODB_PASSWORD").unwrap();
    }
    // Chunk our contents to make fewer requests to the server that handles
    // pushing this data to the database.
    for mut chunk in content_list
        .into_iter()
        // Each item corresponds to one GraphQL method call.
        // For now, all the mutation calls are structured the same way to make
        // this easier.
        .enumerate()
        .map(|(i, x)| {
            format!(
                "r{}: {}(password: \"{}\", contents: \"{}\")\n",
                i,
                method,
                *PASSWORD,
                base64::encode(&x)
            )
        })
        .chunks(10)
        .into_iter()
    {
        let s = chunk.join("");
        let query = serde_json::json!({
            "operationName": null,
            "query": format!("mutation {{\n{}\n}}", s)
        });
        let response = CLIENT
            .post(&*ENDPOINT)
            .json(&query)
            .send()
            .await?
            .json::<serde_json::Value>()
            .await?;
        if let Some(errors) = response.get("errors") {
            bail!("Mutation '{}' failed: {}", method, errors);
        }
    }
    Ok(())
}

async fn update_tag(tag: impl IntoIterator<Item = &dailp::MorphemeTag>) -> Result<()> {
    graphql_mutate(
        "updateTag",
        tag.into_iter()
            .map(|tag| serde_json::to_string(tag).unwrap()),
    )
    .await
}

async fn update_document(tag: impl IntoIterator<Item = &dailp::AnnotatedDoc>) -> Result<()> {
    graphql_mutate(
        "updateDocument",
        tag.into_iter()
            .map(|tag| serde_json::to_string(tag).unwrap()),
    )
    .await
}

async fn update_form(tag: impl IntoIterator<Item = &dailp::AnnotatedForm>) -> Result<()> {
    graphql_mutate(
        "updateForm",
        tag.into_iter()
            .map(|tag| serde_json::to_string(tag).unwrap()),
    )
    .await
}

async fn update_connection(tag: impl IntoIterator<Item = &dailp::LexicalConnection>) -> Result<()> {
    graphql_mutate(
        "updateConnection",
        tag.into_iter()
            .map(|tag| serde_json::to_string(tag).unwrap()),
    )
    .await
}

async fn update_person(tag: impl IntoIterator<Item = &dailp::ContributorDetails>) -> Result<()> {
    graphql_mutate(
        "updatePerson",
        tag.into_iter()
            .map(|tag| serde_json::to_string(tag).unwrap()),
    )
    .await
}

async fn update_image_source(tag: impl IntoIterator<Item = &dailp::ImageSource>) -> Result<()> {
    graphql_mutate(
        "updateImageSource",
        tag.into_iter()
            .map(|tag| serde_json::to_string(tag).unwrap()),
    )
    .await
}
