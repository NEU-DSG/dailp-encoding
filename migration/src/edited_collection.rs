use crate::spreadsheets::SheetInterpretation;
use dailp::Database;
use dailp::SheetResult;

pub async fn migrate_edited_collection(db: &Database) -> anyhow::Result<()> {
    let stage = std::env::var("TF_STAGE").unwrap_or("".to_owned()); // "" | "dev" | "uat" | "prod"
                                                                    // If env is prod, use stable prod collection. Otherwise, use development collection.
    let toc_sheet = if stage == "prod" {
        "12R07Ks8A5g2jffqoILJw7nRn6GehwNwdwosxaJBwNNM"
    } else {
        "1moxVGRJsNQlfQ7MWDzxRfx4_xyo-QZOUHi8wISoTw_Y"
    };
    let res = SheetInterpretation {
        sheet: SheetResult::from_sheet(toc_sheet, None).await?,
    }
    .into_collection_index(
        &"Cherokees Writing the Keetoowah Way".to_string(),
        &4579,
        &"cwkw".to_string(),
    )?;
    let collection = res;

    // Insert collection into database
    db.upsert_collection(&collection).await?;

    db.insert_all_chapters(collection.chapters, collection.slug)
        .await?;

    Ok(())
}
