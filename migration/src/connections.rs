use crate::spreadsheets::SheetResult;
use dailp::{Database, LexicalConnection};
use mongodb::bson;

pub async fn migrate_connections(db: &Database) -> anyhow::Result<()> {
    let res = SheetResult::from_sheet("1ab9ddOiuoCbCaYWwhDOLk-Xj8OOS0dkHwmMqktZabpM", None).await?;
    // Skip header row.
    let connections = res.values.into_iter().skip(1).flat_map(|row| {
        let mut row = row.into_iter();
        let from = row.next().unwrap();
        row.filter_map(|to| LexicalConnection::parse(&from, &to))
            .collect::<Vec<_>>()
    });

    let dict = db.connections_collection();

    // Clear all connections before starting.
    dict.delete_many(bson::doc! {}, None).await?;

    let upsert = mongodb::options::UpdateOptions::builder()
        .upsert(true)
        .build();
    for conn in connections {
        dict.update_one(
            bson::doc! {"_id": &conn.id},
            bson::to_document(&conn)?,
            upsert.clone(),
        )
        .await?;
    }

    Ok(())
}
