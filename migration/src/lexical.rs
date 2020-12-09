use crate::spreadsheets::LexicalEntryWithForms;
use crate::spreadsheets::SheetResult;
use anyhow::Result;
use dailp::convert_udb;
use dailp::seg_verb_surface_forms;
use dailp::AnnotatedDoc;
use dailp::DocumentMetadata;
use dailp::LexicalConnection;
use dailp::MorphemeId;
use dailp::MorphemeSegment;
use dailp::{AnnotatedForm, DateTime, PositionInDocument};

pub async fn migrate_dictionaries() -> Result<()> {
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
        .into_nouns("DF1975", 1975, 1, false)?;
    let irreg_nouns = SheetResult::from_sheet("1urfgtarnSypCgb5lSOhQGhhDcg1ozQ1r4jtCJ8Bu-vw", None)
        .await?
        .into_nouns("DF1975", 1975, 1, false)?;
    let ptcp_nouns = SheetResult::from_sheet("1JRmOx5_LlnoLQhzhyb3NmA4FAfMM2XRoT9ntyWtPEnk", None)
        .await?
        .into_nouns("DF1975", 1975, 0, false)?;
    let inf_nouns = SheetResult::from_sheet("1feuNOuzm0-TpotKyjebKwuXV4MYv-jnU5zLamczqu5U", None)
        .await?
        .into_nouns("DF1975", 1975, 0, true)?;
    let body_parts = SheetResult::from_sheet("1xdnJuTsLBwxbCz9ffJmQNeX-xNYSmntoiRTu9Uwgu5I", None)
        .await?
        .into_nouns("DF1975", 1975, 1, false)?;
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

    // DF1975 Grammatical Appendix
    parse_appendix("1VjpKXMqb7CgFKE5lk9E6gqL-k6JKZ3FVUvhnqiMZYQg", 2).await?;

    let entries: Vec<_> = df1975
        .chain(df2003)
        .chain(root_nouns)
        .chain(root_adjs)
        .chain(body_parts)
        .collect();

    println!("Pushing entries to database...");

    for entry in &entries {
        // Push all lexical entries to the database.
        crate::update_form(&entry.entry).await?;
    }

    let forms = entries
        .into_iter()
        .chain(irreg_nouns)
        .chain(ptcp_nouns)
        .chain(inf_nouns)
        .flat_map(|x| x.forms);

    // Push all the surface forms to the sea of words.
    for form in forms {
        crate::update_form(&form).await?;
    }

    Ok(())
}

async fn parse_appendix(sheet_id: &str, to_skip: usize) -> Result<()> {
    use chrono::TimeZone;

    let sheet = SheetResult::from_sheet(sheet_id, None).await?;
    let meta = SheetResult::from_sheet(sheet_id, Some("Metadata")).await?;
    let mut meta_values = meta.values.into_iter();
    let document_id = meta_values.next().unwrap().pop().unwrap();
    let title = meta_values.next().unwrap().pop().unwrap();
    let year = meta_values.next().unwrap().pop().unwrap().parse();
    let date_recorded = year
        .ok()
        .map(|year| DateTime::new(chrono::Utc.ymd(year, 1, 1).and_hms(0, 0, 0)));
    let meta = DocumentMetadata {
        id: document_id,
        title,
        date: date_recorded,
        publication: None,
        collection: Some("Vocabularies".to_owned()),
        genre: None,
        people: Vec::new(),
        page_images: Vec::new(),
        translation: None,
        is_reference: true,
    };

    let forms = sheet
        .values
        .into_iter()
        .skip(1)
        .filter(|r| r.len() > 4 && !r[1].is_empty())
        .filter_map(|row| {
            let mut values = row.into_iter();
            let position = PositionInDocument {
                document_id: meta.id.clone(),
                index: values.next()?.parse().unwrap_or(1),
                page_number: values.next()?,
            };
            for _ in 0..to_skip {
                values.next()?;
            }
            let syllabary = values.next()?;
            let _numeric = values.next()?;
            let translation = values.next()?;
            let phonemic = values.next();
            let morpheme_gloss = values.next()?;
            let morpheme_segments = values.next()?;
            let segments = MorphemeSegment::parse_many(&morpheme_segments, &morpheme_gloss)?;
            Some(AnnotatedForm {
                id: position.make_form_id(&segments),
                position,
                source: syllabary,
                normalized_source: None,
                simple_phonetics: None,
                english_gloss: vec![translation],
                phonemic,
                segments: Some(segments),
                line_break: None,
                page_break: None,
                commentary: None,
                date_recorded: meta.date.clone(),
            })
        });

    for form in forms {
        crate::update_form(&form).await?;
    }

    let links = SheetResult::from_sheet(sheet_id, Some("References")).await?;
    let links = links.values.into_iter().skip(1).filter_map(|row| {
        let mut row = row.into_iter();
        Some(LexicalConnection::new(
            MorphemeId::new(Some(meta.id.clone()), None, row.next()?),
            MorphemeId::parse(&row.next()?)?,
        ))
    });
    for link in links {
        crate::update_connection(&link).await?;
    }

    let doc = AnnotatedDoc {
        meta,
        segments: None,
    };
    crate::update_document(&doc).await?;

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
        // The rest are relevant to the verb itself.
        .filter_map(move |columns| {
            // The columns are as follows: key, page number, root, root gloss,
            // translations 1, 2, 3, transitivity, UDB class, blank, surface forms.
            if columns.len() > 4 && !columns[2].is_empty() {
                // Skip reference numbers for now.
                let mut root_values = columns.into_iter();
                let key = root_values.next()?;
                let page_number = root_values.next()?;
                let root = root_values.next().filter(|s| !s.is_empty())?;
                let root_gloss = root_values.next().filter(|s| !s.is_empty())?;
                let mut form_values = root_values.clone().skip(after_root + translations);
                let date = DateTime::new(chrono::Utc.ymd(year, 1, 1).and_hms(0, 0, 0));
                let pos = PositionInDocument {
                    document_id: doc_id.clone(),
                    page_number: page_number.clone(),
                    index: key.parse().unwrap_or(1),
                };
                Some(LexicalEntryWithForms {
                    forms: seg_verb_surface_forms(
                        &pos,
                        &date,
                        &mut form_values,
                        translation_count,
                        has_numeric,
                        has_comment,
                    ),
                    entry: AnnotatedForm {
                        id: pos.make_id(&root_gloss),
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
                            root_gloss.to_owned(),
                            None,
                        )]),
                        date_recorded: Some(date),
                        source: root,
                        position: pos,
                    },
                })
            } else {
                None
            }
        })
}

pub async fn migrate_old_lexical() -> Result<()> {
    parse_early_vocab(
        "1Lj8YnEmi4hZk6m3fxNk3mdd366yjgLLa5sWeWSvg-ZY",
        0,
        false,
        true,
        false,
        false,
    )
    .await?;
    // TODO Include all three dialectal variants somehow!
    parse_early_vocab(
        "1RqtDUzYCRMx7AOSp7aICCis40m4kZQpUsd2thav_m50",
        1,
        false,
        false,
        false,
        false,
    )
    .await?;
    parse_early_vocab(
        "1R7dCEDyZEk8bhXlBHro8-JoeKjUZlRyBfAVdsuiY2Yc", // DC1800
        1,
        true,
        false,
        false,
        false,
    )
    .await?;
    parse_early_vocab(
        "14sN6e07u8rttS0nfX58-ojIgP7zwcOm6vjEXRk8qB-0", // TS1822
        1,
        false,
        false,
        false,
        true,
    )
    .await?;
    parse_early_vocab(
        "1rOXTBydHnt5zmMffLf8QEId4W0J8YcQXMen8HBg5rKo",
        1,
        false,
        true,
        false,
        false,
    )
    .await?;
    parse_early_vocab(
        "1Gfa_Ef1KFKp9ig1AlF65hxaXe43ffV_U_xKQGkD0mnc",
        1,
        false,
        false,
        false,
        false,
    )
    .await?;
    parse_early_vocab(
        "1lny1LHFDcwEjxLWqwotXKG_cYXfPrslodq1Rbn7ygAc",
        0,
        false,
        true,
        false,
        false,
    )
    .await?;
    parse_early_vocab(
        "1aLPu_d_1OtgPL2_2olnjeDSBOgsreE6X3vBAFtpB5N0",
        0,
        true,
        false,
        true,
        true,
    )
    .await?;

    Ok(())
}

async fn parse_early_vocab(
    sheet_id: &str,
    to_skip: usize,
    has_norm: bool,
    has_phonetic: bool,
    has_notes: bool,
    has_link: bool,
) -> Result<()> {
    use chrono::TimeZone as _;
    println!("parsing sheet {}...", sheet_id);
    let sheet = SheetResult::from_sheet(sheet_id, None).await?;
    let meta = SheetResult::from_sheet(sheet_id, Some("Metadata")).await?;
    let mut meta = meta.values.into_iter();
    let doc_id = meta.next().unwrap().pop().unwrap();
    let title = meta.next().unwrap().pop().unwrap();
    let year: i32 = meta.next().unwrap().pop().unwrap().parse()?;
    let date_recorded = Some(DateTime::new(chrono::Utc.ymd(year, 1, 1).and_hms(0, 0, 0)));
    let meta = DocumentMetadata {
        id: doc_id,
        title,
        date: date_recorded,
        publication: None,
        collection: Some("Early Vocabularies".to_owned()),
        genre: None,
        people: Vec::new(),
        page_images: Vec::new(),
        translation: None,
        is_reference: true,
    };

    let entries = sheet
        .values
        .into_iter()
        // The first row is just a header.
        .skip(1)
        .filter(move |row| row.len() >= (4 + to_skip))
        .enumerate()
        .filter_map(|(index, row)| {
            let mut row = row.into_iter();
            let id = row.next()?;
            let page_number = row.next()?;
            for _ in 0..to_skip {
                row.next()?;
            }
            let gloss = row.next()?;
            let source = row.next()?;
            let normalized_source = if has_norm { row.next() } else { None };
            let simple_phonetics = if has_phonetic {
                row.next().filter(|s| !s.is_empty())
            } else {
                None
            };
            let commentary = if has_notes {
                row.next().filter(|s| !s.is_empty())
            } else {
                None
            };
            let link = if has_link {
                row.next()
                    .filter(|s| !s.is_empty())
                    .and_then(|to| LexicalConnection::parse(&id, &to))
            } else {
                None
            };

            Some(ConnectedForm {
                form: AnnotatedForm {
                    normalized_source,
                    simple_phonetics,
                    segments: None,
                    source,
                    phonemic: None,
                    commentary,
                    english_gloss: vec![gloss],
                    line_break: None,
                    page_break: None,
                    position: PositionInDocument {
                        document_id: meta.id.clone(),
                        page_number,
                        index: index as i32 + 1,
                    },
                    date_recorded: meta.date.clone(),
                    id,
                },
                link,
            })
        });

    // Push all forms and links to the database.
    for entry in entries {
        crate::update_form(&entry.form).await?;

        if let Some(link) = &entry.link {
            crate::update_connection(&link).await?;
        }
    }

    // Update document metadata record
    let doc = AnnotatedDoc {
        meta,
        segments: None,
    };
    crate::update_document(&doc).await?;

    Ok(())
}

struct ConnectedForm {
    form: AnnotatedForm,
    link: Option<LexicalConnection>,
}
