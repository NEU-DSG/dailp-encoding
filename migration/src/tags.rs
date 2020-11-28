use crate::spreadsheets::SheetResult;
use anyhow::Result;
use dailp::{Database, MorphemeTag};
use mongodb::bson;

/// Cherokee has many functional morphemes that are documented.
/// Pulls all the details we have about each morpheme from our spreadsheets,
/// parses it into typed data, then updates the database entry for each.
pub async fn migrate_tags(db: &Database) -> Result<()> {
    let (pp_tags, combined_pp, prepronominals, modals, nominal, refl, clitics) = futures::join!(
        SheetResult::from_sheet("1D0JZEwE-dj-fKppbosaGhT7Xyyy4lVxmgG02tpEi8nw", None),
        SheetResult::from_sheet("1OMzkbDGY1BqPR_ZwJRe4-F5_I12Ao5OJqqMp8Ej_ZhE", None),
        SheetResult::from_sheet("12v5fqtOztwwLeEaKQJGMfziwlxP4n60riMsN9dYw9Xc", None),
        SheetResult::from_sheet("1QWYWFeK6xy7zciIliizeW2hBfuRPNk6dK5rGJf2pdNc", None),
        SheetResult::from_sheet("1MCooadB1bTIKmi_uXBv93DMsv6CyF-L979XOLbFGGgM", None),
        SheetResult::from_sheet("1Q_q_1MZbmZ-g0bmj1sQouFFDnLBINGT3fzthPgqgkqo", None),
        SheetResult::from_sheet("1inyNSJSbISFLwa5fBs4Sj0UUkNhXBokuNRxk7wVQF5A", None),
    );

    let pp_tags = parse_tags(pp_tags?, 3, 7, true).await?;
    let combined_pp = parse_tags(combined_pp?, 2, 6, false).await?;
    let prepronominals = parse_tags(prepronominals?, 3, 8, false).await?;
    let modals = parse_tags(modals?, 4, 5, false).await?;
    let nominal = parse_tags(nominal?, 7, 5, false).await?;
    let refl = parse_tags(refl?, 4, 4, false).await?;
    let clitics = parse_tags(clitics?, 4, 4, false).await?;

    let dict = db.tags_collection();
    let upsert = mongodb::options::UpdateOptions::builder()
        .upsert(true)
        .build();
    for entry in pp_tags
        .into_iter()
        .chain(combined_pp)
        .chain(modals)
        .chain(prepronominals)
        .chain(refl)
        .chain(clitics)
        .chain(nominal)
    {
        dict.update_one(
            bson::doc! {"_id": &entry.id},
            bson::to_document(&entry)?,
            upsert.clone(),
        )
        .await?;
    }

    Ok(())
}

/// Transforms a spreadsheet of morpheme information into a list of type-safe tag objects.
async fn parse_tags(
    sheet: SheetResult,
    num_allomorphs: usize,
    gap_to_crg: usize,
    has_simple: bool,
) -> Result<Vec<MorphemeTag>> {
    use rayon::prelude::*;
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
            let dailp = cols.next()?;
            Some(MorphemeTag {
                id: dailp.clone(),
                taoc: dailp,
                name: cols.next()?.trim().to_owned(),
                morpheme_type: cols.clone().skip(1).next()?.trim().to_owned(),
                // Each sheet has a different number of columns.
                crg: cols.clone().skip(gap_to_crg).next()?,
                learner: if has_simple {
                    cols.skip(gap_to_crg + 2).next()
                } else {
                    None
                },
            })
        })
        .collect())
}
