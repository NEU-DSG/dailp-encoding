use log::error;

mod cognito;
mod query;

use {
    dailp::async_graphql::{
        dataloader::DataLoader,
        http::{playground_source, GraphQLPlaygroundConfig},
        EmptySubscription, Schema,
    },
    dailp::auth::UserInfo,
    tide::{
        http::headers::HeaderValue,
        http::mime,
        security::{CorsMiddleware, Origin},
        Body, Endpoint, Response, StatusCode,
    },
};

use dailp::async_graphql::extensions::ApolloTracing;

#[tokio::main]
async fn main() -> tide::Result<()> {
    dotenv::dotenv().ok();
    pretty_env_logger::init();
    let mut app = tide::new();

    // create schema
    let schema = Schema::build(query::Query, query::Mutation, EmptySubscription)
        .extension(ApolloTracing)
        .data(DataLoader::new(
            dailp::Database::connect(None)?,
            tokio::spawn,
        ))
        .finish();

    let authed_schema = Schema::build(query::Query, query::Mutation, EmptySubscription)
        .extension(ApolloTracing)
        .data(DataLoader::new(
            dailp::Database::connect(None)?,
            tokio::spawn,
        ))
        .finish();

    let cors = CorsMiddleware::new()
        .allow_methods("GET, POST, OPTIONS".parse::<HeaderValue>().unwrap())
        .allow_origin(Origin::from("*"))
        .allow_headers(
            "Authorization, content-type"
                .parse::<HeaderValue>()
                .unwrap(),
        )
        .allow_credentials(true);

    app.with(cors);

    // add tide endpoint
    app.at("/graphql").post(async_graphql_tide::graphql(schema));
    app.at("/graphql-edit").post(AuthedEndpoint::new(
        authed_schema,
        dailp::Database::connect(None)?,
    ));

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

struct AuthedEndpoint {
    schema: Schema<query::Query, query::Mutation, EmptySubscription>,
    database: dailp::Database,
}

impl AuthedEndpoint {
    fn new(
        schema: Schema<query::Query, query::Mutation, EmptySubscription>,
        database: dailp::Database,
    ) -> Self {
        Self { schema, database }
    }
}

#[async_trait::async_trait]
impl Endpoint<()> for AuthedEndpoint {
    async fn call(&self, req: tide::Request<()>) -> tide::Result {
        let authorization = req.header("Authorization");

        let user: Option<UserInfo> = authorization
            .and_then(|values| values.iter().next())
            .and_then(
                |value| match cognito::user_info_from_authorization(value.as_str()) {
                    Ok(value) => Some(value),
                    Err(err) => {
                        error!("{:?}", err);
                        None
                    }
                },
            );

        if let Some(user_id) = user.as_ref().map(|u| u.id) {
            self.database.upsert_dailp_user(user_id).await?;
        }

        let req = async_graphql_tide::receive_request(req).await?;
        let req = if let Some(user) = user {
            req.data(user)
        } else {
            req
        };

        let gql_resp = self.schema.execute(req).await;

        return async_graphql_tide::respond(gql_resp);
    }
}
