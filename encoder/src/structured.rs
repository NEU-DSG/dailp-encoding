use crate::annotation::AnnotatedWord;
use crate::dictionary::DictionaryEntry;
use crate::encode::{AnnotatedDoc, AnnotatedLine};
use crate::retrieve::{DocumentMetadata, SemanticLine};
use anyhow::Result;
use async_graphql::*;
use futures::join;
use itertools::Itertools;
use mongodb::{bson, options::ClientOptions, Client};
use std::env;
use tokio::stream::StreamExt;

/// Converts a set of annotated documents into our preferred access format, then
/// pushes that data into the underlying database.
/// Existing versions of these documents are overwritten with the new data.
pub async fn build_json(
    inputs: Vec<(DocumentMetadata, Vec<SemanticLine>)>,
    db: &Database,
) -> Result<()> {
    // Combine the documents into one object.
    let docs = inputs.into_iter().map(|(meta, lines)| {
        let annotated = lines
            .into_iter()
            .map(|line| AnnotatedLine::from_semantic(line));
        let segments = AnnotatedLine::to_segments(annotated.collect(), &meta.id);
        AnnotatedDoc::new(meta, segments)
    });
    // Write this big fat object with all our annotated documents as a JSON file.
    let db = db.client.collection("annotated-documents");
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

#[derive(Clone)]
pub struct Database {
    pub client: mongodb::Database,
}
impl Database {
    pub async fn new() -> Result<Self> {
        let login = env::var("MONGODB_LOGIN")?;
        let db_url = format!("mongodb+srv://{}@dailp-encoding.hgtma.mongodb.net/dailp-encoding?retryWrites=true&w=majority", login);
        let mut opts = ClientOptions::parse(&db_url).await?;
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

    /// Retrieves all morphemes that share the given gloss text.
    /// For example, there may be multiple ways to pronounce a Cherokee word
    /// that glosses as "catch" in English.
    pub async fn morphemes(&self, gloss: String) -> Vec<MorphemeReference> {
        let dictionary = self.client.collection("dictionary");
        let documents = self.client.collection("annotated-documents");

        let dictionary_words = dictionary.find(bson::doc! { "_id": &gloss }, None);
        let document_words = documents.aggregate(
            vec![
                bson::doc! {
                    "$project": {
                        "words": {
                            "$filter": {
                                "input": "$words",
                                "as": "word",
                                "cond": {
                                    "$in": [&gloss, { "$ifNull": ["$$word.morpheme_gloss", []]}]
                                }
                            }
                        }
                    }
                },
                bson::doc! { "$unwind": "$words" },
                bson::doc! { "$replaceRoot": { "newRoot": "$words" } },
            ],
            None,
        );

        // Retrieve both document and dictionary references at once.
        let (dictionary_words, document_words) = join!(dictionary_words, document_words);

        let dictionary_words = dictionary_words
            .unwrap()
            .map(|doc| {
                let entry: DictionaryEntry = bson::from_document(doc.unwrap()).unwrap();
                (entry.root, entry.surface_forms)
            })
            .collect::<Vec<_>>()
            .await
            .into_iter()
            .flat_map(|(root, forms)| forms.into_iter().map(move |form| (root.clone(), form)));

        let document_words = document_words
            .unwrap()
            .map(|doc| {
                let word: AnnotatedWord = bson::from_document(doc.unwrap()).unwrap();
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
                (m.to_owned(), word)
            })
            .collect::<Vec<_>>()
            .await;

        document_words
            .into_iter()
            .chain(dictionary_words)
            .into_group_map()
            .into_iter()
            .map(|(m, words)| MorphemeReference { morpheme: m, words })
            .collect()
    }

    pub async fn words_by_doc(&self, gloss: &str) -> Vec<WordsInDocument> {
        let dictionary = self.client.collection("dictionary");
        let documents = self.client.collection("annotated-documents");

        let dictionary_words = dictionary.find(bson::doc! { "_id": gloss }, None);
        let document_words = documents.aggregate(
            vec![
                bson::doc! {
                    "$project": {
                        "words": {
                            "$filter": {
                                "input": "$words",
                                "as": "word",
                                "cond": {
                                    "$in": [gloss, { "$ifNull": ["$$word.morpheme_gloss", []]}]
                                }
                            }
                        }
                    }
                },
                bson::doc! { "$unwind": "$words" },
                bson::doc! { "$replaceRoot": { "newRoot": "$words" } },
            ],
            None,
        );

        // Retrieve both document and dictionary references at once.
        let (dictionary_words, document_words) = join!(dictionary_words, document_words);

        let dictionary_words = dictionary_words
            .unwrap()
            .map(|doc| {
                let entry: DictionaryEntry = bson::from_document(doc.unwrap()).unwrap();
                (
                    entry.surface_forms[0].document_id.clone(),
                    entry.surface_forms,
                )
            })
            .collect::<Vec<_>>()
            .await
            .into_iter()
            .flat_map(|(root, forms)| forms.into_iter().map(move |form| (root.clone(), form)));

        let document_words = document_words
            .unwrap()
            .map(|doc| {
                let word: AnnotatedWord = bson::from_document(doc.unwrap()).unwrap();
                (word.document_id.clone(), word)
            })
            .collect::<Vec<_>>()
            .await;

        document_words
            .into_iter()
            .chain(dictionary_words)
            .into_group_map()
            .into_iter()
            .map(|(m, words)| WordsInDocument {
                document_id: m,
                words,
            })
            .collect()
    }
}

pub struct Query;

#[Object]
impl Query {
    async fn all_documents(&self, context: &Context<'_>) -> FieldResult<Vec<AnnotatedDoc>> {
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

    /// Retrieves a full document from its unique identifier.
    pub async fn document(
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

    pub async fn morphemes(
        &self,
        context: &Context<'_>,
        gloss: String,
    ) -> FieldResult<Vec<MorphemeReference>> {
        Ok(context.data::<Database>()?.morphemes(gloss).await)
    }

    pub async fn words_with_morpheme(
        &self,
        context: &Context<'_>,
        gloss: String,
    ) -> FieldResult<Vec<WordsInDocument>> {
        Ok(context.data::<Database>()?.words_by_doc(&gloss).await)
    }
}

/// One particular morpheme and all the known words that contain that exact morpheme.
#[SimpleObject]
pub struct MorphemeReference {
    pub morpheme: String,
    pub words: Vec<AnnotatedWord>,
}

#[SimpleObject]
pub struct WordsInDocument {
    pub document_id: Option<String>,
    pub words: Vec<AnnotatedWord>,
}
