use crate::spreadsheets::SheetResult;
use anyhow::Result;
use dailp::{Database, MorphemeTag, TagForm};
use mongodb::bson;

/// Cherokee has many functional morphemes that are documented.
/// Pulls all the details we have about each morpheme from our spreadsheets,
/// parses it into typed data, then updates the database entry for each.
pub async fn migrate_tags(db: &Database) -> Result<()> {
    let (glossary, pp_tags, combined_pp, refl) = futures::join!(
        SheetResult::from_sheet("17LSuDu7QHJfJyLDVJjO0f4wmTHQLVyHuSktr6OrbD_M", None),
        SheetResult::from_sheet("1D0JZEwE-dj-fKppbosaGhT7Xyyy4lVxmgG02tpEi8nw", None),
        SheetResult::from_sheet("1MCooadB1bTIKmi_uXBv93DMsv6CyF-L979XOLbFGGgM", None),
        SheetResult::from_sheet("1Q_q_1MZbmZ-g0bmj1sQouFFDnLBINGT3fzthPgqgkqo", None),
    );

    let glossary = parse_tag_glossary(glossary?)?;
    let pp_tags = parse_tags(pp_tags?, 3, 7, true)?;
    let combined_pp = parse_tags(combined_pp?, 2, 6, false)?;
    let refl = parse_tags(refl?, 4, 4, false)?;

    let dict = db.tags_collection();
    let upsert = mongodb::options::UpdateOptions::builder()
        .upsert(true)
        .build();
    for entry in pp_tags
        .into_iter()
        .chain(combined_pp)
        .chain(refl)
        .chain(glossary)
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
fn parse_tags(
    sheet: SheetResult,
    num_allomorphs: usize,
    gap_to_crg: usize,
    has_simple: bool,
) -> Result<Vec<MorphemeTag>> {
    Ok(sheet
        .values
        .into_iter()
        // The first row is headers.
        .skip(1)
        // There are a few empty spacing rows to ignore.
        .filter(|row| !row.is_empty())
        .filter_map(|row| {
            // Skip over allomorphs, and instead allow them to emerge from our texts.
            let mut cols = row.into_iter().skip(num_allomorphs);
            let dailp = cols.next()?;
            let name = cols.next()?.trim().to_owned();
            Some(MorphemeTag {
                id: dailp.clone(),
                // FIXME Use title and shape from the sheet.
                taoc: Some(TagForm {
                    tag: dailp,
                    title: name.clone(),
                    shape: String::new(),
                }),
                morpheme_type: cols.clone().skip(1).next()?.trim().to_owned(),
                // FIXME Use title and shape from the sheet.
                crg: Some(TagForm {
                    // Each sheet has a different number of columns.
                    tag: cols.clone().skip(gap_to_crg).next()?,
                    title: name,
                    shape: String::new(),
                }),
                learner: if has_simple {
                    cols.skip(gap_to_crg + 2).next()
                } else {
                    None
                },
                definition: None,
            })
        })
        .collect())
}

/// Transforms a spreadsheet of morpheme information into a list of type-safe tag objects.
fn parse_tag_glossary(sheet: SheetResult) -> Result<Vec<MorphemeTag>> {
    Ok(sheet
        .values
        .into_iter()
        // The first row is headers.
        .skip(1)
        // There are a few empty spacing rows to ignore.
        .filter(|row| !row.is_empty())
        .filter_map(|row| {
            // Skip over allomorphs, and instead allow them to emerge from our texts.
            let mut cols = row.into_iter();
            let morpheme_type = cols.next()?;
            let dailp = parse_tag_section(&mut cols, false)?;
            let crg = parse_tag_section(&mut cols, true);
            let taoc = parse_tag_section(&mut cols, true);
            let definition = cols.next();
            Some(MorphemeTag {
                id: dailp.tag,
                taoc,
                crg,
                morpheme_type,
                learner: None,
                definition,
            })
        })
        .collect())
}

fn parse_tag_section(values: &mut impl Iterator<Item = String>, has_page: bool) -> Option<TagForm> {
    let tag = values.next()?;
    let title = values.next()?;
    let page_num = if has_page { values.next() } else { None };
    let shape = values.next()?;
    if !tag.is_empty() {
        Some(TagForm { tag, title, shape })
    } else {
        None
    }
}
