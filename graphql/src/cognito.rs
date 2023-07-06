use crate::query::UserInfo;
use jsonwebtoken::{jwk::JwkSet, Validation};

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

const BEARER: &str = "Bearer ";
pub fn user_info_from_authorization(auth: &str) -> Result<UserInfo, anyhow::Error> {
    let token = auth.trim_start_matches(BEARER);
    let header = jsonwebtoken::decode_header(token)?;
    let key_set = get_jwk_set()?;

    match header.kid.and_then(|token_kid| key_set.find(&token_kid)) {
        Some(key) => {
            let decoded = jsonwebtoken::decode::<UserInfo>(
                token,
                &jsonwebtoken::DecodingKey::from_jwk(key)?,
                &cognito_validation()?,
            )?;
            Ok(decoded.claims)
        }
        _ => Err(anyhow::format_err!(
            "No matching validation key found for JWT"
        )),
    }
}
