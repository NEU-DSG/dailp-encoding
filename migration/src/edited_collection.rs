use crate::spreadsheets::SheetInterpretation;
use anyhow::Result;
use dailp::raw::CollectionChapter;
use dailp::raw::EditedCollection;
use dailp::Database;
use dailp::SheetResult;

pub async fn migrate_edited_collection(db: &Database) -> anyhow::Result<()> {
    let res = SheetInterpretation {
        sheet: SheetResult::from_sheet("12R07Ks8A5g2jffqoILJw7nRn6GehwNwdwosxaJBwNNM", None)
            .await?,
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
