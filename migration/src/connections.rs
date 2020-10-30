use crate::spreadsheets::SheetResult;
use dailp::{Database, LexicalConnection};
use mongodb::{bson, bson::Bson};

pub async fn migrate_connections(db: &Database) -> anyhow::Result<()> {
    let res = SheetResult::from_sheet("1ab9ddOiuoCbCaYWwhDOLk-Xj8OOS0dkHwmMqktZabpM", None).await?;
    // Skip header row.
    let connections = res.values.into_iter().skip(1).filter_map(|mut row| {
        let to = row.pop()?;
        let from = row.pop()?;
        Some(LexicalConnection {
            id: format!("{}->{}", from, to),
            to,
            from,
        })
    });

    let dict = db.connections_collection();
    for conn in connections {
        if let Bson::Document(bson_doc) = bson::to_bson(&conn)? {
            dict.update_one(
                bson::doc! {"_id": conn.id},
                bson_doc,
                mongodb::options::UpdateOptions::builder()
                    .upsert(true)
                    .build(),
            )
            .await?;
        }
    }

    Ok(())
}
