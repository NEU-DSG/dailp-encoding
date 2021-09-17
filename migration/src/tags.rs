use crate::spreadsheets::SheetResult;
use anyhow::Result;
use dailp::{MorphemeTag, TagForm};
use log::info;

/// Cherokee has many functional morphemes that are documented.
/// Pulls all the details we have about each morpheme from our spreadsheets,
/// parses it into typed data, then updates the database entry for each.
pub async fn migrate_tags() -> Result<()> {
    let glossary = SheetResult::from_sheet(
        "17LSuDu7QHJfJyLDVJjO0f4wmTHQLVyHuSktr6OrbD_M",
        Some("DAILP Storage Tags"),
    )
    .await;

    info!("Parsing sheet results...");
    let glossary = parse_tag_glossary(glossary?)?;

    info!("Pushing tags to db...");
    crate::update_tag(&glossary).await?;

    // Make sure all reference grammars are cited.
    migrate_glossary_metadata("17LSuDu7QHJfJyLDVJjO0f4wmTHQLVyHuSktr6OrbD_M").await?;

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
            let _name = cols.next()?;
            let morpheme_type = cols.next()?;
            let _dailp_form = cols.next()?;
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

/// Migrate the metadata for each source document used in creating the glossary.
/// There may be multiple entries here, because there are several grammars we use.
async fn migrate_glossary_metadata(sheet_id: &str) -> Result<()> {
    use itertools::Itertools;
    let sheet = SheetResult::from_sheet(sheet_id, Some("Metadata")).await?;
    let docs = sheet
        .values
        .into_iter()
        .chunks(7)
        .into_iter()
        .filter_map(|mut values| {
            Some(dailp::AnnotatedDoc {
                meta: dailp::DocumentMetadata {
                    id: dailp::DocumentId(values.next()?.pop()?),
                    title: values.next()?.pop()?,
                    date: Some(dailp::Date(chrono::NaiveDate::from_ymd(
                        values.next()?.pop()?.parse().unwrap(),
                        1,
                        1,
                    ))),
                    contributors: values
                        .next()?
                        .into_iter()
                        .skip(1)
                        .map(dailp::Contributor::new_author)
                        .collect(),
                    collection: Some("Reference Materials".to_owned()),
                    genre: None,
                    is_reference: true,
                    page_images: None,
                    sources: Vec::new(),
                    translation: None,
                    audio_recording: None,
                    order_index: 0,
                },
                segments: None,
            })
        })
        .collect::<Vec<_>>();
    crate::update_document(&docs).await?;
    Ok(())
}

fn parse_tag_section(values: &mut impl Iterator<Item = String>, has_page: bool) -> Option<TagForm> {
    let tag = values.next()?;
    let title = values.next()?;
    let definition = values.next().unwrap_or_default();
    let _page_num = if has_page { values.next() } else { None };
    let shape = values.next().filter(|x| !x.is_empty());
    let details_url = values.next().filter(|x| !x.is_empty());
    if !tag.is_empty() {
        Some(TagForm {
            tag,
            title,
            definition,
            shape,
            details_url,
        })
    } else {
        None
    }
}
