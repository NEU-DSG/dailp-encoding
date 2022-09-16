//! This piece of the project exposes a GraphQL endpoint that allows one to access DAILP data in a federated manner with specific queries.

use dailp::Uuid;
use itertools::Itertools;

use {
    dailp::async_graphql::{self, dataloader::DataLoader, Context, FieldResult, Guard},
    dailp::{
        AnnotatedDoc, AnnotatedFormUpdate, CherokeeOrthography, Database, EditedCollection,
        MorphemeId, MorphemeReference, MorphemeTag, WordsInDocument,
    },
    serde::{Deserialize, Serialize},
    serde_with::{rust::StringWithSeparator, CommaSeparator},
};

/// Home for all read-only queries
pub struct Query;

#[async_graphql::Object]
impl Query {
    // query for 1 collection based on slug, and make a collection object with all the stuff in it.
    // #[async_graphql::SimpleObject]
    // impl EditedCollection {
    async fn get_collection(
        &self,
        context: &Context<'_>,
        slug: String,
    ) -> FieldResult<Option<Vec<EditedCollection>>> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .load_one(dailp::CollectionObject(slug))
            .await?)
    }
    // }

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
            .into_iter()
            .map(|(_, forms)| {
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
    async fn user_info<'a>(&self, context: &'a Context<'_>) -> &'a UserInfo {
        context.data_unchecked()
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

    #[graphql(guard = "GroupGuard::new(UserGroup::Editor)")]
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

    #[graphql(guard = "GroupGuard::new(UserGroup::Editor)")]
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

    #[graphql(guard = "GroupGuard::new(UserGroup::Editor)")]
    async fn update_word(
        &self,
        context: &Context<'_>,
        word: AnnotatedFormUpdate,
    ) -> FieldResult<Uuid> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .loader()
            .update_word(word)
            .await?)
    }
}

#[derive(async_graphql::SimpleObject)]
struct FormsInTime {
    start: Option<dailp::Date>,
    end: Option<dailp::Date>,
    forms: Vec<dailp::AnnotatedForm>,
}

#[derive(Deserialize, Debug, async_graphql::SimpleObject)]
pub struct UserInfo {
    email: String,
    #[serde(
        default,
        rename = "cognito:groups",
        with = "StringWithSeparator::<CommaSeparator>"
    )]
    groups: Vec<UserGroup>,
}
impl UserInfo {
    pub fn new_test_admin() -> Self {
        Self {
            email: "test@dailp.northeastern.edu".to_string(),
            groups: vec![UserGroup::Editor],
        }
    }
}

#[derive(Eq, PartialEq, Copy, Clone, Serialize, Deserialize, Debug, async_graphql::Enum)]
enum UserGroup {
    Editor,
}
// Impl FromStr and Display automatically for UserGroup, using serde.
// This allows us to (de)serialize lists of groups via a comma-separated string
// like this: "Editor,Contributor,Translator"
serde_plain::forward_from_str_to_serde!(UserGroup);
serde_plain::forward_display_to_serde!(UserGroup);

/// Requires that the user is authenticated and a member of the given user group.
struct GroupGuard {
    group: UserGroup,
}

impl GroupGuard {
    fn new(group: UserGroup) -> Self {
        Self { group }
    }
}

#[async_trait::async_trait]
impl Guard for GroupGuard {
    async fn check(&self, ctx: &async_graphql::Context<'_>) -> async_graphql::Result<()> {
        let user = ctx.data_opt::<UserInfo>();
        let has_group = user.map(|user| user.groups.iter().any(|group| group == &self.group));
        if has_group == Some(true) {
            Ok(())
        } else {
            Err(format!("Forbidden, user not in group '{}'", self.group).into())
        }
    }
}

/// Requires that the user is authenticated.
struct AuthGuard;

#[async_trait::async_trait]
impl Guard for AuthGuard {
    async fn check(&self, ctx: &async_graphql::Context<'_>) -> async_graphql::Result<()> {
        let user = ctx.data_opt::<UserInfo>();
        if user.is_some() {
            Ok(())
        } else {
            Err("Forbidden, user not authenticated".into())
        }
    }
}
