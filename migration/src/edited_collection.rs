use crate::spreadsheets::SheetResult;
use anyhow::Result;
use dailp::collection::Chapter;
use dailp::collection::Collection;
use dailp::Database;

pub async fn migrate_edited_collection(db: &Database) -> anyhow::Result<()> {
    let res = SheetResult::from_sheet("12R07Ks8A5g2jffqoILJw7nRn6GehwNwdwosxaJBwNNM", None)
        .await?
        .into_collection_index(
            &"Cherokees Writing the Keetoowah Way".to_string(),
            &4579,
            &"cwkw".to_string(),
        )?;
    let collection = res;

    // Insert collection into database
    db.upsert_collection(&collection).await?;

    // Append both intro and genre chapters together
    // to add all chapters to the database at the same time
    let mut chapter_group_one = collection.intro_chapters;
    let mut chapter_group_two = collection.genre_chapters;

    let chapter_result: Vec<Chapter> = chapter_group_one
        .into_iter()
        .chain(chapter_group_two)
        .collect();

    db.insert_all_chapters(chapter_result, collection.slug)
        .await?;

    Ok(())
}
