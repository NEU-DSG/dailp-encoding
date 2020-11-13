use crate::spreadsheets::LexicalEntryWithForms;
use crate::spreadsheets::SheetResult;
use anyhow::Result;
use dailp::convert_udb;
use dailp::seg_verb_surface_forms;
use dailp::LexicalEntry;
use dailp::MorphemeSegment;
use dailp::{AnnotatedForm, Database, DateTime, PositionInDocument, UniqueAnnotatedForm};
use futures::future::join_all;
use mongodb::bson;

pub async fn migrate_dictionaries(db: &Database) -> Result<()> {
    let df1975 = parse_new_df1975(
        SheetResult::from_sheet("11ssqdimOQc_hp3Zk8Y55m6DFfKR96OOpclUg5wcGSVE", None).await?,
        "DF1975",
        1975,
        3,
        true,
        false,
        3,
        3,
    );
    let root_nouns = SheetResult::from_sheet("1XuQIKzhGf_mGCH4-bHNBAaQqTAJDNtPbNHjQDhszVRo", None)
        .await?
        .into_nouns("DF1975", 1975, 1, 2)?;
    let irreg_nouns = SheetResult::from_sheet("1urfgtarnSypCgb5lSOhQGhhDcg1ozQ1r4jtCJ8Bu-vw", None)
        .await?
        .into_nouns("DF1975", 1975, 1, 2)?;
    let ptcp_nouns = SheetResult::from_sheet("1JRmOx5_LlnoLQhzhyb3NmA4FAfMM2XRoT9ntyWtPEnk", None)
        .await?
        .into_nouns("DF1975", 1975, 1, 1)?;
    let inf_nouns = SheetResult::from_sheet("1feuNOuzm0-TpotKyjebKwuXV4MYv-jnU5zLamczqu5U", None)
        .await?
        .into_df1975("DF1975", 1975, 3, true, true, 1, 1, 0)?;
    let body_parts = SheetResult::from_sheet("1xdnJuTsLBwxbCz9ffJmQNeX-xNYSmntoiRTu9Uwgu5I", None)
        .await?
        .into_nouns("DF1975", 1975, 2, 1)?;
    let root_adjs = SheetResult::from_sheet("1R5EhHRq-hlMcYKLzwY2bLAvC-LEeVklHJEHgL6dt5L4", None)
        .await?
        .into_adjs("DF1975", 1975)?;
    let df2003 = parse_new_df1975(
        SheetResult::from_sheet("18cKXgsfmVhRZ2ud8Cd7YDSHexs1ODHo6fkTPrmnwI1g", None).await?,
        "DF2003",
        2003,
        1,
        false,
        false,
        3,
        3,
    );

    let words = db.words_collection();
    let entries: Vec<_> = df1975
        .into_iter()
        .chain(irreg_nouns)
        .chain(ptcp_nouns)
        .chain(inf_nouns)
        .chain(body_parts)
        .chain(root_adjs)
        .chain(root_nouns)
        .chain(df2003)
        .collect();

    println!("Pushing entries to database...");

    let upsert = mongodb::options::UpdateOptions::builder()
        .upsert(true)
        .build();
    // Push all lexical entries to the database.
    join_all(entries.iter().filter_map(|entry| {
        let entry = &entry.entry;
        bson::to_document(entry).ok().map(|bson_doc| {
            words.update_one(bson::doc! {"_id": &entry.id}, bson_doc, upsert.clone())
        })
    }))
    .await;

    println!("Pushing surface forms to database...");

    // Push all the surface forms to the sea of words.
    join_all(entries.into_iter().flat_map(|entry| {
        entry.forms.into_iter().filter_map(|form| {
            bson::to_document(&form).ok().map(|bson_doc| {
                words.update_one(bson::doc! {"_id": &form.id}, bson_doc, upsert.clone())
            })
        })
    }))
    .await;

    Ok(())
}

fn parse_new_df1975(
    sheet: SheetResult,
    doc_id: &str,
    year: i32,
    translation_count: usize,
    has_numeric: bool,
    has_comment: bool,
    after_root: usize,
    translations: usize,
) -> impl Iterator<Item = LexicalEntryWithForms> {
    use chrono::TimeZone as _;
    let doc_id = doc_id.to_owned();
    sheet
        .values
        .into_iter()
        // The first two rows are simply headers.
        .skip(2)
        .enumerate()
        // The rest are relevant to the verb itself.
        .filter_map(move |(index, columns)| {
            // The columns are as follows: key, page number, root, root gloss,
            // translations 1, 2, 3, transitivity, UDB class, blank, surface forms.
            if columns.len() > 4 && !columns[2].is_empty() {
                // Skip reference numbers for now.
                let mut root_values = columns.into_iter();
                let _key = root_values.next()?;
                let page_number = root_values.next()?;
                let root = root_values.next().filter(|s| !s.is_empty())?;
                let root_gloss = root_values.next().filter(|s| !s.is_empty())?;
                let root_id = LexicalEntry::make_id(&doc_id, &root_gloss);
                let mut form_values = root_values.clone().skip(after_root + translations);
                let date = DateTime::new(chrono::Utc.ymd(year, 1, 1).and_hms(0, 0, 0));
                Some(LexicalEntryWithForms {
                    forms: seg_verb_surface_forms(
                        &doc_id,
                        &page_number,
                        &date,
                        &mut form_values,
                        translation_count,
                        has_numeric,
                        has_comment,
                        true,
                    ),
                    entry: UniqueAnnotatedForm {
                        id: root_id.clone(),
                        form: AnnotatedForm {
                            simple_phonetics: None,
                            normalized_source: None,
                            phonemic: None,
                            commentary: None,
                            line_break: None,
                            page_break: None,
                            english_gloss: root_values
                                .take(translations)
                                .map(|s| s.trim().to_owned())
                                .filter(|s| !s.is_empty())
                                .collect(),
                            segments: Some(vec![MorphemeSegment::new(
                                convert_udb(&root).to_dailp(),
                                root_id,
                                None,
                            )]),
                            date_recorded: Some(date),
                            source: root,
                            position: Some(PositionInDocument {
                                document_id: doc_id.clone(),
                                page_number,
                                index: index as i32 + 1,
                            }),
                        },
                    },
                })
            } else {
                None
            }
        })
}

pub async fn migrate_old_lexical(db: &Database) -> Result<()> {
    let ag1836 = parse_early_vocab(
        SheetResult::from_sheet("1Lj8YnEmi4hZk6m3fxNk3mdd366yjgLLa5sWeWSvg-ZY", None).await?,
        "AG1836",
        1836,
        0,
        false,
        true,
    );
    // TODO Include all three dialectal variants somehow!
    let jm1887 = parse_early_vocab(
        SheetResult::from_sheet("1RqtDUzYCRMx7AOSp7aICCis40m4kZQpUsd2thav_m50", None).await?,
        "JM1887",
        1887,
        1,
        false,
        false,
    );
    let dc1800 = parse_early_vocab(
        SheetResult::from_sheet("1R7dCEDyZEk8bhXlBHro8-JoeKjUZlRyBfAVdsuiY2Yc", None).await?,
        "DC1800",
        1800,
        1,
        false,
        true,
    );
    let ts1822 = parse_early_vocab(
        SheetResult::from_sheet("14sN6e07u8rttS0nfX58-ojIgP7zwcOm6vjEXRk8qB-0", None).await?,
        "TS1822",
        1823,
        1,
        false,
        false,
    );
    let jdb1771 = parse_early_vocab(
        SheetResult::from_sheet("1rOXTBydHnt5zmMffLf8QEId4W0J8YcQXMen8HBg5rKo", None).await?,
        "JDB1771",
        1771,
        1,
        false,
        true,
    );
    let ja1775 = parse_early_vocab(
        SheetResult::from_sheet("1Gfa_Ef1KFKp9ig1AlF65hxaXe43ffV_U_xKQGkD0mnc", None).await?,
        "JA1775",
        1775,
        1,
        false,
        false,
    );
    let bh1784 = parse_early_vocab(
        SheetResult::from_sheet("1lny1LHFDcwEjxLWqwotXKG_cYXfPrslodq1Rbn7ygAc", None).await?,
        "BH1784",
        1784,
        0,
        false,
        true,
    );
    let bb1819 = parse_early_vocab(
        SheetResult::from_sheet("1aLPu_d_1OtgPL2_2olnjeDSBOgsreE6X3vBAFtpB5N0", None).await?,
        "BB1819",
        1819,
        0,
        true,
        true,
    );
    let entries = ag1836
        .chain(jm1887)
        .chain(dc1800)
        .chain(ts1822)
        .chain(jdb1771)
        .chain(ja1775)
        .chain(bh1784)
        .chain(bb1819);

    // Push all lexical entries to the database.
    let dict = db.words_collection();
    join_all(entries.filter_map(|entry| {
        bson::to_document(&entry).ok().map(|bson_doc| {
            dict.update_one(
                bson::doc! {"_id": &entry.id},
                bson_doc,
                mongodb::options::UpdateOptions::builder()
                    .upsert(true)
                    .build(),
            )
        })
    }))
    .await;

    Ok(())
}

fn parse_early_vocab(
    sheet: SheetResult,
    doc_id: &'static str,
    year: i32,
    to_skip: usize,
    has_norm: bool,
    has_phonetic: bool,
) -> impl Iterator<Item = UniqueAnnotatedForm> {
    use chrono::TimeZone as _;
    sheet
        .values
        .into_iter()
        .filter(move |row| row.len() >= 4 + to_skip)
        .enumerate()
        .filter_map(move |(index, row)| {
            let mut row = row.into_iter();
            let id = row.next()?;
            let page_number = row.next()?;
            for _ in 0..to_skip {
                row.next()?;
            }
            let gloss = row.next()?;
            let original = row.next()?;
            let norm = if has_norm { row.next() } else { None };
            let simple_phonetics = if has_phonetic {
                row.next().filter(|s| !s.is_empty())
            } else {
                None
            };

            Some(UniqueAnnotatedForm {
                form: AnnotatedForm {
                    normalized_source: norm,
                    simple_phonetics,
                    segments: Some(vec![MorphemeSegment::new(
                        original.clone(),
                        id.clone(),
                        None,
                    )]),
                    source: original,
                    phonemic: None,
                    commentary: None,
                    english_gloss: vec![gloss],
                    line_break: None,
                    page_break: None,
                    position: Some(PositionInDocument {
                        document_id: doc_id.to_owned(),
                        page_number,
                        index: index as i32 + 1,
                    }),
                    date_recorded: Some(DateTime::new(
                        chrono::Utc.ymd(year, 1, 1).and_hms(0, 0, 0),
                    )),
                },
                id,
            })
        })
}
