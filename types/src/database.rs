use crate::{
    AnnotatedDoc, AnnotatedForm, DocumentCollection, DocumentType, LexicalConnection, MorphemeId,
    MorphemeTag,
};
use anyhow::Result;
use futures::future::join_all;
use mongodb::bson;
use std::collections::HashSet;

/// Connects to our backing database instance, providing high level functions
/// for accessing the data therein.
#[derive(Clone)]
pub struct Database {
    client: mongodb::Database,
}

impl Database {
    const DOCUMENTS: &'static str = "annotated-documents";
    const WORDS: &'static str = "sea-of-words";
    const TAGS: &'static str = "tags";
    const CONNECTIONS: &'static str = "lexical-connections";

    pub fn documents_collection(&self) -> mongodb::Collection {
        self.client.collection(Self::DOCUMENTS)
    }
    pub fn words_collection(&self) -> mongodb::Collection {
        self.client.collection(Self::WORDS)
    }
    pub fn tags_collection(&self) -> mongodb::Collection {
        self.client.collection(Self::TAGS)
    }
    pub fn connections_collection(&self) -> mongodb::Collection {
        self.client.collection(Self::CONNECTIONS)
    }
}

impl Database {
    pub async fn new() -> Result<Self> {
        use mongodb::{options::ClientOptions, Client};

        let db_url = std::env::var("MONGODB_URI")?;
        let mut opts = ClientOptions::parse(&db_url).await?;
        opts.app_name = Some("DAILP".to_owned());
        let client = Client::with_options(opts)?;
        Ok(Database {
            client: client.database("dailp-encoding"),
        })
    }

    /// The document uniquely identified by the given string
    pub async fn document(&self, id: &str) -> Result<Option<AnnotatedDoc>> {
        Ok(self
            .documents_collection()
            .find_one(bson::doc! { "_id": id }, None)
            .await?
            .and_then(|doc| bson::from_document(doc).ok()))
    }

    pub async fn all_documents(&self, collection: Option<&str>) -> Result<Vec<AnnotatedDoc>> {
        use tokio::stream::StreamExt as _;
        Ok(self
            .documents_collection()
            .find(
                collection.map(|collection| {
                    bson::doc! { "collection": collection }
                }),
                mongodb::options::FindOptions::builder()
                    .projection(bson::doc! { "segments": 0 })
                    .build(),
            )
            .await?
            .filter_map(|doc| doc.ok().and_then(|doc| bson::from_document(doc).ok()))
            .collect()
            .await)
    }

    pub async fn all_collections(&self) -> Result<Vec<DocumentCollection>> {
        Ok(self
            .documents_collection()
            .distinct("collection", None, None)
            .await?
            .iter()
            .filter_map(|doc| doc.as_str())
            .map(|name| DocumentCollection {
                name: name.to_owned(),
            })
            .collect())
    }

    pub async fn word_search(&self, query: String) -> Result<Vec<AnnotatedForm>> {
        use tokio::stream::StreamExt as _;
        Ok(self
            .words_collection()
            .find(
                bson::doc! { "source": { "$regex": format!(".*{}.*", query) } },
                None,
            )
            .await?
            .filter_map(|doc| doc.ok().and_then(|doc| bson::from_document(doc).ok()))
            .collect()
            .await)
    }

    pub async fn lexical_entry(&self, id: &str) -> Result<Option<AnnotatedForm>> {
        Ok(self
            .words_collection()
            .find_one(bson::doc! { "_id": id }, None)
            .await?
            .and_then(|doc| bson::from_document(doc).ok()))
    }

    pub async fn surface_forms(&self, morpheme: &MorphemeId) -> Result<Vec<AnnotatedForm>> {
        use tokio::stream::StreamExt as _;
        Ok(self
            .words_collection()
            .find(
                bson::doc! { "$or": [
                    // More likely a surface form
                    { "position.document_id": &morpheme.document_id, "segments.gloss": &morpheme.gloss },
                    // More likely a root
                    { "_id": morpheme.to_string() }
                ] },
                None,
            )
            .await?
            .filter_map(|doc| doc.ok().and_then(|doc| bson::from_document(doc).ok()))
            .collect()
            .await)
    }

    pub async fn connected_forms(&self, morpheme: &MorphemeId) -> Result<Vec<AnnotatedForm>> {
        use tokio::stream::StreamExt as _;

        let col = self.connections_collection();
        let morpheme = bson::to_bson(morpheme)?;

        // Find the connections starting from this entry.
        let froms = col.aggregate(
            vec![
                bson::doc! { "$match": { "from": &morpheme } },
                bson::doc! { "$lookup": {
                    "from": Database::WORDS,
                    "localField": "to",
                    "foreignField": "segments.gloss",
                    "as": "connections"
                } },
                bson::doc! { "$unwind": "$connections" },
                bson::doc! { "$replaceRoot": { "newRoot": "$connections" } },
            ],
            None,
        );

        // Find the connections ending with this entry.
        let tos = col.aggregate(
            vec![
                bson::doc! { "$match": { "to": morpheme } },
                bson::doc! { "$lookup": {
                    "from": Database::WORDS,
                    "localField": "from",
                    "foreignField": "segments.gloss",
                    "as": "connections"
                } },
                bson::doc! { "$unwind": "$connections" },
                bson::doc! { "$replaceRoot": { "newRoot": "$connections" } },
            ],
            None,
        );

        let (froms, tos) = futures::join!(froms, tos);

        Ok(froms?
            .chain(tos?)
            .filter_map(|doc| doc.ok().and_then(|doc| bson::from_document(doc).ok()))
            .collect()
            .await)
    }

    async fn exact_connections(&self, morpheme: &MorphemeId) -> Result<Vec<MorphemeId>> {
        use tokio::stream::StreamExt as _;

        let col = self.connections_collection();
        let morpheme = bson::to_bson(morpheme)?;

        // Find the connections starting from this entry.
        let froms = col.find(bson::doc! { "from": &morpheme }, None);
        // Find the connections ending with this entry.
        let tos = col.find(bson::doc! { "to": morpheme }, None);
        let (froms, tos) = futures::join!(froms, tos);

        let froms = froms?
            .filter_map(|doc| {
                doc.ok()
                    .and_then(|doc| bson::from_document::<LexicalConnection>(doc).ok())
            })
            .map(|conn| conn.to);

        let tos = tos?
            .filter_map(|doc| {
                doc.ok()
                    .and_then(|doc| bson::from_document::<LexicalConnection>(doc).ok())
            })
            .map(|conn| conn.from);

        Ok(froms.chain(tos).collect().await)
    }

    async fn recursive_connections(&self, id: &MorphemeId) -> Result<HashSet<MorphemeId>> {
        let mut conns = HashSet::new();
        conns.insert(id.clone());
        let mut to_request = vec![id.clone()];
        loop {
            let res = join_all(to_request.iter().map(|x| self.exact_connections(&x))).await;

            let mut is_done = true;
            for y in res {
                for x in y? {
                    if !conns.contains(&x) {
                        conns.insert(x.clone());
                        to_request.push(x);
                        is_done = false;
                    }
                }
            }

            if is_done {
                break;
            }
        }
        Ok(conns)
    }

    async fn doc_matches(&self, morpheme: &MorphemeId) -> Result<Vec<AnnotatedForm>> {
        use tokio::stream::StreamExt as _;
        Ok(self
            .documents_collection()
            .aggregate(
                vec![
                    bson::doc! { "$match": { "_id": &morpheme.document_id } },
                    bson::doc! { "$unwind": "$segments" },
                    bson::doc! { "$replaceRoot": { "newRoot": "$segments.source" } },
                    bson::doc! { "$unwind": "$parts" },
                    bson::doc! { "$replaceRoot": { "newRoot": "$parts" } },
                    bson::doc! { "$match": { "segments.gloss": &morpheme.gloss } },
                ],
                None,
            )
            .await?
            .filter_map(|d| d.ok().and_then(|d| bson::from_document(d).ok()))
            .collect()
            .await)
    }

    /// Forms that contain the given morpheme gloss, from both lexical resources
    /// and corpus data
    pub async fn connected_surface_forms(&self, id: &MorphemeId) -> Result<Vec<AnnotatedForm>> {
        let ids = self.recursive_connections(id).await?;
        let lexical = join_all(ids.iter().map(|id| self.surface_forms(id)));
        let corpus = join_all(ids.iter().map(|id| self.doc_matches(&id)));
        let (lexical, corpus) = futures::join!(lexical, corpus);

        let mut result = Vec::new();
        for x in lexical.into_iter().chain(corpus) {
            for y in x? {
                result.push(y);
            }
        }
        Ok(result)
    }

    /// Retrieves all morphemes that share the given gloss text.
    /// For example, there may be multiple ways to pronounce a Cherokee word
    /// that glosses as "catch" in English.
    pub async fn morphemes(&self, morpheme: &MorphemeId) -> Result<Vec<MorphemeReference>> {
        use itertools::Itertools;
        use tokio::stream::StreamExt;

        let dictionary_words = self.surface_forms(morpheme);
        let documents = self.documents_collection();
        let document_words = documents.aggregate(
            vec![
                bson::doc! { "$match": { "_id": &morpheme.document_id } },
                bson::doc! { "$unwind": "$segments" },
                bson::doc! { "$replaceRoot": { "newRoot": "$segments.source" } },
                bson::doc! { "$unwind": "$parts" },
                bson::doc! { "$replaceRoot": { "newRoot": "$parts" } },
                bson::doc! {
                    "$match": { "segments.gloss": &morpheme.gloss }
                },
            ],
            None,
        );

        // Retrieve both document and dictionary references at once.
        let (dictionary_words, document_words) = futures::join!(dictionary_words, document_words);

        let dictionary_words = dictionary_words?
            .into_iter()
            .map(|form| (form.find_root().unwrap().morpheme.clone(), form));

        let document_words = document_words?
            .filter_map(|doc| {
                let word: AnnotatedForm = bson::from_document(doc.ok()?).ok()?;
                let m = {
                    // Find the index of the relevant morpheme gloss.
                    let segment = word
                        .segments
                        .as_ref()?
                        .iter()
                        .find(|m| m.gloss == morpheme.gloss)?;
                    // Grab the morpheme with the same index.
                    segment.morpheme.clone()
                };
                Some((m.to_owned(), word))
            })
            .collect::<Vec<_>>()
            .await;

        Ok(document_words
            .into_iter()
            .chain(dictionary_words)
            .into_group_map()
            .into_iter()
            .map(|(m, words)| MorphemeReference {
                morpheme: m,
                forms: words,
            })
            .collect())
    }

    /// All words containing a morpheme with the given gloss, grouped by the
    /// document they are contained in.
    pub async fn words_by_doc(&self, gloss: &MorphemeId) -> Result<Vec<WordsInDocument>> {
        use itertools::Itertools;

        let ids = self.recursive_connections(gloss).await?;
        let lexical = join_all(ids.iter().map(|id| self.surface_forms(id)));
        let corpus = join_all(ids.iter().map(|id| self.doc_matches(&id)));
        let (dictionary_words, document_words) = futures::join!(lexical, corpus);

        let dictionary_words = dictionary_words
            .into_iter()
            .filter_map(|x| x.ok())
            .flat_map(|x| x)
            .map(|form| (form.position.document_id.clone(), form))
            .into_group_map()
            .into_iter()
            .map(|(doc_id, words)| WordsInDocument {
                document_type: Some(DocumentType::Reference),
                document_id: Some(doc_id),
                forms: words,
            });

        let document_words = document_words
            .into_iter()
            .filter_map(|x| x.ok())
            .flat_map(|x| x)
            .map(|form| (form.position.document_id.clone(), form))
            .collect::<Vec<_>>()
            .into_iter()
            .into_group_map()
            .into_iter()
            .map(|(doc_id, words)| WordsInDocument {
                document_type: Some(DocumentType::Corpus),
                document_id: Some(doc_id),
                forms: words,
            });

        Ok(document_words.chain(dictionary_words).collect())
    }

    /// The tag details for the morpheme identified by the given string
    pub async fn morpheme_tag(&self, id: &str) -> Result<Option<MorphemeTag>> {
        Ok(self
            .tags_collection()
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
#[derive(async_graphql::SimpleObject)]
pub struct MorphemeReference {
    /// Phonemic shape of the morpheme.
    pub morpheme: String,
    /// List of words that contain this morpheme.
    pub forms: Vec<AnnotatedForm>,
}

/// A list of words grouped by the document that contains them.
#[derive(async_graphql::SimpleObject)]
pub struct WordsInDocument {
    /// Unique identifier of the containing document
    pub document_id: Option<String>,
    /// What kind of document contains these words (e.g. manuscript vs dictionary)
    pub document_type: Option<DocumentType>,
    /// List of annotated and potentially segmented forms
    pub forms: Vec<AnnotatedForm>,
}
