use csv::ReaderBuilder;
use dailp::page::ContentBlock;
use dailp::page::Markdown;
use dailp::page::NewPageInput;
use dailp::{page::Page, Database};
use serde::Deserialize;
use std::fs::File;

// CSV row structure (includes all fields even though we skip some)
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
    //println!("Migrating pages...");
    let pages = load_pages("pages.csv")?;
    //for page in pages {
    //db.insert_page(NewPageInput::from(page.clone())).await?;
    //}
    for page in pages {
        db.upsert_page(NewPageInput::from(page.clone())).await?;
    }
    Ok(())
}
