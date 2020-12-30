mod connections;
mod early_vocab;
mod lexical;
mod spreadsheets;
mod tags;
mod translations;

use anyhow::Result;
use std::time::Duration;

pub const METADATA_SHEET_NAME: &str = "Metadata";
pub const REFERENCES_SHEET_NAME: &str = "References";

/// Migrates DAILP data from several Google spreadsheets to a MongoDB instance.
#[tokio::main]
async fn main() -> Result<()> {
    dotenv::dotenv().ok();

    println!("Migrating connections...");
    connections::migrate_connections().await?;

    migrate_data().await?;

    println!("Migrating early vocabularies...");
    early_vocab::migrate_all().await?;

    println!("Migrating DF1975 and DF2003...");
    lexical::migrate_dictionaries().await?;

    println!("Migrating tags to database...");
    tags::migrate_tags().await?;

    Ok(())
}

/// Parses our annotated document spreadsheets, migrating that data to our
/// database and writing them into TEI XML files.
async fn migrate_data() -> Result<()> {
    // Pull the list of annotated documents from our index sheet.
    let index =
        spreadsheets::SheetResult::from_sheet("1sDTRFoJylUqsZlxU57k1Uj8oHhbM3MAzU8sDgTfO7Mk", None)
            .await?
            .into_index()?;

    println!("Migrating documents to database...");

    // Retrieve data for spreadsheets in sequence.
    // Because of Google API rate limits, we have to limit the number of
    // simultaneous connections to the sheets endpoint.
    for sheet_id in &index.sheet_ids {
        if let Some((doc, refs)) = fetch_sheet(sheet_id).await? {
            spreadsheets::write_to_file(&doc)?;
            spreadsheets::migrate_documents_to_db(&[(doc, refs)]).await?;
        }
        tokio::time::delay_for(Duration::from_millis(1000)).await;
    }
    Ok(())
}

/// Fetch the contents of the sheet with the given ID, validating the first page as
/// annotation lines and the "Metadata" page as [dailp::DocumentMetadata].
async fn fetch_sheet(
    sheet_id: &str,
) -> Result<Option<(dailp::AnnotatedDoc, Vec<dailp::LexicalConnection>)>> {
    use crate::spreadsheets::AnnotatedLine;
    println!("parsing sheet {}...", sheet_id);

    // Parse the metadata on the second page of each sheet.
    // This includes publication information and a link to the translation.
    let meta = spreadsheets::SheetResult::from_sheet(sheet_id, Some(METADATA_SHEET_NAME)).await;
    if let Ok(meta_sheet) = meta {
        let meta = meta_sheet.into_metadata(false).await?;

        // Parse references for this particular document.
        let refs =
            spreadsheets::SheetResult::from_sheet(sheet_id, Some(REFERENCES_SHEET_NAME)).await;
        let refs = if let Ok(refs) = refs {
            refs.into_references(&meta.id).await
        } else {
            Vec::new()
        };

        let page_count = meta.page_images.len();
        let mut all_lines = Vec::new();
        // Each document page lives in its own tab.
        for index in 0..page_count {
            let tab_name = if index > 0 {
                Some(format!("Page {}", index + 1))
            } else {
                None
            };

            // Split the contents of each main sheet into semantic lines with
            // several layers.
            let mut lines =
                spreadsheets::SheetResult::from_sheet(sheet_id, tab_name.as_ref().map(|x| &**x))
                    .await?
                    .split_into_lines();
            // TODO Consider page breaks embedded in the last word of a page.
            lines.last_mut().unwrap().ends_page = true;

            all_lines.append(&mut lines);
        }
        let annotated = AnnotatedLine::many_from_semantic(&all_lines, &meta);
        let segments = AnnotatedLine::to_segments(annotated, &meta.id, &meta.date);
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
        // println!("{:?}", query);
        let res = CLIENT.post(&*ENDPOINT).json(&query).send().await?;
        // println!("{:?}", res);
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
