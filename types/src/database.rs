use crate::*;
use anyhow::Result;
use async_graphql::dataloader::*;
use futures::executor;
use futures::future::join_all;
use mongodb::bson;
use std::collections::{HashMap, HashSet};

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
    const PEOPLE: &'static str = "people";

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
    pub fn people_collection(&self) -> mongodb::Collection {
        self.client.collection(Self::PEOPLE)
    }
}

impl Database {
    pub fn new() -> Result<Self> {
        use mongodb::{options::ClientOptions, Client};

        let db_url = std::env::var("MONGODB_URI")?;
        let opts = executor::block_on(ClientOptions::parse(&db_url))?;
        let client = Client::with_options(opts)?;
        Ok(Database {
            client: client.database("dailp-encoding"),
        })
    }

    pub async fn update_tag(&self, tag: MorphemeTag) -> Result<()> {
        self.tags_collection()
            .update_one(
                bson::doc! { "_id": &tag.id },
                bson::to_document(&tag)?,
                mongodb::options::UpdateOptions::builder()
                    .upsert(true)
                    .build(),
            )
            .await?;
        Ok(())
    }

    pub async fn update_document(&self, tag: AnnotatedDoc) -> Result<()> {
        self.documents_collection()
            .update_one(
                bson::doc! { "_id": &tag.meta.id },
                bson::to_document(&tag)?,
                mongodb::options::UpdateOptions::builder()
                    .upsert(true)
                    .build(),
            )
            .await?;
        Ok(())
    }

    pub async fn update_connection(&self, tag: LexicalConnection) -> Result<()> {
        self.connections_collection()
            .update_one(
                bson::doc! { "_id": &tag.id },
                bson::to_document(&tag)?,
                mongodb::options::UpdateOptions::builder()
                    .upsert(true)
                    .build(),
            )
            .await?;
        Ok(())
    }

    pub async fn update_form(&self, tag: AnnotatedForm) -> Result<()> {
        self.words_collection()
            .update_one(
                bson::doc! { "_id": &tag.id },
                bson::to_document(&tag)?,
                mongodb::options::UpdateOptions::builder()
                    .upsert(true)
                    .build(),
            )
            .await?;
        Ok(())
    }

    pub async fn update_person(&self, person: ContributorDetails) -> Result<()> {
        self.people_collection()
            .update_one(
                bson::doc! { "_id": &person.full_name },
                bson::to_document(&person)?,
                mongodb::options::UpdateOptions::builder()
                    .upsert(true)
                    .build(),
            )
            .await?;
        Ok(())
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
            // Only show non-reference collections in the list.
            .distinct("collection", bson::doc! { "is_reference": false }, None)
            .await?
            .iter()
            .filter_map(|doc| doc.as_str())
            .map(|name| DocumentCollection {
                name: name.to_owned(),
            })
            .collect())
    }

    pub async fn all_tags(&self) -> Result<Vec<MorphemeTag>> {
        use tokio::stream::StreamExt as _;
        Ok(self
            .tags_collection()
            .find(None, None)
            .await?
            .filter_map(|doc| doc.ok().and_then(|doc| bson::from_document(doc).ok()))
            .collect()
            .await)
    }

    pub async fn all_people(&self) -> Result<Vec<ContributorDetails>> {
        use tokio::stream::StreamExt as _;
        Ok(self
            .people_collection()
            .find(None, None)
            .await?
            .filter_map(|doc| doc.ok().and_then(|doc| bson::from_document(doc).ok()))
            .collect()
            .await)
    }

    pub async fn words_in_document(&self, doc_id: &str) -> Result<Vec<AnnotatedForm>> {
        use tokio::stream::StreamExt as _;
        let mut forms: Vec<AnnotatedForm> = self
            .words_collection()
            .find(bson::doc! { "position.document_id": doc_id }, None)
            .await?
            .filter_map(|doc| doc.ok().and_then(|doc| bson::from_document(doc).ok()))
            .collect()
            .await;
        forms.sort_by_key(|f| f.position.index);
        Ok(forms)
    }

    /// The number of words that belong to the given document ID.
    pub async fn count_words_in_document(&self, doc_id: &str) -> Result<i64> {
        Ok(self
            .words_collection()
            .count_documents(bson::doc! { "position.document_id": doc_id }, None)
            .await?)
    }

    pub async fn word_search(&self, query: String) -> Result<Vec<AnnotatedForm>> {
        use tokio::stream::StreamExt as _;
        let pat = format!(".*{}.*", query);
        Ok(self
            .words_collection()
            .find(
                bson::doc! {
                    "$or": [
                        { "source": { "$regex": &pat, "$options": "i" } },
                        { "normalized_source": { "$regex": &pat, "$options": "i" } },
                        { "simple_phonetics": { "$regex": &pat, "$options": "i" } },
                        { "english_gloss": { "$regex": pat, "$options": "i" } },
                    ]
                },
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
        let morpheme_match = if let Some(doc_id) = &morpheme.document_id {
            bson::doc! { "position.document_id": doc_id, "segments.gloss": &morpheme.gloss }
        } else {
            bson::doc! { "segments.gloss": &morpheme.gloss }
        };
        Ok(self
            .words_collection()
            .find(
                bson::doc! { "$or": [
                    // More likely a surface form
                    morpheme_match,
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
        let links = col
            .aggregate(
                vec![
                    bson::doc! { "$match": { "links": &morpheme } },
                    bson::doc! { "$lookup": {
                        "from": Database::WORDS,
                        "localField": "links",
                        "foreignField": "segments.gloss",
                        "as": "connections"
                    } },
                    bson::doc! { "$unwind": "$connections" },
                    bson::doc! { "$replaceRoot": { "newRoot": "$connections" } },
                ],
                None,
            )
            .await?;

        Ok(links
            .filter_map(|doc| doc.ok().and_then(|doc| bson::from_document(doc).ok()))
            .collect()
            .await)
    }

    async fn exact_connections(&self, morpheme: &MorphemeId) -> Result<Vec<MorphemeId>> {
        use tokio::stream::StreamExt as _;

        let col = self.connections_collection();
        let morpheme = bson::to_bson(morpheme)?;

        // Find the connections containing this entry.
        let froms = col.find(bson::doc! { "links": &morpheme }, None).await?;

        let froms = froms.filter_map(|doc| {
            doc.ok()
                .and_then(|doc| bson::from_document::<LexicalConnection>(doc).ok())
        });

        Ok(froms
            .collect::<Vec<_>>()
            .await
            .into_iter()
            .flat_map(|conn| conn.links)
            .collect())
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

    async fn graph_connections(&self, id: &MorphemeId) -> Result<HashSet<MorphemeId>> {
        use tokio::stream::StreamExt as _;

        let col = self.connections_collection();
        let morpheme = bson::to_bson(id)?;

        let connections = col
            .aggregate(
                vec![
                    bson::doc! { "$match": { "links": morpheme } },
                    bson::doc! { "$graphLookup": {
                        "from": Database::CONNECTIONS,
                        "startWith": "$links",
                        "connectFromField": "links",
                        "connectToField": "links",
                        "maxDepth": 20,
                        "as": "connections"
                    } },
                ],
                None,
            )
            .await?
            .collect::<Vec<_>>()
            .await;

        Ok(connections
            .into_iter()
            .filter_map(|d| d.unwrap().get_array("connections").ok().map(|x| x.clone()))
            .flat_map(|x| x)
            .filter_map(|d| bson::from_bson(d).ok())
            .collect())
    }

    async fn doc_matches(&self, morpheme: &MorphemeId) -> Result<Vec<AnnotatedForm>> {
        use tokio::stream::StreamExt as _;
        let mut steps = vec![
            bson::doc! { "$unwind": "$segments" },
            bson::doc! { "$replaceRoot": { "newRoot": "$segments.source" } },
            bson::doc! { "$unwind": "$parts" },
            bson::doc! { "$replaceRoot": { "newRoot": "$parts" } },
            bson::doc! { "$match": { "segments.gloss": &morpheme.gloss } },
        ];
        if let Some(doc_id) = &morpheme.document_id {
            steps.insert(0, bson::doc! { "$match": { "_id": doc_id } });
        }
        Ok(self
            .documents_collection()
            .aggregate(steps, None)
            .await?
            .filter_map(|d| d.ok().and_then(|d| bson::from_document(d).ok()))
            .collect()
            .await)
    }

    /// Forms that contain the given morpheme gloss, from both lexical resources
    /// and corpus data
    pub async fn connected_surface_forms(&self, id: &MorphemeId) -> Result<Vec<AnnotatedForm>> {
        let ids = self.graph_connections(id).await?;
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
    pub async fn morphemes(
        &self,
        morpheme: &MorphemeId,
        compare_by: Option<CherokeeOrthography>,
    ) -> Result<Vec<MorphemeReference>> {
        use itertools::Itertools;
        use tokio::stream::StreamExt;

        let dictionary_words = self.surface_forms(morpheme);
        let documents = self.documents_collection();
        let mut steps = vec![
            bson::doc! { "$unwind": "$segments" },
            bson::doc! { "$replaceRoot": { "newRoot": "$segments.source" } },
            bson::doc! { "$unwind": "$parts" },
            bson::doc! { "$replaceRoot": { "newRoot": "$parts" } },
            bson::doc! { "$match": { "segments.gloss": &morpheme.gloss } },
        ];
        if let Some(doc_id) = &morpheme.document_id {
            steps.insert(0, bson::doc! { "$match": { "_id": doc_id } });
        }
        let document_words = documents.aggregate(steps, None);

        // Retrieve both document and dictionary references at once.
        let (dictionary_words, document_words) = futures::join!(dictionary_words, document_words);

        let dictionary_words = dictionary_words?.into_iter().filter_map(|form| {
            Some((
                form.find_morpheme(&morpheme.gloss)?
                    .get_morpheme(compare_by)
                    .into_owned(),
                form,
            ))
        });

        let document_words = document_words?
            .filter_map(|doc| {
                let word: AnnotatedForm = bson::from_document(doc.ok()?).ok()?;
                let m = {
                    // Find the index of the relevant morpheme gloss.
                    let segment = word.find_morpheme(&morpheme.gloss)?;
                    // Grab the morpheme with the same index.
                    segment.get_morpheme(compare_by).into_owned()
                };
                Some((m, word))
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
}

#[derive(Clone, Eq, PartialEq, Hash)]
pub struct TagId(pub String);

#[async_trait::async_trait]
impl Loader<TagId> for Database {
    type Value = MorphemeTag;
    type Error = mongodb::error::Error;
    async fn load(&self, keys: &[TagId]) -> Result<HashMap<TagId, Self::Value>, Self::Error> {
        let mut results = HashMap::new();
        // Turn keys into strings for Mongo request.
        let keys: Vec<_> = keys.iter().map(|x| &*x.0).collect();
        let items: Vec<Self::Value> = find_all_keys(self.tags_collection(), keys).await?;

        for tag in items {
            results.insert(TagId(tag.id.clone()), tag);
        }

        Ok(results)
    }
}

#[derive(Clone, Eq, PartialEq, Hash)]
pub struct DocumentId(pub String);

#[async_trait::async_trait]
impl Loader<DocumentId> for Database {
    type Value = AnnotatedDoc;
    type Error = mongodb::error::Error;
    async fn load(
        &self,
        keys: &[DocumentId],
    ) -> Result<HashMap<DocumentId, Self::Value>, Self::Error> {
        let mut results = HashMap::new();
        // Turn keys into strings for Mongo request.
        let keys: Vec<_> = keys.iter().map(|x| &x.0 as &str).collect();
        let items: Vec<Self::Value> = find_all_keys(self.documents_collection(), keys).await?;

        for tag in items {
            results.insert(DocumentId(tag.meta.id.clone()), tag);
        }

        Ok(results)
    }
}

#[derive(Clone, Eq, PartialEq, Hash)]
pub struct PersonId(pub String);

#[async_trait::async_trait]
impl Loader<PersonId> for Database {
    type Value = ContributorDetails;
    type Error = mongodb::error::Error;
    async fn load(&self, keys: &[PersonId]) -> Result<HashMap<PersonId, Self::Value>, Self::Error> {
        let mut results = HashMap::new();
        // Turn keys into strings for Mongo request.
        let keys: Vec<_> = keys.iter().map(|x| &x.0 as &str).collect();
        let items: Vec<Self::Value> = find_all_keys(self.people_collection(), keys).await?;

        for tag in items {
            results.insert(PersonId(tag.full_name.clone()), tag);
        }

        Ok(results)
    }
}

async fn find_all_keys<T>(
    col: mongodb::Collection,
    keys: Vec<&str>,
) -> Result<Vec<T>, mongodb::error::Error>
where
    T: for<'de> serde::Deserialize<'de>,
{
    use tokio::stream::StreamExt;
    Ok(col
        .find(bson::doc! { "_id": { "$in": keys } }, None)
        .await?
        .filter_map(|doc| bson::from_document(doc.unwrap()).ok())
        .collect()
        .await)
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
