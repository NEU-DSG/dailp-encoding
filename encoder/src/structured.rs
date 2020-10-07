use crate::encode::{AnnotatedDoc, AnnotatedLine};
use crate::retrieve::{DocumentMetadata, SemanticLine};
use crate::{annotation::AnnotatedForm, encode::DocumentType};
use crate::{dictionary::LexicalEntry, tag::MorphemeTag};
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
        let annotated = lines.iter().map(|line| AnnotatedLine::from_semantic(line));
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
        } else {
            eprintln!("Failed to make document!");
        }
    }

    Ok(())
}

// pub async fn write_doc_db(
//     db: &Database,
//     meta: DocumentMetadata,
//     lines: Vec<SemanticLine>,
// ) -> Result<()> {
//     let doc = {
//         let annotated = lines
//             .into_iter()
//             .map(|line| AnnotatedLine::from_semantic(line));
//         let segments = AnnotatedLine::to_segments(annotated.collect(), &meta.id);
//         AnnotatedDoc::new(meta, segments)
//     };

//     if let bson::Bson::Document(bson_doc) = bson::to_bson(&doc)? {
//         db.client
//             .collection("annotated-documents")
//             .update_one(
//                 bson::doc! {"_id": doc.id},
//                 bson_doc,
//                 mongodb::options::UpdateOptions::builder()
//                     .upsert(true)
//                     .build(),
//             )
//             .await?;
//     }
// }

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

        let dictionary_words = dictionary.find(bson::doc! { "root.gloss": &gloss }, None);
        let document_words = documents.aggregate(
            vec![
                bson::doc! { "$unwind": "$segments" },
                bson::doc! { "$replaceRoot": { "newRoot": "$segments.source" } },
                bson::doc! { "$unwind": "$parts" },
                bson::doc! { "$replaceRoot": { "newRoot": "$parts" } },
                bson::doc! {
                    "$match": {"segments.gloss": &gloss}
                },
            ],
            None,
        );

        // Retrieve both document and dictionary references at once.
        let (dictionary_words, document_words) = join!(dictionary_words, document_words);

        let dictionary_words = dictionary_words?
            .map(|doc| {
                let entry: LexicalEntry = bson::from_document(doc.unwrap()).unwrap();
                (entry.root.morpheme, entry.surface_forms)
            })
            .collect::<Vec<_>>()
            .await
            .into_iter()
            .flat_map(|(root, forms)| forms.into_iter().map(move |form| (root.clone(), form)));

        let document_words = document_words?
            .map(|doc| {
                let word: AnnotatedForm = bson::from_document(doc.unwrap()).unwrap();
                let m = {
                    // Find the index of the relevant morpheme gloss.
                    let segment = word.segments.iter().find(|m| m.gloss == gloss).unwrap();
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

    pub async fn lexical_entries(&self, root_gloss: &str) -> Result<Vec<LexicalEntry>> {
        Ok(self
            .client
            .collection("dictionary")
            .find(bson::doc! { "root.gloss": root_gloss }, None)
            .await
            .unwrap()
            .map(|doc| bson::from_document::<LexicalEntry>(doc.unwrap()).unwrap())
            .collect::<Vec<_>>()
            .await)
    }

    pub async fn words_by_doc(&self, gloss: &str) -> Vec<WordsInDocument> {
        let dictionary = self.client.collection("dictionary");
        let documents = self.client.collection("annotated-documents");

        let dictionary_words = dictionary.find(bson::doc! { "root.gloss": gloss }, None);
        let document_words = documents.aggregate(
            vec![
                bson::doc! { "$unwind": "$segments" },
                bson::doc! { "$replaceRoot": { "newRoot": "$segments.source" } },
                bson::doc! { "$unwind": "$parts" },
                bson::doc! { "$replaceRoot": { "newRoot": "$parts" } },
                bson::doc! { "$match": { "segments.gloss": gloss } },
            ],
            None,
        );

        // Retrieve both document and dictionary references at once.
        let (dictionary_words, document_words) = join!(dictionary_words, document_words);

        let dictionary_words = dictionary_words
            .unwrap()
            .map(|doc| {
                let entry: LexicalEntry = bson::from_document(doc.unwrap()).unwrap();
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
                let word: AnnotatedForm = bson::from_document(doc.unwrap()).unwrap();
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

    pub async fn morpheme_tag(&self, id: &str) -> Result<Option<MorphemeTag>> {
        Ok(self
            .client
            .collection("tags")
            .find_one(bson::doc! { "_id": id }, None)
            .await?
            .and_then(|doc| bson::from_document(doc).ok()))
    }
}

pub struct Query;

#[Object(cache_control(max_age = 60))]
impl Query {
    /// Listing of all documents excluding their contents by default
    async fn all_documents(
        &self,
        context: &Context<'_>,
        collection: Option<String>,
    ) -> FieldResult<Vec<AnnotatedDoc>> {
        Ok(context
            .data::<Database>()?
            .client
            .collection("annotated-documents")
            .find(
                collection.map(|collection| {
                    bson::doc! { "collection": collection }
                }),
                mongodb::options::FindOptions::builder()
                    .projection(bson::doc! { "segments": 0, "translation": 0 })
                    .build(),
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

    /// Lists all words containing a morpheme with the given gloss.
    /// Groups these words by the phonemic shape of the target morpheme.
    pub async fn morphemes_by_shape(
        &self,
        context: &Context<'_>,
        gloss: String,
    ) -> FieldResult<Vec<MorphemeReference>> {
        Ok(context.data::<Database>()?.morphemes(gloss).await?)
    }

    /// Lists all words containing a morpheme with the given gloss.
    /// Groups these words by the document containing them.
    async fn morphemes_by_document(
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
    /// Phonemic shape of the morpheme.
    pub morpheme: String,
    /// List of words that contain this morpheme.
    pub words: Vec<AnnotatedForm>,
}

#[SimpleObject]
pub struct WordsInDocument {
    pub document_id: Option<String>,
    pub document_type: Option<DocumentType>,
    pub words: Vec<AnnotatedForm>,
}
