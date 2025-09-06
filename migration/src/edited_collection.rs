use crate::spreadsheets::SheetInterpretation;
use dailp::Database;
use dailp::SheetResult;

// NOTE intermediary types like this will be helpful in reorganizing migration
struct EditedCollectionInfo {
    pub sheet_id: String,
    pub title: String,
    pub description: String,
    pub wp_menu_id: i64,
    pub slug: String,
    pub thumbnail_url: String,
}

pub async fn migrate_edited_collection(db: &Database) -> anyhow::Result<()> {
    // If env is prod, use stable prod collection. Otherwise, use development collection.
    let stage = std::env::var("TF_STAGE").unwrap_or("".to_owned()); // "" | "dev" | "uat" | "prod"
                                                                    // TODO there should be a seperate point of data entry
    let cwkw = EditedCollectionInfo {
        sheet_id: if stage == "prod" {
            "12R07Ks8A5g2jffqoILJw7nRn6GehwNwdwosxaJBwNNM".to_owned()
        } else {
            "1moxVGRJsNQlfQ7MWDzxRfx4_xyo-QZOUHi8wISoTw_Y".to_owned()
        },
        title: "Cherokees Writing the Keetoowah Way".to_owned(),
        description: "A collection of Cherokee texts and stories from the Keetoowah tradition."
            .to_owned(),
        wp_menu_id: 4579,
        slug: "cwkw".to_owned(),
        thumbnail_url: "".to_owned(),
    };

    let wjs = EditedCollectionInfo {
        sheet_id: "1fDYTFrIvU-mCBPyQfRZcwG8sGM4td9kGECxnuJe2StA".to_owned(), // TODO add prod TOC
        title: "Willie Jumper Manuscripts".to_owned(),
        description: "A collection of manuscripts and stories from Willie Jumper.".to_owned(),
        wp_menu_id: 4579, // TODO create unique landing page
        slug: "willie_jumper_stories".to_owned(),
        thumbnail_url: "".to_owned(),
    };

    let collections: Vec<EditedCollectionInfo> = vec![cwkw, wjs];

    for collection_info in collections {
        let collection = SheetInterpretation {
            sheet: SheetResult::from_sheet(&collection_info.sheet_id, None).await?,
        }
        .into_collection_index(
            &collection_info.title,
            &collection_info.description,
            &collection_info.wp_menu_id,
            &collection_info.slug,
        )?;
        db.upsert_collection(&collection).await?;
        db.insert_all_chapters(collection.chapters, collection.slug)
            .await?;
    }

    Ok(())
}
