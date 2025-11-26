//! This piece of the project exposes a GraphQL endpoint that allows one to access DAILP data in a federated manner with specific queries.

use dailp::{
    auth::{AuthGuard, GroupGuard, UserGroup, UserInfo},
    comment::{CommentParent, CommentUpdate, DeleteCommentInput, PostCommentInput},
    page::{NewPageInput, Page},
    slugify_ltree,
    user::{User, UserUpdate},
    AnnotatedForm, AnnotatedSeg, AttachAudioToDocumentInput, AttachAudioToWordInput,
    CollectionChapter, Contributor, ContributorRole, CreateEditedCollectionInput,
    CurateDocumentAudioInput, CurateWordAudioInput, DeleteContributorAttribution, DocumentMetadata,
    DocumentMetadataUpdate, DocumentParagraph, PositionInDocument, SourceAttribution,
    TranslatedPage, TranslatedSection, UpdateContributorAttribution, Uuid,
};
use itertools::Itertools;

use {
    dailp::async_graphql::{self, dataloader::DataLoader, Context, FieldResult},
    dailp::{
        AbstractMorphemeTag, AnnotatedDoc, AnnotatedFormUpdate, CherokeeOrthography, Database,
        EditedCollection, Menu, MenuUpdate, MorphemeId, MorphemeReference, MorphemeTag,
        ParagraphUpdate, WordsInDocument,
    },
};

/// Home for all read-only queries
pub struct Query;

#[async_graphql::Object]
impl Query {
    // List of all the edited collections available.
    async fn all_edited_collections(
        &self,
        context: &Context<'_>,
    ) -> FieldResult<Vec<EditedCollection>> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .loader()
            .all_edited_collections()
            .await?)
    }

    async fn page_by_path(&self, context: &Context<'_>, path: String) -> FieldResult<Option<Page>> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .loader()
            .page_by_path(&path)
            .await?)
    }

    // query for 1 collection based on slug, and make a collection object with all the stuff in it.
    async fn edited_collection(
        &self,
        context: &Context<'_>,
        slug: String,
    ) -> FieldResult<Option<EditedCollection>> {
        let slug = slugify_ltree(slug);
        Ok(context
            .data::<DataLoader<Database>>()?
            .load_one(dailp::EditedCollectionDetails(slug))
            .await?)
    }

    /// Retrieves a chapter and its contents by its collection and chapter slug.
    async fn chapter(
        &self,
        context: &Context<'_>,
        collection_slug: String,
        chapter_slug: String,
    ) -> FieldResult<Option<CollectionChapter>> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .loader()
            .chapter(slugify_ltree(collection_slug), slugify_ltree(chapter_slug))
            .await?)
    }

    /// List of all the functional morpheme tags available
    async fn all_tags(
        &self,
        context: &Context<'_>,
        system: CherokeeOrthography,
    ) -> FieldResult<Vec<MorphemeTag>> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .loader()
            .all_tags(system)
            .await?)
    }

    /// Listing of all documents excluding their contents by default
    async fn all_documents(&self, context: &Context<'_>) -> FieldResult<Vec<AnnotatedDoc>> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .loader()
            .all_documents()
            .await?)
    }

    /// List of all content pages
    async fn all_pages(&self, context: &Context<'_>) -> FieldResult<Vec<dailp::page::Page>> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .loader()
            .all_pages()
            .await?)
    }

    /// List of all the document collections available.
    async fn all_collections(
        &self,
        context: &Context<'_>,
    ) -> FieldResult<Vec<dailp::DocumentCollection>> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .loader()
            .top_collections()
            .await?)
    }

    async fn collection(
        &self,
        context: &Context<'_>,
        slug: String,
    ) -> FieldResult<dailp::DocumentCollection> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .loader()
            .collection(slug)
            .await?)
    }

    /// Retrieves a full document from its unique name.
    pub async fn document(
        &self,
        context: &Context<'_>,
        slug: String,
    ) -> FieldResult<Option<AnnotatedDoc>> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .load_one(dailp::DocumentShortName(slug.to_ascii_uppercase()))
            .await?)
    }

    /// Retrieves all documents that are bookmarked by the current user.
    #[graphql(guard = "AuthGuard")]
    pub async fn bookmarked_documents(
        &self,
        context: &Context<'_>,
    ) -> FieldResult<Vec<AnnotatedDoc>> {
        let user = context
            .data_opt::<UserInfo>()
            .ok_or_else(|| anyhow::format_err!("User is not signed in"))?;
        let bookmarked_ids = context
            .data::<DataLoader<Database>>()?
            .loader()
            .bookmarked_documents(&user.id)
            .await?;
        let annotated_docs_map = context
            .data::<DataLoader<Database>>()?
            .load_many(bookmarked_ids.iter().map(|&id| dailp::DocumentId(id)))
            .await?;
        Ok(annotated_docs_map.into_values().collect())
    }

    /// Retrieves a full document from its unique identifier.
    pub async fn document_by_uuid(
        &self,
        context: &Context<'_>,
        id: Uuid,
    ) -> FieldResult<Option<AnnotatedDoc>> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .load_one(dailp::DocumentId(id))
            .await?)
    }

    /// Retrieves a full document from its unique identifier.
    pub async fn page(
        &self,
        context: &Context<'_>,
        id: String,
    ) -> FieldResult<Option<dailp::page::Page>> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .load_one(dailp::PageId(id))
            .await?)
    }

    /// Lists all forms containing a morpheme with the given gloss.
    /// Groups these words by the phonemic shape of the target morpheme.
    pub async fn morphemes_by_shape(
        &self,
        context: &Context<'_>,
        gloss: String,
        #[graphql(desc = "Compare morpheme shapes in this orthography.
                          Choosing a simpler system like d/t will give you more general groupings.
                         ")]
        compare_by: Option<CherokeeOrthography>,
    ) -> FieldResult<Vec<MorphemeReference>> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .loader()
            .morphemes(MorphemeId::parse(&gloss).unwrap(), compare_by)
            .await?)
    }

    /// Lists all words containing a morpheme with the given gloss.
    /// Groups these words by the document containing them.
    async fn morphemes_by_document(
        &self,
        context: &Context<'_>,
        document_id: Option<dailp::DocumentId>,
        morpheme_gloss: String,
    ) -> FieldResult<Vec<WordsInDocument>> {
        if let Some(document_id) = document_id {
            Ok(context
                .data::<DataLoader<Database>>()?
                .loader()
                .connected_forms(Some(document_id), &morpheme_gloss)
                .await?
                .into_iter()
                .group_by(|w| w.position.document_id)
                .into_iter()
                .map(|(document_id, forms)| WordsInDocument {
                    document_type: None,
                    document_id: Some(document_id),
                    forms: forms.collect(),
                })
                .collect())
        } else {
            Ok(context
                .data::<DataLoader<Database>>()?
                .loader()
                .words_by_doc(document_id, &morpheme_gloss)
                .await?)
        }
    }

    /// Forms containing the given morpheme gloss or related ones clustered over time.
    async fn morpheme_time_clusters(
        &self,
        context: &Context<'_>,
        gloss: String,
        #[graphql(default = 10)] cluster_years: i32,
    ) -> FieldResult<Vec<FormsInTime>> {
        use dailp::chrono::Datelike;
        use itertools::Itertools as _;

        let db = context.data::<DataLoader<Database>>()?.loader();
        let morpheme = dailp::MorphemeId::parse(&gloss).unwrap();
        let doc_id = if let Some(short_name) = morpheme.document_name {
            db.document_id_from_name(&short_name).await?
        } else {
            None
        };
        let forms = db.connected_forms(doc_id, &morpheme.gloss).await?;
        // Cluster forms by the decade they were recorded in.
        let clusters = forms
            .into_iter()
            .map(|form| {
                (
                    form.date_recorded
                        .as_ref()
                        .map(|d| d.0.year() / cluster_years),
                    form,
                )
            })
            .into_group_map();

        Ok(clusters
            .into_values()
            .map(|forms| {
                let dates = forms.iter().filter_map(|f| f.date_recorded.as_ref());
                let start = dates.clone().min();
                let end = dates.max();
                FormsInTime {
                    start: start.cloned(),
                    end: end.cloned(),
                    // Sort forms from oldest to newest.
                    forms: forms
                        .into_iter()
                        .sorted_by(|a, b| Ord::cmp(&b.date_recorded, &a.date_recorded))
                        .collect(),
                }
            })
            // Sort the clusters from oldest to newest.
            .sorted_by(|a, b| Ord::cmp(&b.start, &a.start))
            .collect())
    }

    /// Retrieve information for the morpheme that corresponds to the given tag
    /// string. For example, "3PL.B" is the standard string referring to a 3rd
    /// person plural prefix.
    async fn morpheme_tag(
        &self,
        context: &Context<'_>,
        id: String,
        system: CherokeeOrthography,
    ) -> FieldResult<Option<MorphemeTag>> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .load_one(dailp::TagId(id, system))
            .await?
            .unwrap_or_default()
            .into_iter()
            .next())
    }

    /// Search for words that match any one of the given queries.
    /// Each query may match against multiple fields of a word.
    async fn word_search(
        &self,
        context: &Context<'_>,
        query: String,
    ) -> FieldResult<Vec<dailp::AnnotatedForm>> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .loader()
            .search_words_any_field(query)
            .await?)
    }

    /// Get a single word given the word ID
    async fn word_by_id(
        &self,
        context: &Context<'_>,
        id: Uuid,
    ) -> FieldResult<dailp::AnnotatedForm> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .loader()
            .word_by_id(&id)
            .await?)
    }

    /// Get a single paragraph given the paragraph ID
    async fn paragraph_by_id(
        &self,
        context: &Context<'_>,
        id: Uuid,
    ) -> FieldResult<dailp::DocumentParagraph> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .loader()
            .paragraph_by_id(&id)
            .await?)
    }

    /// Search for words with the exact same syllabary string, or with very
    /// similar looking characters.
    async fn syllabary_search(
        &self,
        context: &Context<'_>,
        query: String,
    ) -> FieldResult<Vec<dailp::AnnotatedForm>> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .loader()
            .potential_syllabary_matches(&query)
            .await?)
    }

    /// Basic information about the currently authenticated user, if any.
    #[graphql(guard = "AuthGuard")]
    async fn user_info<'a>(&self, context: &'a Context<'_>) -> Option<&'a UserInfo> {
        context.data_opt()
    }

    /// Gets a dailp_user by their id
    async fn dailp_user_by_id(&self, context: &Context<'_>, id: Uuid) -> FieldResult<User> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .loader()
            .dailp_user_by_id(&id)
            .await?)
    }

    async fn abbreviation_id_from_short_name(
        &self,
        context: &Context<'_>,
        short_name: String,
    ) -> FieldResult<Uuid> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .loader()
            .abbreviation_id_from_short_name(&short_name)
            .await?)
    }

    async fn menu_by_slug(&self, context: &Context<'_>, slug: String) -> FieldResult<Menu> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .loader()
            .get_menu_by_slug(slug)
            .await?)
    }
}

pub struct Mutation;

#[async_graphql::Object]
impl Mutation {
    /// Mutation must have at least one visible field for introspection to work
    /// correctly, so we just provide an API version which might be useful in
    /// the future.
    async fn api_version(&self) -> &str {
        "1.0"
    }

    /// Delete a comment.
    /// Will fail if the user making the request is not the poster.
    #[graphql(guard = "AuthGuard")]
    async fn delete_comment(
        &self,
        context: &Context<'_>,
        input: DeleteCommentInput,
    ) -> FieldResult<CommentParent> {
        let user = context
            .data_opt::<UserInfo>()
            .ok_or_else(|| anyhow::format_err!("User is not signed in"))?;

        // We could theoretically do this in one round trip, if we have ever
        // have performance issues. The query would roughly be:
        //     delete from comment where user_id and comment_id
        //     returning parent_type, parent_id

        let db = context.data::<DataLoader<Database>>()?.loader();

        let comment = db.comment_by_id(&input.comment_id).await?;

        if comment.posted_by.id.0 != user.id.to_string() {
            return Err("User attempted to delete another user's comment".into());
        }

        db.delete_comment(&input.comment_id).await?;

        // We return the parent object, for GraphCache interop
        comment.parent(context).await
    }

    /// Post a new comment on a given object
    #[graphql(guard = "AuthGuard")]
    async fn post_comment(
        &self,
        context: &Context<'_>,
        input: PostCommentInput,
    ) -> FieldResult<CommentParent> {
        let user = context
            .data_opt::<UserInfo>()
            .ok_or_else(|| anyhow::format_err!("User is not signed in"))?;

        let db = context.data::<DataLoader<Database>>()?.loader();

        db.insert_comment(
            &user.id,
            input.text_content,
            &input.parent_id,
            &input.parent_type,
            &input.comment_type,
        )
        .await?;

        // We return the parent object, for GraphCache interop
        input.parent_type.resolve(db, &input.parent_id).await
    }

    /// Update a comment
    #[graphql(guard = "AuthGuard")]
    async fn update_comment(
        &self,
        context: &Context<'_>,
        comment: CommentUpdate,
    ) -> FieldResult<CommentParent> {
        let user = context
            .data_opt::<UserInfo>()
            .ok_or_else(|| anyhow::format_err!("User is not signed in"))?;
        let db = context.data::<DataLoader<Database>>()?.loader();
        let comment_object = db.comment_by_id(&comment.id).await?;

        if comment_object.posted_by.id.0 != user.id.to_string() {
            return Err("User attempted to edit another user's comment".into());
        }
        // Note: We should probably handle an error here more gracefully.
        let _ = db.update_comment(comment).await;

        // We return the parent object, for GraphCache interop
        return comment_object.parent(context).await;
    }

    /// Mutation for adding/changing contributor attributions
    #[graphql(
        guard = "GroupGuard::new(UserGroup::Editors).or(GroupGuard::new(UserGroup::Contributors))"
    )]
    async fn update_contributor_attribution(
        &self,
        context: &Context<'_>,
        contribution: UpdateContributorAttribution,
    ) -> FieldResult<Uuid> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .loader()
            .update_contributor_attribution(contribution)
            .await?)
    }

    ///Mutation for deleting contributor attributions
    #[graphql(
        guard = "GroupGuard::new(UserGroup::Editors).or(GroupGuard::new(UserGroup::Contributors))"
    )]
    async fn delete_contributor_attribution(
        &self,
        context: &Context<'_>,
        contribution: DeleteContributorAttribution,
    ) -> FieldResult<Uuid> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .loader()
            .delete_contributor_attribution(contribution)
            .await?)
    }

    /// Mutation for paragraph and translation editing
    #[graphql(guard = "GroupGuard::new(UserGroup::Contributors)")]
    async fn update_paragraph(
        &self,
        context: &Context<'_>,
        paragraph: ParagraphUpdate,
    ) -> FieldResult<DocumentParagraph> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .loader()
            .update_paragraph(paragraph)
            .await?)
    }

    #[graphql(guard = "GroupGuard::new(UserGroup::Editors)")]
    async fn update_page(
        &self,
        context: &Context<'_>,
        // Data encoded as JSON for now.
        data: async_graphql::Json<dailp::page::Page>,
    ) -> FieldResult<bool> {
        context
            .data::<DataLoader<Database>>()?
            .loader()
            .update_page(data.0)
            .await?;
        Ok(true)
    }

    #[graphql(guard = "GroupGuard::new(UserGroup::Editors)")]
    async fn update_annotation(
        &self,
        context: &Context<'_>,
        // Data encoded as JSON for now.
        data: async_graphql::Json<dailp::annotation::Annotation>,
    ) -> FieldResult<bool> {
        context
            .data::<DataLoader<Database>>()?
            .loader()
            .update_annotation(data.0)
            .await?;
        Ok(true)
    }

    #[graphql(
        guard = "GroupGuard::new(UserGroup::Editors).or(GroupGuard::new(UserGroup::Contributors))"
    )]
    async fn update_word(
        &self,
        context: &Context<'_>,
        word: AnnotatedFormUpdate,
    ) -> FieldResult<AnnotatedForm> {
        let database = context.data::<DataLoader<Database>>()?.loader();
        Ok(database
            .word_by_id(&database.update_word(word).await?)
            .await?)
    }

    /// Updates a dailp_user's information
    #[graphql(guard = "AuthGuard")]
    async fn update_user(&self, context: &Context<'_>, user: UserUpdate) -> FieldResult<User> {
        let user_id = Uuid::from(&user.id);
        let db = context.data::<DataLoader<Database>>()?.loader();

        db.update_dailp_user(user).await?;

        let user_object = db.dailp_user_by_id(&user_id).await?;

        // We return the user object, for GraphCache interop
        return Ok(user_object);
    }

    /// Adds a bookmark to the user's list of bookmarks.
    #[graphql(guard = "AuthGuard")]
    async fn add_bookmark(
        &self,
        context: &Context<'_>,
        document_id: Uuid,
    ) -> FieldResult<AnnotatedDoc> {
        let user = context
            .data_opt::<UserInfo>()
            .ok_or_else(|| anyhow::format_err!("User is not signed in"))?;
        context
            .data::<DataLoader<Database>>()?
            .loader()
            .add_bookmark(document_id, user.id)
            .await?;
        Ok(context
            .data::<DataLoader<Database>>()?
            .load_one(dailp::DocumentId(document_id))
            .await?
            .ok_or_else(|| anyhow::format_err!("Failed to load document"))?)
    }

    /// Removes a bookmark from a user's list of bookmarks
    #[graphql(guard = "AuthGuard")]
    async fn remove_bookmark(
        &self,
        context: &Context<'_>,
        document_id: Uuid,
    ) -> FieldResult<AnnotatedDoc> {
        let user = context
            .data_opt::<UserInfo>()
            .ok_or_else(|| anyhow::format_err!("User is not signed in"))?;
        context
            .data::<DataLoader<Database>>()?
            .loader()
            .remove_bookmark(document_id, user.id)
            .await?;
        Ok(context
            .data::<DataLoader<Database>>()?
            .load_one(dailp::DocumentId(document_id))
            .await?
            .ok_or_else(|| anyhow::format_err!("Failed to load document"))?)
    }

    /// Decide if a piece of word audio should be included in edited collection
    #[graphql(guard = "GroupGuard::new(UserGroup::Editors)")]
    async fn curate_word_audio(
        &self,
        context: &Context<'_>,
        input: CurateWordAudioInput,
    ) -> FieldResult<dailp::AnnotatedForm> {
        // TODO: should this return a typed id ie. AudioSliceId?
        let user = context
            .data_opt::<UserInfo>()
            .ok_or_else(|| anyhow::format_err!("User is not signed in"))?;
        let word_id = context
            .data::<DataLoader<Database>>()?
            .loader()
            .update_word_audio_visibility(
                &input.word_id,
                &input.audio_slice_id,
                input.include_in_edited_collection,
                &user.id,
            )
            .await?;
        Ok(context
            .data::<DataLoader<Database>>()?
            .loader()
            .word_by_id(&word_id.ok_or_else(|| anyhow::format_err!("Word audio not found"))?)
            .await?)
    }

    /// Decide if a piece of document audio should be included in edited collection
    #[graphql(guard = "GroupGuard::new(UserGroup::Editors)")]
    async fn curate_document_audio(
        &self,
        context: &Context<'_>,
        input: CurateDocumentAudioInput,
    ) -> FieldResult<dailp::AnnotatedDoc> {
        let user = context
            .data_opt::<UserInfo>()
            .ok_or_else(|| anyhow::format_err!("User is not signed in"))?;
        let document_id = context
            .data::<DataLoader<Database>>()?
            .loader()
            .update_document_audio_visibility(
                &input.document_id,
                &input.audio_slice_id,
                input.include_in_edited_collection,
                &user.id,
            )
            .await?;
        Ok(context
            .data::<DataLoader<Database>>()?
            .load_one(dailp::DocumentId(
                document_id.ok_or_else(|| anyhow::format_err!("Document not found"))?,
            ))
            .await?
            .ok_or_else(|| anyhow::format_err!("Document not found"))?)
    }

    /// Attach audio that has already been uploaded to S3 to a particular word
    /// Assumes user requesting mutation recoreded the audio
    #[graphql(guard = "GroupGuard::new(UserGroup::Contributors)")]
    async fn attach_audio_to_word(
        &self,
        context: &Context<'_>,
        input: AttachAudioToWordInput,
    ) -> FieldResult<dailp::AnnotatedForm> {
        // TODO: should this return a typed id ie. AudioSliceId?
        let user = context
            .data_opt::<UserInfo>()
            .ok_or_else(|| anyhow::format_err!("User is not signed in"))?;
        let _media_slice_id = context
            .data::<DataLoader<Database>>()?
            .loader()
            .attach_audio_to_word(&input, &user.id)
            .await?;
        Ok(context
            .data::<DataLoader<Database>>()?
            .loader()
            .word_by_id(&input.word_id)
            .await?)
    }

    /// Attach audio that has already been uploaded to S3 to a particular document
    /// Assumes user requesting mutation recorded the audio
    #[graphql(
        guard = "GroupGuard::new(UserGroup::Contributors).or(GroupGuard::new(UserGroup::Editors))"
    )]
    async fn attach_audio_to_document(
        &self,
        context: &Context<'_>,
        input: AttachAudioToDocumentInput,
    ) -> FieldResult<dailp::AnnotatedDoc> {
        let user = context
            .data_opt::<UserInfo>()
            .ok_or_else(|| anyhow::format_err!("User is not signed in"))?;
        let _media_slice_id = context
            .data::<DataLoader<Database>>()?
            .loader()
            .attach_audio_to_document(&input, &user.id)
            .await?;
        Ok(context
            .data::<DataLoader<Database>>()?
            .load_one(dailp::DocumentId(input.document_id))
            .await?
            .ok_or_else(|| anyhow::format_err!("Document not found"))?)
    }

    #[graphql(guard = "GroupGuard::new(UserGroup::Editors)")]
    async fn update_document_metadata(
        &self,
        context: &Context<'_>,
        document: DocumentMetadataUpdate,
    ) -> FieldResult<Uuid> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .loader()
            .update_document_metadata(document)
            .await?)
    }

    /// Minimal mutation to add a document with only essential fields
    #[graphql(
        guard = "GroupGuard::new(UserGroup::Editors).or(GroupGuard::new(UserGroup::Contributors))"
    )]
    async fn add_document(
        &self,
        context: &Context<'_>,
        input: CreateDocumentFromFormInput,
    ) -> FieldResult<AddDocumentPayload> {
        let title = input.document_name;
        // Get info for the user currently signed in
        let user = context
            .data_opt::<UserInfo>()
            .ok_or_else(|| anyhow::format_err!("User is not signed in"))?;
        let user_profile_data = context
            .data::<DataLoader<Database>>()?
            .loader()
            .dailp_user_by_id(&user.id)
            .await?;
        let contributor = Contributor {
            id: user.id,
            name: user_profile_data.display_name,
            // get users display name. TODO we should more rigorously check this value for errors
            role: Some(ContributorRole::Transcriber), // TODO Ask Ellen, Cara, Shireen about this terminology
        };
        let today = dailp::chrono::Utc::now().date_naive();
        let document_date = dailp::Date::new(today);
        let document_id = Uuid::new_v4();
        let short_name = dailp::slugify(&title).to_ascii_uppercase();
        let source = SourceAttribution {
            name: input.source_name,
            link: input.source_url,
        };
        let mut sections = Vec::new();
        for (i, _raw_text_line) in input.raw_text_lines.iter().enumerate() {
            let translation: Option<String> = Some(input.english_translation_lines[i].join(" "));
            let mut segs = Vec::new();
            for (j, src_word) in input.raw_text_lines[i].iter().enumerate() {
                let form = AnnotatedForm {
                    id: None,
                    source: src_word.clone(),
                    normalized_source: None,
                    simple_phonetics: None,
                    phonemic: None,
                    segments: None,
                    english_gloss: vec![],
                    commentary: None,
                    line_break: None,
                    page_break: None,
                    position: PositionInDocument {
                        document_id: dailp::DocumentId(document_id),
                        page_number: "1".to_string(),
                        index: j as i64,
                        geometry: None,
                    },
                    date_recorded: None,
                    ingested_audio_track: None,
                };
                segs.push(AnnotatedSeg::Word(form));
            }
            let section = TranslatedSection {
                translation,
                source: segs,
            };
            sections.push(section);
        }
        let page = TranslatedPage {
            paragraphs: sections,
        };
        let meta = DocumentMetadata {
            id: dailp::DocumentId(document_id),
            short_name: short_name.clone(),
            title: title.clone(),
            sources: vec![source],
            collection: None,
            genre: None,
            contributors: Some(vec![contributor]),
            spatial_coverage_ids: None,
            translation: None,
            page_images: None,
            date: Some(document_date),
            is_reference: false,
            audio_recording: None,
            order_index: 0,
        };
        let annotated_doc = AnnotatedDoc {
            meta: meta.clone(),
            segments: Some(vec![page]),
        };
        let database = context.data::<DataLoader<Database>>()?.loader();
        let (document_id, _chapter_id) = database
            .insert_document_into_edited_collection(annotated_doc.clone(), input.collection_id)
            .await?;

        // Update the annotated_doc with the correct document_id from the database
        let mut updated_annotated_doc = annotated_doc.clone();
        updated_annotated_doc.meta.id = document_id;

        // Insert the document contents (words and paragraphs) into the database
        database
            .insert_document_contents(updated_annotated_doc)
            .await?;

        let collection_slug = database.collection_slug_by_id(input.collection_id).await?;

        Ok(AddDocumentPayload {
            id: document_id.0,
            title,
            slug: short_name.clone(),
            collection_slug: collection_slug
                .ok_or_else(|| anyhow::format_err!("Failed to load collection"))?
                .to_string(), // All user-created documents go to user_documents collection
            chapter_slug: dailp::slugify_ltree(&short_name), // Chapter slug must be ltree-compatible
        })
    }

    #[graphql(
        guard = "GroupGuard::new(UserGroup::Contributors).or(GroupGuard::new(UserGroup::Editors))"
    )]
    async fn insert_custom_morpheme_tag(
        &self,
        context: &Context<'_>,
        tag: String,
        title: String,
        system: String,
    ) -> FieldResult<bool> {
        //first get id of custom morpheme tag
        let abstract_id = context
            .data::<DataLoader<Database>>()?
            .loader()
            .insert_custom_abstract_tag(AbstractMorphemeTag {
                //TODO: can just make it CUS once we remove the unique constraint
                id: "CUS:".to_string() + &title,
                morpheme_type: "custom".to_string(),
            })
            .await?;

        //construct the morpheme tag
        //todo: need to figure out why tag and title are the same thing :(
        //its a frontend issue
        let tag = MorphemeTag {
            internal_tags: vec![abstract_id.to_string()],
            tag: tag,
            title: title.clone(),
            shape: None,
            details_url: None,
            definition: title,
            morpheme_type: String::new(),
            role_override: None,
        };

        let system_id = context
            .data::<DataLoader<Database>>()?
            .loader()
            .abbreviation_id_from_short_name("CUS")
            .await?;

        context
            .data::<DataLoader<Database>>()?
            .loader()
            .insert_custom_morpheme_tag(tag, system_id)
            .await?;
        Ok(true)
    }

    #[graphql(
        //TODO ADD ADMIN ROLES WHEN IT IS READY
        guard = "GroupGuard::new(UserGroup::Editors)"
    )]
    async fn create_edited_collection(
        &self,
        context: &Context<'_>,
        input: CreateEditedCollectionInput,
    ) -> FieldResult<String> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .loader()
            .insert_edited_collection(input)
            .await?
            .to_string())
    }

    #[graphql(guard = "GroupGuard::new(UserGroup::Editors)")]
    async fn upsert_page(&self, context: &Context<'_>, page: NewPageInput) -> FieldResult<String> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .loader()
            .upsert_page(page)
            .await?)
    }

    // dennis todo: should be admin, but admin accs not implemented yet
    #[graphql(guard = "GroupGuard::new(UserGroup::Editors)")]
    async fn update_menu(&self, context: &Context<'_>, menu: MenuUpdate) -> FieldResult<Menu> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .loader()
            .update_menu(menu)
            .await?)
    }
}

#[derive(async_graphql::SimpleObject)]
struct FormsInTime {
    start: Option<dailp::Date>,
    end: Option<dailp::Date>,
    forms: Vec<dailp::AnnotatedForm>,
}

#[derive(async_graphql::InputObject, Debug, Clone)]
pub struct CreateDocumentFromFormInput {
    pub document_name: String,
    pub raw_text_lines: Vec<Vec<String>>,
    pub english_translation_lines: Vec<Vec<String>>,
    pub unresolved_words: Vec<String>,
    pub source_name: String,
    pub source_url: String,
    pub collection_id: Uuid,
}

#[derive(async_graphql::SimpleObject)]
pub struct AddDocumentPayload {
    pub id: Uuid,
    pub title: String,
    pub slug: String,
    pub collection_slug: String,
    pub chapter_slug: String,
}
