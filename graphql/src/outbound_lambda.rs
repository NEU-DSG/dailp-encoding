use {
    crate::service_integrations::turnstile::validate_token, lambda_runtime::{Error, LambdaEvent, run, service_fn}, log::info, serde_json::Value
};

// Even though a dedicated struct for inputs is overkill for now,
// we expect more service integrations soon for our backup strategy
#[derive(Deserialize, Serialize)]
struct OutboundRequest {
    service: String,
    data: String
}

type Error = Box<dyn std::error::Error + Sync + Send + 'static>;

#[tokio::main]
async fn main() -> Result<(), Error> {
    pretty_env_logger::init();
    run(service_fn(handler))
    .await?;
    Ok(())
}

/// Calls external services from outside our VPC
async fn handler(
    event: LambdaEvent<Value>,
) -> Result<bool, Error> {
    let payload = event.payload;
    let request: OutboundRequest = serde_json::from_value(payload)?;
    let token = request.data;
    validate_token(token)
}
