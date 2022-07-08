use crate::spreadsheets::SheetResult;
use dailp::{Database};
use anyhow::Result;
use dailp::chapter::Chapter;
use dailp::collection::Collection;

pub async fn migrate_edited_collection(db: &Database) -> anyhow::Result<()> {
    let res = SheetResult::from_sheet("12R07Ks8A5g2jffqoILJw7nRn6GehwNwdwosxaJBwNNM", None)
        .await?
        .into_collection_index(&"Test".to_string(), &4579)?;
    let collection = res;

    let collection_slug = "test_sheet".to_string();

    // Insert collection into database-- hardcode CWKW stuff/move outside of this function?
    db.upsert_collection(collection.title,collection.wordpress_menu_id, collection_slug.clone()).await?;
    // Append both intro and genre chapters together
    // to add all chapters to the database at the same time
   
    let mut chapter_group_one = collection.intro_chapters.clone();
    let mut chapter_group_two = collection.genre_chapters.clone();

    chapter_group_one.append(&mut chapter_group_two);

    db.insert_all_chapters(chapter_group_one, collection_slug.clone()).await?;

    Ok(())
}