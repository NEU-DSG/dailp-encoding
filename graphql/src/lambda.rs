mod email;
mod query;

use {
    dailp::async_graphql::{self, dataloader::DataLoader, EmptySubscription, Schema},
    dailp::auth::{ApiGatewayUserInfo, UserInfo},
    lambda_http::{http::header, IntoResponse, Request, RequestExt, Response},
    log::info,
    query::*,
};

type Error = Box<dyn std::error::Error + Sync + Send + 'static>;

#[tokio::main]
async fn main() -> Result<(), Error> {
    pretty_env_logger::init();
    // Share database connection between executions.
    // This prevents each lambda invocation from creating a new connection to
    // the database.
    let connections = Some(16);
    let database = dailp::Database::connect(connections)?;
    let schema = {
        Schema::build(Query, Mutation, EmptySubscription)
            .data(DataLoader::new(
                dailp::Database::connect(connections)?,
                tokio::spawn,
            ))
            .finish()
    };
    let database = &database;
    let schema = &schema;
    lambda_http::run(lambda_http::service_fn(|req| {
        handler(req, database, schema)
    }))
    .await?;
    Ok(())
}

/// Takes an HTTP request containing a GraphQL query,
/// processes it with our GraphQL schema, then returns a JSON response.
async fn handler(
    req: Request,
    database: &dailp::Database,
    schema: &Schema<Query, Mutation, EmptySubscription>,
) -> Result<impl IntoResponse, Error> {
    info!("API Gateway Request: {:?}", req);

    // We have this nasty optional result type because we have three options
    // 1. The authorizer has no claims (None)
    // 2. The authorizer has valid claims (Some(Ok(UserInfo)))
    // 2. The authorizer has invalid claims (Some(Err(_)))
    let user: Option<Result<UserInfo, _>> = match req.request_context() {
        lambda_http::request::RequestContext::ApiGatewayV1(ctx) => {
            ctx.authorizer.get("claims").map(|claims| {
                serde_json::from_value::<ApiGatewayUserInfo>(claims.clone())
                    .map(|ApiGatewayUserInfo(user)| user)
            })
        }
        _ => None,
    };

    if let Some(Ok(user)) = user.as_ref() {
        database.upsert_dailp_user(user.id).await?;
    }

    if let Some(Err(err)) = user {
        info!("Failed to decode UserInfo from authorizer: {:?}", err);
        return Err(Box::new(err));
    }

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
            let req: async_graphql::Request = serde_json::from_str(&req)?;
            // If the request was made by an authenticated user, add their
            // information to the request data.
            let req = if let Some(Ok(user)) = user {
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
        let mut parts = full_path.split('/');
        let document_name = parts.nth(2).expect("No manifest ID given");
        let manifest = database.document_manifest(document_name, full_url).await?;
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
