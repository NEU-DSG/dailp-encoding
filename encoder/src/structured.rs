use crate::encode::{AnnotatedDoc, AnnotatedLine};
use crate::retrieve::{DocumentMetadata, SemanticLine};
use crate::{annotation::AnnotatedWord, encode::DocumentType};
use crate::{dictionary::DictionaryEntry, tag::MorphemeTag};
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
    println!("Migrating documents to database...");

    // Combine the documents into one object.
    let docs = inputs.into_iter().map(|(meta, lines)| {
        let annotated = lines
            .into_iter()
            .map(|line| AnnotatedLine::from_semantic(line));
        let segments = AnnotatedLine::to_segments(annotated.collect(), &meta.id);
        AnnotatedDoc::new(meta, segments)
    });

    // Write the contents of each document to our database.
    let db = db.client.collection("annotated-documents");
    for doc in docs {
        if let bson::Bson::Document(bson_doc) = bson::to_bson(&doc)? {
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
    pub async fn morphemes(&self, gloss: String) -> Result<Vec<MorphemeReference>> {
        let dictionary = self.client.collection("dictionary");
        let documents = self.client.collection("annotated-documents");

        let dictionary_words = dictionary.find(bson::doc! { "root_gloss": &gloss }, None);
        let document_words = documents.aggregate(
            vec![
                bson::doc! { "$unwind": "$segments" },
                bson::doc! { "$replaceRoot": { "newRoot": "$segments" } },
                bson::doc! { "$unwind": "$parts" },
                bson::doc! { "$replaceRoot": { "newRoot": "$parts" } },
                bson::doc! {
                    "$match": {"segmentation.gloss": &gloss}
                },
            ],
            None,
        );

        // Retrieve both document and dictionary references at once.
        let (dictionary_words, document_words) = join!(dictionary_words, document_words);

        let dictionary_words = dictionary_words?
            .map(|doc| {
                let entry: DictionaryEntry = bson::from_document(doc.unwrap()).unwrap();
                (entry.root, entry.surface_forms)
            })
            .collect::<Vec<_>>()
            .await
            .into_iter()
            .flat_map(|(root, forms)| forms.into_iter().map(move |form| (root.clone(), form)));

        let document_words = document_words?
            .map(|doc| {
                let word: AnnotatedWord = bson::from_document(doc.unwrap()).unwrap();
                let m = {
                    // Find the index of the relevant morpheme gloss.
                    let segment = word.segmentation.iter().find(|m| m.gloss == gloss).unwrap();
                    // Grab the morpheme with the same index.
                    segment.morpheme.clone()
                };
                (m.to_owned(), word)
            })
            .collect::<Vec<_>>()
            .await;

        Ok(document_words
            .into_iter()
            .chain(dictionary_words)
            .into_group_map()
            .into_iter()
            .map(|(m, words)| MorphemeReference { morpheme: m, words })
            .collect())
    }

    pub async fn words_by_doc(&self, gloss: &str) -> Vec<WordsInDocument> {
        let dictionary = self.client.collection("dictionary");
        let documents = self.client.collection("annotated-documents");

        let dictionary_words = dictionary.find(bson::doc! { "root_gloss": gloss }, None);
        let document_words = documents.aggregate(
            vec![
                bson::doc! { "$unwind": "$segments" },
                bson::doc! { "$replaceRoot": { "newRoot": "$segments" } },
                bson::doc! { "$unwind": "$parts" },
                bson::doc! { "$replaceRoot": { "newRoot": "$parts" } },
                bson::doc! {
                    "$match": {"segmentation.gloss": gloss}
                },
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
            .flat_map(|(root, forms)| forms.into_iter().map(move |form| (root.clone(), form)))
            .into_group_map()
            .into_iter()
            .map(|(doc_id, words)| WordsInDocument {
                document_type: Some(DocumentType::Reference),
                document_id: doc_id,
                words,
            });

        let document_words = document_words
            .unwrap()
            .map(|doc| {
                let word: AnnotatedWord = bson::from_document(doc.unwrap()).unwrap();
                (word.document_id.clone(), word)
            })
            .collect::<Vec<_>>()
            .await
            .into_iter()
            .into_group_map()
            .into_iter()
            .map(|(doc_id, words)| WordsInDocument {
                document_type: Some(DocumentType::Corpus),
                document_id: doc_id,
                words,
            });

        document_words.chain(dictionary_words).collect()
    }
}

pub struct Query;

#[Object]
impl Query {
    async fn all_documents(
        &self,
        context: &Context<'_>,
        source: Option<String>,
    ) -> FieldResult<Vec<AnnotatedDoc>> {
        Ok(context
            .data::<Database>()?
            .client
            .collection("annotated-documents")
            .find(
                source.map(|source| {
                    bson::doc! { "source": source }
                }),
                None,
            )
            .await?
            .filter_map(|doc| bson::from_document(doc.unwrap()).ok())
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
        Ok(context.data::<Database>()?.morphemes(gloss).await?)
    }

    async fn words_with_morpheme(
        &self,
        context: &Context<'_>,
        gloss: String,
    ) -> FieldResult<Vec<WordsInDocument>> {
        Ok(context.data::<Database>()?.words_by_doc(&gloss).await)
    }

    pub async fn morpheme_tag(
        &self,
        context: &Context<'_>,
        id: String,
    ) -> FieldResult<Option<MorphemeTag>> {
        Ok(context
            .data::<Database>()?
            .client
            .collection("tags")
            .find_one(bson::doc! { "_id": id }, None)
            .await?
            .map(|doc| bson::from_document(doc).unwrap()))
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
    pub document_type: Option<DocumentType>,
    pub words: Vec<AnnotatedWord>,
}
