use anyhow::Result;
use async_graphql;
use futures::{future::join_all, join};
use mongodb::{
    self,
    bson::{self, to_bson, Bson},
};
use rayon::prelude::*;
use serde::{Deserialize, Serialize};

use crate::retrieve::SheetResult;
use crate::structured::Database;

#[async_graphql::SimpleObject]
#[derive(Serialize, Deserialize, Debug)]
pub struct MorphemeTag {
    #[serde(rename = "_id")]
    id: String,
    crg: String,
    name: String,
    morpheme_type: String,
}

pub async fn migrate_tags(db: &Database) -> Result<()> {
    println!("Migrating tags to database...");

    let (pp_tags, combined_pp, prepronominals, modals, refl, clitics) = join!(
        SheetResult::from_sheet("1D0JZEwE-dj-fKppbosaGhT7Xyyy4lVxmgG02tpEi8nw", None),
        SheetResult::from_sheet("1OMzkbDGY1BqPR_ZwJRe4-F5_I12Ao5OJqqMp8Ej_ZhE", None),
        SheetResult::from_sheet("12v5fqtOztwwLeEaKQJGMfziwlxP4n60riMsN9dYw9Xc", None),
        SheetResult::from_sheet("1QWYWFeK6xy7zciIliizeW2hBfuRPNk6dK5rGJf2pdNc", None),
        SheetResult::from_sheet("1Q_q_1MZbmZ-g0bmj1sQouFFDnLBINGT3fzthPgqgkqo", None),
        SheetResult::from_sheet("1inyNSJSbISFLwa5fBs4Sj0UUkNhXBokuNRxk7wVQF5A", None),
    );

    let pp_tags = into_prenominals(pp_tags?, 3, 7).await?;
    let combined_pp = into_prenominals(combined_pp?, 2, 6).await?;
    let prepronominals = into_prenominals(prepronominals?, 3, 8).await?;
    let modals = into_prenominals(modals?, 4, 5).await?;
    let refl = into_prenominals(refl?, 4, 4).await?;
    let clitics = into_prenominals(clitics?, 4, 4).await?;

    let dict = db.client.collection("tags");
    for entry in pp_tags
        .into_iter()
        .chain(combined_pp)
        .chain(modals)
        .chain(prepronominals)
        .chain(refl)
        .chain(clitics)
    {
        if let Bson::Document(bson_doc) = to_bson(&entry).unwrap() {
            dict.update_one(
                bson::doc! {"_id": entry.id},
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

async fn into_prenominals(
    sheet: SheetResult,
    num_allomorphs: usize,
    gap_to_crg: usize,
) -> Result<Vec<MorphemeTag>> {
    Ok(sheet
        .values
        .into_par_iter()
        .skip(1)
        .filter(|row| !row.is_empty())
        .filter_map(|row| {
            let mut cols = row.into_iter().skip(num_allomorphs);
            Some(MorphemeTag {
                id: cols.next()?,
                name: cols.next()?.trim().to_owned(),
                morpheme_type: cols.clone().skip(1).next()?.trim().to_owned(),
                crg: cols.skip(gap_to_crg).next()?,
            })
        })
        .collect())
}
