use crate::spreadsheets::SheetResult;
use anyhow::Result;
use dailp::Database;
use futures::future::join_all;
use mongodb::bson::{self, Bson};

pub async fn migrate_dictionaries(db: &Database) -> Result<()> {
    println!("Migrating DF1975 and DF2003 to database...");
    let (df1975, df2003, root_nouns) = futures::join!(
        SheetResult::from_sheet("11ssqdimOQc_hp3Zk8Y55m6DFfKR96OOpclUg5wcGSVE", None),
        SheetResult::from_sheet("18cKXgsfmVhRZ2ud8Cd7YDSHexs1ODHo6fkTPrmnwI1g", None),
        SheetResult::from_sheet("1XuQIKzhGf_mGCH4-bHNBAaQqTAJDNtPbNHjQDhszVRo", None)
    );

    let df1975 = df1975?.into_df1975("DF1975", 1975, true)?;
    let df2003 = df2003?.into_df1975("DF2003", 2003, false)?;
    let root_nouns = root_nouns?.into_nouns("DF1975", 1975)?;

    let dict = db.client.collection("dictionary");
    let entries = df1975.into_iter().chain(df2003).chain(root_nouns);
    join_all(entries.filter_map(|entry| {
        if let Bson::Document(bson_doc) = bson::to_bson(&entry).unwrap() {
            Some(
                dict.update_one(
                    bson::doc! {"_id": entry.id},
                    bson_doc,
                    mongodb::options::UpdateOptions::builder()
                        .upsert(true)
                        .build(),
                ),
            )
        } else {
            None
        }
    }))
    .await;

    Ok(())
}
