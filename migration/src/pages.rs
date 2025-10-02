use dailp::{Database, page::Page};
use csv::ReaderBuilder;
use std::fs::File;
use serde::Deserialize;
use dailp::page::ContentBlock;
use dailp::page::Markdown;
use dailp::page::NewPageInput;


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


pub fn load_pages(file_path:&str) -> Result<Vec<NewPageInput>, anyhow::Error> {

  let file = File::open(file_path)?;
  let mut reader = ReaderBuilder::new()
  .from_reader(file);

  let mut pages = Vec::new();
  for result in reader.deserialize() {
    let row: CsvRow = result?;
    //println!("row: {:?}", row);
    let page: NewPageInput = NewPageInput{
      title: row.title,
      body: vec![row.content],
      path: row.path,
    };
    //println!("result: {:?}", page);
    pages.push(page);
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
    db.insert_page(NewPageInput::from(page.clone())).await?;
  }
  Ok(())
}
