//! This piece of the project exposes a GraphQL endpoint that allows one to access DAILP data in a federated manner with specific queries.

use {
    async_graphql::{
        dataloader::DataLoader, guard::Guard, Context, EmptySubscription, FieldResult, Schema,
    },
    dailp::{
        AnnotatedDoc, CherokeeOrthography, Database, MorphemeId, MorphemeReference, MorphemeTag,
        WordsInDocument,
    },
    lambda_http::{http::header, lambda_runtime, IntoResponse, Request, RequestExt, Response},
    mongodb::bson,
    serde::{Deserialize, Serialize},
    serde_with::{rust::StringWithSeparator, CommaSeparator},
};

type Error = Box<dyn std::error::Error + Sync + Send + 'static>;

lazy_static::lazy_static! {
    // Share database connection between executions.
    // This prevents each lambda invocation from creating a new connection to
    // the database.
    static ref DATABASE: dailp::Database = dailp::Database::new().unwrap();
    static ref SCHEMA: Schema<Query, Mutation, EmptySubscription> = {
        Schema::build(Query, Mutation, EmptySubscription)
            .data(dailp::Database::new().unwrap())
            .data(DataLoader::new(dailp::Database::new().unwrap()))
            .finish()
    };
    static ref MONGODB_PASSWORD: String = std::env::var("MONGODB_PASSWORD").unwrap();
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    lambda_runtime::run(lambda_http::handler(handler)).await?;
    Ok(())
}

/// Takes an HTTP request containing a GraphQL query,
/// processes it with our GraphQL schema, then returns a JSON response.
async fn handler(req: Request, _: lambda_runtime::Context) -> Result<impl IntoResponse, Error> {
    let user: Option<UserInfo> = match req.request_context() {
        lambda_http::request::RequestContext::ApiGatewayV2(ctx) => ctx
            .authorizer
            .get("claims")
            .and_then(|claims| serde_json::from_value(claims.clone()).ok()),
        _ => None,
    };

    // TODO Hook up warp or tide instead of using a manual conditional.
    let path = req.uri().path();
    // GraphQL queries route to the /graphql endpoint.
    if path.contains("/graphql") {
        if req.method() == lambda_http::http::Method::GET {
            // Serve GraphQL Playground over GET to allow introspection in the browser!
            let playground = async_graphql::http::playground_source(
                async_graphql::http::GraphQLPlaygroundConfig::new(req.uri().path()),
            );
            Ok(Response::builder()
                .header(header::CONTENT_TYPE, "text/html; charset=utf-8")
                .header(header::ACCESS_CONTROL_ALLOW_ORIGIN, "*")
                .body(playground)?)
        } else if let lambda_http::Body::Text(req) = req.into_body() {
            // Other requests (usually POST) should be processed as an actual
            // GraphQL query.
            let schema = &*SCHEMA;
            let req: async_graphql::Request = serde_json::from_str(&req)?;
            // If the request was made by an authenticated user, add their
            // information to the request data.
            let req = if let Some(user) = user {
                req.data(user)
            } else {
                req
            };
            let res = schema.execute(req).await;
            let result = serde_json::to_string(&res)?;
            let resp = Response::builder()
                .header(header::CONTENT_TYPE, "application/json")
                .header(header::ACCESS_CONTROL_ALLOW_ORIGIN, "*")
                .header(header::ACCESS_CONTROL_ALLOW_CREDENTIALS, "true")
                .body(result)?;
            Ok(resp)
        } else {
            // TODO Make a custom error type for DAILP to cover this and ingestion errors.
            Err(Box::new(std::fmt::Error))
        }
    }
    // Document manifests are found at /manifests/{id}
    else if path.starts_with("/manifests") {
        let full_url = req.uri().to_string();
        let params = req.path_parameters();
        let document_id = params.get("id").unwrap();
        let manifest = DATABASE
            .document_manifest(&dailp::DocumentId(document_id.to_string()), full_url)
            .await?;
        let json = serde_json::to_string(&manifest)?;
        let resp = Response::builder()
            .header(header::CONTENT_TYPE, "application/json")
            .header(header::ACCESS_CONTROL_ALLOW_ORIGIN, "*")
            .body(json)?;
        Ok(resp)
    } else {
        // TODO Make a custom error type for DAILP to cover this and ingestion errors.
        Err(Box::new(std::fmt::Error))
    }
}

/// Home for all read-only queries
struct Query;

#[async_graphql::Object]
impl Query {
    /// List of all the functional morpheme tags available
    async fn all_tags(&self, context: &Context<'_>) -> FieldResult<Vec<MorphemeTag>> {
        Ok(context.data::<Database>()?.all_tags().await?)
    }

    /// Listing of all documents excluding their contents by default
    async fn all_documents(
        &self,
        context: &Context<'_>,
        collection: Option<String>,
    ) -> FieldResult<Vec<AnnotatedDoc>> {
        Ok(context
            .data::<Database>()?
            .all_documents(collection.as_deref())
            .await?)
    }

    /// List of all content pages
    async fn all_pages(&self, context: &Context<'_>) -> FieldResult<Vec<dailp::page::Page>> {
        Ok(context.data::<Database>()?.pages().all().await?)
    }

    /// List of all the document collections available.
    async fn all_collections(
        &self,
        context: &Context<'_>,
    ) -> FieldResult<Vec<dailp::DocumentCollection>> {
        Ok(context.data::<Database>()?.all_collections().await?)
    }

    /// List all contributors to documents and lexical resources.
    async fn all_contributors(
        &self,
        context: &Context<'_>,
    ) -> FieldResult<Vec<dailp::ContributorDetails>> {
        Ok(context.data::<Database>()?.all_people().await?)
    }

    /// Retrieves a full document from its unique identifier.
    pub async fn document(
        &self,
        context: &Context<'_>,
        id: String,
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

    async fn lexical_entry(
        &self,
        context: &Context<'_>,
        id: String,
    ) -> FieldResult<Option<dailp::AnnotatedForm>> {
        Ok(context.data::<Database>()?.lexical_entry(&id).await?)
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
            .data::<Database>()?
            .morphemes(&MorphemeId::parse(&gloss).unwrap(), compare_by)
            .await?)
    }

    /// Lists all words containing a morpheme with the given gloss.
    /// Groups these words by the document containing them.
    async fn morphemes_by_document(
        &self,
        context: &Context<'_>,
        morpheme_id: String,
    ) -> FieldResult<Vec<WordsInDocument>> {
        let id = MorphemeId::parse(&morpheme_id).unwrap();
        Ok(context.data::<Database>()?.words_by_doc(&id).await?)
    }

    /// Forms containing the given morpheme gloss or related ones clustered over time.
    async fn morpheme_time_clusters(
        &self,
        context: &Context<'_>,
        gloss: String,
        #[graphql(default = 10)] cluster_years: i32,
    ) -> FieldResult<Vec<FormsInTime>> {
        use chrono::Datelike;
        use itertools::Itertools as _;

        let forms = context
            .data::<Database>()?
            .connected_surface_forms(&dailp::MorphemeId::parse(&gloss).unwrap())
            .await?;
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
    ) -> FieldResult<Option<MorphemeTag>> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .load_one(dailp::TagId(id))
            .await?)
    }

    /// Details of one image source based on its short identifier string.
    async fn image_source(
        &self,
        context: &Context<'_>,
        id: String,
    ) -> FieldResult<Option<dailp::ImageSource>> {
        Ok(context
            .data::<Database>()?
            .image_source(&dailp::ImageSourceId(id))
            .await?)
    }

    /// Search for words that match any one of the given queries.
    /// Each query may match against multiple fields of a word.
    async fn word_search(
        &self,
        context: &Context<'_>,
        queries: Vec<FormQuery>,
    ) -> FieldResult<Vec<dailp::AnnotatedForm>> {
        // Convert the queries to valid BSON to send to MongoDB.
        let bson_queries: Vec<_> = queries.into_iter().map(|q| q.into_bson()).collect();
        // Match against any of the given queries.
        let q = bson::doc! { "$or": bson_queries };
        // Return the matching words, if any.
        Ok(context.data::<Database>()?.word_search(q).await?)
    }

    /// Search for words with the exact same syllabary string, or with very
    /// similar looking characters.
    async fn syllabary_search(
        &self,
        context: &Context<'_>,
        query: String,
    ) -> FieldResult<Vec<dailp::AnnotatedForm>> {
        Ok(context
            .data::<Database>()?
            .potential_syllabary_matches(&query)
            .await?)
    }

    /// Basic information about the currently authenticated user, if any.
    #[graphql(guard(AuthGuard()))]
    async fn user_info<'a>(&self, context: &'a Context<'_>) -> &'a UserInfo {
        context.data_unchecked()
    }
}

#[derive(async_graphql::InputObject)]
struct FormQuery {
    id: Option<String>,
    source: Option<String>,
    normalized_source: Option<String>,
    simple_phonetics: Option<String>,
    english_gloss: Option<String>,
    unresolved: Option<bool>,
}
impl FormQuery {
    fn into_bson(self) -> bson::Document {
        let regex_query = |q| bson::doc! { "$regex": q, "$options": "i" };
        let mut doc = bson::Document::new();
        if let Some(id) = self.id {
            doc.insert("id", regex_query(id));
        }
        if let Some(source) = self.source {
            doc.insert("source", regex_query(source));
        }
        if let Some(normalized_source) = self.normalized_source {
            doc.insert("normalizedSource", regex_query(normalized_source));
        }
        if let Some(simple_phonetics) = self.simple_phonetics {
            doc.insert("simplePhonetics", regex_query(simple_phonetics));
        }
        if let Some(english_gloss) = self.english_gloss {
            doc.insert("englishGloss", regex_query(english_gloss));
        }
        if let Some(true) = self.unresolved {
            doc.insert("segments", bson::doc! { "gloss": "?" });
        }
        doc
    }
}

struct Mutation;

#[async_graphql::Object]
impl Mutation {
    /// Mutation must have at least one visible field for introspection to work
    /// correctly, so we just provide an API version which might be useful in
    /// the future.
    async fn api_version(&self) -> &str {
        "1.0"
    }

    #[graphql(visible = false)]
    async fn update_tag(
        &self,
        context: &Context<'_>,
        #[graphql(secret)] password: String,
        // Data encoded as JSON for now.
        // FIXME Use real input objects.
        contents: String,
    ) -> FieldResult<bool> {
        if password != *MONGODB_PASSWORD {
            Ok(false)
        } else {
            let b = base64::decode(&contents)?;
            let tag = serde_json::from_slice(&b)?;
            context.data::<Database>()?.update_tag(tag).await?;
            Ok(true)
        }
    }

    #[graphql(visible = false)]
    async fn update_document(
        &self,
        context: &Context<'_>,
        #[graphql(secret)] password: String,
        // Data encoded as JSON for now.
        // FIXME Use real input objects.
        contents: String,
    ) -> FieldResult<bool> {
        if password != *MONGODB_PASSWORD {
            Ok(false)
        } else {
            let b = base64::decode(&contents)?;
            let tag = serde_json::from_slice(&b)?;
            context.data::<Database>()?.update_document(tag).await?;
            Ok(true)
        }
    }

    #[graphql(visible = false)]
    async fn update_form(
        &self,
        context: &Context<'_>,
        #[graphql(secret)] password: String,
        // Data encoded as JSON for now.
        // FIXME Use real input objects.
        contents: String,
    ) -> FieldResult<bool> {
        if password != *MONGODB_PASSWORD {
            Ok(false)
        } else {
            let b = base64::decode(&contents)?;
            let tag = serde_json::from_slice(&b)?;
            context.data::<Database>()?.update_form(tag).await?;
            Ok(true)
        }
    }

    #[graphql(visible = false)]
    async fn update_connection(
        &self,
        context: &Context<'_>,
        #[graphql(secret)] password: String,
        // Data encoded as JSON for now.
        // FIXME Use real input objects.
        contents: String,
    ) -> FieldResult<bool> {
        if password != *MONGODB_PASSWORD {
            Ok(false)
        } else {
            let b = base64::decode(&contents)?;
            let tag = serde_json::from_slice(&b)?;
            context.data::<Database>()?.update_connection(tag).await?;
            Ok(true)
        }
    }

    #[graphql(visible = false)]
    async fn update_person(
        &self,
        context: &Context<'_>,
        #[graphql(secret)] password: String,
        // Data encoded as JSON for now.
        // FIXME Use real input objects.
        contents: String,
    ) -> FieldResult<bool> {
        if password != *MONGODB_PASSWORD {
            Ok(false)
        } else {
            let b = base64::decode(&contents)?;
            let tag = serde_json::from_slice(&b)?;
            context.data::<Database>()?.update_person(tag).await?;
            Ok(true)
        }
    }

    #[graphql(visible = false)]
    async fn update_image_source(
        &self,
        context: &Context<'_>,
        #[graphql(secret)] password: String,
        // Data encoded as JSON for now.
        // FIXME Use real input objects.
        contents: String,
    ) -> FieldResult<bool> {
        if password != *MONGODB_PASSWORD {
            Ok(false)
        } else {
            let b = base64::decode(&contents)?;
            let tag = serde_json::from_slice(&b)?;
            context.data::<Database>()?.update_image_source(tag).await?;
            Ok(true)
        }
    }

    #[graphql(guard(GroupGuard(group = "UserGroup::Editor")))]
    async fn update_page(
        &self,
        context: &Context<'_>,
        // Data encoded as JSON for now.
        data: async_graphql::Json<dailp::page::Page>,
    ) -> FieldResult<bool> {
        context.data::<Database>()?.pages().update(data.0).await?;
        Ok(true)
    }

    #[graphql(guard(GroupGuard(group = "UserGroup::Editor")))]
    async fn update_annotation(
        &self,
        context: &Context<'_>,
        // Data encoded as JSON for now.
        data: async_graphql::Json<dailp::annotation::Annotation>,
    ) -> FieldResult<bool> {
        context
            .data::<Database>()?
            .annotations()
            .update(data.0)
            .await?;
        Ok(true)
    }

    #[graphql(visible = false)]
    async fn clear_database(
        &self,
        context: &Context<'_>,
        #[graphql(secret)] password: String,
    ) -> FieldResult<bool> {
        if password != *MONGODB_PASSWORD {
            Ok(false)
        } else {
            context.data::<Database>()?.clear_all().await?;
            Ok(true)
        }
    }
}

#[derive(async_graphql::SimpleObject)]
struct FormsInTime {
    start: Option<dailp::Date>,
    end: Option<dailp::Date>,
    forms: Vec<dailp::AnnotatedForm>,
}

#[derive(Deserialize, Debug, async_graphql::SimpleObject)]
struct UserInfo {
    email: String,
    #[serde(
        rename = "cognito:groups",
        with = "StringWithSeparator::<CommaSeparator>"
    )]
    groups: Vec<UserGroup>,
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
