use anyhow::Result;
use dailp::{AbstractMorphemeTag, Database, MorphemeTag, SheetResult, Uuid, WordSegmentRole};

/// Cherokee has many functional morphemes that are documented.
/// Pulls all the details we have about each morpheme from our spreadsheets,
/// parses it into typed data, then updates the database entry for each.
pub async fn migrate_tags(db: &Database) -> Result<()> {
    // Make sure all reference grammars are cited.
    migrate_glossary_metadata(db, "17LSuDu7QHJfJyLDVJjO0f4wmTHQLVyHuSktr6OrbD_M").await?;

    let glossary = SheetResult::from_sheet(
        "17LSuDu7QHJfJyLDVJjO0f4wmTHQLVyHuSktr6OrbD_M",
        Some("DAILP Storage Tags"),
    )
    .await;

    println!("Parsing sheet results...");
    let glossary = parse_tag_glossary(glossary?)?;

    // Insert all of the internal tags that each system will convert from.
    for tag in glossary {
        db.insert_abstract_tag(tag).await?;
    }

    let crg = db
        .insert_morpheme_system("CRG".into(), "Cherokee Reference Grammar".into())
        .await?;
    sync_morpheme_system(db, "CRG Merged Glossary", crg).await?;
    let taoc = db
        .insert_morpheme_system("TAOC".into(), "Tone and Accent in Oklahoma Cherokee".into())
        .await?;
    sync_morpheme_system(db, "TAOC Glossary", taoc).await?;
    let learner = db
        .insert_morpheme_system("LEARNER".into(), "Learner System".into())
        .await?;
    sync_morpheme_system(db, "Learner Glossary", learner).await?;

    Ok(())
}

async fn sync_morpheme_system(db: &Database, sheet_name: &str, system_id: Uuid) -> Result<()> {
    let sheet = SheetResult::from_sheet(
        "17LSuDu7QHJfJyLDVJjO0f4wmTHQLVyHuSktr6OrbD_M",
        Some(sheet_name),
    )
    .await?;
    let glossary = sheet.values.into_iter().skip(1).filter_map(|row| {
        let mut cols = row.into_iter();
        let internal_tags_str = cols.next()?;
        let target_tag = cols.next()?;
        let name = cols.next()?;
        let definition = cols.next().unwrap_or_default();
        let _page_num = cols.next().filter(|x| !x.is_empty());
        let shape = cols.next().filter(|x| !x.is_empty());
        let details_url = cols.next().filter(|x| !x.is_empty());
        let role_override = cols.next().and_then(|s| match s.trim() {
            "Modifier" => Some(WordSegmentRole::Modifier),
            "Clitic" => Some(WordSegmentRole::Clitic),
            _ => None,
        });
        Some(MorphemeTag {
            internal_tags: internal_tags_str.split("-").map(|s| s.to_owned()).collect(),
            tag: target_tag,
            title: name,
            definition,
            shape,
            details_url,
            morpheme_type: String::new(),
            role_override,
        })
    });

    println!("Pushing tags to db...");
    for tag in glossary {
        db.insert_morpheme_tag(tag, system_id).await?;
    }

    Ok(())
}

/// Transforms a spreadsheet of morpheme information into a list of type-safe tag objects.
fn parse_tag_glossary(sheet: SheetResult) -> Result<Vec<AbstractMorphemeTag>> {
    Ok(sheet
        .values
        .into_iter()
        // The first row is headers.
        .skip(1)
        // There are a few empty spacing rows to ignore.
        .filter_map(|row| {
            // Skip over allomorphs, and instead allow them to emerge from our texts.
            let mut cols = row.into_iter();
            let id = cols.next()?;
            let _name = cols.next()?;
            let morpheme_type = cols.next()?;
            let _dailp_form = cols.next()?;
            Some(AbstractMorphemeTag { id, morpheme_type })
        })
        .collect())
}

/// Migrate the metadata for each source document used in creating the glossary.
/// There may be multiple entries here, because there are several grammars we use.
async fn migrate_glossary_metadata(db: &Database, sheet_id: &str) -> Result<()> {
    use itertools::Itertools;
    let sheet = SheetResult::from_sheet(sheet_id, Some("Metadata")).await?;
    let chunks = sheet.values.into_iter().chunks(7);
    let docs = chunks.into_iter().filter_map(|mut values| {
        Some(dailp::DocumentMetadata {
            id: Default::default(),
            short_name: values.next()?.pop()?,
            title: values.next()?.pop()?,
            date: Some(dailp::Date::from_ymd(
                values.next()?.pop()?.parse().unwrap(),
                1,
                1,
            )),
            contributors: values
                .next()?
                .into_iter()
                .skip(1)
                .map(dailp::Contributor::new_author)
                .collect(),
            collection: Some("Reference Materials".to_owned()),
            genre: None,
            subject_headings_ids: None,
            is_reference: true,
            page_images: None,
            sources: Vec::new(),
            translation: None,
            audio_recording: None,
            order_index: 0,
        })
    });
    for doc in docs {
        db.insert_dictionary_document(&doc).await?;
    }
    Ok(())
}
