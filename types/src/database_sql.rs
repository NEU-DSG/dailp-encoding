use std::sync::Arc;

use sqlx::types::Uuid;

use {
    crate::*,
    anyhow::Result,
    async_graphql::dataloader::*,
    async_trait::async_trait,
    futures::executor,
    futures::future::{join_all, try_join},
    itertools::Itertools,
    serde::Serialize,
    sqlx::Acquire,
    sqlx::{
        postgres::{self, types::PgRange, PgPoolOptions},
        query, query_as, query_file, query_file_as, query_file_scalar, query_scalar,
    },
    std::collections::{HashMap, HashSet},
    tokio_stream::StreamExt,
};

/// Connects to our backing database instance, providing high level functions
/// for accessing the data therein.
pub struct Database {
    client: sqlx::Pool<sqlx::Postgres>,
}
impl Database {
    pub async fn connect() -> Result<Self> {
        let db_url = std::env::var("DATABASE_URL")?;
        let conn = PgPoolOptions::new()
            .max_connections(5)
            .connect(&db_url)
            .await?;
        Ok(Database { client: conn })
    }

    pub async fn search_words_any_field(&self, query: String) -> Result<Vec<AnnotatedForm>> {
        let like_query = format!("%{}%", query);
        let results = query_file!("queries/search_words_any_field.sql", like_query)
            .fetch_all(&self.client)
            .await?;
        Ok(results
            .into_iter()
            .map(|w| AnnotatedForm {
                id: Some(w.id),
                source: w.source_text,
                normalized_source: None,
                simple_phonetics: w.simple_phonetics,
                phonemic: w.phonemic,
                // TODO Fill in
                segments: None,
                english_gloss: w.english_gloss.map(|s| vec![s]).unwrap_or_default(),
                commentary: w.commentary,
                audio_track: None,
                date_recorded: None,
                line_break: None,
                page_break: None,
                position: PositionInDocument::new(DocumentId(w.document_id), "".to_owned(), 1),
            })
            .collect())
    }

    pub async fn top_collections(&self) -> Result<Vec<DocumentCollection>> {
        Ok(
            query_file_as!(DocumentCollection, "queries/top_collections.sql")
                .fetch_all(&self.client)
                .await?,
        )
    }

    pub async fn words_in_document(
        &self,
        document_id: &DocumentId,
    ) -> Result<impl Iterator<Item = AnnotatedForm>> {
        let words = query_file!("queries/document_words.sql", &document_id.0)
            .fetch_all(&self.client)
            .await?;
        Ok(words.into_iter().map(|w| AnnotatedForm {
            id: Some(w.id),
            source: w.source_text,
            normalized_source: None,
            simple_phonetics: w.simple_phonetics,
            phonemic: w.phonemic,
            // TODO Fill in
            segments: None,
            english_gloss: w.english_gloss.map(|s| vec![s]).unwrap_or_default(),
            commentary: w.commentary,
            audio_track: None,
            date_recorded: None,
            line_break: None,
            page_break: None,
            position: PositionInDocument::new(DocumentId(w.document_id), "".to_owned(), 1),
        }))
    }

    pub async fn count_words_in_document(&self, document_id: &DocumentId) -> Result<i64> {
        Ok(
            query_file_scalar!("queries/count_words_in_document.sql", &document_id.0)
                .fetch_one(&self.client)
                .await?
                .unwrap(),
        )
    }

    pub async fn documents_in_collection(
        &self,
        super_collection: &str,
        collection: &str,
    ) -> Result<Vec<DocumentReference>> {
        Ok(query_file_as!(
            DocumentReference,
            "queries/documents_in_collection.sql",
            super_collection,
            collection
        )
        .fetch_all(&self.client)
        .await?)
    }

    pub async fn insert_top_collection(&self, title: String, index: i64) -> Result<Uuid> {
        Ok(query_file_scalar!(
            "queries/insert_collection.sql",
            None as Option<Uuid>,
            slug::slugify(&title),
            title.trim(),
            index
        )
        .fetch_one(&self.client)
        .await?)
    }

    pub async fn insert_dictionary_document(&self, document: DocumentMetadata) -> Result<()> {
        query_file!(
            "queries/insert_document.sql",
            document.id.0,
            document.title,
            document.is_reference,
            document.date as Option<Date>,
            None as Option<Uuid>,
        )
        .execute(&self.client)
        .await?;
        Ok(())
    }

    pub async fn insert_document(
        &self,
        document: AnnotatedDoc,
        collection_id: &Uuid,
        index_in_collection: i64,
    ) -> Result<()> {
        let mut tx = self.client.begin().await?;

        let slice_id = if let Some(audio) = document.meta.audio_recording {
            let time_range: Option<PgRange<_>> = match (audio.start_time, audio.end_time) {
                (Some(a), Some(b)) => Some((a as i64..b as i64).into()),
                (Some(a), None) => Some((a as i64..).into()),
                (None, Some(b)) => Some((..b as i64).into()),
                (None, None) => None,
            };
            let slice_id =
                query_file_scalar!("queries/insert_audio.sql", audio.resource_url, time_range)
                    .fetch_one(&mut tx)
                    .await?;
            Some(slice_id)
        } else {
            None
        };

        let document_id = document.meta.id.0;
        let res = query_file!(
            "queries/insert_document_in_collection.sql",
            &document_id,
            document.meta.title,
            document.meta.is_reference,
            document.meta.date as Option<Date>,
            slice_id,
            collection_id,
            index_in_collection
        )
        .execute(&mut tx)
        .await;

        // Bail early without an error if the document already exists.
        // TODO Write function to delete all data associated with a document
        if res.is_err() {
            return Ok(());
        }

        if let Some(pages) = document.segments {
            let mut starting_char_index = 0;
            for (page_index, page) in pages.into_iter().enumerate() {
                let page_id = query_file_scalar!(
                    "queries/upsert_document_page.sql",
                    &document_id,
                    page_index as i64
                )
                .fetch_one(&mut tx)
                .await?;

                for paragraph in page.paragraphs {
                    let total_chars: usize = paragraph
                        .source
                        .iter()
                        .map(|e| {
                            if let AnnotatedSeg::Word(word) = e {
                                word.source.chars().count()
                            } else {
                                0
                            }
                        })
                        .sum();
                    let char_range: PgRange<_> =
                        (starting_char_index..starting_char_index + total_chars as i64).into();
                    query_file!(
                        "queries/insert_paragraph.sql",
                        page_id,
                        char_range,
                        paragraph.translation.unwrap_or_default()
                    )
                    .execute(&mut tx)
                    .await?;

                    for element in paragraph.source {
                        match element {
                            AnnotatedSeg::Word(word) => {
                                let len = word.source.chars().count() as i64;
                                for (char_index, character) in word.source.chars().enumerate() {
                                    query_file!(
                                        "queries/insert_character_transcription.sql",
                                        page_id,
                                        starting_char_index + char_index as i64,
                                        &[character.to_string()] as &[String]
                                    )
                                    .execute(&mut tx)
                                    .await?;
                                }
                                let char_range: PgRange<_> =
                                    (starting_char_index..starting_char_index + len).into();
                                self.insert_word(
                                    &mut tx,
                                    word,
                                    &document_id,
                                    Some(page_id),
                                    Some(char_range),
                                )
                                .await?;
                                starting_char_index += len;
                            }
                            AnnotatedSeg::LineBreak(_) => {}
                        }
                    }
                }
            }
        }

        tx.commit().await?;
        Ok(())
    }

    pub async fn document_breadcrumbs(
        &self,
        document_id: &str,
        super_collection: &str,
    ) -> Result<Vec<DocumentCollection>> {
        let breadcrumbs = query_file!(
            "queries/document_breadcrumbs.sql",
            document_id,
            super_collection
        )
        .fetch_all(&self.client)
        .await?;

        Ok(breadcrumbs
            .into_iter()
            .map(|item| DocumentCollection {
                slug: item.slug.unwrap(),
                title: item.title.unwrap(),
            })
            .collect())
    }

    pub async fn insert_lexical_entry(
        &self,
        stem: AnnotatedForm,
        surface_forms: Vec<AnnotatedForm>,
    ) -> Result<()> {
        let doc_id = stem.position.document_id.0;
        let mut tx = self.client.begin().await?;
        let segment = &stem.segments.unwrap()[0];
        // TODO Instead of sanitizing like this, just adjust the glosses in EFN documents.
        // That will reduce having to handle special cases. We should be able to
        // support whatever characters in morpheme glosses and just maybe
        // sanitize for display purposes if absolutely necessary.
        let gloss = segment
            .gloss
            .replace(&[',', '+', '(', ')', '[', ']'] as &[char], " ")
            .split_whitespace()
            .join(".");
        let gloss_id = query_file_scalar!(
            "queries/upsert_dictionary_entry.sql",
            &doc_id,
            gloss,
            segment.morpheme
        )
        .fetch_one(&mut tx)
        .await?;

        // TODO When we end up referring to morpheme glosses by ID, pass that in.
        for form in surface_forms {
            self.insert_word(&mut tx, form, &doc_id, None, None).await?;
        }

        tx.commit().await?;
        Ok(())
    }

    pub async fn insert_lexical_forms(
        &self,
        forms: impl Iterator<Item = AnnotatedForm>,
    ) -> Result<()> {
        let mut tx = self.client.begin().await?;
        for form in forms {
            let doc_id = form.position.document_id.0.clone();
            self.insert_word(&mut tx, form, &doc_id, None, None).await?;
        }
        tx.commit().await?;
        Ok(())
    }

    pub async fn insert_word<'a>(
        &self,
        tx: &mut sqlx::Transaction<'a, sqlx::Postgres>,
        form: AnnotatedForm,
        document_id: &str,
        page_id: Option<Uuid>,
        char_range: Option<PgRange<i64>>,
    ) -> Result<Uuid> {
        let mut tx = tx.begin().await?;
        let word_id: Uuid = query_file_scalar!(
            "queries/upsert_word_in_document.sql",
            form.source,
            form.simple_phonetics,
            form.phonemic,
            form.english_gloss.get(0),
            form.date_recorded as Option<Date>,
            form.commentary,
            document_id,
            form.position.page_number,
            form.position.index as i64,
            page_id,
            char_range
        )
        .fetch_one(&mut tx)
        .await?;

        if let Some(segments) = form.segments {
            for (index, segment) in segments.into_iter().enumerate() {
                // FIXME Get rid of this sanitize step.
                let gloss = segment
                    .gloss
                    .replace(&[',', '+', '(', ')', '[', ']'] as &[char], " ")
                    .split_whitespace()
                    .join(".");

                query_file!(
                    "queries/upsert_morpheme_gloss.sql",
                    document_id,
                    gloss,
                    None as Option<String>
                )
                .execute(&mut tx)
                .await?;

                query_file!(
                    "queries/upsert_word_segment.sql",
                    word_id,
                    index as i64,
                    segment.morpheme,
                    gloss,
                    segment.followed_by as Option<SegmentType>
                )
                .execute(&mut tx)
                .await?;
            }
        }

        tx.commit().await?;

        Ok(word_id)
    }

    pub async fn insert_morpheme_relation(&self, link: LexicalConnection) -> Result<()> {
        query_file!(
            "queries/insert_morpheme_relation.sql",
            link.left.document_id.unwrap().0,
            link.left.gloss,
            link.right.document_id.unwrap().0,
            link.right.gloss
        )
        .execute(&self.client)
        .await?;
        Ok(())
    }

    pub async fn collection(&self, slug: String) -> Result<DocumentCollection> {
        let collection = query_file!("queries/collection_details.sql", slug)
            .fetch_one(&self.client)
            .await?;
        Ok(DocumentCollection {
            slug: collection.slug,
            title: collection.title,
        })
    }
}

#[async_trait]
impl Loader<DocumentId> for Database {
    type Value = AnnotatedDoc;
    type Error = Arc<sqlx::Error>;
    async fn load(
        &self,
        keys: &[DocumentId],
    ) -> Result<HashMap<DocumentId, Self::Value>, Self::Error> {
        // Turn keys into strings for database request.
        // TODO ideally I'd be able to pass `keys` directly instead of mapping it.
        let keys: Vec<&str> = keys.iter().map(|x| &x.0 as &str).collect();
        let items = query_file!("queries/many_documents.sql", keys as Vec<&str>)
            .fetch_all(&self.client)
            .await?;
        Ok(items
            .into_iter()
            .map(|item| Self::Value {
                meta: DocumentMetadata {
                    id: DocumentId(item.id),
                    title: item.title,
                    is_reference: item.is_reference,
                    date: item.written_at.map(Date::new),
                    audio_recording: None,
                    collection: None,
                    contributors: item
                        .contributors
                        .and_then(|x| serde_json::from_value(x).ok())
                        .unwrap_or_default(),
                    genre: None,
                    order_index: 0,
                    page_images: None,
                    sources: Vec::new(),
                    translation: None,
                },
                segments: None,
            })
            .map(|tag| (tag.meta.id.clone(), tag))
            .collect())
    }
}

#[async_trait]
impl Loader<PagesInDocument> for Database {
    type Value = Vec<DocumentPage>;
    type Error = Arc<sqlx::Error>;

    async fn load(
        &self,
        keys: &[PagesInDocument],
    ) -> Result<HashMap<PagesInDocument, Self::Value>, Self::Error> {
        let keys: Vec<_> = keys.iter().map(|k| (k.0).0.clone()).collect();
        let items = query_file!("queries/document_pages.sql", &keys[..])
            .fetch_all(&self.client)
            .await?;
        Ok(items
            .into_iter()
            .map(|page| {
                (
                    PagesInDocument(DocumentId(page.document_id)),
                    DocumentPage {
                        id: page.id,
                        page_number: (page.index_in_document + 1).to_string(),
                    },
                )
            })
            .into_group_map())
    }
}

#[async_trait]
impl Loader<ParagraphsInPage> for Database {
    type Value = Vec<DocumentParagraph>;
    type Error = Arc<sqlx::Error>;

    async fn load(
        &self,
        keys: &[ParagraphsInPage],
    ) -> Result<HashMap<ParagraphsInPage, Self::Value>, Self::Error> {
        let keys: Vec<_> = keys.iter().map(|k| k.0.clone()).collect();
        let items = query_file!("queries/document_paragraphs.sql", &keys[..])
            .fetch_all(&self.client)
            .await?;
        // TODO use a stream here to avoid collecting into a Vec twice.
        // Hmm... Might not be possible with the group_by call? Or we'd have to
        // reimplement that with try_fold()
        Ok(items
            .into_iter()
            .map(|p| {
                (
                    ParagraphsInPage(p.page_id),
                    DocumentParagraph {
                        id: p.id,
                        translation: p.english_translation,
                    },
                )
            })
            .into_group_map())
    }
}

#[async_trait]
impl Loader<PartsOfWord> for Database {
    type Value = Vec<MorphemeSegment>;
    type Error = Arc<sqlx::Error>;

    async fn load(
        &self,
        keys: &[PartsOfWord],
    ) -> Result<HashMap<PartsOfWord, Self::Value>, Self::Error> {
        let keys: Vec<_> = keys.iter().map(|k| k.0.clone()).collect();
        let items = query_file!("queries/word_parts.sql", &keys[..])
            .fetch_all(&self.client)
            .await?;
        Ok(items
            .into_iter()
            .map(|part| {
                (
                    PartsOfWord(part.word_id),
                    MorphemeSegment {
                        morpheme: part.morpheme,
                        gloss: part.gloss,
                        followed_by: part.followed_by,
                    },
                )
            })
            .into_group_map())
    }
}

// #[async_trait]
// impl Loader<TagId> for Database {
//     type Value = MorphemeTag;
//     type Error = Arc<sqlx::Error>;
//     async fn load(&self, keys: &[TagId]) -> Result<HashMap<TagId, Self::Value>, Self::Error> {
//         let keys: Vec<_> = keys.iter().map(|k| &k.0 as &str).collect();
//         let items = query_file!("queries/")
//     }
// }

#[async_trait]
impl Loader<WordsInParagraph> for Database {
    type Value = Vec<AnnotatedSeg>;
    type Error = Arc<sqlx::Error>;

    async fn load(
        &self,
        keys: &[WordsInParagraph],
    ) -> Result<HashMap<WordsInParagraph, Self::Value>, Self::Error> {
        let keys: Vec<_> = keys.iter().map(|k| k.0.clone()).collect();
        let items = query_file!("queries/words_in_paragraph.sql", &keys[..])
            .fetch_all(&self.client)
            .await?;
        Ok(items
            .into_iter()
            .map(|w| {
                (
                    WordsInParagraph(w.paragraph_id),
                    AnnotatedSeg::Word(AnnotatedForm {
                        id: Some(w.id),
                        source: w.source_text,
                        normalized_source: None,
                        simple_phonetics: w.simple_phonetics,
                        phonemic: w.phonemic,
                        // TODO Fill in
                        segments: None,
                        english_gloss: w.english_gloss.map(|s| vec![s]).unwrap_or_default(),
                        commentary: w.commentary,
                        audio_track: None,
                        date_recorded: None,
                        line_break: None,
                        page_break: None,
                        position: PositionInDocument::new(
                            DocumentId(String::new()),
                            "".to_owned(),
                            1,
                        ),
                    }),
                )
            })
            .into_group_map())
    }
}
