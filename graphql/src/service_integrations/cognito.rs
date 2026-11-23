use anyhow::Context;
use dailp::auth::{JWTUserInfo, UserInfo};
use jsonwebtoken::{jwk::JwkSet, Validation};
use lambda_http::tower::load;
use std::{env, fs::File, io::BufReader, path::PathBuf};

/// Load the set of keys that can be used to validate Cognito identity tokens
fn get_jwk_set() -> Result<JwkSet, serde_json::Error> {
    // this file is pulled from:
    // https://cognito-idp.<Region>.amazonaws.com/<userPoolId>/.well-known/jwks.json
    serde_json::from_str::<JwkSet>(include_str!("dailp_user_pool_jwks.json"))
}

/// Construct a jsonwebtoken valdiation scheme that is compliant with AWS JWT validation guidelines.
/// https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html
fn cognito_validation() -> Result<Validation, anyhow::Error> {
    let mut validation = Validation::new(jsonwebtoken::Algorithm::RS256);
    validation.set_audience(&[std::env::var("DAILP_USER_POOL_CLIENT")?]); // app client ID
    validation.set_issuer(&[format!(
        "https://cognito-idp.{}.amazonaws.com/{}",
        std::env::var("DAILP_AWS_REGION")?,
        std::env::var("DAILP_USER_POOL")?
    )]);
    Ok(validation)
}

fn load_local_jwk_set() -> anyhow::Result<JwkSet> {
    let path = PathBuf::from(
        env::var_os("DAILP_COGNITO_JWKS_PATH")
            .context("DAILP_COGNITO_JWKS_PATH must be set when TF_STAGE is local")?,
    );

    let file = File::open(&path)
        .with_context(|| format!("failed to open Cognito JWKS at {}", path.display()))?;

    serde_json::from_reader(BufReader::new(file))
        .with_context(|| format!("failed to parse Cognito JWKS at {}", path.display()))
}

const BEARER: &str = "Bearer ";
pub fn user_info_from_authorization(auth: &str) -> Result<UserInfo, anyhow::Error> {
    let token = auth.trim_start_matches(BEARER);
    let header = jsonwebtoken::decode_header(token)?;

    let (key_set, validation) = if matches!(std::env::var("TF_STAGE").as_deref(), Ok("local")) {
        let key_set = load_local_jwk_set()?;

        let pool = std::env::var("DAILP_USER_POOL")
            .with_context(|| "DAILP_USER_POOL must be set when TF_STAGE is local")?;

        let issuer_base = std::env::var("DAILP_COGNITO_ISSUER_BASE")
            .with_context(|| "DAILP_COGNITO_ISSUER_BASE must be set when TF_STAGE is local")?;

        let client_pool = std::env::var("DAILP_USER_POOL_CLIENT")
            .with_context(|| "DAILP_USER_POOL_CLIENT must be set when TF_STAGE is local")?;

        let mut validation = Validation::new(jsonwebtoken::Algorithm::RS256);
        validation.set_issuer(&[format!("{issuer_base}/{pool}")]);
        validation.set_audience(&[client_pool]);
        validation.set_required_spec_claims(&["exp", "iss", "aud", "sub"]);
        (key_set, validation)
    } else {
        (get_jwk_set()?, cognito_validation()?)
    };

    match header.kid.and_then(|token_kid| key_set.find(&token_kid)) {
        Some(key) => {
            let decoded = jsonwebtoken::decode::<JWTUserInfo>(
                token,
                &jsonwebtoken::DecodingKey::from_jwk(key)?,
                &validation,
            )?;
            Ok(decoded.claims.0)
        }
        _ => Err(anyhow::format_err!(
            "No matching validation key found for JWT"
        )),
    }
}
