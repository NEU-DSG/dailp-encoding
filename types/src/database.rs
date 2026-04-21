use {
    crate::*,
    anyhow::Result,
    async_graphql::dataloader::*,
    futures::executor,
    futures::future::join_all,
    mongodb::bson,
    std::collections::{HashMap, HashSet},
    tokio_stream::StreamExt,
};

/// Connects to our backing database instance, providing high level functions
/// for accessing the data therein.
#[derive(Clone)]
struct Database {
    client: mongodb::Database,
}

impl Database {
    const DOCUMENTS: &'static str = "annotated-documents";
    /// TODO Rename to "forms"
    const WORDS: &'static str = "sea-of-words";
    const TAGS: &'static str = "tags";
    const CONNECTIONS: &'static str = "lexical-connections";
    /// TODO Rename to "contributors"
    const PEOPLE: &'static str = "people";
    const IMAGE_SOURCES: &'static str = "image-sources";
    const PAGES: &'static str = "pages";
    const ANNOTATIONS: &'static str = "annotations";
}

impl Database {
    pub fn new() -> Result<Self> {
        use mongodb::{options::ClientOptions, Client};

        let db_url = std::env::var("MONGODB_URI")?;
        let opts = executor::block_on(ClientOptions::parse(&db_url))?;
        let client = Client::with_options(opts)?;
        let db = client.database("dailp-encoding");
        Ok(Database { client: db })
    }

    pub fn pages(&self) -> PagesDb {
        PagesDb {
            conn: self.client.collection(Self::PAGES),
        }
    }

    pub fn annotations(&self) -> AnnotationsDb {
        AnnotationsDb {
            conn: self.client.collection(Self::ANNOTATIONS),
        }
    }

    pub async fn all_tags(&self) -> Result<Vec<MorphemeTag>> {
        self.client
            .collection(Self::TAGS)
            .find(None, None)
            .await?
            .map(|doc| Ok(bson::from_document(doc?)?))
            .collect()
            .await
    }

    pub async fn all_people(&self) -> Result<Vec<ContributorDetails>> {
        self.client
            .collection(Self::PEOPLE)
            .find(None, None)
            .await?
            .map::<Result<_>, _>(|doc| Ok(bson::from_document(doc?)?))
            .collect()
            .await
    }

    pub async fn lexical_entry(&self, id: &str) -> Result<Option<Word>> {
        Ok(self
            .client
            .collection(Self::WORDS)
            .find_one(bson::doc! { "_id": id }, None)
            .await?
            .and_then(|doc| bson::from_document(doc).ok()))
    }

    pub async fn surface_forms(&self, morpheme: &MorphemeId) -> Result<Vec<Word>> {
        let morpheme_match = if let Some(doc_id) = &morpheme.document_id {
            let doc_id = bson::to_bson(doc_id)?;
            bson::doc! { "position.documentId": doc_id, "segments.gloss": &morpheme.gloss }
        } else {
            bson::doc! { "segments.gloss": &morpheme.gloss }
        };
        Ok(self
            .client
            .collection(Self::WORDS)
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

    pub async fn connected_forms(&self, morpheme: &MorphemeId) -> Result<Vec<Word>> {
        let col = self
            .client
            .collection::<LexicalConnection>(Self::CONNECTIONS);
        let morpheme = bson::to_bson(morpheme)?;

        // Find the connections starting from this entry.
        let links = col
            .aggregate(
                vec![
                    bson::doc! { "$match": { "links": &morpheme } },
                    bson::doc! { "$lookup": {
                        "from": Self::WORDS,
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

        links
            .map::<Result<_>, _>(|doc| Ok(bson::from_document(doc?)?))
            .collect()
            .await
    }

    async fn exact_connections(&self, morpheme: &MorphemeId) -> Result<Vec<MorphemeId>> {
        unimplemented!()
        // let col = self
        //     .client
        //     .collection::<LexicalConnection>(Self::CONNECTIONS);
        // let morpheme = bson::to_bson(morpheme)?;

        // // Find the connections containing this entry.
        // let froms = col.find(bson::doc! { "links": &morpheme }, None).await?;

        // let froms = froms.filter_map(|doc| doc.ok());

        // Ok(froms
        //     .collect::<Vec<_>>()
        //     .await
        //     .into_iter()
        //     .flat_map(|conn| conn.links)
        //     .collect())
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
        let col = self
            .client
            .collection::<LexicalConnection>(Self::CONNECTIONS);
        let morpheme = if let Some(doc_id) = &id.document_id {
            let doc_id = bson::to_bson(doc_id)?;
            if let Some(index) = id.index {
                bson::doc! { "documentId": doc_id, "gloss": &id.gloss, "index": index }
            } else {
                bson::doc! { "documentId": doc_id, "gloss": &id.gloss }
            }
        } else {
            bson::doc! { "gloss": &id.gloss }
        };

        let connections = col
            .aggregate(
                vec![
                    bson::doc! { "$match": { "links": morpheme } },
                    bson::doc! { "$graphLookup": {
                        "from": Self::CONNECTIONS,
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
            .filter_map(|d| d.unwrap().get_array("connections").ok().cloned())
            .flat_map(|x| x)
            .filter_map(|d| bson::from_bson(d).ok())
            .collect())
    }

    async fn doc_search(&self, query: bson::Document) -> Result<Vec<Word>> {
        let steps = vec![
            bson::doc! { "$unwind": "$segments" },
            bson::doc! { "$replaceRoot": { "newRoot": "$segments.source" } },
            bson::doc! { "$unwind": "$parts" },
            bson::doc! { "$replaceRoot": { "newRoot": "$parts" } },
            bson::doc! { "$match": query },
        ];
        let coll = self.client.collection::<AnnotatedDoc>(Self::DOCUMENTS);
        coll.aggregate(steps, None)
            .await?
            .map::<Result<_>, _>(|d| Ok(bson::from_document(d?)?))
            .collect()
            .await
    }

    async fn doc_matches(&self, morpheme: &MorphemeId) -> Result<Vec<Word>> {
        let mut steps = vec![
            bson::doc! { "$unwind": "$segments" },
            bson::doc! { "$replaceRoot": { "newRoot": "$segments.source" } },
            bson::doc! { "$unwind": "$parts" },
            bson::doc! { "$replaceRoot": { "newRoot": "$parts" } },
            bson::doc! { "$match": { "segments.gloss": &morpheme.gloss } },
        ];
        if let Some(doc_id) = &morpheme.document_id {
            steps.insert(
                0,
                bson::doc! { "$match": { "_id": bson::to_bson(doc_id)? } },
            );
        }
        let coll = self.client.collection::<AnnotatedDoc>(Self::DOCUMENTS);
        coll.aggregate(steps, None)
            .await?
            .map::<Result<_>, _>(|d| Ok(bson::from_document(d?)?))
            .collect()
            .await
    }

    /// Forms that contain the given morpheme gloss, from both lexical resources
    /// and corpus data
    pub async fn connected_surface_forms(&self, id: &MorphemeId) -> Result<Vec<Word>> {
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

        let dictionary_words = self.surface_forms(morpheme);
        let documents = self.client.collection::<AnnotatedDoc>(Self::DOCUMENTS);
        let mut steps = vec![
            bson::doc! { "$unwind": "$segments" },
            bson::doc! { "$replaceRoot": { "newRoot": "$segments.source" } },
            bson::doc! { "$unwind": "$parts" },
            bson::doc! { "$replaceRoot": { "newRoot": "$parts" } },
            bson::doc! { "$match": { "segments.gloss": &morpheme.gloss } },
        ];
        if let Some(doc_id) = &morpheme.document_id {
            steps.insert(
                0,
                bson::doc! { "$match": { "_id": bson::to_bson(doc_id)? } },
            );
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
                let word: Word = bson::from_document(doc.ok()?).ok()?;
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
                document_id: Some(doc_id.0),
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
                document_id: Some(doc_id.0),
                forms: words,
            });

        Ok(document_words.chain(dictionary_words).collect())
    }

    /// USE WITH CAUTION! Clears the entire database of words, documents, etc.
    pub async fn clear_all(&self) -> Result<()> {
        Ok(self.client.drop(None).await?)
    }
}

pub struct PagesDb {
    conn: mongodb::Collection<crate::page::Page>,
}
impl PagesDb {
    pub async fn all(&self) -> Result<Vec<crate::page::Page>> {
        self.conn
            .find(None, None)
            .await?
            .map(|doc| Ok(doc?))
            .collect()
            .await
    }
}

pub struct AnnotationsDb {
    conn: mongodb::Collection<annotation::Annotation>,
}
impl AnnotationsDb {
    pub async fn on_document(
        &self,
        document_id: &DocumentId,
    ) -> Result<Vec<annotation::Annotation>> {
        self.conn
            .find(
                bson::doc! {
                    "attachedTo": {
                        "__typename": "Document",
                        "document": bson::to_bson(document_id)?
                    }
                },
                None,
            )
            .await?
            .map(|d| Ok(d?))
            .collect()
            .await
    }
}

#[async_trait::async_trait]
impl Loader<TagId> for Database {
    type Value = MorphemeTag;
    type Error = mongodb::error::Error;
    async fn load(&self, keys: &[TagId]) -> Result<HashMap<TagId, Self::Value>, Self::Error> {
        todo!()
        // let mut results = HashMap::new();
        // // Turn keys into strings for Mongo request.
        // let keys: Vec<_> = keys.iter().map(|x| &*x.0).collect();
        // let items: Vec<Self::Value> =
        //     find_all_keys(self.client.collection(Self::TAGS), keys).await?;

        // for tag in items {
        //     results.insert(TagId(tag.id.clone()), tag);
        // }

        // Ok(results)
    }
}

#[async_trait::async_trait]
impl Loader<DocumentId> for Database {
    type Value = AnnotatedDoc;
    type Error = mongodb::error::Error;
    async fn load(
        &self,
        keys: &[DocumentId],
    ) -> Result<HashMap<DocumentId, Self::Value>, Self::Error> {
        // Turn keys into strings for database request.
        let keys: Vec<_> = keys.iter().map(|x| &x.0 as &str).collect();
        let items: Vec<Self::Value> =
            find_all_keys(self.client.collection(Self::DOCUMENTS), keys).await?;
        Ok(items
            .into_iter()
            .map(|tag| (tag.meta.id.clone(), tag))
            .collect())
    }
}

#[async_trait::async_trait]
impl Loader<PersonFullName> for Database {
    type Value = ContributorDetails;
    type Error = mongodb::error::Error;
    async fn load(
        &self,
        keys: &[PersonFullName],
    ) -> Result<HashMap<PersonFullName, Self::Value>, Self::Error> {
        // Turn keys into strings for Mongo request.
        let keys: Vec<_> = keys.iter().map(|x| &x.0 as &str).collect();
        let items: Vec<Self::Value> =
            find_all_keys(self.client.collection(Self::PEOPLE), keys).await?;
        Ok(items
            .into_iter()
            .map(|tag| (PersonFullName(tag.full_name.clone()), tag))
            .collect())
    }
}

#[async_trait::async_trait]
impl Loader<PageId> for Database {
    type Value = crate::page::Page;
    type Error = mongodb::error::Error;
    async fn load(&self, keys: &[PageId]) -> Result<HashMap<PageId, Self::Value>, Self::Error> {
        // Turn keys into strings for database request.
        let keys: Vec<_> = keys.iter().map(|x| &x.0 as &str).collect();
        let items: Vec<Self::Value> =
            find_all_keys(self.client.collection(Self::PAGES), keys).await?;
        Ok(items
            .into_iter()
            .map(|tag| (PageId(tag.id.clone()), tag))
            .collect())
    }
}

async fn find_all_keys<T>(
    col: mongodb::Collection<T>,
    keys: Vec<&str>,
) -> Result<Vec<T>, mongodb::error::Error>
where
    T: for<'de> serde::Deserialize<'de>,
    T: Send + Sync + Unpin,
{
    Ok(col
        .find(bson::doc! { "_id": { "$in": keys } }, None)
        .await?
        .filter_map(|doc| doc.ok())
        .collect()
        .await)
}
