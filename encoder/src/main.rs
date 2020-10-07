use async_graphql::http::{GQLRequest, GQLResponse};
use async_graphql::{EmptyMutation, EmptySubscription, IntoQueryBuilder, Schema};
use async_once::AsyncOnce;
use dailp::structured::{self, Database};
use lambda_http::{
    http::header::CONTENT_TYPE,
    lambda::{lambda, Context},
    IntoResponse, Request, Response,
};
use lazy_static::lazy_static;

type Error = Box<dyn std::error::Error + Sync + Send + 'static>;

lazy_static! {
    // Share database connection between executions.
    static ref CTX: AsyncOnce<Database> = AsyncOnce::new(async { Database::new().await.unwrap() });
    static ref SCHEMA: Schema<structured::Query, EmptyMutation, EmptySubscription> = Schema::new(structured::Query, EmptyMutation, EmptySubscription);
}

/// Takes an HTTP request containing a GraphQL query,
/// processes it with our GraphQL schema, then returns a JSON response.
#[lambda(http)]
#[tokio::main]
async fn main(req: Request, _: Context) -> Result<impl IntoResponse, Error> {
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
    } else {
        todo!()
    }
}
