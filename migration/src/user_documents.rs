use dailp::raw::EditedCollection;
use dailp::Database;

pub async fn create_user_documents_collection(db: &Database) -> anyhow::Result<()> {
    println!("Creating user documents collection...");

    // Create the edited collection for the UI
    let user_documents_collection = EditedCollection {
        slug: "user_documents".to_string(),
        title: "User-Created Documents".to_string(),
        wordpress_menu_id: None,
        description: None,
        thumbnail_url: None,
        chapters: Vec::new(), // No chapters initially - we'll create them per document
    };

    db.upsert_collection(&user_documents_collection).await?;

    Ok(())
}
