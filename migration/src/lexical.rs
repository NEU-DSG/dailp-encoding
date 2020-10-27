use crate::spreadsheets::SheetResult;
use anyhow::Result;
use dailp::{
    AnnotatedForm, Database, DateTime, LexicalEntry, MorphemeSegment, PositionInDocument,
    UniqueAnnotatedForm,
};
use futures::future::join_all;
use mongodb::bson::{self, Bson};

pub async fn migrate_dictionaries(db: &Database) -> Result<()> {
    let (df1975, df2003, root_nouns, irreg_nouns, ptcp_nouns, body_parts, root_adjs, inf_nouns) = futures::join!(
        SheetResult::from_sheet("11ssqdimOQc_hp3Zk8Y55m6DFfKR96OOpclUg5wcGSVE", None),
        SheetResult::from_sheet("18cKXgsfmVhRZ2ud8Cd7YDSHexs1ODHo6fkTPrmnwI1g", None),
        SheetResult::from_sheet("1XuQIKzhGf_mGCH4-bHNBAaQqTAJDNtPbNHjQDhszVRo", None),
        SheetResult::from_sheet("1urfgtarnSypCgb5lSOhQGhhDcg1ozQ1r4jtCJ8Bu-vw", None),
        SheetResult::from_sheet("1JRmOx5_LlnoLQhzhyb3NmA4FAfMM2XRoT9ntyWtPEnk", None),
        SheetResult::from_sheet("1xdnJuTsLBwxbCz9ffJmQNeX-xNYSmntoiRTu9Uwgu5I", None),
        SheetResult::from_sheet("1R5EhHRq-hlMcYKLzwY2bLAvC-LEeVklHJEHgL6dt5L4", None),
        SheetResult::from_sheet("1feuNOuzm0-TpotKyjebKwuXV4MYv-jnU5zLamczqu5U", None),
    );

    let df1975 = df1975?.into_df1975("DF1975", 1975, 3, true, false, 2, 5, 3)?;
    let root_nouns = root_nouns?.into_nouns("DF1975", 1975, 1, 2)?;
    let irreg_nouns = irreg_nouns?.into_nouns("DF1975", 1975, 1, 2)?;
    let ptcp_nouns = ptcp_nouns?.into_nouns("DF1975", 1975, 1, 1)?;
    let inf_nouns = inf_nouns?.into_df1975("DF1975", 1975, 3, true, true, 1, 1, 0)?;
    let body_parts = body_parts?.into_nouns("DF1975", 1975, 2, 1)?;
    let root_adjs = root_adjs?.into_adjs("DF1975", 1975)?;
    let df2003 = df2003?.into_df1975("DF2003", 2003, 1, false, false, 2, 5, 3)?;

    let dict = db.lexical_collection();
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

    // Push all lexical entries to the database.
    join_all(entries.iter().filter_map(|entry| {
        let entry = &entry.entry;
        if let Bson::Document(bson_doc) = bson::to_bson(entry).unwrap() {
            Some(
                dict.update_one(
                    bson::doc! {"_id": &entry.id},
                    bson_doc,
                    mongodb::options::UpdateOptions::builder()
                        .upsert(true)
                        .build(),
                ),
            )
        } else {
            None
        }
    }))
    .await;

    // Push all the surface forms to the sea of words.
    join_all(entries.into_iter().flat_map(|entry| {
        entry.forms.into_iter().filter_map(|form| {
            if let Bson::Document(bson_doc) = bson::to_bson(&form).unwrap() {
                Some(
                    words.update_one(
                        bson::doc! {"_id": &form.id},
                        bson_doc,
                        mongodb::options::UpdateOptions::builder()
                            .upsert(true)
                            .build(),
                    ),
                )
            } else {
                None
            }
        })
    }))
    .await;

    Ok(())
}

pub async fn migrate_old_lexical(db: &Database) -> Result<()> {
    let (ag1836, jm1887, dc1800) = futures::join!(
        SheetResult::from_sheet("1Lj8YnEmi4hZk6m3fxNk3mdd366yjgLLa5sWeWSvg-ZY", None),
        SheetResult::from_sheet("1RqtDUzYCRMx7AOSp7aICCis40m4kZQpUsd2thav_m50", None),
        SheetResult::from_sheet("1R7dCEDyZEk8bhXlBHro8-JoeKjUZlRyBfAVdsuiY2Yc", None),
    );

    let ag1836 = parse_early_vocab(ag1836?, "AG1836", 1836, 0);
    let jm1887 = parse_early_vocab(jm1887?, "JM1887", 1887, 1);
    let dc1800 = parse_early_vocab(dc1800?, "DC1800", 1800, 1);
    let entries = ag1836.chain(jm1887).chain(dc1800);

    // Push all lexical entries to the database.
    let dict = db.words_collection();
    join_all(entries.filter_map(|entry| {
        if let Bson::Document(bson_doc) = bson::to_bson(&entry).unwrap() {
            Some(
                dict.update_one(
                    bson::doc! {"_id": &entry.id},
                    bson_doc,
                    mongodb::options::UpdateOptions::builder()
                        .upsert(true)
                        .build(),
                ),
            )
        } else {
            None
        }
    }))
    .await;

    Ok(())
}

fn parse_early_vocab(
    sheet: SheetResult,
    doc_id: &'static str,
    year: i32,
    to_skip: usize,
) -> impl Iterator<Item = UniqueAnnotatedForm> {
    use chrono::TimeZone as _;
    sheet
        .values
        .into_iter()
        .filter(move |row| row.len() >= 4 + to_skip)
        .enumerate()
        .map(move |(index, mut row)| {
            let id = row.remove(0);
            let page_num = row.remove(0);
            for _ in 0..to_skip {
                row.remove(0);
            }
            let gloss = row.remove(0);
            let original = row.remove(0);

            UniqueAnnotatedForm {
                form: AnnotatedForm {
                    index: index as i32 + 1,
                    source: original,
                    simple_phonetics: None,
                    segments: None,
                    phonemic: None,
                    commentary: None,
                    english_gloss: vec![gloss],
                    line_break: None,
                    page_break: None,
                    document_id: Some(doc_id.to_owned()),
                },
                id,
            }
            // LexicalEntry {
            //     root: MorphemeSegment::new(original.clone(), id.clone(), None),
            //     id,
            //     position: Some(PositionInDocument {
            //         document_id: doc_id.to_owned(),
            //         page_number: page_num.parse().unwrap_or(1),
            //         index: index as i64 + 1,
            //     }),
            //     root_translations: vec![gloss],
            //     original,
            //     date_recorded: DateTime::new(chrono::Utc.ymd(year, 1, 1).and_hms(0, 0, 0)),
            // }
        })
}
