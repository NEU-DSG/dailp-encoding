use async_graphql::{
    http::{GQLRequest, GQLResponse},
    Context, EmptyMutation, EmptySubscription, FieldResult, IntoQueryBuilder, Schema,
};
use dailp::{AnnotatedDoc, Database, MorphemeReference, MorphemeTag, WordsInDocument};
use lambda_http::{http::header::CONTENT_TYPE, lambda, IntoResponse, Request, Response};

type Error = Box<dyn std::error::Error + Sync + Send + 'static>;

lazy_static::lazy_static! {
    // Share database connection between executions.
    static ref CTX: async_once::AsyncOnce<dailp::Database> = async_once::AsyncOnce::new(async {
        dailp::Database::new().await.unwrap()
    });
    static ref SCHEMA: Schema<Query, EmptyMutation, EmptySubscription> = Schema::new(Query, EmptyMutation, EmptySubscription);
}

/// Takes an HTTP request containing a GraphQL query,
/// processes it with our GraphQL schema, then returns a JSON response.
#[lambda::lambda(http)]
#[tokio::main]
async fn main(req: Request, _: lambda::Context) -> Result<impl IntoResponse, Error> {
    if let lambda_http::Body::Text(req) = req.into_body() {
        let req: GQLRequest = serde_json::from_str(&req)?;
        let builder = req.into_query_builder().await?.data(CTX.get().await);
        let res = GQLResponse(builder.execute(&SCHEMA).await);
        let result = serde_json::to_string(&res)?;
        let resp = Response::builder()
            .header(CONTENT_TYPE, "application/json")
            .header("Access-Control-Allow-Origin", "*")
            .body(result)?;
        Ok(resp)
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
        use tokio::stream::StreamExt;

        Ok(context
            .data::<Database>()?
            .client
            .collection("annotated-documents")
            .find(
                collection.map(|collection| {
                    bson::doc! { "collection": collection }
                }),
                mongodb::options::FindOptions::builder()
                    .projection(bson::doc! { "segments": 0, "translation": 0 })
                    .build(),
            )
            .await?
            .filter_map(|doc| bson::from_document(doc.unwrap()).ok())
            .collect()
            .await)
    }

    /// Retrieves a full document from its unique identifier.
    pub async fn document(
        &self,
        context: &Context<'_>,
        id: String,
    ) -> FieldResult<Option<AnnotatedDoc>> {
        Ok(context.data::<Database>()?.document(&id).await)
    }

    /// Lists all words containing a morpheme with the given gloss.
    /// Groups these words by the phonemic shape of the target morpheme.
    pub async fn morphemes_by_shape(
        &self,
        context: &Context<'_>,
        gloss: String,
    ) -> FieldResult<Vec<MorphemeReference>> {
        Ok(context.data::<Database>()?.morphemes(gloss).await?)
    }

    /// Lists all words containing a morpheme with the given gloss.
    /// Groups these words by the document containing them.
    async fn morphemes_by_document(
        &self,
        context: &Context<'_>,
        gloss: String,
    ) -> FieldResult<Vec<WordsInDocument>> {
        Ok(context.data::<Database>()?.words_by_doc(&gloss).await)
    }

    /// Retrieve information for the morpheme that corresponds to the given tag
    /// string. For example, "3PL.B" is the standard string referring to a 3rd
    /// person plural prefix.
    pub async fn morpheme_tag(
        &self,
        context: &Context<'_>,
        id: String,
    ) -> FieldResult<Option<MorphemeTag>> {
        Ok(context
            .data::<Database>()?
            .client
            .collection("tags")
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
}
