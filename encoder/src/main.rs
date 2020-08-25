mod annotation;
mod encode;
mod retrieve;
mod structured;
mod translation;

use async_graphql::http::{GQLRequest, GQLResponse};
use async_graphql::{EmptyMutation, EmptySubscription, IntoQueryBuilder, Schema};
use lambda_http::{
    http::header::CONTENT_TYPE,
    lambda::{lambda, Context},
    IntoResponse, Request, Response,
};
use retrieve::{DocumentMetadata, SemanticLine};
use serde_json::json;
use structured::{Database, Query};

pub const GOOGLE_API_KEY: &str = "AIzaSyBqqPrkht_OeYUSNkSf_sc6UzNaFhzOVNI";

type Error = Box<dyn std::error::Error + Sync + Send + 'static>;

#[lambda(http)]
#[tokio::main]
async fn main(req: Request, _: Context) -> Result<impl IntoResponse, Error> {
    if let lambda_http::Body::Text(req) = req.into_body() {
        let schema = Schema::new(structured::Query, EmptyMutation, EmptySubscription);
        let req: GQLRequest = serde_json::from_str(&req)?;
        let ctx = Database::new().await?;
        let builder = req.into_query_builder().await?.data(ctx);
        let res = GQLResponse(builder.execute(&schema).await);
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
