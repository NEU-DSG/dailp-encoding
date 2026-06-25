
use log::{debug, info};
use reqwest::{header, Client};

pub async fn validate_token(token: String) -> Result<bool, anyhow::Error> {
    const TURNSTILE_API: &str = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
    let secret = std::env::var("TURNSTILE_SECRET_KEY").unwrap();
    let params = [("secret", secret), ("response", token)];
    let client = Client::new();

    info!("Sending POST to SiteVerify API");
    debug!("Payload: {:?}", params);

    let response = client
        .post(TURNSTILE_API)
        .header(header::ACCESS_CONTROL_ALLOW_ORIGIN, "*")
        .form(&params)
        .send()
        .await?;

        info!("Response recieved from SiteVerify API");
        debug!("Status Code: {}", response.status());

        let body = response.text().await?;
        debug!("Body Content: {}", body);
        let body_json = serde_json::from_str::<serde_json::Value>(&body)?;

        Ok(body_json["success"].as_bool().unwrap())
}
