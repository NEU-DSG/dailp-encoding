mod query;

use {
    crate::query::UserInfo,
    dailp::async_graphql::{
        dataloader::DataLoader,
        http::{playground_source, GraphQLPlaygroundConfig},
        EmptySubscription, Schema,
    },
    tide::{
        http::headers::HeaderValue,
        http::mime,
        security::{CorsMiddleware, Origin},
        Body, Response, StatusCode,
    },
};

#[tokio::main]
async fn main() -> tide::Result<()> {
    dotenv::dotenv().ok();
    pretty_env_logger::init();
    let mut app = tide::new();

    // create schema
    let schema = Schema::build(query::Query, query::Mutation, EmptySubscription)
        .data(DataLoader::new(
            dailp::Database::connect(None).await?,
            tokio::spawn,
        ))
        .finish();

    let authed_schema = Schema::build(query::Query, query::Mutation, EmptySubscription)
        .data(DataLoader::new(
            dailp::Database::connect(None).await?,
            tokio::spawn,
        ))
        .data(UserInfo::new_test_admin())
        .finish();

    let cors = CorsMiddleware::new()
        .allow_methods("GET, POST, OPTIONS".parse::<HeaderValue>().unwrap())
        .allow_origin(Origin::from("*"))
        .allow_credentials(true);

    app.with(cors);

    // add tide endpoint
    app.at("/graphql").post(async_graphql_tide::graphql(schema));
    app.at("/graphql-edit")
        .post(async_graphql_tide::graphql(authed_schema));

    // enable graphql playground
    app.at("/graphql").get(|_| async move {
        Ok(Response::builder(StatusCode::Ok)
            .body(Body::from_string(playground_source(
                // note that the playground needs to know
                // the path to the graphql endpoint
                GraphQLPlaygroundConfig::new("/graphql"),
            )))
            .content_type(mime::HTML)
            .build())
    });
    app.at("/graphql-edit").get(|_| async move {
        Ok(Response::builder(StatusCode::Ok)
            .body(Body::from_string(playground_source(
                // note that the playground needs to know
                // the path to the graphql endpoint
                GraphQLPlaygroundConfig::new("/graphql-edit"),
            )))
            .content_type(mime::HTML)
            .build())
    });

    Ok(app.listen("127.0.0.1:8080").await?)
}
