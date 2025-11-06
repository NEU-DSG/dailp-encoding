use anyhow::{Context, Result};
use lettre::{
    message::Message,
    transport::smtp::authentication::Credentials,
    SmtpTransport, Transport,
};
use std::env;

/// Base URL for the application (used to generate verification links)
fn get_base_url() -> String {
    env::var("DAILP_API_URL")
        .unwrap_or_else(|_| "http://localhost:3001".to_string())
}

/// Send email verification code to user
pub async fn send_verification_email(to_email: &str, token: &str) -> Result<()> {
    let from_email = env::var("SMTP_FROM")
        .context("SMTP_FROM not set in environment")?;
    let from_name = env::var("SMTP_FROM_NAME")
        .unwrap_or_else(|_| "DAILP".to_string());
    
    let subject = "Verify your DAILP account";
    let body = format!(
        "Welcome to DAILP!\n\n\
         Your verification code is: {}\n\n\
         Please enter this code on the confirmation page to verify your email address.\n\n\
         This code will expire in 24 hours.\n\n\
         If you didn't create a DAILP account, please ignore this email.\n\n\
         Thanks,\n\
         The DAILP Team",
        token
    );

    send_email(to_email, &from_email, &from_name, subject, &body).await
}

/// Send password reset code to user
pub async fn send_password_reset_email(to_email: &str, token: &str) -> Result<()> {
    let from_email = env::var("SMTP_FROM")
        .context("SMTP_FROM not set in environment")?;
    let from_name = env::var("SMTP_FROM_NAME")
        .unwrap_or_else(|_| "DAILP".to_string());
    
    let subject = "Reset your DAILP password";
    let body = format!(
        "Hello,\n\n\
         Someone requested a password reset for your DAILP account.\n\n\
         Your password reset code is: {}\n\n\
         If you didn't request this, please ignore this email. Your password won't change.\n\n\
         This code will expire in 1 hour.\n\n\
         Thanks,\n\
         The DAILP Team",
        token
    );

    send_email(to_email, &from_email, &from_name, subject, &body).await
}

/// Internal function to send email via SMTP
async fn send_email(
    to_email: &str,
    from_email: &str,
    from_name: &str,
    subject: &str,
    body: &str,
) -> Result<()> {
    // Build email message
    let email = Message::builder()
        .from(format!("{} <{}>", from_name, from_email).parse()?)
        .to(to_email.parse()?)
        .subject(subject)
        .body(body.to_string())?;

    // Get SMTP credentials from environment
    let smtp_username = env::var("SMTP_USERNAME")
        .context("SMTP_USERNAME not set in environment")?;
    let smtp_password = env::var("SMTP_PASSWORD")
        .context("SMTP_PASSWORD not set in environment")?;
    let smtp_host = env::var("SMTP_HOST")
        .unwrap_or_else(|_| "smtp.gmail.com".to_string());
    
    let creds = Credentials::new(smtp_username, smtp_password);

    // Connect to SMTP server and send email
    let mailer = SmtpTransport::relay(&smtp_host)?
        .credentials(creds)
        .build();

    mailer.send(&email)
        .context("Failed to send email")?;

    Ok(())
}