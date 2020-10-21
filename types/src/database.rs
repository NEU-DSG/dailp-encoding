use crate::{AnnotatedDoc, AnnotatedForm, DocumentType, LexicalEntry, MorphemeTag};
use anyhow::Result;
use mongodb::bson;

/// Connects to our backing database instance, providing high level functions
/// for accessing the data therein.
#[derive(Clone)]
pub struct Database {
    pub client: mongodb::Database,
}

impl Database {
    pub async fn new() -> Result<Self> {
        use mongodb::{options::ClientOptions, Client};

        let login = std::env::var("MONGODB_LOGIN")?;
        let db_url = format!("mongodb+srv://{}@dailp-encoding.hgtma.mongodb.net/dailp-encoding?retryWrites=true&w=majority", login);
        let mut opts = ClientOptions::parse(&db_url).await?;
        opts.app_name = Some("DAILP".to_owned());
        let client = Client::with_options(opts)?;
        Ok(Database {
            client: client.database("dailp-encoding"),
        })
    }

    /// The document uniquely identified by the given string
    pub async fn document(&self, id: &str) -> Option<AnnotatedDoc> {
        self.client
            .collection("annotated-documents")
            .find_one(bson::doc! { "_id": id }, None)
            .await
            .ok()
            .and_then(|doc| doc.and_then(|doc| bson::from_document(doc).ok()))
    }

    pub async fn lexical_entry(&self, id: String) -> Result<Option<LexicalEntry>> {
        Ok(self
            .client
            .collection("dictionary")
            .find_one(bson::doc! { "_id": id }, None)
            .await?
            .and_then(|doc| bson::from_document(doc).ok()))
    }

    /// Retrieves all morphemes that share the given gloss text.
    /// For example, there may be multiple ways to pronounce a Cherokee word
    /// that glosses as "catch" in English.
    pub async fn morphemes(&self, gloss: String) -> Result<Vec<MorphemeReference>> {
        use itertools::Itertools;
        use tokio::stream::StreamExt;

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
        let (dictionary_words, document_words) = futures::join!(dictionary_words, document_words);

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

    /// All lexical entries that use the given gloss.
    pub async fn lexical_entries(&self, root_gloss: &str) -> Result<Vec<LexicalEntry>> {
        use tokio::stream::StreamExt;

        Ok(self
            .client
            .collection("dictionary")
            .find(bson::doc! { "root.gloss": root_gloss }, None)
            .await
            .unwrap()
            .filter_map(|doc| bson::from_document::<LexicalEntry>(doc.unwrap()).ok())
            .collect::<Vec<_>>()
            .await)
    }

    /// All words containing a morpheme with the given gloss, grouped by the
    /// document they are contained in.
    pub async fn words_by_doc(&self, gloss: &str) -> Vec<WordsInDocument> {
        use itertools::Itertools;
        use tokio::stream::StreamExt;

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
        let (dictionary_words, document_words) = futures::join!(dictionary_words, document_words);

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

    /// The tag details for the morpheme identified by the given string
    pub async fn morpheme_tag(&self, id: &str) -> Result<Option<MorphemeTag>> {
        Ok(self
            .client
            .collection("tags")
            .find_one(bson::doc! { "_id": id }, None)
            .await
            .and_then(|doc| {
                if let Some(doc) = doc {
                    Ok(bson::from_document(doc)?)
                } else {
                    Ok(None)
                }
            })?)
    }
}

/// One particular morpheme and all the known words that contain that exact morpheme.
#[async_graphql::SimpleObject]
pub struct MorphemeReference {
    /// Phonemic shape of the morpheme.
    pub morpheme: String,
    /// List of words that contain this morpheme.
    pub words: Vec<AnnotatedForm>,
}

/// A list of words grouped by the document that contains them.
#[async_graphql::SimpleObject]
pub struct WordsInDocument {
    /// Unique identifier of the containing document
    pub document_id: Option<String>,
    /// What kind of document contains these words (e.g. manuscript vs dictionary)
    pub document_type: Option<DocumentType>,
    /// List of annotated and potentially segmented forms
    pub words: Vec<AnnotatedForm>,
}
