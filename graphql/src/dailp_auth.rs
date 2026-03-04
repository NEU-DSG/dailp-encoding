use dailp::auth::{DailpJWT, UserInfo};
use jsonwebtoken::{decode, Algorithm, DecodingKey, Validation};

const BEARER: &str = "Bearer ";

pub fn user_info_from_authorization(auth: &str) -> Result<UserInfo, anyhow::Error> {
    let token = auth.trim_start_matches(BEARER);
    let secret =
        std::env::var("JWT_SECRET").map_err(|_| anyhow::anyhow!("JWT_SECRET not configured"))?;

    let mut validation = Validation::new(Algorithm::HS256);
    validation.validate_exp = true;

    let decoded = decode::<DailpJWT>(
        token,
        &DecodingKey::from_secret(secret.as_bytes()),
        &validation,
    )?;

    let user_info = UserInfo::from(decoded.claims);
    Ok(user_info)
}
