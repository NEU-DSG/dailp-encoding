use crate::spreadsheets::{LexicalEntryWithForms, SheetResult};
use anyhow::Result;
use dailp::{
    convert_udb, database_sql::Database, seg_verb_surface_forms, AnnotatedDoc, AnnotatedForm,
    Contributor, Date, DocumentMetadata, LexicalConnection, MorphemeId, MorphemeSegment,
    PositionInDocument,
};
use log::info;

pub async fn migrate_dictionaries(db: &Database) -> Result<()> {
    let docs = vec![
        DocumentMetadata {
            id: dailp::DocumentId("DF1975".to_string()),
            title: "Cherokee–English Dictionary".to_string(),
            sources: Vec::new(),
            collection: Some("Lexical Resources".to_string()),
            contributors: vec![
                Contributor::new_author("Feeling, Durbin".to_string()),
                Contributor::new_author("Pulte, William".to_string()),
            ],
            date: Some(dailp::Date::from_ymd(1975, 1, 1)),
            genre: None,
            translation: None,
            page_images: None,
            is_reference: true,
            audio_recording: None,
            order_index: 0,
        },
        DocumentMetadata {
            id: dailp::DocumentId("DF2003".to_string()),
            title: "A handbook of the Cherokee verb: a preliminary study".to_string(),
            sources: Vec::new(),
            collection: Some("Lexical Resources".to_string()),
            contributors: vec![Contributor::new_author("Feeling, Durbin".to_string())],
            date: Some(dailp::Date::from_ymd(2003, 1, 1)),
            genre: None,
            translation: None,
            page_images: None,
            is_reference: true,
            audio_recording: None,
            order_index: 0,
        },
    ];
    for doc in docs {
        db.insert_dictionary_document(&doc).await?;
    }

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

    parse_numerals(
        db,
        "1MB_FCG3QhmX-pw9t9PyMtFlV8SCvgXzWz8B9BdvEtec",
        "DF1975",
        1975,
    )
    .await?;

    // FIXME has items from a bunch of different documents.
    // ingest_particle_index(db, "1YppMsIvNixHdq7oM_iCnYE1ZI4y0TMSf-mVibji7pJ4").await?;

    ingest_ac1995(db, "1x02KTuF0yyEFcrJwkfFiBKj79ysQTZfLKB6hKeq-ZT8").await?;

    // DF1975 Grammatical Appendix (PF1975)
    parse_appendix(db, "1VjpKXMqb7CgFKE5lk9E6gqL-k6JKZ3FVUvhnqiMZYQg", 2).await?;

    let entries = df1975
        .chain(df2003)
        .chain(root_nouns)
        .chain(root_adjs)
        .chain(body_parts)
        .chain(irreg_nouns)
        .chain(ptcp_nouns)
        .chain(inf_nouns);

    info!("Pushing entries to database...");
    // Push all lexical entries to the database.
    for entry in entries {
        // Push all the surface forms to the sea of words.
        db.insert_lexical_entry(entry.entry, entry.forms).await?;
    }

    Ok(())
}

async fn parse_numerals(db: &Database, sheet_id: &str, doc_id: &str, year: i32) -> Result<()> {
    let numerals = SheetResult::from_sheet(sheet_id, None).await?;
    let date = Date::from_ymd(year, 1, 1);

    let forms = numerals
        .values
        .into_iter()
        .skip(1)
        .enumerate()
        .filter_map(|(index, cols)| {
            let mut values = cols.into_iter();
            let key = values.next()?.parse().unwrap_or(index as i32);
            // UDB t/th
            let root = values.next().filter(|s| !s.is_empty())?;
            let root_dailp = convert_udb(&root).into_dailp();
            let gloss = values.next()?;
            let page_num = values.next()?;
            // UDB d/t
            let surface_form = values.next()?;
            let _surface_form_dailp = convert_udb(&surface_form).into_dailp();
            let translation = values.next()?;
            let _numeric = values.next()?;
            let simple_phonetics = values.next()?;
            let syllabary = values.next()?;
            let position =
                PositionInDocument::new(dailp::DocumentId(doc_id.to_string()), page_num, key);
            let segments = vec![MorphemeSegment::new(root_dailp, gloss.clone(), None)];
            Some(AnnotatedForm {
                id: None,
                position,
                normalized_source: None,
                simple_phonetics: Some(simple_phonetics),
                phonemic: Some(root),
                segments: Some(segments),
                english_gloss: vec![translation],
                source: syllabary,
                commentary: None,
                date_recorded: Some(date.clone()),
                line_break: None,
                page_break: None,
                audio_track: None,
            })
        });

    db.insert_lexical_forms(forms).await?;

    Ok(())
}

async fn parse_meta(sheet_id: &str, collection: &str) -> Result<DocumentMetadata> {
    let meta = SheetResult::from_sheet(sheet_id, Some("Metadata")).await?;
    let mut meta_values = meta.values.into_iter();
    let document_id = meta_values.next().unwrap().pop().unwrap();
    let title = meta_values.next().unwrap().pop().unwrap();
    let year = meta_values.next().unwrap().pop().unwrap().parse();
    let date_recorded = year.ok().map(|year| Date::from_ymd(year, 1, 1));
    let authors = meta_values.next().unwrap_or_default();
    Ok(DocumentMetadata {
        id: dailp::DocumentId(document_id),
        title,
        date: date_recorded,
        sources: Vec::new(),
        collection: Some(collection.to_owned()),
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
    })
}

async fn parse_appendix(db: &Database, sheet_id: &str, to_skip: usize) -> Result<()> {
    let sheet = SheetResult::from_sheet(sheet_id, None).await?;
    let meta = parse_meta(sheet_id, "Vocabularies").await?;
    db.insert_dictionary_document(&meta).await?;

    let forms = sheet
        .values
        .into_iter()
        .skip(1)
        .filter(|r| r.len() > 4 && !r[1].is_empty())
        .filter_map(|row| {
            let mut values = row.into_iter();
            let index = values.next()?.parse().unwrap_or(1);
            let page_num = values.next()?;
            let position = PositionInDocument::new(meta.id.clone(), page_num, index);
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
                id: None,
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
                audio_track: None,
            })
        });

    db.insert_lexical_forms(forms).await?;

    // FIXME add function to Database
    // let links = SheetResult::from_sheet(sheet_id, Some("References")).await?;
    // let links = links.values.into_iter().skip(1).filter_map(|row| {
    //     let mut row = row.into_iter();
    //     Some(LexicalConnection::new(
    //         MorphemeId::new(Some(meta.id.clone()), None, row.next()?),
    //         MorphemeId::parse(&row.next()?)?,
    //     ))
    // });
    // for link in links {
    //     db.update_connection(link).await?;
    // }

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
    let doc_id = dailp::DocumentId(doc_id.to_owned());
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
                let date = Date::from_ymd(year, 1, 1);
                let pos =
                    PositionInDocument::new(doc_id.clone(), page_number, key.parse().unwrap_or(1));
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
                        id: None,
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
                            convert_udb(&root).into_dailp(),
                            root_gloss.to_owned(),
                            None,
                        )]),
                        date_recorded: Some(date),
                        source: root,
                        position: pos,
                        audio_track: None,
                    },
                })
            } else {
                None
            }
        })
}

async fn ingest_particle_index(db: &Database, document_id: &str) -> Result<()> {
    let sheet = SheetResult::from_sheet(document_id, None).await?;
    let forms = sheet
        .values
        .into_iter()
        .enumerate()
        .filter_map(|(index, row)| {
            let mut row = row.into_iter();
            let syllabary = row.next()?;
            let simple_phonetics = row.next()?;
            let translation = row.next()?;
            let source_str = row.next()?;
            let source = MorphemeId::parse(&source_str)?;
            let pos =
                PositionInDocument::new(source.document_id.clone()?, source.gloss, index as i32);
            Some(AnnotatedForm {
                id: None,
                simple_phonetics: Some(simple_phonetics),
                normalized_source: None,
                phonemic: None,
                commentary: None,
                line_break: None,
                page_break: None,
                english_gloss: vec![translation],
                segments: None,
                date_recorded: None,
                source: syllabary,
                position: pos,
                audio_track: None,
            })
        });

    // Push the forms to the database.
    db.insert_lexical_forms(forms).await?;

    Ok(())
}

async fn ingest_ac1995(db: &Database, sheet_id: &str) -> Result<()> {
    let sheet = SheetResult::from_sheet(sheet_id, None).await?;
    let meta = parse_meta(sheet_id, "Vocabularies").await?;

    // Update the document metadata.
    db.insert_dictionary_document(&meta).await?;

    let forms = sheet.values.into_iter().filter_map(|row| {
        let mut row = row.into_iter();
        let index: i32 = row.next()?.parse().ok()?;
        let form_id = row.next()?;
        let syllabary = row.next()?;
        let _romanized = row.next()?;
        let normalized = row.next()?;
        let translation = row.next()?;
        let pos = PositionInDocument::new(meta.id.clone(), "1".to_owned(), index);
        Some(AnnotatedForm {
            id: None,
            simple_phonetics: Some(normalized),
            normalized_source: None,
            phonemic: None,
            commentary: None,
            line_break: None,
            page_break: None,
            english_gloss: vec![translation],
            segments: None,
            date_recorded: meta.date.clone(),
            source: syllabary,
            position: pos,
            audio_track: None,
        })
    });

    // Push the forms to the database.
    db.insert_lexical_forms(forms).await?;

    Ok(())
}
