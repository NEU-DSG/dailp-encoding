use crate::spreadsheets::SheetResult;
use anyhow::Result;
use dailp::{MorphemeTag, TagForm};

/// Cherokee has many functional morphemes that are documented.
/// Pulls all the details we have about each morpheme from our spreadsheets,
/// parses it into typed data, then updates the database entry for each.
pub async fn migrate_tags() -> Result<()> {
    let glossary = SheetResult::from_sheet(
        "17LSuDu7QHJfJyLDVJjO0f4wmTHQLVyHuSktr6OrbD_M",
        Some("DAILP Storage Tags"),
    )
    .await;

    println!("Parsing sheet results...");
    let glossary = parse_tag_glossary(glossary?)?;

    println!("Pushing tags to db...");
    crate::update_tag(&glossary).await?;

    Ok(())
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
            let id = cols.next()?;
            let name = cols.next()?;
            let morpheme_type = cols.next()?;
            let dailp_form = cols.next()?;
            let crg = parse_tag_section(&mut cols, true);
            let taoc = parse_tag_section(&mut cols, true);
            let learner = parse_tag_section(&mut cols, false);
            Some(MorphemeTag {
                id,
                taoc,
                crg,
                morpheme_type,
                learner,
            })
        })
        .collect())
}

fn parse_tag_section(values: &mut impl Iterator<Item = String>, has_page: bool) -> Option<TagForm> {
    let tag = values.next()?;
    let title = values.next()?;
    let definition = values.next()?;
    let page_num = if has_page { values.next() } else { None };
    let shape = values.next();
    if !tag.is_empty() {
        Some(TagForm {
            tag,
            title,
            definition,
            shape,
        })
    } else {
        None
    }
}
