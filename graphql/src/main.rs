use async_graphql::{Context, EmptySubscription, FieldResult, Schema};
use dailp::{
    AnnotatedDoc, CherokeeOrthography, Database, MorphemeId, MorphemeReference, MorphemeTag,
    WordsInDocument,
};
use lambda_http::{http::header, lambda, IntoResponse, Request, Response};

type Error = Box<dyn std::error::Error + Sync + Send + 'static>;

lazy_static::lazy_static! {
    // Share database connection between executions.
    static ref DATABASE: dailp::Database = dailp::Database::new().unwrap();
    static ref MONGODB_PASSWORD: String = std::env::var("MONGODB_PASSWORD").unwrap();
}

/// Takes an HTTP request containing a GraphQL query,
/// processes it with our GraphQL schema, then returns a JSON response.
#[lambda::lambda(http)]
#[tokio::main]
async fn main(req: Request, _: lambda::Context) -> Result<impl IntoResponse, Error> {
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
        let schema = Schema::build(Query, Mutation, EmptySubscription)
            .data::<&dailp::Database>(&*DATABASE)
            .finish();
        let req: async_graphql::Request = serde_json::from_str(&req)?;
        let res = schema.execute(req).await;
        let result = serde_json::to_string(&res)?;
        let resp = Response::builder()
            .header(header::CONTENT_TYPE, "application/json")
            .header(header::ACCESS_CONTROL_ALLOW_ORIGIN, "*")
            .body(result)?;
        Ok(resp)
    } else {
        // TODO Make a custom error type for DAILP to cover this and ingestion errors.
        Err(Box::new(std::fmt::Error))
    }
}

use mongodb::bson;

/// Home for all read-only queries
struct Query;

#[async_graphql::Object]
impl Query {
    /// List of all the functional morpheme tags available
    async fn all_tags(&self, context: &Context<'_>) -> FieldResult<Vec<MorphemeTag>> {
        Ok(context.data::<&Database>()?.all_tags().await?)
    }

    /// Listing of all documents excluding their contents by default
    async fn all_documents(
        &self,
        context: &Context<'_>,
        collection: Option<String>,
    ) -> FieldResult<Vec<AnnotatedDoc>> {
        Ok(context
            .data::<&Database>()?
            .all_documents(collection.as_ref().map(|x| &**x))
            .await?)
    }

    /// List of all the document collections available.
    async fn all_collections(
        &self,
        context: &Context<'_>,
    ) -> FieldResult<Vec<dailp::DocumentCollection>> {
        Ok(context.data::<&Database>()?.all_collections().await?)
    }

    /// Retrieves a full document from its unique identifier.
    pub async fn document(
        &self,
        context: &Context<'_>,
        id: String,
    ) -> FieldResult<Option<AnnotatedDoc>> {
        Ok(context.data::<&Database>()?.document(&id).await?)
    }

    async fn lexical_entry(
        &self,
        context: &Context<'_>,
        id: String,
    ) -> FieldResult<Option<dailp::AnnotatedForm>> {
        Ok(context.data::<&Database>()?.lexical_entry(&id).await?)
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
            .data::<&Database>()?
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
        Ok(context.data::<&Database>()?.words_by_doc(&id).await?)
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
            .data::<&Database>()?
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
            .data::<&Database>()?
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

    /// Search for words that include the given query at any position.
    async fn word_search(
        &self,
        context: &Context<'_>,
        query: String,
    ) -> FieldResult<Vec<dailp::AnnotatedForm>> {
        Ok(context.data::<&Database>()?.word_search(query).await?)
    }
}

struct Mutation;

#[async_graphql::Object]
impl Mutation {
    async fn update_tag(
        &self,
        context: &Context<'_>,
        password: String,
        // Data encoded as JSON for now.
        // FIXME Use real input objects.
        contents: String,
    ) -> FieldResult<bool> {
        if password != *MONGODB_PASSWORD {
            Ok(false)
        } else {
            let b = base64::decode(&contents)?;
            let tag = serde_json::from_slice(&b)?;
            context.data::<&Database>()?.update_tag(tag).await?;
            Ok(true)
        }
    }

    async fn update_document(
        &self,
        context: &Context<'_>,
        password: String,
        // Data encoded as JSON for now.
        // FIXME Use real input objects.
        contents: String,
    ) -> FieldResult<bool> {
        if password != *MONGODB_PASSWORD {
            Ok(false)
        } else {
            let b = base64::decode(&contents)?;
            let tag = serde_json::from_slice(&b)?;
            context.data::<&Database>()?.update_document(tag).await?;
            Ok(true)
        }
    }

    async fn update_form(
        &self,
        context: &Context<'_>,
        password: String,
        // Data encoded as JSON for now.
        // FIXME Use real input objects.
        contents: String,
    ) -> FieldResult<bool> {
        if password != *MONGODB_PASSWORD {
            Ok(false)
        } else {
            let b = base64::decode(&contents)?;
            let tag = serde_json::from_slice(&b)?;
            context.data::<&Database>()?.update_form(tag).await?;
            Ok(true)
        }
    }

    async fn update_connection(
        &self,
        context: &Context<'_>,
        password: String,
        // Data encoded as JSON for now.
        // FIXME Use real input objects.
        contents: String,
    ) -> FieldResult<bool> {
        if password != *MONGODB_PASSWORD {
            Ok(false)
        } else {
            let b = base64::decode(&contents)?;
            let tag = serde_json::from_slice(&b)?;
            context.data::<&Database>()?.update_connection(tag).await?;
            Ok(true)
        }
    }
}

#[derive(async_graphql::SimpleObject)]
struct FormsInTime {
    start: Option<dailp::DateTime>,
    end: Option<dailp::DateTime>,
    forms: Vec<dailp::AnnotatedForm>,
}
