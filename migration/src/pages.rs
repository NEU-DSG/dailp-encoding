use csv::ReaderBuilder;
<<<<<<< HEAD
use dailp::page::NewPageInput;
use dailp::Database;
use serde::Deserialize;
use std::fs::File;

/// CSV row structure, used to load pages.csv data into a vector
=======
use dailp::page::ContentBlock;
use dailp::page::Markdown;
use dailp::page::NewPageInput;
use dailp::{page::Page, Database};
use serde::Deserialize;
use std::fs::File;

// CSV row structure (includes all fields even though we skip some)
>>>>>>> 978a066d (Page editing backend (#502))
#[derive(Debug, Deserialize)]
struct CsvRow {
    #[serde(rename = "page_id")]
    _page_id: String,
    #[serde(rename = "slug")]
    _slug: String,
    path: String,
    title: String,
    content: String,
}

fn validate_row(row: &CsvRow) -> Result<(), anyhow::Error> {
    if row.title.is_empty() {
        return Err(anyhow::anyhow!("Title is empty"));
    }
    if row.content.is_empty() {
        return Err(anyhow::anyhow!("Content is empty"));
    }
    if row.path.is_empty() {
        return Err(anyhow::anyhow!("Path is empty"));
    }
    Ok(())
}

pub fn load_pages(file_path: &str) -> Result<Vec<NewPageInput>, anyhow::Error> {
    let file = File::open(file_path)?;
    let mut reader = ReaderBuilder::new().from_reader(file);

    let mut pages = Vec::new();
<<<<<<< HEAD
    for result in reader.deserialize() {
        let row: CsvRow = result?;
        //println!("row: {:?}", row);
        let page: NewPageInput = NewPageInput {
            title: row.title,
            body: vec![row.content],
            path: row.path,
        };
        //println!("result: {:?}", page);
        pages.push(page);
    }
=======
>>>>>>> 978a066d (Page editing backend (#502))
    for (idx, result) in reader.deserialize::<CsvRow>().enumerate() {
        match result {
            Ok(row) => {
                if let Err(e) = validate_row(&row) {
                    println!("Error migrating pages: {:?}, row: {:?}", e, idx);
                    continue;
                }
                let page: NewPageInput = NewPageInput {
                    title: row.title,
                    body: vec![row.content],
                    path: row.path,
                };
                pages.push(page);
            }
            Err(e) => {
                println!("Error migrating pages: {:?}, row: {:?}", e, idx);
            }
        }
    }
    Ok(pages)
}

pub async fn migrate_pages(db: &Database) -> anyhow::Result<()> {
<<<<<<< HEAD
    // Resolve pages.csv relative to this crate's directory so running from target/ works
    let csv_path = concat!(env!("CARGO_MANIFEST_DIR"), "/pages.csv");
    let pages = load_pages(csv_path)?;

=======
    //println!("Migrating pages...");
    let pages = load_pages("pages.csv")?;
    //for page in pages {
    //db.insert_page(NewPageInput::from(page.clone())).await?;
    //}
>>>>>>> 978a066d (Page editing backend (#502))
    for page in pages {
        db.upsert_page(NewPageInput::from(page.clone())).await?;
    }
    Ok(())
}
