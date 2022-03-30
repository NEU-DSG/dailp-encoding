use {
    crate::*,
    anyhow::Result,
    async_graphql::dataloader::*,
    async_trait::async_trait,
    itertools::Itertools,
    sqlx::{
        postgres::{types::PgRange, PgPoolOptions},
        query_file, query_file_as, query_file_scalar, Acquire,
    },
    std::collections::HashMap,
    std::sync::Arc,
    tokio_stream::StreamExt,
    uuid::Uuid,
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
            .max_connections(8)
            .connect(&db_url)
            .await?;
        Ok(Database { client: conn })
    }

    pub async fn upsert_contributor(&self, person: ContributorDetails) -> Result<()> {
        query_file!("queries/upsert_contributor.sql", person.full_name)
            .execute(&self.client)
            .await?;
        Ok(())
    }

    pub async fn potential_syllabary_matches(&self, syllabary: &str) -> Result<Vec<AnnotatedForm>> {
        let alternate_spellings: Vec<_> = CherokeeOrthography::similar_syllabary_strings(syllabary)
            .into_iter()
            // Convert into "LIKE"-compatible format
            .map(|x| format!("%{}%", x))
            .collect();
        let items = query_file_as!(
            BasicWord,
            "queries/search_syllabary.sql",
            &alternate_spellings
        )
        .fetch_all(&self.client)
        .await?;
        Ok(items.into_iter().map(Into::into).collect())
    }

    pub async fn connected_forms(
        &self,
        document_id: Option<DocumentId>,
        gloss: &str,
    ) -> Result<Vec<AnnotatedForm>> {
        let items = query_file_as!(
            BasicWord,
            "queries/connected_forms.sql",
            gloss,
            document_id.map(|id| id.0)
        )
        .fetch_all(&self.client)
        .await?;
        Ok(items.into_iter().map(Into::into).collect())
    }

    pub async fn morphemes(
        &self,
        morpheme_id: MorphemeId,
        compare_by: Option<CherokeeOrthography>,
    ) -> Result<Vec<MorphemeReference>> {
        let items = query_file!(
            "queries/surface_forms.sql",
            morpheme_id.gloss,
            morpheme_id.document_name
        )
        .fetch_all(&self.client)
        .await?;
        Ok(items
            .into_iter()
            .group_by(|w| w.morpheme.clone())
            .into_iter()
            .map(|(shape, forms)| {
                MorphemeReference {
                    morpheme: shape,
                    forms: forms
                        .into_iter()
                        .map(|w| AnnotatedForm {
                            id: Some(w.word_id),
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
                                DocumentId(w.document_id),
                                w.page_number.unwrap_or_default(),
                                w.index_in_document as i32,
                            ),
                        })
                        .collect(),
                }
            })
            .collect())
    }

    pub async fn words_by_doc(
        &self,
        document_id: Option<DocumentId>,
        gloss: &str,
    ) -> Result<Vec<WordsInDocument>> {
        let words = query_file!(
            "queries/morphemes_by_document.sql",
            gloss,
            document_id.map(|id| id.0)
        )
        .fetch_all(&self.client)
        .await?;
        Ok(words
            .into_iter()
            .group_by(|w| (w.document_id, w.is_reference))
            .into_iter()
            .map(|((document_id, is_reference), forms)| WordsInDocument {
                document_id: Some(DocumentId(document_id)),
                document_type: if is_reference {
                    Some(DocumentType::Reference)
                } else {
                    Some(DocumentType::Corpus)
                },
                forms: forms
                    .into_iter()
                    .map(|w| AnnotatedForm {
                        id: Some(w.id),
                        source: w.source_text,
                        normalized_source: None,
                        simple_phonetics: w.simple_phonetics,
                        phonemic: w.phonemic,
                        segments: None,
                        english_gloss: w.english_gloss.map(|s| vec![s]).unwrap_or_default(),
                        commentary: w.commentary,
                        audio_track: None,
                        date_recorded: None,
                        line_break: None,
                        page_break: None,
                        position: PositionInDocument::new(
                            DocumentId(w.document_id),
                            w.page_number.unwrap_or_default(),
                            w.index_in_document as i32,
                        ),
                    })
                    .collect(),
            })
            .collect())
    }

    pub async fn all_documents(&self) -> Result<Vec<AnnotatedDoc>> {
        let results = query_file!("queries/all_documents.sql")
            .fetch_all(&self.client)
            .await?;
        Ok(results
            .into_iter()
            .map(|item| AnnotatedDoc {
                meta: DocumentMetadata {
                    id: DocumentId(item.id),
                    short_name: item.short_name,
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
            .collect())
    }

    pub async fn upsert_image_source(&self, title: &str, url: &str) -> Result<Uuid> {
        let id = query_file_scalar!("queries/insert_image_source.sql", title, url)
            .fetch_one(&self.client)
            .await?;
        Ok(id)
    }

    pub async fn image_source_by_title(&self, title: &str) -> Result<Option<ImageSource>> {
        let results = query_file!("queries/image_source_by_title.sql", title)
            .fetch_all(&self.client)
            .await?;
        Ok(results.into_iter().next().map(|x| ImageSource {
            id: ImageSourceId(x.id),
            url: x.base_url,
        }))
    }

    pub async fn image_source_by_id(&self, id: ImageSourceId) -> Result<Option<ImageSource>> {
        let results = query_file!("queries/image_source_by_id.sql", id.0)
            .fetch_all(&self.client)
            .await?;
        Ok(results.into_iter().next().map(|x| ImageSource {
            id: ImageSourceId(x.id),
            url: x.base_url,
        }))
    }

    pub async fn document_manifest(
        &self,
        document_name: &str,
        url: String,
    ) -> Result<iiif::Manifest> {
        // Retrieve the document from the DB.
        let item = query_file!("queries/many_documents.sql", &[url.clone()] as &[String])
            .fetch_one(&self.client)
            .await?;
        let doc = AnnotatedDoc {
            meta: DocumentMetadata {
                id: DocumentId(item.id),
                short_name: item.short_name,
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
        };
        // Build a IIIF manifest for this document.
        Ok(iiif::Manifest::from_document(self, doc, url).await)
    }

    pub async fn all_tags(&self, system: CherokeeOrthography) -> Result<Vec<TagForm>> {
        use async_graphql::InputType;
        let system_name = if let async_graphql::Value::Enum(s) = system.to_value() {
            s
        } else {
            unreachable!()
        };
        let results = query_file!("queries/all_morpheme_tags.sql", system_name.as_str())
            .fetch_all(&self.client)
            .await?;
        Ok(results
            .into_iter()
            .map(|tag| TagForm {
                tag: tag.gloss,
                title: tag.title,
                shape: None,
                details_url: None,
                definition: tag.description.unwrap_or_default(),
                morpheme_type: tag.linguistic_type.unwrap_or_default(),
            })
            .collect())
    }

    pub async fn search_words_any_field(&self, query: String) -> Result<Vec<AnnotatedForm>> {
        let like_query = format!("%{}%", query);
        let results = query_file_as!(BasicWord, "queries/search_words_any_field.sql", like_query)
            .fetch_all(&self.client)
            .await?;
        Ok(results.into_iter().map(Into::into).collect())
    }

    pub async fn top_collections(&self) -> Result<Vec<DocumentCollection>> {
        Ok(
            query_file_as!(DocumentCollection, "queries/document_groups.sql")
                .fetch_all(&self.client)
                .await?,
        )
    }

    pub async fn update_annotation(&self, _annote: annotation::Annotation) -> Result<()> {
        todo!("Implement image annotations")
    }

    pub async fn all_pages(&self) -> Result<Vec<page::Page>> {
        todo!("Implement content pages")
    }

    pub async fn update_page(&self, _page: page::Page) -> Result<()> {
        todo!("Implement content pages")
    }

    pub async fn words_in_document(
        &self,
        document_id: DocumentId,
    ) -> Result<impl Iterator<Item = AnnotatedForm>> {
        let words = query_file_as!(BasicWord, "queries/document_words.sql", document_id.0)
            .fetch_all(&self.client)
            .await?;
        Ok(words.into_iter().map(Into::into))
    }

    pub async fn count_words_in_document(&self, document_id: DocumentId) -> Result<i64> {
        Ok(
            query_file_scalar!("queries/count_words_in_document.sql", document_id.0)
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
            "queries/documents_in_group.sql",
            collection
        )
        .fetch_all(&self.client)
        .await?)
    }

    pub async fn insert_top_collection(&self, title: String, index: i64) -> Result<Uuid> {
        Ok(query_file_scalar!(
            "queries/insert_document_group.sql",
            slug::slugify(&title),
            title.trim()
        )
        .fetch_one(&self.client)
        .await?)
    }

    pub async fn insert_dictionary_document(
        &self,
        document: &DocumentMetadata,
    ) -> Result<DocumentId> {
        let group_id = self
            .insert_top_collection(document.collection.clone().unwrap(), 0)
            .await?;
        let id = query_file_scalar!(
            "queries/insert_document.sql",
            document.short_name,
            document.title,
            document.is_reference,
            &document.date as &Option<Date>,
            None as Option<Uuid>,
            group_id
        )
        .fetch_one(&self.client)
        .await?;
        Ok(DocumentId(id))
    }

    pub async fn insert_document(
        &self,
        meta: &DocumentMetadata,
        collection_id: Uuid,
        index_in_collection: i64,
    ) -> Result<DocumentId> {
        let mut tx = self.client.begin().await?;

        let document_id = &meta.short_name;

        // Clear the document audio before re-inserting it.
        query_file!("queries/delete_document_audio.sql", &document_id)
            .execute(&mut tx)
            .await?;

        let slice_id = if let Some(audio) = &meta.audio_recording {
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

        let document_uuid = query_file_scalar!(
            "queries/insert_document_in_collection.sql",
            &document_id,
            meta.title,
            meta.is_reference,
            &meta.date as &Option<Date>,
            slice_id,
            collection_id,
            index_in_collection
        )
        .fetch_one(&mut tx)
        .await?;

        for contributor in &meta.contributors {
            query_file!(
                "queries/upsert_document_contributor.sql",
                &contributor.name,
                &document_uuid,
                &contributor.role
            )
            .execute(&mut tx)
            .await?;
        }
        tx.commit().await?;

        Ok(DocumentId(document_uuid))
    }

    pub async fn insert_document_contents(&self, document: AnnotatedDoc) -> Result<()> {
        let mut tx = self.client.begin().await?;
        let document_id = document.meta.id;
        // Delete all the document contents first, because trying to upsert them
        // is difficult. Since all of these queries are within a transaction,
        // any failure will rollback to the previous state.
        query_file!("queries/delete_document_pages.sql", document_id.0)
            .execute(&mut tx)
            .await?;

        if let Some(pages) = document.segments {
            let mut starting_char_index = 0;
            for (page_index, page) in pages.into_iter().enumerate() {
                let page_id = query_file_scalar!(
                    "queries/upsert_document_page.sql",
                    document_id.0,
                    page_index as i64,
                    document.meta.page_images.as_ref().map(|imgs| imgs.source.0),
                    document
                        .meta
                        .page_images
                        .as_ref()
                        .and_then(|imgs| imgs.ids.get(page_index))
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
                                    document_id.0,
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
        document_id: DocumentId,
        super_collection: &str,
    ) -> Result<Vec<DocumentCollection>> {
        let item = query_file!("queries/document_group_crumb.sql", document_id.0)
            .fetch_one(&self.client)
            .await?;

        Ok(vec![DocumentCollection {
            slug: item.slug,
            title: item.title,
        }])
    }

    pub async fn insert_one_word(&self, form: AnnotatedForm) -> Result<()> {
        let doc_id = form.position.document_id.0;
        let mut tx = self.client.begin().await?;
        self.insert_word(&mut tx, form, doc_id, None, None).await?;
        Ok(())
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
        let _gloss_id = query_file_scalar!(
            "queries/upsert_dictionary_entry.sql",
            &doc_id,
            gloss,
            segment.morpheme
        )
        .fetch_one(&mut tx)
        .await?;

        // TODO When we end up referring to morpheme glosses by ID, pass that in.
        for form in surface_forms {
            self.insert_word(&mut tx, form, doc_id, None, None).await?;
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
            let doc_id = form.position.document_id.0;
            self.insert_word(&mut tx, form, doc_id, None, None).await?;
        }
        tx.commit().await?;
        Ok(())
    }

    pub async fn insert_word<'a>(
        &self,
        tx: &mut sqlx::Transaction<'a, sqlx::Postgres>,
        form: AnnotatedForm,
        document_id: Uuid,
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

                let morpheme_tag = query_file!("queries/find_global_gloss.sql", gloss)
                    .fetch_one(&mut tx)
                    .await;

                let gloss_id = if let Ok(morpheme_tag) = morpheme_tag {
                    morpheme_tag.gloss_id
                } else {
                    query_file_scalar!(
                        "queries/upsert_morpheme_gloss.sql",
                        document_id,
                        gloss,
                        None as Option<String>,
                        None as Option<Uuid>
                    )
                    .fetch_one(&mut tx)
                    .await?
                };

                query_file!(
                    "queries/upsert_word_segment.sql",
                    word_id,
                    index as i64,
                    segment.morpheme,
                    gloss_id,
                    segment.followed_by as Option<SegmentType>
                )
                .execute(&mut tx)
                .await?;
            }
        }

        tx.commit().await?;

        Ok(word_id)
    }

    pub async fn insert_morpheme_system(&self, short_name: String, title: String) -> Result<Uuid> {
        Ok(
            query_file_scalar!("queries/insert_abbreviation_system.sql", short_name, title)
                .fetch_one(&self.client)
                .await?,
        )
    }

    pub async fn insert_morpheme_tag(
        &self,
        tag: MorphemeTag,
        crg_system_id: Uuid,
        taoc_system_id: Uuid,
        learner_system_id: Uuid,
    ) -> Result<()> {
        let learner = tag
            .learner
            .as_ref()
            .ok_or_else(|| anyhow::format_err!("Tag {:?} missing a learner form", tag))?;
        let abstract_id = query_file_scalar!(
            "queries/upsert_morpheme_tag.sql",
            &tag.id,
            learner.definition,
            tag.morpheme_type
        )
        .fetch_one(&self.client)
        .await?;

        let doc_id: Option<Uuid> = None;
        query_file!(
            "queries/upsert_morpheme_gloss.sql",
            doc_id,
            tag.id,
            None as Option<String>,
            Some(abstract_id)
        )
        .fetch_one(&self.client)
        .await?;

        let abstract_ids = vec![abstract_id];
        query_file!(
            "queries/upsert_concrete_tag.sql",
            learner_system_id,
            &abstract_ids[..],
            learner.tag,
            learner.title,
        )
        .execute(&self.client)
        .await?;
        if let Some(concrete) = tag.crg {
            query_file!(
                "queries/upsert_concrete_tag.sql",
                crg_system_id,
                &abstract_ids[..],
                concrete.tag,
                concrete.title,
            )
            .execute(&self.client)
            .await?;
        }
        if let Some(concrete) = tag.taoc {
            query_file!(
                "queries/upsert_concrete_tag.sql",
                taoc_system_id,
                &abstract_ids[..],
                concrete.tag,
                concrete.title,
            )
            .execute(&self.client)
            .await?;
        }
        Ok(())
    }

    pub async fn document_id_from_name(&self, short_name: &str) -> Result<Option<DocumentId>> {
        Ok(
            query_file_scalar!("queries/document_id_from_name.sql", short_name)
                .fetch_all(&self.client)
                .await?
                .pop()
                .map(DocumentId),
        )
    }

    pub async fn insert_morpheme_relation(&self, link: LexicalConnection) -> Result<()> {
        // Don't crash if a morpheme relation fails to insert.
        if let (Some(left_doc), Some(right_doc)) =
            (link.left.document_name, link.right.document_name)
        {
            let _ = query_file!(
                "queries/insert_morpheme_relation.sql",
                link.left.gloss,
                &left_doc,
                link.right.gloss,
                &right_doc
            )
            .execute(&self.client)
            .await;
        }
        Ok(())
    }

    pub async fn collection(&self, slug: String) -> Result<DocumentCollection> {
        let collection = query_file!("queries/document_group_details.sql", slug)
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
        let keys: Vec<_> = keys.iter().map(|x| x.0).collect();
        let items = query_file!("queries/many_documents.sql", &keys[..])
            .fetch_all(&self.client)
            .await?;
        Ok(items
            .into_iter()
            .map(|item| Self::Value {
                meta: DocumentMetadata {
                    id: DocumentId(item.id),
                    short_name: item.short_name,
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
            .map(|tag| (tag.meta.id, tag))
            .collect())
    }
}

#[async_trait]
impl Loader<DocumentShortName> for Database {
    type Value = AnnotatedDoc;
    type Error = Arc<sqlx::Error>;
    async fn load(
        &self,
        keys: &[DocumentShortName],
    ) -> Result<HashMap<DocumentShortName, Self::Value>, Self::Error> {
        // Turn keys into strings for database request.
        // TODO ideally I'd be able to pass `keys` directly instead of mapping it.
        let keys: Vec<_> = keys.iter().map(|x| &x.0 as &str).collect();
        let items = query_file!("queries/many_documents_by_name.sql", keys as Vec<&str>)
            .fetch_all(&self.client)
            .await?;
        Ok(items
            .into_iter()
            .map(|item| Self::Value {
                meta: DocumentMetadata {
                    id: DocumentId(item.id),
                    short_name: item.short_name,
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
            .map(|tag| (DocumentShortName(tag.meta.short_name.clone()), tag))
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
        let keys: Vec<_> = keys.iter().map(|k| (k.0)).collect();
        let items = query_file!("queries/document_pages.sql", &keys[..])
            .fetch_all(&self.client)
            .await?;
        Ok(items
            .into_iter()
            .map(|page| {
                (
                    PagesInDocument(page.document_id),
                    DocumentPage {
                        id: page.id,
                        page_number: (page.index_in_document + 1).to_string(),
                        image: if let (Some(source_id), Some(oid)) =
                            (page.iiif_source_id, page.iiif_oid)
                        {
                            Some(PageImage {
                                source_id: ImageSourceId(source_id),
                                oid,
                            })
                        } else {
                            None
                        },
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
        let keys: Vec<_> = keys.iter().map(|k| k.0).collect();
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
        let keys: Vec<_> = keys.iter().map(|k| k.0).collect();
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
                        gloss_id: part.gloss_id,
                        followed_by: part.followed_by,
                    },
                )
            })
            .into_group_map())
    }
}

#[async_trait]
impl Loader<TagId> for Database {
    type Value = TagForm;
    type Error = Arc<sqlx::Error>;
    async fn load(&self, keys: &[TagId]) -> Result<HashMap<TagId, Self::Value>, Self::Error> {
        use async_graphql::{InputType, Name, Value};
        let glosses: Vec<_> = keys.iter().map(|k| k.0.clone()).collect();
        let systems: Vec<_> = keys
            .iter()
            .unique()
            .map(|k| {
                if let Value::Enum(s) = k.1.to_value() {
                    s.as_str().to_owned()
                } else {
                    unreachable!()
                }
            })
            .collect();
        let items = query_file!("queries/morpheme_tags_by_gloss.sql", &glosses, &systems)
            .fetch_all(&self.client)
            .await?;
        Ok(items
            .into_iter()
            .map(|tag| {
                (
                    TagId(
                        tag.gloss.clone().unwrap(),
                        InputType::parse(Some(Value::Enum(Name::new(tag.system_name.unwrap()))))
                            .unwrap(),
                    ),
                    TagForm {
                        tag: tag.gloss.unwrap(),
                        title: tag.title.unwrap(),
                        shape: tag.example_shape,
                        details_url: None,
                        definition: tag.description.unwrap_or_default(),
                        morpheme_type: tag.linguistic_type.unwrap_or_default(),
                    },
                )
            })
            .collect())
    }
}

#[async_trait]
impl Loader<WordsInParagraph> for Database {
    type Value = Vec<AnnotatedSeg>;
    type Error = Arc<sqlx::Error>;

    async fn load(
        &self,
        keys: &[WordsInParagraph],
    ) -> Result<HashMap<WordsInParagraph, Self::Value>, Self::Error> {
        let keys: Vec<_> = keys.iter().map(|k| k.0).collect();
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
                            DocumentId(w.document_id),
                            w.page_number.unwrap_or_default(),
                            w.index_in_document as i32,
                        ),
                    }),
                )
            })
            .into_group_map())
    }
}

#[async_trait]
impl Loader<TagForMorpheme> for Database {
    type Value = TagForm;
    type Error = Arc<sqlx::Error>;

    async fn load(
        &self,
        keys: &[TagForMorpheme],
    ) -> Result<HashMap<TagForMorpheme, Self::Value>, Self::Error> {
        use async_graphql::{InputType, Name, Value};
        let gloss_ids: Vec<_> = keys.iter().map(|k| k.0).collect();
        let systems: Vec<_> = keys
            .iter()
            .unique()
            .map(|k| {
                if let Value::Enum(s) = k.1.to_value() {
                    s.as_str().to_owned()
                } else {
                    unreachable!()
                }
            })
            .collect();
        let items = query_file!("queries/morpheme_tags.sql", &gloss_ids, &systems)
            .fetch_all(&self.client)
            .await?;
        Ok(items
            .into_iter()
            .map(|tag| {
                (
                    TagForMorpheme(
                        tag.gloss_id.unwrap(),
                        InputType::parse(Some(Value::Enum(Name::new(tag.system_name.unwrap()))))
                            .unwrap(),
                    ),
                    TagForm {
                        tag: tag.gloss.unwrap(),
                        title: tag.title.unwrap(),
                        shape: tag.example_shape,
                        details_url: None,
                        definition: tag.description.unwrap_or_default(),
                        morpheme_type: tag.linguistic_type.unwrap_or_default(),
                    },
                )
            })
            .collect())
    }
}

#[async_trait]
impl Loader<ImageSourceId> for Database {
    type Value = ImageSource;
    type Error = Arc<sqlx::Error>;

    async fn load(
        &self,
        keys: &[ImageSourceId],
    ) -> Result<HashMap<ImageSourceId, Self::Value>, Self::Error> {
        let keys: Vec<_> = keys.iter().map(|k| k.0).collect();
        let items = query_file!("queries/image_sources.sql", &keys)
            .fetch_all(&self.client)
            .await?;
        Ok(items
            .into_iter()
            .map(|x| {
                (
                    ImageSourceId(x.id),
                    ImageSource {
                        id: ImageSourceId(x.id),
                        url: x.base_url,
                    },
                )
            })
            .collect())
    }
}

#[async_trait]
impl Loader<ContributorsForDocument> for Database {
    type Value = Vec<Contributor>;
    type Error = Arc<sqlx::Error>;

    async fn load(
        &self,
        keys: &[ContributorsForDocument],
    ) -> Result<HashMap<ContributorsForDocument, Self::Value>, Self::Error> {
        let keys: Vec<_> = keys.iter().map(|k| k.0).collect();
        let items = query_file!("queries/document_contributors.sql", &keys)
            .fetch_all(&self.client)
            .await?;
        Ok(items
            .into_iter()
            .map(|x| {
                (
                    ContributorsForDocument(x.document_id.unwrap()),
                    Contributor {
                        name: x.full_name.unwrap(),
                        role: x.contribution_role.unwrap_or_default(),
                    },
                )
            })
            .into_group_map())
    }
}

#[async_trait]
impl Loader<PersonFullName> for Database {
    type Value = ContributorDetails;
    type Error = Arc<sqlx::Error>;

    async fn load(
        &self,
        keys: &[PersonFullName],
    ) -> Result<HashMap<PersonFullName, Self::Value>, Self::Error> {
        let keys: Vec<_> = keys.iter().map(|k| k.0.clone()).collect();
        let items = query_file!("queries/contributors_by_name.sql", &keys)
            .fetch_all(&self.client)
            .await?;
        Ok(items
            .into_iter()
            .map(|x| {
                (
                    PersonFullName(x.full_name.clone()),
                    ContributorDetails {
                        full_name: x.full_name,
                        alternate_name: None,
                        birth_date: None,
                    },
                )
            })
            .collect())
    }
}

#[async_trait]
impl Loader<PageId> for Database {
    type Value = page::Page;
    type Error = Arc<sqlx::Error>;

    async fn load(&self, _keys: &[PageId]) -> Result<HashMap<PageId, Self::Value>, Self::Error> {
        todo!("Implement content pages")
    }
}

struct BasicWord {
    id: Uuid,
    source_text: String,
    simple_phonetics: Option<String>,
    phonemic: Option<String>,
    english_gloss: Option<String>,
    commentary: Option<String>,
    document_id: Uuid,
    index_in_document: i64,
    page_number: Option<String>,
}

impl From<BasicWord> for AnnotatedForm {
    fn from(w: BasicWord) -> Self {
        Self {
            id: Some(w.id),
            source: w.source_text,
            normalized_source: None,
            simple_phonetics: w.simple_phonetics,
            phonemic: w.phonemic,
            // TODO Fill in?
            segments: None,
            english_gloss: w.english_gloss.map(|s| vec![s]).unwrap_or_default(),
            commentary: w.commentary,
            audio_track: None,
            date_recorded: None,
            line_break: None,
            page_break: None,
            position: PositionInDocument::new(
                DocumentId(w.document_id),
                w.page_number.unwrap_or_default(),
                w.index_in_document as i32,
            ),
        }
    }
}

#[derive(Clone, Eq, PartialEq, Hash)]
pub struct TagId(pub String, pub CherokeeOrthography);

#[derive(Clone, Eq, PartialEq, Hash)]
pub struct PartsOfWord(pub Uuid);

#[derive(Clone, Eq, PartialEq, Hash)]
pub struct PersonFullName(pub String);

#[derive(Clone, Eq, PartialEq, Hash)]
pub struct ContributorsForDocument(pub Uuid);

#[derive(Clone, Eq, PartialEq, Hash)]
pub struct DocumentShortName(pub String);

#[derive(Clone, Eq, PartialEq, Hash)]
pub struct TagForMorpheme(pub Uuid, pub CherokeeOrthography);

#[derive(Clone, Eq, PartialEq, Hash)]
pub struct PageId(pub String);

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
    pub document_id: Option<DocumentId>,
    /// What kind of document contains these words (e.g. manuscript vs dictionary)
    pub document_type: Option<DocumentType>,
    /// List of annotated and potentially segmented forms
    pub forms: Vec<AnnotatedForm>,
}
