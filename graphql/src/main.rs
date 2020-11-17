use async_graphql::{Context, EmptyMutation, EmptySubscription, FieldResult, Schema};
use async_once::AsyncOnce;
use dailp::{AnnotatedDoc, Database, MorphemeId, MorphemeReference, MorphemeTag, WordsInDocument};
use lambda_http::{http::header, lambda, IntoResponse, Request, Response};

type Error = Box<dyn std::error::Error + Sync + Send + 'static>;

lazy_static::lazy_static! {
    // Share database connection between executions.
    static ref DATABASE: AsyncOnce<dailp::Database> = AsyncOnce::new(async {
        dailp::Database::new().await.unwrap()
    });
}

/// Takes an HTTP request containing a GraphQL query,
/// processes it with our GraphQL schema, then returns a JSON response.
#[lambda::lambda(http)]
#[tokio::main]
async fn main(req: Request, _: lambda::Context) -> Result<impl IntoResponse, Error> {
    if let lambda_http::Body::Text(req) = req.into_body() {
        let schema = Schema::build(Query, EmptyMutation, EmptySubscription)
            .data(DATABASE.get().await)
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
        todo!("Failed to parse lambda request.")
    }
}

use mongodb::bson;

/// Home for all read-only queries
struct Query;

#[async_graphql::Object(cache_control(max_age = 60))]
impl Query {
    /// Listing of all documents excluding their contents by default
    async fn all_documents(
        &self,
        context: &Context<'_>,
        collection: Option<String>,
    ) -> FieldResult<Vec<AnnotatedDoc>> {
        Ok(context
            .data::<Database>()?
            .all_documents(collection.as_ref().map(|x| &**x))
            .await?)
    }

    /// List of all the document collections available.
    async fn all_collections(
        &self,
        context: &Context<'_>,
    ) -> FieldResult<Vec<dailp::DocumentCollection>> {
        Ok(context.data::<Database>()?.all_collections().await?)
    }

    /// Retrieves a full document from its unique identifier.
    pub async fn document(
        &self,
        context: &Context<'_>,
        id: String,
    ) -> FieldResult<Option<AnnotatedDoc>> {
        Ok(context.data::<Database>()?.document(&id).await?)
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
    ) -> FieldResult<Vec<MorphemeReference>> {
        Ok(context
            .data::<Database>()?
            .morphemes(&MorphemeId::parse(&gloss).unwrap())
            .await?)
    }

    /// Lists all words containing a morpheme with the given gloss.
    /// Groups these words by the document containing them.
    async fn morphemes_by_document(
        &self,
        context: &Context<'_>,
        document_id: String,
        gloss: String,
    ) -> FieldResult<Vec<WordsInDocument>> {
        let id = MorphemeId::new(document_id, None, gloss);
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
            .data::<Database>()?
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
        Ok(context.data::<Database>()?.word_search(query).await?)
    }
}

#[derive(async_graphql::SimpleObject)]
struct FormsInTime {
    start: Option<dailp::DateTime>,
    end: Option<dailp::DateTime>,
    forms: Vec<dailp::AnnotatedForm>,
}
