use crate::annotation::AnnotatedWord;
use crate::encode::{AnnotatedDoc, AnnotatedLine, AnnotatedSeg};
use crate::retrieve::{self, DocumentMetadata, SemanticLine};
use anyhow::Result;
use async_graphql::*;
use itertools::Itertools;
use mongodb::{bson, options::ClientOptions, options::FindOneOptions, Client};
use serde::{Deserialize, Serialize};
use serde_json;
use std::env;
use std::fs::File;
use tokio::{prelude::*, stream::StreamExt};

pub async fn build_json(inputs: Vec<(DocumentMetadata, Vec<SemanticLine>)>) -> Result<()> {
    // Combine the documents into one object.
    let docs = inputs.into_iter().map(|(meta, lines)| {
        let annotated = lines
            .into_iter()
            .map(|line| AnnotatedLine::from_semantic(line));
        AnnotatedDoc {
            segments: AnnotatedLine::to_segments(annotated.collect(), &meta.id),
            id: meta.id,
            title: meta.title,
            publication: meta.publication,
            source: meta.source,
            people: meta.people,
            translation: meta.translation,
            image_url: meta.image_url,
        }
    });
    // Write this big fat object with all our annotated documents as a JSON file.
    let login = env::var("MONGODB_LOGIN")?;
    let db_url = format!("mongodb+srv://{}@dailp-encoding.hgtma.mongodb.net/dailp-encoding?retryWrites=true&w=majority", login);
    let mut opts = ClientOptions::parse(&db_url).await?;
    opts.app_name = Some("DAILP Encoding".to_owned());
    let client = Client::with_options(opts)?;

    let db = client
        .database("dailp-encoding")
        .collection("annotated-documents");
    println!("migrating data to database");
    for doc in docs {
        if let bson::Bson::Document(bson_doc) = bson::to_bson(&doc).unwrap() {
            db.update_one(
                bson::doc! {"_id": doc.id},
                bson_doc,
                mongodb::options::UpdateOptions::builder()
                    .upsert(true)
                    .build(),
            )
            .await?;
        }
    }

    Ok(())
}

pub struct Database {
    pub client: mongodb::Database,
}
impl Database {
    pub async fn new() -> Result<Self> {
        let mut opts = ClientOptions::parse("mongodb+srv://dailp:pok101@dailp-encoding.hgtma.mongodb.net/dailp-encoding?retryWrites=true&w=majority").await?;
        opts.app_name = Some("DAILP Encoding".to_owned());
        let client = Client::with_options(opts)?;
        Ok(Database {
            client: client.database("dailp-encoding"),
        })
    }
    pub async fn document(&self, id: &str) -> Option<AnnotatedDoc> {
        self.client
            .collection("annotated-documents")
            .find_one(bson::doc! { "_id": id }, None)
            .await
            .ok()
            .and_then(|doc| doc.and_then(|doc| bson::from_document(doc).ok()))
    }
    pub async fn morphemes(&self, gloss: String) -> Vec<MorphemeReference> {
        let docs: Vec<AnnotatedDoc> = self
            .client
            .collection("annotated-documents")
            .aggregate(
                vec![bson::doc! { "$project": {
                    "title": 1,
                    "people": 1,
                    "translation": 1,
                    "segments": {
                        "$filter": {
                            "input": "$segments",
                            "as": "seg",
                            "cond": {
                                "$in": [&gloss, { "$ifNull": ["$$seg.morpheme_gloss", []]}]
                            }
                        }
                    }
                } }],
                None,
            )
            .await
            .unwrap()
            .map(|doc| bson::from_document(doc.unwrap()).unwrap())
            .collect()
            .await;

        docs.into_iter()
            .flat_map(|doc| {
                doc.segments.into_iter().filter_map(|segment| {
                    if let AnnotatedSeg::Word(word) = segment {
                        let m = {
                            // Find the index of the relevant morpheme gloss.
                            let (idx, _) = word
                                .morpheme_gloss
                                .as_ref()
                                .unwrap()
                                .iter()
                                .enumerate()
                                .find(|(_, m)| **m == gloss)
                                .unwrap();
                            // Grab the morpheme with the same index.
                            &word.morphemic_segmentation.as_ref().unwrap()[idx]
                        };
                        Some((m.to_owned(), word))
                    } else {
                        None
                    }
                })
            })
            .into_group_map()
            .into_iter()
            .map(|(m, words)| MorphemeReference { morpheme: m, words })
            .collect()
    }
}

pub struct Query;

#[Object]
impl Query {
    async fn api_version(&self) -> &'static str {
        "1.0"
    }

    async fn documents(&self, context: &Context<'_>) -> FieldResult<Vec<AnnotatedDoc>> {
        Ok(context
            .data::<Database>()?
            .client
            .collection("annotated-documents")
            .find(None, None)
            .await
            .unwrap()
            .map(|doc| bson::from_document(doc.unwrap()).unwrap())
            .collect()
            .await)
    }

    async fn document(
        &self,
        context: &Context<'_>,
        id: String,
    ) -> FieldResult<Option<AnnotatedDoc>> {
        Ok(context.data::<Database>()?.document(&id).await)
    }

    // async fn words(&self, context: &Context<'_>, root: String) -> FieldResult<Vec<AnnotatedWord>> {
    //     context
    //         .data::<Database>()?
    //         .client
    //         .collection("annotated-documents")
    //         .aggregate(vec![bson::doc! {  "$project": {
    //             "title": 1,
    //             "people": 1,
    //             "translation": 1,
    //             "segments": {
    //                 "$filter": {
    //                     "input": "$segments",
    //                     "as": "seg",
    //                     "cond": {
    //                         "$in": [&root, { "$ifNull": ["$$seg.morpheme_gloss", []]}]
    //                     }
    //                 }
    //             }
    //         }  }])
    // }

    async fn morphemes(
        &self,
        context: &Context<'_>,
        gloss: String,
    ) -> FieldResult<Vec<MorphemeReference>> {
        Ok(context.data::<Database>()?.morphemes(gloss).await)
    }
}

#[SimpleObject]
pub struct MorphemeReference {
    pub morpheme: String,
    // TODO Add methods to reference the document.
    // document_id: String,
    pub words: Vec<AnnotatedWord>,
}
