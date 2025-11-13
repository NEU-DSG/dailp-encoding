#![allow(missing_docs)]

use anyhow::Error;
use async_graphql::MaybeUndefined;
use auth::UserGroup;
use chrono::{NaiveDate, NaiveDateTime};
use sqlx::postgres::types::{PgLTree, PgRange};
use std::ops::Bound;
use std::str::FromStr;
use user::UserUpdate;

use crate::collection::CollectionChapter;
use crate::collection::EditedCollection;
use crate::comment::{Comment, CommentParentType, CommentType, CommentUpdate};
use crate::page::ContentBlock;
use crate::page::Markdown;
use crate::page::NewPageInput;
use crate::page::Page;
use crate::user::User;
use crate::user::UserId;
use {
    crate::*,
    anyhow::Result,
    async_graphql::dataloader::*,
    async_graphql::InputType,
    async_trait::async_trait,
    itertools::Itertools,
    sqlx::{postgres::PgPoolOptions, query_file, query_file_as, query_file_scalar, Acquire},
    std::collections::HashMap,
    std::sync::Arc,
    std::time::Duration,
    uuid::Uuid,
};
// Explicitly import types from person.rs
use crate::person::{Contributor, ContributorDetails, ContributorRole};

// Add new metadata
use crate::doc_metadata::Format;

/// Connects to our backing database instance, providing high level functions
/// for accessing the data therein.
pub struct Database {
    client: sqlx::Pool<sqlx::Postgres>,
}
impl Database {
    pub fn connect(num_connections: Option<u32>) -> Result<Self> {
        let db_url = std::env::var("DATABASE_URL")?;
        let conn = PgPoolOptions::new()
            .max_connections(num_connections.unwrap_or_else(|| {
                std::thread::available_parallelism().map_or(2, |x| x.get() as u32)
            }))
            .acquire_timeout(Duration::from_secs(60 * 8))
            .max_lifetime(Duration::from_secs(60 * 20))
            // Disable excessive pings to the database.
            .test_before_acquire(false)
            .connect_lazy(&db_url)?;
        Ok(Database { client: conn })
    }

    /// Get a specific comment by id
    pub async fn comment_by_id(&self, comment_id: &Uuid) -> Result<Comment> {
        Ok(
            query_file_as!(BasicComment, "queries/comment_by_id.sql", comment_id,)
                .fetch_one(&self.client)
                .await?
                .into(),
        )
    }

    /// Get all comments on a given object
    pub async fn comments_by_parent(
        &self,
        parent_id: &Uuid,
        parent_type: &CommentParentType,
    ) -> Result<Vec<Comment>> {
        Ok(query_file_as!(
            BasicComment,
            "queries/comments_by_parent.sql",
            parent_id,
            parent_type.clone() as CommentParentType
        )
        .fetch_all(&self.client)
        .await?
        .into_iter()
        .map(|c| c.into())
        .collect())
    }

    /// Insert a new comment into the database
    pub async fn insert_comment(
        &self,
        posted_by: &Uuid,
        text_content: String,
        parent_id: &Uuid,
        parent_type: &CommentParentType,
        comment_type: &Option<CommentType>,
    ) -> Result<Uuid> {
        Ok(query_file_scalar!(
            "queries/insert_comment.sql",
            posted_by,
            text_content,
            parent_id,
            parent_type.clone() as CommentParentType,
            comment_type.clone() as Option<CommentType>
        )
        .fetch_one(&self.client)
        .await?)
    }

    /// Delete a comment from the database
    pub async fn delete_comment(&self, comment_id: &Uuid) -> Result<Uuid> {
        Ok(
            query_file_scalar!("queries/delete_comment.sql", comment_id,)
                .fetch_one(&self.client)
                .await?,
        )
    }

    pub async fn paragraph_by_id(&self, paragraph_id: &Uuid) -> Result<DocumentParagraph> {
        Ok(query_file_as!(
            DocumentParagraph,
            "queries/paragraph_by_id.sql",
            paragraph_id
        )
        .fetch_one(&self.client)
        .await?)
    }

    pub async fn word_by_id(&self, word_id: &Uuid) -> Result<AnnotatedForm> {
        Ok(query_file_as!(BasicWord, "queries/word_by_id.sql", word_id)
            .fetch_one(&self.client)
            .await?
            .into())
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
        _compare_by: Option<CherokeeOrthography>,
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
                            ingested_audio_track: None,
                            date_recorded: None,
                            line_break: None,
                            page_break: None,
                            position: PositionInDocument::new(
                                DocumentId(w.document_id),
                                w.page_number.unwrap_or_default(),
                                w.index_in_document,
                            ),
                        })
                        .collect(),
                }
            })
            .collect())
    }

    pub async fn word_contributor_audio(&self, word_id: &Uuid) -> Result<Vec<AudioSlice>> {
        let contributor_audio = query_file_as!(
            BasicAudioSlice,
            "queries/word_contributor_audio.sql",
            word_id
        )
        .fetch_all(&self.client)
        .await?;
        Ok(contributor_audio
            .into_iter()
            .map(AudioSlice::from)
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
                        ingested_audio_track: None,
                        date_recorded: None,
                        line_break: None,
                        page_break: None,
                        position: PositionInDocument::new(
                            DocumentId(w.document_id),
                            w.page_number.unwrap_or_default(),
                            w.index_in_document,
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
                    format_id: None.into(),
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

    pub async fn upsert_collection(&self, collection: &raw::EditedCollection) -> Result<String> {
        query_file!(
            "queries/upsert_collection.sql",
            collection.slug,
            collection.title,
            collection.wordpress_menu_id
        )
        .execute(&self.client)
        .await?;
        Ok((collection.slug).to_string())
    }

    pub async fn insert_all_chapters(
        &self,
        chapters: Vec<raw::CollectionChapter>,
        slug: String,
    ) -> Result<String> {
        let mut tx = self.client.begin().await?;

        // Delete previous chapter data stored for a particular collection before re-inserting
        query_file!("queries/delete_chapters_in_collection.sql", &*slug)
            .execute(&mut *tx)
            .await?;

        let mut chapter_stack = Vec::new();
        let initial_tuple = (0, slug.clone());
        chapter_stack.push(initial_tuple);

        for current_chapter in chapters {
            let mut chapter_doc_name = "".to_string();

            if current_chapter.document_short_name.is_some() {
                chapter_doc_name = current_chapter.document_short_name.unwrap();
            }

            // Use stack to build chapter slug
            let mut before_chapter_index = chapter_stack.last().unwrap().0;
            while before_chapter_index != (current_chapter.index_in_parent - 1) {
                let last_chapter_index = chapter_stack.last().unwrap().0;
                if last_chapter_index >= current_chapter.index_in_parent {
                    chapter_stack.pop();
                }
                before_chapter_index = chapter_stack.last().unwrap().0;
            }

            // Concatenate URL Slugs of all chapters on the path
            let mut chapter_stack_cur = chapter_stack.clone();
            let mut url_slug_cur = current_chapter.url_slug.clone();
            let final_path = (
                current_chapter.index_in_parent,
                current_chapter.url_slug.clone(),
            );
            chapter_stack.push(final_path);

            while let Some(temp_chapter) = chapter_stack_cur.pop() {
                let cur_slug = temp_chapter.1;
                url_slug_cur = format!("{}.{}", cur_slug, url_slug_cur);
            }

            let url_slug = PgLTree::from_str(&url_slug_cur)?;

            query_file!(
                "queries/insert_one_chapter_marking_intro_or_body.sql",
                current_chapter.chapter_name,
                chapter_doc_name,
                current_chapter.wordpress_id,
                current_chapter.index_in_parent,
                url_slug,
                current_chapter.section as _
            )
            .execute(&mut *tx)
            .await?;
        }
        tx.commit().await?;

        Ok(slug)
    }

    pub async fn document_manifest(
        &self,
        _document_name: &str,
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
                format_id: None.into(),
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

    pub async fn all_tags(&self, system: CherokeeOrthography) -> Result<Vec<MorphemeTag>> {
        use async_graphql::Value;
        let system_name = if let Value::Enum(s) = system.to_value() {
            s
        } else {
            unreachable!()
        };
        let results = query_file!("queries/all_morpheme_tags.sql", system_name.as_str())
            .fetch_all(&self.client)
            .await?;
        Ok(results
            .into_iter()
            .map(|tag| MorphemeTag {
                internal_tags: Vec::new(),
                tag: tag.gloss,
                title: tag.title,
                shape: None,
                details_url: None,
                definition: tag.description.unwrap_or_default(),
                morpheme_type: tag.linguistic_type.unwrap_or_default(),
                role_override: tag.role_override,
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

    pub async fn all_edited_collections(&self) -> Result<Vec<EditedCollection>> {
        Ok(
            query_file_as!(EditedCollection, "queries/edited_collections.sql")
                .fetch_all(&self.client)
                .await?,
        )
    }

    /// Ensure that a user exists in the database
    /// user_id should be a congnito sub claim
    pub async fn upsert_dailp_user(&self, user_id: Uuid) -> Result<Uuid> {
        query_file!("queries/upsert_dailp_user.sql", user_id,)
            .execute(&self.client)
            .await?;

        Ok(user_id)
    }

    // Updates fields in the user dailp_user table
    pub async fn update_dailp_user(&self, user: UserUpdate) -> Result<Uuid> {
        let user_id = Uuid::from(user.id);
        let display_name = user.display_name.into_vec();
        let avatar_url = user.avatar_url.into_vec();
        let bio = user.bio.into_vec();
        let organization = user.organization.into_vec();
        let location = user.location.into_vec();
        // Role needs to come in from graphql as all caps ("EDITORS" rather than "Editors")
        let role = if user.role.is_value() {
            let role_str = match user.role.value().unwrap() {
                UserGroup::Readers => "Readers",
                UserGroup::Editors => "Editors",
                UserGroup::Contributors => "Contributors",
            };
            vec![role_str.to_string()]
        } else {
            vec![]
        };

        query_file!(
            "queries/update_dailp_user.sql",
            &user_id,
            &display_name as _,
            &avatar_url as _,
            &bio as _,
            &organization as _,
            &location as _,
            &role as _
        )
        .execute(&self.client)
        .await?;

        Ok(user_id)
    }

    // Gets a user from the dailp_user table by their id
    pub async fn dailp_user_by_id(&self, user_id: &Uuid) -> Result<User> {
        let row = query_file!("queries/get_dailp_user_by_id.sql", user_id)
            .fetch_one(&self.client)
            .await?;

        let created_at = Date::from(row.created_at);
        let role = UserGroup::from(row.role);

        Ok(User {
            id: UserId(row.id.to_string()),
            display_name: row.display_name,
            created_at: Some(created_at),
            avatar_url: row.avatar_url,
            bio: row.bio,
            organization: row.organization,
            location: row.location,
            role: Some(role),
        })
    }

    pub async fn update_annotation(&self, _annote: annotation::Annotation) -> Result<()> {
        todo!("Implement image annotations")
    }

    pub async fn update_word(&self, word: AnnotatedFormUpdate) -> Result<Uuid> {
        let mut tx = self.client.begin().await?;

        let source = word.source.into_vec();
        let simple_phonetics = word.romanized_source.into_vec();
        let commentary = word.commentary.into_vec();
        let english_gloss_owned: Vec<String> = match word.english_gloss.into_vec().pop().flatten() {
            Some(glosses) => glosses.split(',').map(|s| s.trim().to_string()).collect(),
            None => Vec::new(),
        };
        let english_gloss: Vec<&str> = english_gloss_owned.iter().map(|s| s.as_str()).collect();

        let document_id = query_file!(
            "queries/update_word.sql",
            word.id,
            &source as _,
            &simple_phonetics as _,
            &commentary as _,
            &english_gloss as _
        )
        .fetch_one(&mut *tx)
        .await?
        .document_id;

        // If word segmentation was not changed, then return early since SQL update queries need to be called.
        if !word.segments.is_value() {
            tx.commit().await?;
            return Ok(word.id);
        }

        let segments = word.segments.take().unwrap();
        // if word segmentation not present, return early.
        if segments.is_empty() {
            // Delete all existing segments since the new segments array is empty
            query_file!("queries/delete_word_segments.sql", word.id)
                .execute(&mut *tx)
                .await?;
            tx.commit().await?;
            return Ok(word.id);
        }

        // Delete existing segments before upserting new ones
        query_file!("queries/delete_word_segments.sql", word.id)
            .execute(&mut *tx)
            .await?;

        let system_name: Option<CherokeeOrthography> = segments[0].system;

        let (doc_id, gloss, word_id, index, morpheme, role): (
            Vec<_>,
            Vec<_>,
            Vec<_>,
            Vec<_>,
            Vec<_>,
            Vec<_>,
        ) = segments
            .into_iter()
            .enumerate()
            .map(move |(index, segment)| {
                (
                    document_id,
                    segment.gloss,
                    word.id,
                    index as i64, // index of the segment in the word
                    segment.morpheme,
                    segment.role,
                )
            })
            .multiunzip();

        // Convert the given glosses if they have an internal for to add to the database.
        let internal_glosses = query_file_scalar!(
            "queries/find_internal_glosses.sql",
            &*gloss,
            match system_name {
                Some(CherokeeOrthography::Taoc) => "TAOC",
                _ =>
                    return Err(anyhow::anyhow!(
                        "Other Cherokee systems are currently not supported"
                    )),
            }
        )
        .fetch_all(&mut *tx)
        .await?;

        // Add any newly created local glosses into morpheme gloss table.
        query_file!(
            "queries/upsert_local_morpheme_glosses.sql",
            &*doc_id,
            &*internal_glosses as _,
        )
        .execute(&mut *tx)
        .await?;

        query_file!(
            "queries/upsert_many_word_segments.sql",
            &*doc_id,
            &*internal_glosses as _,
            &*word_id,
            &*index,
            &*morpheme,
            &*role as _
        )
        .execute(&mut *tx)
        .await?;

        tx.commit().await?;

        Ok(word.id)
    }

    // pub async fn maybe_undefined_to_vec() -> Vec<Option<String>> {}

    pub async fn add_bookmark(&self, document_id: Uuid, user_id: Uuid) -> Result<String> {
        query_file!("queries/add_bookmark.sql", document_id, user_id)
            .execute(&self.client)
            .await?;
        Ok(format!("document: {}, user: {}", document_id, user_id))
    }

    pub async fn remove_bookmark(&self, document_id: Uuid, user_id: Uuid) -> Result<String> {
        query_file!("queries/remove_bookmark.sql", document_id, user_id)
            .execute(&self.client)
            .await?;
        Ok(format!("document: {}, user: {}", document_id, user_id))
    }

    pub async fn bookmarked_documents(&self, user_id: &Uuid) -> Result<Vec<Uuid>> {
        let bookmarks = query_file!("queries/get_bookmark_ids.sql", user_id)
            .fetch_all(&self.client)
            .await?;

        Ok(bookmarks.into_iter().map(|x| x.id).collect())
    }

    pub async fn get_document_bookmarked_on(
        &self,
        document_id: &Uuid,
        user_id: &Uuid,
    ) -> Result<Option<Date>> {
        if let Some(bookmark) = query_file!(
            "queries/get_document_bookmarked_on.sql",
            document_id,
            user_id
        )
        .fetch_optional(&self.client)
        .await?
        {
            Ok(Some(date::Date(bookmark.bookmarked_on)))
        } else {
            Ok(None)
        }
    }

    /// This does two things:
    /// 1. Create a media slice if one does not exist for the provided audio
    ///     recording.
    /// 2. Add a join table entry attaching that media slice to the
    ///     specified word.
    ///
    /// Returns the `id` of the upserted media slice
    pub async fn attach_audio_to_word(
        &self,
        upload: &AttachAudioToWordInput,
        contributor_id: &Uuid,
    ) -> Result<Uuid> {
        let media_slice_id = query_file_scalar!(
            "queries/attach_audio_to_word.sql",
            contributor_id,
            upload.contributor_audio_url as _,
            0,
            0,
            upload.word_id
        )
        .fetch_one(&self.client)
        .await?;
        Ok(media_slice_id)
    }

    /// Update if a piece of audio will be shown to readers
    /// Will return None if the word and audio assocation could not be found, otherwise word id.
    pub async fn update_audio_visibility(
        &self,
        word_id: &Uuid,
        audio_slice_id: &Uuid,
        include_in_edited_collection: bool,
        editor_id: &Uuid,
    ) -> Result<Option<Uuid>> {
        let _word_id = query_file_scalar!(
            "queries/update_audio_visibility.sql",
            word_id,
            audio_slice_id,
            include_in_edited_collection,
            editor_id
        )
        .fetch_one(&self.client)
        .await?;
        Ok(_word_id)
    }

    pub async fn update_document_metadata(&self, document: DocumentMetadataUpdate) -> Result<Uuid> {
        let title = document.title.into_vec();
        let written_at: Option<Date> = document.written_at.value().map(Into::into);

        let format_id = match document.format_id {
            MaybeUndefined::Value(id) => Some(id),
            _ => None,
        };

        query_file!(
            "queries/update_document_metadata.sql",
            document.id,
            &title as _,
            &written_at as _,
            format_id,
        )
        .execute(&self.client)
        .await?;

        Ok(document.id)
    }

    pub async fn update_paragraph(&self, paragraph: ParagraphUpdate) -> Result<DocumentParagraph> {
        let translation = paragraph.translation.into_vec();

        query_file!(
            "queries/update_paragraph.sql",
            paragraph.id,
            &translation as _
        )
        .execute(&self.client)
        .await?;

        self.paragraph_by_id(&paragraph.id).await
    }

    pub async fn update_comment(&self, comment: CommentUpdate) -> Result<Uuid> {
        let text_content = comment.text_content.into_vec();
        let comment_type = comment.comment_type.into_vec();

        query_file!(
            "queries/update_comment.sql",
            comment.id,
            &text_content as _,
            &comment_type as _,
            comment.edited
        )
        .execute(&self.client)
        .await?;

        Ok(comment.id)
    }

    pub async fn update_contributor_attribution(
        &self,
        contribution: UpdateContributorAttribution,
    ) -> Result<Uuid> {
        let document_id = contribution.document_id;
        let contributor_id = contribution.contributor_id;
        let contribution_role = contribution.contribution_role;

        query_file!(
            "queries/update_contributor_attribution.sql",
            document_id,
            &contributor_id as _,
            &contribution_role as _
        )
        .execute(&self.client)
        .await?;

        Ok(document_id)
    }

    pub async fn delete_contributor_attribution(
        &self,
        contribution: DeleteContributorAttribution,
    ) -> Result<Uuid> {
        let document_id = contribution.document_id;
        let contributor_id = contribution.contributor_id;

        query_file!(
            "queries/delete_contributor_attribution.sql",
            document_id,
            &contributor_id as _
        )
        .execute(&self.client)
        .await?;

        Ok(document_id)
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
        start: Option<i64>,
        end: Option<i64>,
    ) -> Result<impl Iterator<Item = AnnotatedForm>> {
        let words = query_file_as!(
            BasicWord,
            "queries/document_words.sql",
            document_id.0,
            start,
            end
        )
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
        _super_collection: &str,
        collection: &str,
    ) -> Result<Vec<DocumentReference>> {
        let documents = query_file!("queries/documents_in_group.sql", collection)
            .fetch_all(&self.client)
            .await?;

        Ok(documents
            .into_iter()
            .map(|doc| DocumentReference {
                id: doc.id,
                short_name: doc.short_name,
                title: doc.title,
                date: doc.date,
                order_index: doc.order_index,
            })
            .collect())
    }

    pub async fn insert_top_collection(&self, title: String, _index: i64) -> Result<Uuid> {
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
            .execute(&mut *tx)
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
                    .fetch_one(&mut *tx)
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
        .fetch_one(&mut *tx)
        .await?;

        {
            let (name, doc, role): (Vec<_>, Vec<_>, Vec<_>) = meta
                .contributors
                .iter()
                .map(|contributor| (&*contributor.name, document_uuid, contributor.role.as_ref()))
                .multiunzip();
            // Convert roles to Option<String> for SQL
            let role_strings: Vec<Option<String>> =
                role.iter().map(|r| r.map(|r| r.to_string())).collect();
            query_file!(
                "queries/upsert_document_contributors.sql",
                &*name as _,
                &*doc,
                &role_strings as _
            )
            .execute(&mut *tx)
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
            .execute(&mut *tx)
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
                .fetch_one(&mut *tx)
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
                    let _paragraph_id = query_file_scalar!(
                        "queries/insert_paragraph.sql",
                        page_id,
                        char_range,
                        paragraph.translation.unwrap_or_default()
                    )
                    .fetch_one(&mut *tx)
                    .await?;

                    for element in paragraph.source {
                        match element {
                            AnnotatedSeg::Word(word) => {
                                let len = word.source.chars().count() as i64;
                                let (char_index, character): (Vec<_>, Vec<_>) = word
                                    .source
                                    .chars()
                                    .enumerate()
                                    .map(|(idx, c)| {
                                        (starting_char_index + idx as i64, c.to_string())
                                    })
                                    .unzip();
                                query_file!(
                                    "queries/insert_character_transcription.sql",
                                    page_id,
                                    &*char_index,
                                    &*character
                                )
                                .execute(&mut *tx)
                                .await?;

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

    pub async fn insert_edited_collection(
        &self,
        collection: CreateEditedCollectionInput,
    ) -> Result<Uuid> {
        // let mut tx = self.client.begin().await?;
        let collection_id = query_file_scalar!(
            "queries/insert_edited_collection.sql",
            collection.title,
            slug::slugify(&collection.title),
            collection.description,
            collection.thumbnail_url,
        )
        .fetch_one(&self.client)
        .await?;
        Ok(collection_id)
    }

    pub async fn document_breadcrumbs(
        &self,
        document_id: DocumentId,
        _super_collection: &str,
    ) -> Result<Vec<DocumentCollection>> {
        let item = query_file!("queries/document_group_crumb.sql", document_id.0)
            .fetch_one(&self.client)
            .await?;

        Ok(vec![DocumentCollection {
            slug: item.slug,
            title: item.title,
            id: None,
        }])
    }

    pub async fn chapter_breadcrumbs(&self, path: Vec<String>) -> Result<Vec<DocumentCollection>> {
        let chapters = query_file!("queries/chapter_breadcrumbs.sql", PgLTree::from_iter(path)?)
            .fetch_all(&self.client)
            .await?;
        Ok(chapters
            .into_iter()
            .sorted_by_key(|chapter| chapter.chapter_path.len())
            .map(|chapter| DocumentCollection {
                slug: chapter.slug,
                title: chapter.title,
                id: None,
            })
            .collect())
    }

    pub async fn insert_one_word(&self, form: AnnotatedForm) -> Result<()> {
        let doc_id = form.position.document_id.0;
        let mut tx = self.client.begin().await?;
        self.insert_word(&mut tx, form, doc_id, None, None).await?;
        Ok(())
    }

    pub async fn insert_lexical_entries(
        &self,
        document_id: DocumentId,
        stems: Vec<AnnotatedForm>,
        surface_forms: Vec<AnnotatedForm>,
    ) -> Result<()> {
        let mut tx = self.client.begin().await?;

        // Clear all contents before inserting more.
        query_file!("queries/clear_dictionary_document.sql", document_id.0)
            .execute(&mut *tx)
            .await?;

        // Convert the list of stems into a list for each field to prepare for a
        // bulk DB insertion.
        let (glosses, shapes): (Vec<_>, Vec<_>) = stems
            .into_iter()
            .map(|stem| {
                (
                    stem.segments.as_ref().unwrap()[0]
                        .gloss
                        .replace(&[',', '+', '(', ')', '[', ']'] as &[char], " ")
                        .split_whitespace()
                        .join("."),
                    stem,
                )
            })
            .unique_by(|(gloss, _)| gloss.clone())
            .map(|(gloss, stem)| (gloss, stem.segments.as_ref().unwrap()[0].morpheme.clone()))
            .multiunzip();

        // Insert all the morpheme glosses from this dictionary at once.
        query_file!(
            "queries/upsert_dictionary_entry.sql",
            document_id.0,
            &*glosses,
            &*shapes
        )
        .execute(&mut *tx)
        .await?;

        // TODO When we end up referring to morpheme glosses by ID, pass that in.
        self.insert_lexical_words(&mut tx, surface_forms).await?;

        tx.commit().await?;
        Ok(())
    }

    pub async fn only_insert_words(
        &self,
        document_id: DocumentId,
        forms: Vec<AnnotatedForm>,
    ) -> Result<()> {
        let mut tx = self.client.begin().await?;
        // Clear all contents before inserting more.
        query_file!("queries/clear_dictionary_document.sql", document_id.0)
            .execute(&mut *tx)
            .await?;

        self.insert_lexical_words(&mut tx, forms).await?;

        tx.commit().await?;
        Ok(())
    }

    pub async fn insert_lexical_words<'a>(
        &self,
        tx: &mut sqlx::Transaction<'a, sqlx::Postgres>,
        forms: Vec<AnnotatedForm>,
    ) -> Result<()> {
        let mut tx = tx.begin().await?;
        let (
            document_id,
            source_text,
            simple_phonetics,
            phonemic,
            english_gloss,
            recorded_at,
            commentary,
            page_number,
            index_in_document,
        ): (
            Vec<_>,
            Vec<_>,
            Vec<_>,
            Vec<_>,
            Vec<_>,
            Vec<_>,
            Vec<_>,
            Vec<_>,
            Vec<_>,
        ) = forms
            .iter()
            .map(|form| {
                (
                    form.position.document_id.0,
                    &*form.source,
                    form.simple_phonetics.as_deref(),
                    form.phonemic.as_deref(),
                    form.english_gloss.first().map(|s| &**s),
                    form.date_recorded.as_ref().map(|d| d.0),
                    form.commentary.as_deref(),
                    &*form.position.page_number,
                    form.position.index,
                )
            })
            .multiunzip();

        let ids = query_file_scalar!(
            "queries/insert_many_words_in_document.sql",
            &*document_id,
            &*source_text as _,
            &*simple_phonetics as _,
            &*phonemic as _,
            &*english_gloss as _,
            &*recorded_at as _,
            &*commentary as _,
            &*page_number as _,
            &*index_in_document
        )
        .fetch_all(&mut *tx)
        .await?;

        let (doc_id, gloss, word_id, index, morpheme, role): (
            Vec<_>,
            Vec<_>,
            Vec<_>,
            Vec<_>,
            Vec<_>,
            Vec<_>,
        ) = forms
            .into_iter()
            .zip(ids)
            .filter_map(move |(form, word_id)| {
                form.segments.map(move |segments| {
                    segments
                        .into_iter()
                        .enumerate()
                        .map(move |(index, segment)| {
                            let gloss = segment
                                .gloss
                                .replace(&[',', '+', '(', ')', '[', ']'] as &[char], " ")
                                .split_whitespace()
                                .join(".");

                            (
                                form.position.document_id.0,
                                gloss,
                                word_id,
                                index as i64,
                                segment.morpheme,
                                segment.role,
                            )
                        })
                })
            })
            .flatten()
            .multiunzip();

        query_file!(
            "queries/upsert_local_morpheme_glosses.sql",
            &*doc_id,
            &*gloss
        )
        .execute(&mut *tx)
        .await?;

        query_file!(
            "queries/upsert_many_word_segments.sql",
            &*doc_id,
            &*gloss,
            &*word_id,
            &*index,
            &*morpheme,
            &*role as _
        )
        .execute(&mut *tx)
        .await?;

        tx.commit().await?;

        Ok(())
    }

    /// This is only used for
    pub async fn insert_word<'a>(
        &self,
        tx: &mut sqlx::Transaction<'a, sqlx::Postgres>,
        form: AnnotatedForm,
        document_id: Uuid,
        page_id: Option<Uuid>,
        char_range: Option<PgRange<i64>>,
    ) -> Result<Uuid> {
        let mut tx = tx.begin().await?;

        let audio_start = form
            .ingested_audio_track
            .as_ref()
            .and_then(|t| t.start_time)
            .map(i64::from);
        let audio_end = form
            .ingested_audio_track
            .as_ref()
            .and_then(|t| t.end_time)
            .map(i64::from);
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
            char_range,
            form.ingested_audio_track.map(|t| t.resource_url),
            audio_start,
            audio_end
        )
        .fetch_one(&mut *tx)
        .await?;

        if let Some(segments) = form.segments {
            let (document_id, gloss, word_id, index, morpheme, role): (
                Vec<_>,
                Vec<_>,
                Vec<_>,
                Vec<_>,
                Vec<_>,
                Vec<_>,
            ) = segments
                .into_iter()
                .enumerate()
                .map(move |(index, segment)| {
                    // FIXME Get rid of this sanitize step.
                    let gloss = segment
                        .gloss
                        .replace(&[',', '+', '(', ')', '[', ']'] as &[char], " ")
                        .split_whitespace()
                        .join(".");

                    (
                        document_id,
                        gloss,
                        word_id,
                        index as i64,
                        segment.morpheme,
                        segment.role as WordSegmentRole,
                    )
                })
                .multiunzip();

            query_file!(
                "queries/upsert_local_morpheme_glosses.sql",
                &*document_id,
                &*gloss
            )
            .execute(&mut *tx)
            .await?;

            query_file!(
                "queries/upsert_many_word_segments.sql",
                &*document_id,
                &*gloss,
                &*word_id,
                &*index,
                &*morpheme,
                &*role as _
            )
            .execute(&mut *tx)
            .await?;
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

    pub async fn insert_abstract_tag(&self, tag: AbstractMorphemeTag) -> Result<()> {
        let abstract_id = query_file_scalar!(
            "queries/upsert_morpheme_tag.sql",
            &tag.id,
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
        Ok(())
    }

    pub async fn insert_custom_abstract_tag(&self, tag: AbstractMorphemeTag) -> Result<Uuid> {
        let abstract_id =
            query_file_scalar!("queries/insert_custom_abstract_tag.sql", tag.id, "custom")
                .fetch_one(&self.client)
                .await?;
        Ok(abstract_id)
    }

    pub async fn insert_custom_morpheme_tag(
        &self,
        form: MorphemeTag,
        system_id: Uuid,
    ) -> Result<()> {
        query_file!(
            "queries/insert_custom_morpheme_tag.sql",
            system_id,
            &form
                .internal_tags
                .iter()
                .map(|id| Uuid::parse_str(id).unwrap())
                .collect::<Vec<Uuid>>(),
            form.tag,
            form.title,
            form.role_override as Option<WordSegmentRole>,
            form.definition
        )
        .fetch_all(&self.client)
        .await?;

        Ok(())
    }

    pub async fn insert_morpheme_tag(&self, form: MorphemeTag, system_id: Uuid) -> Result<()> {
        let abstract_ids = query_file_scalar!(
            "queries/abstract_tag_ids_from_glosses.sql",
            &form.internal_tags[..]
        )
        .fetch_all(&self.client)
        .await?;
        query_file!(
            "queries/upsert_concrete_tag.sql",
            system_id,
            &abstract_ids,
            form.tag,
            form.title,
            form.role_override as Option<WordSegmentRole>,
            form.definition
        )
        .execute(&self.client)
        .await?;
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

    pub async fn insert_morpheme_relations(&self, links: Vec<LexicalConnection>) -> Result<()> {
        // Ignores glosses without a document ID.
        // TODO Consider whether that's a reasonable constraint.
        let (left_doc, left_gloss, right_doc, right_gloss): (Vec<_>, Vec<_>, Vec<_>, Vec<_>) =
            links
                .into_iter()
                .filter_map(|link| {
                    Some((
                        link.left.document_name?,
                        link.left.gloss,
                        link.right.document_name?,
                        link.right.gloss,
                    ))
                })
                .multiunzip();
        // Don't crash if a morpheme relation fails to insert.
        let _ = query_file!(
            "queries/insert_morpheme_relations.sql",
            &*left_doc,
            &*left_gloss,
            &*right_doc,
            &*right_gloss,
        )
        .execute(&self.client)
        .await;
        Ok(())
    }

    pub async fn collection(&self, slug: String) -> Result<DocumentCollection> {
        let collection = query_file!("queries/document_group_details.sql", slug)
            .fetch_one(&self.client)
            .await?;
        Ok(DocumentCollection {
            slug: collection.slug,
            title: collection.title,
            id: Some(collection.id),
        })
    }

    pub async fn document_group_id_by_slug(&self, slug: &str) -> Result<Option<Uuid>> {
        Ok(
            query_file_scalar!("queries/document_group_id_by_slug.sql", slug)
                .fetch_optional(&self.client)
                .await?,
        )
    }

    /// Get collection slug by collection ID
    pub async fn collection_slug_by_id(&self, collection_id: Uuid) -> Result<Option<String>> {
        let result = query_file!("queries/edited_collection_by_id.sql", collection_id)
            .fetch_optional(&self.client)
            .await?;
        Ok(result.map(|r| r.slug))
    }

    pub async fn chapter(
        &self,
        collection_slug: String,
        chapter_slug: String,
    ) -> Result<Option<CollectionChapter>> {
        // Try the original slugs first
        let chapter = query_file!(
            "queries/chapter_contents.sql",
            collection_slug,
            chapter_slug
        )
        .fetch_optional(&self.client)
        .await?;

        // If found, return it
        if let Some(chapter_data) = chapter {
            return Ok(Some(CollectionChapter {
                id: chapter_data.id,
                path: chapter_data
                    .chapter_path
                    .into_iter()
                    .map(|s| (*s).into())
                    .collect(),
                index_in_parent: chapter_data.index_in_parent,
                title: chapter_data.title,
                document_id: chapter_data.document_id.map(DocumentId),
                wordpress_id: chapter_data.wordpress_id,
                section: chapter_data.section,
            }));
        }

        // If not found, try with underscore/hyphen conversion for collection_slug
        let alternative_collection_slug = if collection_slug.contains('-') {
            collection_slug.replace("-", "_")
        } else {
            collection_slug.replace("_", "-")
        };

        let chapter = query_file!(
            "queries/chapter_contents.sql",
            alternative_collection_slug,
            chapter_slug
        )
        .fetch_optional(&self.client)
        .await?;

        Ok(chapter.map(|chapter| CollectionChapter {
            id: chapter.id,
            path: chapter
                .chapter_path
                .into_iter()
                .map(|s| (*s).into())
                .collect(),
            index_in_parent: chapter.index_in_parent,
            title: chapter.title,
            document_id: chapter.document_id.map(DocumentId),
            wordpress_id: chapter.wordpress_id,
            section: chapter.section,
        }))
    }

    // Returns the CollectionChapters that contain given document.
    pub async fn chapters_by_document(
        &self,
        document_slug: String,
    ) -> Result<Option<Vec<CollectionChapter>>> {
        let chapters = query_file!("queries/chapters_by_document.sql", document_slug)
            .fetch_all(&self.client)
            .await?;

        if chapters.is_empty() {
            Ok(None)
        } else {
            Ok(Some(
                chapters
                    .into_iter()
                    .map(|chapter| CollectionChapter {
                        id: chapter.id,
                        path: chapter
                            .chapter_path
                            .into_iter()
                            .map(|s| (*s).into())
                            .collect(),
                        index_in_parent: chapter.index_in_parent,
                        title: chapter.title,
                        document_id: chapter.document_id.map(DocumentId),
                        wordpress_id: chapter.wordpress_id,
                        section: chapter.section,
                    })
                    .collect(),
            ))
        }
    }

    /// Insert a contributor attribution for a chapter
    pub async fn insert_chapter_contributor_attribution(
        &self,
        chapter_id: &uuid::Uuid,
        contributor_id: &uuid::Uuid,
        contribution_role: &str,
    ) -> Result<()> {
        query_file!(
            "queries/insert_chapter_contributor_attribution.sql",
            chapter_id,
            contributor_id,
            contribution_role
        )
        .execute(&self.client)
        .await?;
        Ok(())
    }

    /// Insert a document into an edited collection and create a new chapter for it
    /// Returns (document_id, chapter_id)
    pub async fn insert_document_into_edited_collection(
        &self,
        document: AnnotatedDoc,
        _collection_id: Uuid,
    ) -> Result<(DocumentId, Uuid)> {
        let mut tx = self.client.begin().await?;
        let meta = &document.meta;
        let next_index = -1;

        // All user-created documents go to the user_documents document group
        let user_documents_group_id = match self.document_group_id_by_slug("user_documents").await?
        {
            Some(id) => id,
            None => {
                // Create the user_documents document_group if it doesn't exist
                query_file_scalar!(
                    "queries/insert_document_group.sql",
                    "user_documents",
                    "User-Created Documents"
                )
                .fetch_one(&mut *tx)
                .await?
            }
        };

        // Insert the document using the user_documents document group ID
        let document_uuid = query_file_scalar!(
            "queries/insert_document_at_end_of_collection.sql",
            meta.short_name,
            meta.title,
            meta.is_reference,
            &meta.date as &Option<Date>,
            user_documents_group_id,
            next_index
        )
        .fetch_one(&mut *tx)
        .await?;

        // Attribute contributors to the document
        {
            let name: Vec<String> = meta.contributors.iter().map(|c| c.clone().name).collect();
            let doc_id: Vec<Uuid> = vec![meta.id.0];
            let roles: Vec<String> = meta
                .contributors
                .iter()
                .map(|c| match c.role {
                    Some(r) => r.to_string(),
                    // not sure what to default to, also not sure why contributor role is an
                    // option
                    None => ContributorRole::Author.to_string(),
                })
                .collect();

            if !name.is_empty() {
                query_file!(
                    "queries/upsert_document_contributors.sql",
                    &name,
                    &doc_id,
                    &roles
                )
                .execute(&mut *tx)
                .await?;
            }
        }

        // Create a new chapter for this document in the user_documents collection
        let chapter_slug = crate::slugs::slugify_ltree(&meta.short_name);
        let chapter_path = PgLTree::from_str(&format!("user_documents.{}", chapter_slug))?;

        let chapter_id = query_file_scalar!(
            "queries/insert_chapter_with_document_id.sql",
            meta.title, // Use document title as chapter title
            document_uuid,
            None::<i64>, // wordpress_id
            0i64,        // index_in_parent (we can increment this later if needed)
            chapter_path,
            crate::CollectionSection::Body as crate::CollectionSection
        )
        .fetch_one(&mut *tx)
        .await?;

        // Attribute contributors to the new chapter
        for contributor in &meta.contributors {
            query_file!("queries/upsert_contributor.sql", &contributor.name)
                .execute(&mut *tx)
                .await?;
            let contributor_id =
                query_file_scalar!("queries/contributor_id_by_name.sql", &contributor.name)
                    .fetch_one(&mut *tx)
                    .await?;
            let role = contributor
                .role
                .unwrap_or(ContributorRole::Author)
                .to_string();
            query_file!(
                "queries/insert_chapter_contributor_attribution.sql",
                &chapter_id,
                &contributor_id,
                &role
            )
            .execute(&mut *tx)
            .await?;
        }

        // Insert document contents (pages, paragraphs, words)
        let document_id = DocumentId(document_uuid);
        let document_with_updated_id = AnnotatedDoc {
            meta: DocumentMetadata {
                id: document_id,
                ..document.meta.clone()
            },
            segments: document.segments.clone(),
        };

        query_file!("queries/delete_document_pages.sql", document_uuid)
            .execute(&mut *tx)
            .await?;

        if let Some(pages) = document_with_updated_id.segments {
            let mut starting_char_index = 0;
            for (page_index, page) in pages.into_iter().enumerate() {
                let page_id = query_file_scalar!(
                    "queries/upsert_document_page.sql",
                    document_uuid,
                    page_index as i64,
                    document_with_updated_id
                        .meta
                        .page_images
                        .as_ref()
                        .map(|imgs| imgs.source.0),
                    document_with_updated_id
                        .meta
                        .page_images
                        .as_ref()
                        .and_then(|imgs| imgs.ids.get(page_index))
                )
                .fetch_one(&mut *tx)
                .await?;

                for section in page.paragraphs {
                    // Calculate the actual character range for this paragraph
                    let total_chars: usize = section
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

                    let char_range: PgRange<i64> =
                        (starting_char_index..starting_char_index + total_chars as i64).into();

                    let _paragraph_id = query_file_scalar!(
                        "queries/insert_paragraph.sql",
                        page_id,
                        char_range,
                        section.translation.unwrap_or_default()
                    )
                    .fetch_one(&mut *tx)
                    .await?;

                    // Insert words with proper page_id and character ranges
                    let mut word_char_index = starting_char_index;
                    for word_seg in section.source {
                        match word_seg {
                            AnnotatedSeg::Word(word) => {
                                let word_len = word.source.chars().count() as i64;
                                let word_char_range: PgRange<i64> =
                                    (word_char_index..word_char_index + word_len).into();

                                self.insert_word(
                                    &mut tx,
                                    word,
                                    document_uuid,
                                    Some(page_id),
                                    Some(word_char_range),
                                )
                                .await?;

                                word_char_index += word_len;
                            }
                            _ => {}
                        }
                    }
                    starting_char_index += total_chars as i64;
                }
            }
        }

        tx.commit().await?;
        Ok((document_id, chapter_id))
    }

    pub async fn abbreviation_id_from_short_name(&self, short_name: &str) -> Result<Uuid> {
        Ok(
            query_file_scalar!("queries/abbreviation_id_from_short_name.sql", short_name)
                .fetch_one(&self.client)
                .await?,
        )
    }

    pub async fn upsert_page(&self, input: NewPageInput) -> Result<String> {
        // sanitize input
        let title = input.title.trim();
        // generate slug
        let slug = slug::slugify(title);
        // Ensure there is at least one body block and it is non-empty
        let body = match input.body.first() {
            Some(content) if !content.trim().is_empty() => content.clone(),
            _ => return Err(anyhow::anyhow!("input body is empty")),
        };

        query_file!("queries/upsert_page.sql", slug, input.path, title, body)
            .execute(&self.client)
            .await?;
        Ok(input.path)
    }

    pub async fn page_by_path(&self, path: &str) -> Result<Option<Page>> {
        let record = query_file!("queries/page_by_path.sql", path)
            .fetch_optional(&self.client)
            .await?;
        if let Some(row) = record {
            let blocks: Vec<ContentBlock> =
                vec![ContentBlock::Markdown(Markdown { content: row.body })];
            Ok(Some(Page::build(row.title, row.slug, blocks)))
        } else {
            Ok(None)
        }
    }

    pub async fn get_menu_by_slug(&self, slug: String) -> Result<Menu> {
        let menu = query_file!("queries/menu_by_slug.sql", slug)
            .fetch_one(&self.client)
            .await?;

        let items_json: serde_json::Value = menu.items;
        let items: Vec<MenuItem> = serde_json::from_value(items_json).unwrap_or_default();

        Ok(Menu {
            id: menu.id,
            name: menu.name,
            slug: menu.slug,
            items,
        })
    }

    pub async fn update_menu(&self, menu: MenuUpdate) -> Result<Menu> {
        let menu = query_file!(
            "queries/update_menu.sql",
            menu.id,
            menu.name.clone().unwrap_or_default(),
            slug::slugify(menu.name.unwrap_or_default()),
            menu.items
                .map(|items| serde_json::to_value(items).unwrap_or_default())
        )
        .fetch_one(&self.client)
        .await?;
        let items: Vec<MenuItem> = serde_json::from_value(menu.items).unwrap_or_default();
        Ok(Menu {
            id: menu.id,
            name: menu.name,
            slug: menu.slug,
            items,
        })
    }

    pub async fn insert_menu(&self, menu: Menu) -> Result<()> {
        query_file!(
            "queries/insert_menu.sql",
            menu.name,
            menu.slug,
            serde_json::to_value(menu.items).unwrap_or_default()
        )
        .execute(&self.client)
        .await?;
        Ok(())
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
                    audio_recording: item.audio_url.map(|resource_url| AudioSlice {
                        slice_id: Some(AudioSliceId(item.audio_slice_id.unwrap().to_string())),
                        resource_url,
                        parent_track: None,
                        annotations: None,
                        index: 0,
                        include_in_edited_collection: true,
                        edited_by: None,
                        recorded_at: item.recorded_at.map(Date::new),
                        recorded_by: item.recorded_by.and_then(|user_id| {
                            item.recorded_by_name.map(|display_name| User {
                                id: UserId(user_id.to_string()),
                                display_name,
                                created_at: None,
                                avatar_url: None,
                                bio: None,
                                organization: None,
                                location: None,
                                role: None,
                            })
                        }),
                        start_time: item.audio_slice.as_ref().and_then(|r| match r.start {
                            Bound::Unbounded => None,
                            Bound::Included(t) | Bound::Excluded(t) => Some(t as i32),
                        }),
                        end_time: item.audio_slice.and_then(|r| match r.end {
                            Bound::Unbounded => None,
                            Bound::Included(t) | Bound::Excluded(t) => Some(t as i32),
                        }),
                    }),
                    collection: None,
                    contributors: item
                        .contributors
                        .and_then(|x| serde_json::from_value(x).ok())
                        .unwrap_or_default(),
                    format_id: None.into(),
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
                    audio_recording: item.audio_url.map(|resource_url| AudioSlice {
                        slice_id: Some(AudioSliceId(item.audio_slice_id.unwrap().to_string())),
                        resource_url,
                        parent_track: None,
                        annotations: None,
                        index: 0,
                        // TODO: is this a bad default?
                        include_in_edited_collection: true,
                        edited_by: None,
                        recorded_at: item.recorded_at.map(Date::new),
                        recorded_by: item.recorded_by.and_then(|user_id| {
                            item.recorded_by_name.map(|display_name| User {
                                id: UserId(user_id.to_string()),
                                display_name,
                                created_at: None,
                                avatar_url: None,
                                bio: None,
                                organization: None,
                                location: None,
                                role: None,
                            })
                        }),
                        start_time: item.audio_slice.as_ref().and_then(|r| match r.start {
                            Bound::Unbounded => None,
                            Bound::Included(t) | Bound::Excluded(t) => Some(t as i32),
                        }),
                        end_time: item.audio_slice.and_then(|r| match r.end {
                            Bound::Unbounded => None,
                            Bound::Included(t) | Bound::Excluded(t) => Some(t as i32),
                        }),
                    }),
                    collection: None,
                    contributors: item
                        .contributors
                        .and_then(|x| serde_json::from_value(x).ok())
                        .unwrap_or_default(),
                    format_id: None.into(),
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
            .enumerate()
            .map(|(index, p)| {
                (
                    ParagraphsInPage(p.page_id),
                    DocumentParagraph {
                        id: p.id,
                        translation: p.english_translation,
                        index: (index as i64) + 1,
                    },
                )
            })
            .into_group_map())
    }
}

#[async_trait]
impl Loader<PartsOfWord> for Database {
    type Value = Vec<WordSegment>;
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
                    WordSegment {
                        system: None,
                        morpheme: part.morpheme,
                        gloss: part.gloss,
                        gloss_id: part.gloss_id,
                        role: part.role,
                        matching_tag: None,
                    },
                )
            })
            .into_group_map())
    }
}

#[async_trait]
impl Loader<TagId> for Database {
    type Value = Vec<MorphemeTag>;
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
                        tag.abstract_gloss.clone(),
                        InputType::parse(Some(Value::Enum(Name::new(tag.system_name)))).unwrap(),
                    ),
                    MorphemeTag {
                        internal_tags: tag.internal_tags.unwrap_or_default(),
                        tag: tag.concrete_gloss,
                        title: tag.title,
                        shape: tag.example_shape,
                        details_url: None,
                        definition: tag.description.unwrap_or_default(),
                        morpheme_type: tag.linguistic_type.unwrap_or_default(),
                        role_override: tag.role_override,
                    },
                )
            })
            .into_group_map())
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
                    AnnotatedSeg::Word(
                        (BasicWord {
                            id: Some(w.id),
                            source_text: Some(w.source_text),
                            simple_phonetics: w.simple_phonetics,
                            phonemic: w.phonemic,
                            english_gloss: w.english_gloss,
                            commentary: w.commentary,
                            document_id: Some(w.document_id),
                            index_in_document: Some(w.index_in_document),
                            page_number: w.page_number,
                            audio_url: w.audio_url,
                            audio_slice_id: w.audio_slice_id,
                            audio_slice: w.audio_slice,
                            audio_recorded_at: w.audio_recorded_at,
                            audio_recorded_by: w.audio_recorded_by,
                            audio_recorded_by_name: w.audio_recorded_by_name,
                            include_audio_in_edited_collection: Some(
                                w.include_audio_in_edited_collection,
                            ),
                            audio_edited_by: w.audio_edited_by,
                            audio_edited_by_name: w.audio_edited_by_name,
                        })
                        .into(),
                    ),
                )
            })
            .into_group_map())
    }
}

#[async_trait]
impl Loader<TagForMorpheme> for Database {
    type Value = MorphemeTag;
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
                        tag.gloss_id,
                        InputType::parse(Some(Value::Enum(Name::new(tag.system_name)))).unwrap(),
                    ),
                    MorphemeTag {
                        internal_tags: Vec::new(),
                        tag: tag.gloss,
                        title: tag.title,
                        shape: tag.example_shape,
                        details_url: None,
                        definition: tag.description.unwrap_or_default(),
                        morpheme_type: tag.linguistic_type.unwrap_or_default(),
                        role_override: tag.role_override,
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
                    ContributorsForDocument(x.document_id),
                    Contributor {
                        name: x.full_name,
                        role: x
                            .contribution_role
                            .to_lowercase()
                            .parse::<ContributorRole>()
                            .ok(),
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
                        is_visible: false,
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

#[async_trait]
impl Loader<FormatById> for Database {
    type Value = Option<Format>;
    type Error = Arc<sqlx::Error>;

    async fn load(
        &self,
        keys: &[FormatById],
    ) -> Result<HashMap<FormatById, Self::Value>, Self::Error> {
        // Collect UUID
        let id: Uuid = keys.iter().next().map(|k| k.0).expect("No keys found");

        // Query all formats by IDs
        let rows = query_file!("queries/get_format_by_id.sql", id)
            .fetch_all(&self.client)
            .await?;

        // Map results by ID
        let mut results = HashMap::new();
        for key in keys {
            if let Some(row) = rows.iter().find(|r| r.id == key.0) {
                results.insert(
                    key.clone(),
                    Some(Format {
                        id: row.id,
                        name: row.name.clone(),
                        status: row.status.clone(),
                    }),
                );
            } else {
                results.insert(key.clone(), None);
            }
        }

        Ok(results)
    }
}

/// A struct representing an audio slice that can be easily pulled from the database
struct BasicAudioSlice {
    id: Uuid,
    recorded_at: Option<NaiveDate>,
    resource_url: String,
    range: Option<PgRange<i64>>,
    include_in_edited_collection: bool,
    recorded_by: Option<Uuid>,
    recorded_by_name: Option<String>,
    edited_by: Option<Uuid>,
    edited_by_name: Option<String>,
}

impl From<BasicAudioSlice> for AudioSlice {
    fn from(b: BasicAudioSlice) -> Self {
        AudioSlice {
            slice_id: Some(AudioSliceId(b.id.to_string())),
            resource_url: b.resource_url,
            parent_track: None,
            annotations: None,
            index: 0,
            include_in_edited_collection: b.include_in_edited_collection,
            edited_by: b.edited_by.and_then(|user_id| {
                b.edited_by_name.map(|display_name| User {
                    id: UserId::from(user_id),
                    display_name,
                    created_at: None,
                    avatar_url: None,
                    bio: None,
                    organization: None,
                    location: None,
                    role: None,
                })
            }),
            recorded_at: b.recorded_at.map(Date::new),
            recorded_by: b.recorded_by.and_then(|user_id| {
                b.recorded_by_name.map(|display_name| User {
                    id: UserId::from(user_id),
                    display_name,
                    created_at: None,
                    avatar_url: None,
                    bio: None,
                    organization: None,
                    location: None,
                    role: None,
                })
            }),
            start_time: b.range.as_ref().and_then(|r| match r.start {
                Bound::Unbounded => None,
                Bound::Included(t) | Bound::Excluded(t) => Some(t as i32),
            }),
            end_time: b.range.and_then(|r| match r.end {
                Bound::Unbounded => None,
                Bound::Included(t) | Bound::Excluded(t) => Some(t as i32),
            }),
        }
    }
}

/// A struct representing a Word/AnnotatedForm that can be easily pulled from
/// the database
struct BasicWord {
    id: Option<Uuid>,
    source_text: Option<String>,
    simple_phonetics: Option<String>,
    phonemic: Option<String>,
    english_gloss: Option<String>,
    commentary: Option<String>,
    document_id: Option<Uuid>,
    index_in_document: Option<i64>,
    page_number: Option<String>,
    audio_url: Option<String>,
    audio_slice_id: Option<Uuid>,
    audio_slice: Option<PgRange<i64>>,
    audio_recorded_at: Option<NaiveDate>,
    audio_recorded_by: Option<Uuid>,
    audio_recorded_by_name: Option<String>,
    include_audio_in_edited_collection: Option<bool>,
    audio_edited_by: Option<Uuid>,
    audio_edited_by_name: Option<String>,
}

impl BasicWord {
    fn audio_slice(&self) -> Option<BasicAudioSlice> {
        Some(BasicAudioSlice {
            id: self.audio_slice_id?.to_owned(),
            resource_url: self.audio_url.as_ref()?.clone(),
            range: self.audio_slice.to_owned(),
            recorded_at: self.audio_recorded_at,
            recorded_by: self.audio_recorded_by,
            recorded_by_name: self.audio_recorded_by_name.to_owned(),
            include_in_edited_collection: self.include_audio_in_edited_collection.unwrap_or(false),
            edited_by: self.audio_edited_by,
            edited_by_name: self.audio_edited_by_name.to_owned(),
        })
    }
}

impl From<BasicWord> for AnnotatedForm {
    fn from(w: BasicWord) -> Self {
        // up here because we need to borrow the basic type before we start moving things
        let ingested_audio_track = w.audio_slice().map(AudioSlice::from);
        Self {
            id: w.id,
            source: w.source_text.unwrap_or_default(),
            normalized_source: None,
            simple_phonetics: w.simple_phonetics,
            phonemic: w.phonemic,
            // TODO Fill in?
            segments: None,
            english_gloss: w.english_gloss.map(|s| vec![s]).unwrap_or_default(),
            commentary: w.commentary,
            ingested_audio_track,
            date_recorded: None,
            line_break: None,
            page_break: None,
            position: PositionInDocument::new(
                DocumentId(w.document_id.unwrap_or_default()),
                w.page_number.unwrap_or_default(),
                w.index_in_document.unwrap_or_default(),
            ),
        }
    }
}

// Loader to get each chapter id from the database regardless if it's a subchapter or not.
#[async_trait]
impl Loader<ChaptersInCollection> for Database {
    type Value = Vec<CollectionChapter>;
    type Error = Arc<sqlx::Error>;

    // string slug can look like "cwkw".chapter1.doc1 But assume user only passes "cwkw"

    async fn load(
        &self,
        keys: &[ChaptersInCollection],
    ) -> Result<HashMap<ChaptersInCollection, Self::Value>, Self::Error> {
        let keys: Vec<_> = keys.iter().map(|k| k.0.clone()).collect();
        let items = query_file!("queries/collection_chapters.sql", &keys)
            .fetch_all(&self.client)
            .await?;
        Ok(items
            .into_iter()
            .map(|chapter| {
                (
                    ChaptersInCollection(chapter.collection_slug),
                    CollectionChapter {
                        id: chapter.id,
                        title: chapter.title,
                        document_id: chapter.document_id.map(DocumentId),
                        wordpress_id: chapter.wordpress_id,
                        index_in_parent: chapter.index_in_parent,
                        section: chapter.section,
                        path: chapter
                            .chapter_path
                            .into_iter()
                            .map(|s| (*s).into())
                            .collect(),
                    },
                )
            })
            .into_group_map())
    }
}

#[async_trait]
impl Loader<EditedCollectionDetails> for Database {
    type Value = EditedCollection;
    type Error = Arc<sqlx::Error>;

    async fn load(
        &self,
        keys: &[EditedCollectionDetails],
    ) -> Result<HashMap<EditedCollectionDetails, Self::Value>, Self::Error> {
        let keys: Vec<_> = keys.iter().map(|k| k.0.clone()).collect();
        let items = query_file!("queries/collection_attributes.sql", &keys)
            .fetch_all(&self.client)
            .await?;
        Ok(items
            .into_iter()
            .map(|collection| {
                (
                    EditedCollectionDetails(collection.slug.clone()),
                    EditedCollection {
                        id: collection.id,
                        title: collection.title,
                        wordpress_menu_id: collection.wordpress_menu_id,
                        description: collection.description,
                        slug: collection.slug,
                        thumbnail_url: collection.thumbnail_url,
                    },
                )
            })
            .collect())
    }
}

/// A simplified comment type that is easier to pull out of the database
struct BasicComment {
    pub id: Uuid,
    pub posted_at: NaiveDateTime,

    pub posted_by: Uuid,
    pub posted_by_name: String,

    pub text_content: String,
    pub comment_type: Option<CommentType>,

    pub edited: bool,

    pub parent_id: Uuid,
    pub parent_type: CommentParentType,
}

impl From<BasicComment> for Comment {
    fn from(val: BasicComment) -> Self {
        Comment {
            id: val.id,
            posted_at: DateTime::new(val.posted_at),
            posted_by: User {
                id: val.posted_by.into(),
                display_name: val.posted_by_name,
                created_at: None,
                avatar_url: None,
                bio: None,
                organization: None,
                location: None,
                role: None,
            },
            text_content: val.text_content,
            comment_type: val.comment_type,
            edited: val.edited,
            parent_id: val.parent_id,
            parent_type: val.parent_type,
        }
    }
}

#[derive(Clone, Eq, PartialEq, Hash, Debug)]
pub struct TagId(pub String, pub CherokeeOrthography);

#[derive(Clone, Eq, PartialEq, Hash)]
pub struct PartsOfWord(pub Uuid);

#[derive(Clone, Eq, PartialEq, Hash)]
pub struct PersonFullName(pub String);

#[derive(Clone, Eq, PartialEq, Hash)]
pub struct ContributorsForDocument(pub Uuid);

#[derive(Clone, Eq, PartialEq, Hash)]
pub struct BookmarkedOn(pub Uuid, pub Uuid);

#[derive(Clone, Eq, PartialEq, Hash)]
pub struct DocumentShortName(pub String);

#[derive(Clone, Eq, PartialEq, Hash)]
pub struct TagForMorpheme(pub Uuid, pub CherokeeOrthography);

#[derive(Clone, Eq, PartialEq, Hash)]
pub struct PageId(pub String);

#[derive(Clone, Eq, PartialEq, Hash)]
pub struct ChaptersInCollection(pub String);

#[derive(Clone, Eq, PartialEq, Hash)]
pub struct EditedCollectionDetails(pub String);

#[derive(Clone, Eq, PartialEq, Hash)]
pub struct FormatById(pub uuid::Uuid);

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
