//! This piece of the project exposes a GraphQL endpoint that allows one to access DAILP data in a federated manner with specific queries.

use dailp::{
    auth::{AuthGuard, GroupGuard, UserGroup, UserInfo},
    comment::{CommentParent, CommentUpdate, DeleteCommentInput, PostCommentInput},
    slugify_ltree,
    user::{User, UserUpdate},
    AnnotatedForm, AttachAudioToWordInput, CollectionChapter, CreateEditedCollectionInput,
    CurateWordAudioInput, DeleteContributorAttribution, DocumentMetadataUpdate, DocumentParagraph,
    UpdateContributorAttribution, Uuid,
};
use itertools::Itertools;

use {
    dailp::async_graphql::{self, dataloader::DataLoader, Context, FieldResult},
    dailp::{
        AbstractMorphemeTag, AnnotatedDoc, AnnotatedFormUpdate, CherokeeOrthography, Database,
        EditedCollection, MorphemeId, MorphemeReference, MorphemeTag, ParagraphUpdate,
        WordsInDocument, Menu, MenuUpdate,
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

    /// Decide if a piece audio should be included in edited collection
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
            .update_audio_visibility(
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

    #[graphql(
        guard = "GroupGuard::new(UserGroup::Editors)"
    )]
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
