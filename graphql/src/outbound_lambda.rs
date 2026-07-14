use serde::{Deserialize, Serialize};
use {
    dailp_graphql::service_integrations::turnstile::{validate_token, OutboundRequest},
    lambda_http::lambda_runtime::{run, service_fn, LambdaEvent},
    log::info,
    serde_json::Value,
};

type Error = Box<dyn std::error::Error + Sync + Send + 'static>;

#[tokio::main]
async fn main() -> Result<(), Error> {
    pretty_env_logger::init();
    run(service_fn(handler)).await?;
    Ok(())
}

/// Calls external services from outside our VPC
async fn handler(event: LambdaEvent<Value>) -> Result<bool, Error> {
    let payload = event.payload;
    let request: OutboundRequest = serde_json::from_value(payload)?;
    let token = request.data;
    validate_token(token).await.map_err(Into::into)
}
