mod query;

use {
    dailp::async_graphql::{self, dataloader::DataLoader, EmptySubscription, Schema},
    lambda_http::{http::header, lambda_runtime, IntoResponse, Request, RequestExt, Response},
    log::info,
    query::*,
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
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    pretty_env_logger::init();
    lambda_runtime::run(lambda_http::handler(handler)).await?;
    Ok(())
}

/// Takes an HTTP request containing a GraphQL query,
/// processes it with our GraphQL schema, then returns a JSON response.
async fn handler(req: Request, _: lambda_runtime::Context) -> Result<impl IntoResponse, Error> {
    info!("API Gateway Request: {:?}", req);

    let user: Option<UserInfo> = match req.request_context() {
        lambda_http::request::RequestContext::ApiGatewayV2(ctx) => ctx
            .authorizer
            .get("claims")
            .and_then(|claims| serde_json::from_value(claims.clone()).ok()),
        lambda_http::request::RequestContext::ApiGateway(ctx) => ctx
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
        let full_path = req.uri().path();
        let mut parts = full_path.split("/");
        let document_id = parts.nth(2).expect("No manifest ID given");
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
