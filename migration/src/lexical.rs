use crate::spreadsheets::{LexicalEntryWithForms, SheetInterpretation};
use anyhow::Result;
use dailp::{
    convert_udb, seg_verb_surface_forms, AnnotatedForm, Contributor, Database, Date, DocumentId,
    DocumentMetadata, LexicalConnection, MorphemeId, PositionInDocument, SheetResult, WordSegment,
};
use itertools::Itertools;

pub async fn migrate_dictionaries(db: &Database) -> Result<()> {
    let df1975_id = db
        .insert_dictionary_document(&DocumentMetadata {
            id: Default::default(),
            short_name: "DF1975".to_string(),
            title: "Cherokee–English Dictionary".to_string(),
            sources: Vec::new(),
            collection: Some("Lexical Resources".to_string()),
            contributors: vec![
                Contributor::new_author("Feeling, Durbin".to_string()),
                Contributor::new_author("Pulte, William".to_string()),
            ],
            date: Some(dailp::Date::from_ymd(1975, 1, 1)),
            genre: None,
            format_id: None,
            translation: None,
            page_images: None,
            is_reference: true,
            audio_recording: None,
            order_index: 0,
        })
        .await?;
    let df2003_id = db
        .insert_dictionary_document(&DocumentMetadata {
            id: Default::default(),
            short_name: "DF2003".to_string(),
            title: "A handbook of the Cherokee verb: a preliminary study".to_string(),
            sources: Vec::new(),
            collection: Some("Lexical Resources".to_string()),
            contributors: vec![Contributor::new_author("Feeling, Durbin".to_string())],
            date: Some(dailp::Date::from_ymd(2003, 1, 1)),
            genre: None,
            format_id: None,
            translation: None,
            page_images: None,
            is_reference: true,
            audio_recording: None,
            order_index: 0,
        })
        .await?;

    let df1975 = parse_new_df(
        SheetResult::from_sheet("11ssqdimOQc_hp3Zk8Y55m6DFfKR96OOpclUg5wcGSVE", None).await?,
        df1975_id,
        DFSheetMetadata {
            year: 1975,
            translation_count: 3,
            has_numeric: true,
            has_comment: false,
            after_root: 3,
            translations: 3,
        },
    );
    let root_nouns = SheetInterpretation {
        sheet: SheetResult::from_sheet("1XuQIKzhGf_mGCH4-bHNBAaQqTAJDNtPbNHjQDhszVRo", None)
            .await?,
    }
    .into_nouns(df1975_id, 1975, 1, false)
    .map_err(|e| {
        anyhow::anyhow!(
            "Failed to process root nouns sheet (1XuQIKzhGf_mGCH4-bHNBAaQqTAJDNtPbNHjQDhszVRo): {}",
            e
        )
    })?;

    let irreg_nouns = SheetInterpretation {
        sheet: SheetResult::from_sheet("1urfgtarnSypCgb5lSOhQGhhDcg1ozQ1r4jtCJ8Bu-vw", None)
            .await?,
    }
    .into_nouns(df1975_id, 1975, 1, false)
    .map_err(|e| anyhow::anyhow!("Failed to process irregular nouns sheet (1urfgtarnSypCgb5lSOhQGhhDcg1ozQ1r4jtCJ8Bu-vw): {}", e))?;

    let ptcp_nouns = SheetInterpretation {
        sheet: SheetResult::from_sheet("1JRmOx5_LlnoLQhzhyb3NmA4FAfMM2XRoT9ntyWtPEnk", None)
            .await?,
    }
    .into_nouns(df1975_id, 1975, 0, false)
    .map_err(|e| {
        anyhow::anyhow!(
            "Failed to process ptcp nouns sheet (1JRmOx5_LlnoLQhzhyb3NmA4FAfMM2XRoT9ntyWtPEnk): {}",
            e
        )
    })?;

    let inf_nouns = SheetInterpretation {
        sheet: SheetResult::from_sheet("1feuNOuzm0-TpotKyjebKwuXV4MYv-jnU5zLamczqu5U", None)
            .await?,
    }
    .into_nouns(df1975_id, 1975, 0, true)
    .map_err(|e| {
        anyhow::anyhow!(
            "Failed to process inf nouns sheet (1feuNOuzm0-TpotKyjebKwuXV4MYv-jnU5zLamczqu5U): {}",
            e
        )
    })?;

    let body_parts = SheetInterpretation {
        sheet: SheetResult::from_sheet("1xdnJuTsLBwxbCz9ffJmQNeX-xNYSmntoiRTu9Uwgu5I", None)
            .await?,
    }
    .into_nouns(df1975_id, 1975, 1, false)
    .map_err(|e| anyhow::anyhow!("Failed to process body parts nouns sheet (1xdnJuTsLBwxbCz9ffJmQNeX-xNYSmntoiRTu9Uwgu5I): {}", e))?;

    let root_adjs = SheetInterpretation {
        sheet: SheetResult::from_sheet("1R5EhHRq-hlMcYKLzwY2bLAvC-LEeVklHJEHgL6dt5L4", None)
            .await?,
    }
    .into_adjs(df1975_id, 1975)
    .map_err(|e| anyhow::anyhow!("Failed to process root adjectives sheet (1R5EhHRq-hlMcYKLzwY2bLAvC-LEeVklHJEHgL6dt5L4): {}", e))?;

    let df2003 = parse_new_df(
        SheetResult::from_sheet("18cKXgsfmVhRZ2ud8Cd7YDSHexs1ODHo6fkTPrmnwI1g", None).await?,
        df2003_id,
        DFSheetMetadata {
            year: 2003,
            translation_count: 1,
            has_numeric: false,
            has_comment: false,
            after_root: 3,
            translations: 3,
        },
    );

    {
        println!("Pushing DF1975 to database...");
        let df1975_entries = df1975
            .into_iter()
            .chain(root_nouns)
            .chain(root_adjs)
            .chain(body_parts)
            .chain(irreg_nouns)
            .chain(ptcp_nouns)
            .chain(inf_nouns);

        // Push all the DF1975 surface forms to the sea of words.
        let (roots, surface_forms): (Vec<_>, Vec<_>) = df1975_entries
            .map(|entry| (entry.entry, entry.forms))
            .unzip();

        let numerals = parse_numerals(
            "1MB_FCG3QhmX-pw9t9PyMtFlV8SCvgXzWz8B9BdvEtec",
            df1975_id,
            1975,
        )
        .await?;

        let surface_forms: Vec<_> = surface_forms
            .into_iter()
            .flatten()
            .chain(numerals)
            .collect();

        db.insert_lexical_entries(df1975_id, roots, surface_forms)
            .await?;
    }

    {
        println!("Pushing DF2003 to database...");
        let (roots, surface_forms): (Vec<_>, Vec<_>) = df2003
            .into_iter()
            .map(|entry| (entry.entry, entry.forms))
            .unzip();
        let surface_forms: Vec<_> = surface_forms.into_iter().flatten().collect();
        db.insert_lexical_entries(df2003_id, roots, surface_forms)
            .await?;
    }

    // FIXME has items from a bunch of different documents.
    // ingest_particle_index(db, "1YppMsIvNixHdq7oM_iCnYE1ZI4y0TMSf-mVibji7pJ4").await?;

    println!("Ingesting AC1995...");
    ingest_ac1995(db, "1x02KTuF0yyEFcrJwkfFiBKj79ysQTZfLKB6hKeq-ZT8").await?;

    println!("Ingesting PF1975 grammatical appendix...");
    // DF1975 Grammatical Appendix (PF1975)
    parse_appendix(db, "1VjpKXMqb7CgFKE5lk9E6gqL-k6JKZ3FVUvhnqiMZYQg", 2).await?;

    Ok(())
}

async fn parse_numerals(
    sheet_id: &str,
    doc_id: DocumentId,
    year: i32,
) -> Result<Vec<AnnotatedForm>> {
    let numerals = SheetResult::from_sheet(sheet_id, None).await?;
    let date = Date::from_ymd(year, 1, 1);

    let forms = numerals
        .values
        .into_iter()
        .skip(1)
        .enumerate()
        .filter_map(|(index, cols)| {
            let mut values = cols.into_iter();
            let key = values.next()?.parse().unwrap_or(index as i64 + 1);
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
            let position = PositionInDocument::new(doc_id, page_num, key);
            let segments = vec![WordSegment::new(root_dailp, gloss.clone(), None)];
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
                ingested_audio_track: None,
            })
        });

    Ok(forms.collect())
}

async fn insert_document_from_sheet(
    db: &Database,
    sheet_id: &str,
    collection: &str,
) -> Result<DocumentMetadata> {
    let meta = SheetResult::from_sheet(sheet_id, Some("Metadata")).await?;
    let mut meta_values = meta.values.into_iter();
    let document_id = meta_values.next().unwrap().pop().unwrap();
    let title = meta_values.next().unwrap().pop().unwrap();
    let year = meta_values.next().unwrap().pop().unwrap().parse();
    let date_recorded = year.ok().map(|year| Date::from_ymd(year, 1, 1));
    let authors = meta_values.next().unwrap_or_default();
    let meta = DocumentMetadata {
        id: Default::default(),
        short_name: document_id,
        title,
        date: date_recorded,
        sources: Vec::new(),
        collection: Some(collection.to_owned()),
        genre: None,
        format_id: None,
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
    let doc_id = db.insert_dictionary_document(&meta).await?;
    // Include the newly minted UUID in the result.
    Ok(DocumentMetadata { id: doc_id, ..meta })
}

async fn parse_appendix(db: &Database, sheet_id: &str, to_skip: usize) -> Result<()> {
    let sheet = SheetResult::from_sheet(sheet_id, None).await?;
    let meta = insert_document_from_sheet(db, sheet_id, "Vocabularies").await?;

    let forms = sheet
        .values
        .into_iter()
        .skip(1)
        .filter(|r| r.len() > 4 && !r[1].is_empty())
        .filter_map(|row| {
            let mut values = row.into_iter();
            let index = values.next()?.parse().unwrap_or(1);
            let page_num = values.next()?;
            let position = PositionInDocument::new(meta.id, page_num, index);
            for _ in 0..to_skip {
                values.next()?;
            }
            let syllabary = values.next()?;
            let _numeric = values.next()?;
            let translation = values.next()?;
            let phonemic = values.next();
            let morpheme_gloss = values.next()?;
            let morpheme_segments = values.next()?;
            let segments = WordSegment::parse_many(&morpheme_segments, &morpheme_gloss)?;
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
                ingested_audio_track: None,
            })
        });

    db.only_insert_words(meta.id, forms.collect()).await?;

    let links = SheetResult::from_sheet(sheet_id, Some("References")).await?;
    let links = links.values.into_iter().skip(1).filter_map(|row| {
        let mut row = row.into_iter();
        Some(LexicalConnection::new(
            MorphemeId::new(Some(meta.short_name.clone()), None, row.next()?),
            MorphemeId::parse(&row.next()?)?,
        ))
    });

    db.insert_morpheme_relations(links.collect()).await?;

    Ok(())
}
struct DFSheetMetadata {
    year: i32,
    translation_count: usize,
    has_numeric: bool,
    has_comment: bool,
    after_root: usize,
    translations: usize,
}
fn parse_new_df(
    sheet: SheetResult,
    doc_id: DocumentId,
    meta: DFSheetMetadata,
) -> Vec<LexicalEntryWithForms> {
    sheet
        .values
        .into_iter()
        // The first two rows are simply headers.
        .skip(2)
        .filter(|cols| cols.len() > 4 && !cols[2].is_empty())
        .group_by(|columns| {
            columns
                .first()
                .and_then(|s| s.split(",").next().unwrap().parse::<i64>().ok())
        })
        .into_iter()
        .enumerate()
        // The rest are relevant to the verb itself.
        .filter_map(move |(index, (key, rows))| {
            let rows: Vec<_> = rows.collect();
            let columns = rows.first()?.clone();

            // The columns are as follows: key, page number, root, root gloss,
            // translations 1, 2, 3, transitivity, UDB class, blank, surface forms.
            // Skip reference numbers for now.
            let mut root_values = columns.into_iter().skip(1);
            let key = key.unwrap_or(index as i64 + 1);
            let page_number = root_values.next()?;
            let root = root_values.next().filter(|s| !s.is_empty())?;
            let root_gloss = root_values.next().filter(|s| !s.is_empty())?;
            let glosses = root_values
                .take(meta.translations)
                .map(|s| s.trim().to_owned())
                .filter(|s| !s.is_empty())
                .collect();
            let date = Date::from_ymd(meta.year, 1, 1);
            let pos = PositionInDocument::new(doc_id, page_number, key);
            let mut form_cells = rows.into_iter().flat_map(|row| {
                row.into_iter()
                    .skip(4 + meta.translations + meta.after_root)
            });
            Some(LexicalEntryWithForms {
                forms: seg_verb_surface_forms(
                    &pos,
                    &date,
                    &mut form_cells,
                    meta.translation_count,
                    meta.has_numeric,
                    meta.has_comment,
                ),
                entry: AnnotatedForm {
                    id: None,
                    simple_phonetics: None,
                    normalized_source: None,
                    phonemic: None,
                    commentary: None,
                    line_break: None,
                    page_break: None,
                    english_gloss: glosses,
                    segments: Some(vec![WordSegment::new(
                        convert_udb(&root).into_dailp(),
                        root_gloss.to_owned(),
                        None,
                    )]),
                    date_recorded: Some(date),
                    source: root,
                    position: pos,
                    ingested_audio_track: None,
                },
            })
        })
        .collect()
}

async fn ingest_ac1995(db: &Database, sheet_id: &str) -> Result<()> {
    let sheet = SheetResult::from_sheet(sheet_id, None).await?;
    let meta = insert_document_from_sheet(db, sheet_id, "Vocabularies").await?;

    let forms = sheet.values.into_iter().filter_map(|row| {
        let mut row = row.into_iter();
        let index: i64 = row.next()?.parse().ok()?;
        let _form_id = row.next()?;
        let syllabary = row.next()?;
        let _romanized = row.next()?;
        let normalized = row.next()?;
        let translation = row.next()?;
        let pos = PositionInDocument::new(meta.id, "1".to_owned(), index);
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
            ingested_audio_track: None,
        })
    });

    // Push the forms to the database.
    db.only_insert_words(meta.id, forms.collect()).await?;

    Ok(())
}
