use crate::email;
use dailp::auth::{
    AuthResponse, DailpJWT, LoginInput, MessageResponse, RefreshTokenInput, RefreshTokenResponse,
    RequestPasswordResetInput, ResetPasswordInput, SignupInput, UserInfo,
};
use dailp::Database;
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

fn require_dailp_mode(error_label: &str) -> anyhow::Result<()> {
    if std::env::var("AUTH_MODE").unwrap_or_else(|_| "cognito".to_string()) != "dailp" {
        return Err(anyhow::anyhow!(
            "{} is only available in DAILP authentication mode",
            error_label
        ));
    }
    Ok(())
}

pub async fn signup(db: &Database, input: SignupInput) -> anyhow::Result<MessageResponse> {
    require_dailp_mode("Signup")?;

    let generic_message = MessageResponse {
        message: "If the email is available, an account has been created and a 6-digit verification code has been sent to it.".to_string(),
    };

    // create_user returns Ok(None) when the email is already registered.
    // Treat that case the same as success to avoid leaking which emails
    // have accounts. Other errors are logged server-side and also folded
    // into the generic response.
    let user_id = match db.create_user(input.email.clone(), input.password).await {
        Ok(Some(id)) => id,
        Ok(None) => {
            log::info!("signup: email already registered");
            return Ok(generic_message);
        }
        Err(e) => {
            log::error!("signup: failed to create user: {}", e);
            return Ok(generic_message);
        }
    };

    let verification_code = match db.create_email_verification_token(user_id).await {
        Ok(code) => code,
        Err(e) => {
            log::error!(
                "signup: failed to create verification token for user {}: {}",
                user_id,
                e
            );
            return Ok(generic_message);
        }
    };

    if let Err(e) = email::send_verification_email(&input.email, &verification_code).await {
        log::error!("signup: failed to send verification email: {}", e);
    }

    Ok(generic_message)
}

pub async fn login(db: &Database, input: LoginInput) -> anyhow::Result<AuthResponse> {
    require_dailp_mode("Local user accounts")?;
    db.login(input.email, input.password).await
}

pub async fn refresh_token(
    db: &Database,
    input: RefreshTokenInput,
) -> anyhow::Result<RefreshTokenResponse> {
    require_dailp_mode("Local user accounts")?;
    db.refresh_access_token(input.refresh_token).await
}

pub async fn logout(db: &Database, refresh_token: String) -> anyhow::Result<bool> {
    require_dailp_mode("Local user accounts")?;
    let token_hash = Database::hash_token(&refresh_token);
    db.revoke_refresh_token(&token_hash).await?;
    Ok(true)
}

pub async fn request_password_reset(
    db: &Database,
    input: RequestPasswordResetInput,
) -> anyhow::Result<MessageResponse> {
    require_dailp_mode("Local user accounts")?;

    // All branches return the same response. Errors at any step are
    // logged server-side but never surface to the client, so the endpoint
    // cannot be used to enumerate accounts (whether by response content
    // or by error-vs-success differential).
    match db.get_user_by_email(&input.email).await {
        Ok(Some(user)) => match db.create_password_reset_token(user.id).await {
            Ok(reset_token) => {
                if let Err(e) = email::send_password_reset_email(&input.email, &reset_token).await {
                    log::error!(
                        "request_password_reset: failed to send email for user {}: {}",
                        user.id,
                        e
                    );
                }
            }
            Err(e) => log::error!(
                "request_password_reset: failed to create reset token for user {}: {}",
                user.id,
                e
            ),
        },
        Ok(None) => log::info!("request_password_reset: no account for submitted email"),
        Err(e) => log::error!("request_password_reset: user lookup failed: {}", e),
    }

    Ok(MessageResponse {
        message: "If an account with that email exists, a password reset link has been sent."
            .to_string(),
    })
}

pub async fn reset_password(
    db: &Database,
    input: ResetPasswordInput,
) -> anyhow::Result<MessageResponse> {
    require_dailp_mode("Password reset")?;

    let user_id = db
        .validate_and_use_password_reset_token(&input.token)
        .await?;
    db.update_user_password(user_id, input.new_password).await?;
    db.revoke_all_user_refresh_tokens(user_id).await?;

    Ok(MessageResponse {
        message: "Password reset successfully! You can now log in with your new password."
            .to_string(),
    })
}

pub async fn verify_email(db: &Database, token: String) -> anyhow::Result<MessageResponse> {
    require_dailp_mode("Email verification")?;
    let _user_id = db.validate_and_use_email_verification_token(&token).await?;
    Ok(MessageResponse {
        message: "Email verified successfully! You can now log in.".to_string(),
    })
}

pub async fn resend_verification_email(
    db: &Database,
    email_address: String,
) -> anyhow::Result<MessageResponse> {
    require_dailp_mode("Email verification")?;

    let generic_message = MessageResponse {
        message: "If an unverified account with that email exists, a new verification code has been sent.".to_string(),
    };

    // All branches return the same response so the endpoint cannot be
    // used to probe which emails are registered or already verified.
    match db.get_user_by_email(&email_address).await {
        Ok(Some(user)) if !user.email_verified => {
            match db.create_email_verification_token(user.id).await {
                Ok(verification_code) => {
                    if let Err(e) =
                        email::send_verification_email(&email_address, &verification_code).await
                    {
                        log::error!(
                            "resend_verification_email: send failed for user {}: {}",
                            user.id,
                            e
                        );
                    } else {
                        log::info!("Resent verification email to user {}", user.id);
                    }
                }
                Err(e) => log::error!(
                    "resend_verification_email: token creation failed for user {}: {}",
                    user.id,
                    e
                ),
            }
        }
        // Account exists but is already verified: the guard on the
        // arm above failed, so this arm catches the verified case.
        Ok(Some(_)) => log::info!("resend_verification_email: account already verified"),
        Ok(None) => log::info!("resend_verification_email: no account for submitted email"),
        Err(e) => log::error!("resend_verification_email: user lookup failed: {}", e),
    }

    Ok(generic_message)
}

pub async fn resend_password_reset(
    db: &Database,
    email_address: String,
) -> anyhow::Result<MessageResponse> {
    require_dailp_mode("Password reset")?;

    // All branches return the same response so the endpoint cannot be
    // used to enumerate accounts.
    match db.get_user_by_email(&email_address).await {
        Ok(Some(user)) => match db.create_password_reset_token(user.id).await {
            Ok(reset_code) => {
                if let Err(e) = email::send_password_reset_email(&email_address, &reset_code).await
                {
                    log::error!(
                        "resend_password_reset: send failed for user {}: {}",
                        user.id,
                        e
                    );
                } else {
                    log::info!("Resent password reset email to user {}", user.id);
                }
            }
            Err(e) => log::error!(
                "resend_password_reset: token creation failed for user {}: {}",
                user.id,
                e
            ),
        },
        Ok(None) => log::info!("resend_password_reset: no account for submitted email"),
        Err(e) => log::error!("resend_password_reset: user lookup failed: {}", e),
    }

    Ok(MessageResponse {
        message: "If an account with that email exists, a password reset email has been sent."
            .to_string(),
    })
}
