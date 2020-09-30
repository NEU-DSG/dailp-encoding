use anyhow::Result;
use async_graphql;
use futures::join;
use mongodb::{
    self,
    bson::{self, to_bson, Bson},
};
use rayon::prelude::*;
use serde::{Deserialize, Serialize};

use crate::retrieve::SheetResult;
use crate::structured::Database;

/// Represents a morphological gloss tag without commiting to a single representation.
#[async_graphql::SimpleObject]
#[derive(Serialize, Deserialize, Debug)]
pub struct MorphemeTag {
    /// Standard annotation tag for this morpheme, defined by DAILP.
    #[serde(rename = "_id")]
    id: String,
    /// Alternate form that conveys a simple English representation.
    simple: String,
    /// Alternate form of this morpheme from Cherokee Reference Grammar.
    crg: String,
    /// English title
    name: String,
    /// The kind of morpheme, whether prefix or suffix.
    morpheme_type: String,
}

/// Cherokee has many functional morphemes that are documented.
/// Pulls all the details we have about each morpheme from our spreadsheets,
/// parses it into typed data, then updates the database entry for each.
pub async fn migrate_tags(db: &Database) -> Result<()> {
    println!("Migrating tags to database...");

    let (pp_tags, combined_pp, prepronominals, modals, nominal, refl, clitics) = join!(
        SheetResult::from_sheet("1D0JZEwE-dj-fKppbosaGhT7Xyyy4lVxmgG02tpEi8nw", None),
        SheetResult::from_sheet("1OMzkbDGY1BqPR_ZwJRe4-F5_I12Ao5OJqqMp8Ej_ZhE", None),
        SheetResult::from_sheet("12v5fqtOztwwLeEaKQJGMfziwlxP4n60riMsN9dYw9Xc", None),
        SheetResult::from_sheet("1QWYWFeK6xy7zciIliizeW2hBfuRPNk6dK5rGJf2pdNc", None),
        SheetResult::from_sheet("1MCooadB1bTIKmi_uXBv93DMsv6CyF-L979XOLbFGGgM", None),
        SheetResult::from_sheet("1Q_q_1MZbmZ-g0bmj1sQouFFDnLBINGT3fzthPgqgkqo", None),
        SheetResult::from_sheet("1inyNSJSbISFLwa5fBs4Sj0UUkNhXBokuNRxk7wVQF5A", None),
    );

    let pp_tags = parse_tags(pp_tags?, 3, 7).await?;
    let combined_pp = parse_tags(combined_pp?, 2, 6).await?;
    let prepronominals = parse_tags(prepronominals?, 3, 8).await?;
    let modals = parse_tags(modals?, 4, 5).await?;
    let nominal = parse_tags(nominal?, 7, 5).await?;
    let refl = parse_tags(refl?, 4, 4).await?;
    let clitics = parse_tags(clitics?, 4, 4).await?;

    let dict = db.client.collection("tags");
    for entry in pp_tags
        .into_iter()
        .chain(combined_pp)
        .chain(modals)
        .chain(prepronominals)
        .chain(refl)
        .chain(clitics)
        .chain(nominal)
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

/// Transforms a spreadsheet of morpheme information into a list of type-safe tag objects.
async fn parse_tags(
    sheet: SheetResult,
    num_allomorphs: usize,
    gap_to_crg: usize,
) -> Result<Vec<MorphemeTag>> {
    Ok(sheet
        .values
        .into_par_iter()
        // The first row is headers.
        .skip(1)
        // There are a few empty spacing rows to ignore.
        .filter(|row| !row.is_empty())
        .filter_map(|row| {
            // Skip over allomorphs, and instead allow them to emerge from our texts.
            let mut cols = row.into_iter().skip(num_allomorphs);
            Some(MorphemeTag {
                id: cols.next()?,
                name: cols.next()?.trim().to_owned(),
                simple: String::new(),
                morpheme_type: cols.clone().skip(1).next()?.trim().to_owned(),
                // Each sheet has a different number of columns.
                crg: cols.skip(gap_to_crg).next()?,
            })
        })
        .collect())
}
