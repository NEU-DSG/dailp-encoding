use crate::batch_join_all;
use anyhow::Result;
use dailp::{Contributor, Database};

const COLLECTION_NAME: &str = "Early Vocabularies";

pub async fn migrate_all(db: &Database) -> Result<()> {
    // Most of our early vocabularies have a consistent format, so we can parse
    // them the exact same way.
    migrate_new_vocabs(
        db,
        &[
            // AG1836
            "1EPsHXNIqGgsPtTP-V86ItFfJ5vwxKIV2qx9sycrARsg",
            // DC1800
            "1zq0qQ6jv8ym6VZNIAoiavGQeGhIWM0M1ZfOM9ngA49w",
            // TS1822
            "1sZEhIBoEGp1nTsvpDcFqLm6HAjz0YBTlWW-uzkAzQkM",
            // jdb1771
            "1pYYS_jv01rccXhue2vX0xnLqMnCg-PoFDE4WSOA6hVQ",
            // BH1784
            "1fhV3DTHzh9ffqUFfHPSALjotgkXEvKKMNfE5G8ZYVC8",
            // WP1796
            "1H2Z26jHh6bb1p7xVfv3P2vvD73eifiLR7Ss5k1HpUfM",
            // JH1823
            "1Uj7bk1wvTbXopL52mm-b9s3RLw7iSA_RFAt_ccFg_bQ",
            // DB1884
            "1hLPiRBdKUX7jaLVE6MFLgfrTMBJGNHFb8P-2MM81YIo",
            // BB1797
            "1SRTn65vbHrjmc54hVFSmBba6Cnh8KPn5LQ8qmk_kJMc",
            // BB1819
            "1OTtJuh1n5Z05JYxFVbilwvwjvhCUETUHhzhMw1zWGsw",
            // JA1775
            "1Gfa_Ef1KFKp9ig1AlF65hxaXe43ffV_U_xKQGkD0mnc",
        ],
    )
    .await?;

    // A few others have slight differences.

    // TODO Include all three dialectal variants somehow!
    // JM1887
    parse_early_vocab(
        db,
        "1RqtDUzYCRMx7AOSp7aICCis40m4kZQpUsd2thav_m50",
        1,
        false,
        false,
        false,
        false,
        0,
    )
    .await?;

    Ok(())
}

async fn migrate_new_vocabs(db: &Database, sheet_ids: &[&str]) -> Result<()> {
    let mut links = Vec::new();
    for s in sheet_ids {
        let mut new_links = parse_early_vocab(db, s, 0, true, false, true, true, 3).await?;
        links.append(&mut new_links);
    }
    batch_join_all(links.into_iter().map(|l| db.insert_morpheme_relation(l))).await?;
    Ok(())
}

async fn parse_early_vocab(
    db: &Database,
    sheet_id: &str,
    to_skip: usize,
    has_norm: bool,
    has_phonetic: bool,
    has_notes: bool,
    has_segmentation: bool,
    num_links: usize,
) -> Result<Vec<dailp::LexicalConnection>> {
    use crate::spreadsheets::SheetResult;
    use dailp::{Date, DocumentMetadata, MorphemeSegment};

    let sheet = SheetResult::from_sheet(sheet_id, None).await?;
    let meta = SheetResult::from_sheet(sheet_id, Some(crate::METADATA_SHEET_NAME)).await?;
    let mut meta = meta.values.into_iter();
    let doc_id = meta.next().unwrap().pop().unwrap();
    let title = meta.next().unwrap().pop().unwrap();
    let year = meta.next().unwrap().pop().unwrap().parse::<i32>();
    let date_recorded = year.ok().map(|year| Date::from_ymd(year, 1, 1));
    let authors = meta.next().unwrap_or_default();
    let meta = DocumentMetadata {
        id: Default::default(),
        short_name: doc_id,
        title,
        date: date_recorded,
        sources: Vec::new(),
        collection: Some(COLLECTION_NAME.to_owned()),
        genre: None,
        contributors: authors
            .into_iter()
            .skip(1)
            .map(Contributor::new_author)
            .collect(),
        page_images: None,
        translation: None,
        is_reference: true,
        audio_recording: None,
        order_index: 0,
    };

    // Update document metadata record
    let doc_id = db.insert_dictionary_document(&meta).await?;

    let entries = sheet
        .values
        .into_iter()
        // The first row is just a header.
        .skip(1)
        .filter(move |row| row.len() >= (4 + to_skip))
        .enumerate()
        .filter_map(|(index, row)| {
            let mut row = row.into_iter();
            let page_number = row.next()?;
            let id = row.next()?;
            for _ in 0..to_skip {
                row.next()?;
            }
            let gloss = row.next()?;
            let source = row.next()?;
            let normalized_source = if has_norm {
                row.next().filter(|s| !s.is_empty())
            } else {
                None
            };
            let simple_phonetics = if has_phonetic {
                row.next().filter(|s| !s.is_empty())
            } else {
                None
            }
            .or_else(|| {
                // Convert the normalized source to simple phonetics.
                normalized_source
                    .as_ref()
                    .map(|s| dailp::PhonemicString::parse_crg(&s).into_learner())
            });

            let commentary = if has_notes {
                row.next().filter(|s| !s.is_empty())
            } else {
                None
            };
            let segments = if has_segmentation {
                if let (Some(segs), Some(glosses)) = (
                    row.next().filter(|s| !s.is_empty()),
                    row.next().filter(|s| !s.is_empty()),
                ) {
                    MorphemeSegment::parse_many(&segs, &glosses)
                } else {
                    None
                }
            } else {
                None
            };
            let mut links = Vec::new();
            for _ in 0..num_links {
                if let Some(s) = row.next() {
                    if !s.is_empty() {
                        links.push(dailp::LexicalConnection::parse(&id, &s)?);
                    }
                }
            }

            Some((
                dailp::AnnotatedForm {
                    normalized_source,
                    simple_phonetics,
                    segments,
                    source,
                    phonemic: None,
                    commentary,
                    english_gloss: vec![gloss],
                    line_break: None,
                    page_break: None,
                    position: dailp::PositionInDocument::new(
                        doc_id.clone(),
                        page_number,
                        index as i32 + 1,
                    ),
                    date_recorded: meta.date.clone(),
                    id: None,
                    audio_track: None,
                },
                links,
            ))
        });

    let (forms, links): (Vec<_>, Vec<_>) = entries.unzip();

    // Push all forms and links to the database.
    batch_join_all(forms.into_iter().map(|form| db.insert_one_word(form))).await?;

    Ok(links.into_iter().flatten().collect())
}

struct ConnectedForm {
    form: dailp::AnnotatedForm,
    links: Vec<dailp::LexicalConnection>,
}
