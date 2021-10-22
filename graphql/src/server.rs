mod query;
use {
    async_graphql::{
        dataloader::DataLoader,
        http::{playground_source, GraphQLPlaygroundConfig},
        EmptySubscription, Schema,
    },
    tide::{http::mime, Body, Response, StatusCode},
};

#[tokio::main]
async fn main() -> tide::Result<()> {
    dotenv::dotenv().ok();
    pretty_env_logger::init();
    let mut app = tide::new();

    // create schema
    let schema = Schema::build(query::Query, query::Mutation, EmptySubscription)
        .data(dailp::Database::new().unwrap())
        .data(DataLoader::new(dailp::Database::new().unwrap()))
        .finish();

    // add tide endpoint
    app.at("/graphql")
        .post(async_graphql_tide::endpoint(schema));

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

    Ok(app.listen("127.0.0.1:8080").await?)
}