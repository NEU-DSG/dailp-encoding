use crate::spreadsheets::{LexicalEntryWithForms, SheetResult};
use anyhow::Result;
use dailp::{
    convert_udb, seg_verb_surface_forms, AnnotatedForm, Contributor, Database, Date, DocumentId,
    DocumentMetadata, LexicalConnection, MorphemeId, MorphemeSegment, PositionInDocument,
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
            translation: None,
            page_images: None,
            is_reference: true,
            audio_recording: None,
            order_index: 0,
        })
        .await?;

    let df1975 = parse_new_df1975(
        SheetResult::from_sheet("11ssqdimOQc_hp3Zk8Y55m6DFfKR96OOpclUg5wcGSVE", None).await?,
        df1975_id,
        1975,
        3,
        true,
        false,
        3,
        3,
    );
    let root_nouns = SheetResult::from_sheet("1XuQIKzhGf_mGCH4-bHNBAaQqTAJDNtPbNHjQDhszVRo", None)
        .await?
        .into_nouns(df1975_id, 1975, 1, false)?;
    let irreg_nouns = SheetResult::from_sheet("1urfgtarnSypCgb5lSOhQGhhDcg1ozQ1r4jtCJ8Bu-vw", None)
        .await?
        .into_nouns(df1975_id, 1975, 1, false)?;
    let ptcp_nouns = SheetResult::from_sheet("1JRmOx5_LlnoLQhzhyb3NmA4FAfMM2XRoT9ntyWtPEnk", None)
        .await?
        .into_nouns(df1975_id, 1975, 0, false)?;
    let inf_nouns = SheetResult::from_sheet("1feuNOuzm0-TpotKyjebKwuXV4MYv-jnU5zLamczqu5U", None)
        .await?
        .into_nouns(df1975_id, 1975, 0, true)?;
    let body_parts = SheetResult::from_sheet("1xdnJuTsLBwxbCz9ffJmQNeX-xNYSmntoiRTu9Uwgu5I", None)
        .await?
        .into_nouns(df1975_id, 1975, 1, false)?;
    let root_adjs = SheetResult::from_sheet("1R5EhHRq-hlMcYKLzwY2bLAvC-LEeVklHJEHgL6dt5L4", None)
        .await?
        .into_adjs(df1975_id, 1975)?;
    let df2003 = parse_new_df1975(
        SheetResult::from_sheet("18cKXgsfmVhRZ2ud8Cd7YDSHexs1ODHo6fkTPrmnwI1g", None).await?,
        df2003_id,
        2003,
        1,
        false,
        false,
        3,
        3,
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
            let position = PositionInDocument::new(doc_id.clone(), page_num, key);
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

fn parse_new_df1975(
    sheet: SheetResult,
    doc_id: DocumentId,
    year: i32,
    translation_count: usize,
    has_numeric: bool,
    has_comment: bool,
    after_root: usize,
    translations: usize,
) -> Vec<LexicalEntryWithForms> {
    sheet
        .values
        .into_iter()
        // The first two rows are simply headers.
        .skip(2)
        .filter(|cols| cols.len() > 4 && !cols[2].is_empty())
        .group_by(|columns| {
            columns
                .get(0)
                .and_then(|s| s.split(",").next().unwrap().parse::<i64>().ok())
        })
        .into_iter()
        .enumerate()
        // The rest are relevant to the verb itself.
        .filter_map(move |(index, (key, rows))| {
            let rows: Vec<_> = rows.collect();
            let columns = rows.get(0)?.clone();

            // The columns are as follows: key, page number, root, root gloss,
            // translations 1, 2, 3, transitivity, UDB class, blank, surface forms.
            // Skip reference numbers for now.
            let mut root_values = columns.into_iter().skip(1);
            let key = key.unwrap_or(index as i64 + 1);
            let page_number = root_values.next()?;
            let root = root_values.next().filter(|s| !s.is_empty())?;
            let root_gloss = root_values.next().filter(|s| !s.is_empty())?;
            let glosses = root_values
                .take(translations)
                .map(|s| s.trim().to_owned())
                .filter(|s| !s.is_empty())
                .collect();
            let date = Date::from_ymd(year, 1, 1);
            let pos = PositionInDocument::new(doc_id.clone(), page_number, key);
            let mut form_cells = rows
                .into_iter()
                .flat_map(|row| row.into_iter().skip(4 + translations + after_root));
            Some(LexicalEntryWithForms {
                forms: seg_verb_surface_forms(
                    &pos,
                    &date,
                    &mut form_cells,
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
                    english_gloss: glosses,
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
        })
        .collect()
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
            // let doc_id = db.document_id_from_name(source.document_name).await?;
            let pos = PositionInDocument::new(
                todo!("Get the actual document ID from the short name provided."),
                source.gloss,
                index as i64,
            );
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
    // db.only_insert_words(forms).await?;

    Ok(())
}

async fn ingest_ac1995(db: &Database, sheet_id: &str) -> Result<()> {
    let sheet = SheetResult::from_sheet(sheet_id, None).await?;
    let meta = insert_document_from_sheet(db, sheet_id, "Vocabularies").await?;

    let forms = sheet.values.into_iter().filter_map(|row| {
        let mut row = row.into_iter();
        let index: i64 = row.next()?.parse().ok()?;
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
    db.only_insert_words(meta.id, forms.collect()).await?;

    Ok(())
}
