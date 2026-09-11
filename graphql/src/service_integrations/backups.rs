//! Presigned S3 URLs for human downloads of database and XML backups.
//!
//! Backups live in a dedicated private bucket (`dailp-<stage>-backups`, see
//! `terraform/backup-storage.nix`) with a full public access block and no
//! CloudFront origin. There are exactly two ways to read from it:
//!
//!   - **Restore automation** reads directly with `aws s3 cp` under the bastion
//!     instance role. It needs nothing from this module.
//!   - **Humans** call the Cognito-authorized GraphQL fields in `query.rs`,
//!     which hand back a short-lived presigned URL produced here.
//!
//! Everything in this module is synchronous and makes **no network calls**.
//! SigV4 presigning is a local HMAC over a canonical request, which matters
//! because the GraphQL lambda runs inside the VPC (`terraform/functions.nix`)
//! and nothing in this repo asserts that its subnets have an egress path. A
//! presign that needed to reach `s3.amazonaws.com` would hang until the
//! function's 30s timeout.
//!
//! The URL is only *valid* if the signing principal can perform the action.
//! That grant is `allow_backup_lambda_reads` / `allow_backup_listing` on the
//! bucket policy, not an identity policy -- see the comments in
//! `terraform/backup-storage.nix` for why.

use aws_credential_types::Credentials;
// async_graphql is not a direct dependency of this crate; it reaches us
// re-exported through `dailp` (types/src/lib.rs), and the SimpleObject derive
// expands to paths rooted at `async_graphql`, so it has to be in scope by name.
use dailp::async_graphql;

use aws_sigv4::http_request::{
    sign, PercentEncodingMode, SignableBody, SignableRequest, SignatureLocation, SigningSettings,
    UriPathNormalizationMode,
};
use aws_sigv4::sign::v4;
use percent_encoding::{utf8_percent_encode, AsciiSet, NON_ALPHANUMERIC};
use std::time::{Duration, SystemTime};

/// Default lifetime for a presigned URL.
pub const DEFAULT_EXPIRY_SECS: u64 = 900;
/// Ceiling on the requested lifetime.
///
/// A presigned URL dies at whichever comes first: its own `X-Amz-Expires`, or
/// the expiry of the session token that signed it. A lambda's role session
/// lifetime is not discoverable from inside the function -- there is no API for
/// "how long do my credentials have left" -- so a long `expires_in` buys a URL
/// that merely *looks* long-lived and fails unpredictably. Short is the only
/// honest posture.
///
/// Note this does NOT limit how long a download may take. S3 checks expiry when
/// it authorizes the request, not throughout the response body, so a transfer
/// that starts at T+890s finishes fine however large the object is. What breaks
/// is a *resumed* or ranged download, because that re-issues requests: use a
/// single `curl` and re-mint on failure rather than `--continue-at`.
pub const MAX_EXPIRY_SECS: u64 = 3600;
/// Floor, to catch a caller passing 0 and getting an already-dead URL.
pub const MIN_EXPIRY_SECS: u64 = 60;

/// The only prefixes these fields will sign for.
///
/// This is belt and braces. The bucket policy's `s3:prefix` condition already
/// confines listing, and the lambda's `GetObject` grant is scoped to these two
/// prefixes, so a key outside them would fail at S3 anyway. Rejecting here
/// turns that into a legible error instead of an opaque `AccessDenied`, and
/// keeps a caller from using this as an oracle to probe the policy boundary.
pub const ALLOWED_PREFIXES: [&str; 2] = ["db-backups/", "xml-backups/"];

/// RFC 3986 unreserved characters, plus `/` which stays literal as the S3 key
/// separator. Used for the URL *path*.
///
/// Backup keys routinely contain characters that must be encoded: the run
/// timestamp carries `:` and, in the pg_dump filenames, `+` (from strftime
/// `%z`). Leaving `+` literal is what produced spurious 403s on the old
/// CloudFront path -- see the `url_encode_key` rationale in
/// `scripts/src/utils/s3_utils.sh`, which implements this same set in bash.
const PATH_ENCODE_SET: &AsciiSet = &NON_ALPHANUMERIC
    .remove(b'-')
    .remove(b'.')
    .remove(b'_')
    .remove(b'~')
    .remove(b'/');

/// RFC 3986 unreserved characters only. Used for query parameter names and
/// values, where `/` must become `%2F`.
///
/// This has to match SigV4's canonical query string encoding exactly, because
/// the signature is computed over the canonical form: if the URL we emit and
/// the canonical form disagree on a single byte, S3 recomputes a different
/// signature and rejects the request.
const QUERY_ENCODE_SET: &AsciiSet = &NON_ALPHANUMERIC
    .remove(b'-')
    .remove(b'.')
    .remove(b'_')
    .remove(b'~');

/// A presigned URL plus the metadata a caller needs to use it sensibly.
#[derive(async_graphql::SimpleObject, Debug, Clone, PartialEq, Eq)]
pub struct PresignedBackupUrl {
    /// The signed URL. Fetch it **verbatim** -- it is already percent-encoded,
    /// and re-encoding or unescaping any part of it invalidates the signature.
    pub url: String,
    /// The object key (for `backup_download_url`) or prefix (for
    /// `backup_listing_url`) the URL addresses, echoed back so a caller can log
    /// what it actually asked for.
    pub key: String,
    /// When the URL stops working, RFC 3339, UTC.
    pub expires_at: String,
    /// Lifetime actually granted, which may differ from what was requested
    /// only in that out-of-range requests are rejected rather than clamped.
    pub expires_in_seconds: i32,
}

/// Clamp-free validation of a requested lifetime.
///
/// Rejecting rather than silently clamping: a caller who asks for 24 hours and
/// receives 15 minutes without being told has been handed a URL that will die
/// long before they expect it to.
pub fn validate_expiry(requested: Option<i32>) -> anyhow::Result<u64> {
    let secs = match requested {
        None => return Ok(DEFAULT_EXPIRY_SECS),
        Some(n) if n < 0 => anyhow::bail!("expiresInSeconds must be positive, got {n}"),
        Some(n) => n as u64,
    };
    if secs < MIN_EXPIRY_SECS {
        anyhow::bail!(
            "expiresInSeconds must be at least {MIN_EXPIRY_SECS}, got {secs}; \
             a shorter URL is likely to expire before it can be used"
        );
    }
    if secs > MAX_EXPIRY_SECS {
        anyhow::bail!(
            "expiresInSeconds must be at most {MAX_EXPIRY_SECS}, got {secs}; \
             a presigned URL cannot outlive the signing session's credentials, \
             so longer lifetimes are not honoured by S3 even when requested"
        );
    }
    Ok(secs)
}

/// Rejects anything that is not plainly an object key under a backup prefix.
///
/// The `..` check matters because S3 does **not** normalize paths and this
/// signer has path normalization disabled to match: `db-backups/../foo` would
/// be signed and served as that literal key, so the guard has to be here rather
/// than relying on a canonicalization step that deliberately does not happen.
pub fn validate_key(key: &str) -> anyhow::Result<()> {
    if key.is_empty() {
        anyhow::bail!("key must not be empty");
    }
    if key.starts_with('/') {
        anyhow::bail!("key must not start with '/', got {key:?}");
    }
    if key.split('/').any(|segment| segment == "..") {
        anyhow::bail!("key must not contain a '..' path segment, got {key:?}");
    }
    if !ALLOWED_PREFIXES
        .iter()
        .any(|prefix| key.starts_with(prefix))
    {
        anyhow::bail!(
            "key must start with one of {:?}, got {key:?}",
            ALLOWED_PREFIXES
        );
    }
    Ok(())
}

/// Rejects a listing prefix that is not exactly one of the allowed prefixes.
///
/// Deliberately stricter than [`validate_key`]: the bucket policy's `s3:prefix`
/// condition permits `db-backups*` and `xml-backups*`, and an empty prefix is
/// denied outright, so anything else here would produce an `AccessDenied` from
/// S3 that looks like a bug rather than a rejected request.
pub fn validate_prefix(prefix: &str) -> anyhow::Result<()> {
    if ALLOWED_PREFIXES.contains(&prefix) {
        Ok(())
    } else {
        anyhow::bail!(
            "prefix must be exactly one of {:?}, got {prefix:?}",
            ALLOWED_PREFIXES
        )
    }
}

/// Reads the bucket name the backup workflow uploads to.
///
/// Set from terraform as `BACKUP_BUCKET` (see `terraform/main.nix`). Absent in
/// local development unless exported, hence the explicit error rather than
/// signing against an empty bucket name and getting an inscrutable failure.
pub fn backup_bucket() -> anyhow::Result<String> {
    match std::env::var("BACKUP_BUCKET") {
        Ok(bucket) if !bucket.trim().is_empty() => Ok(bucket),
        _ => anyhow::bail!(
            "BACKUP_BUCKET is not set; backup downloads are unavailable in this environment"
        ),
    }
}

fn aws_region() -> String {
    std::env::var("AWS_REGION")
        .or_else(|_| std::env::var("AWS_DEFAULT_REGION"))
        .unwrap_or_else(|_| "us-east-1".to_owned())
}

/// Builds credentials from the environment on **every call**, deliberately.
///
/// The lambda runtime rotates `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` /
/// `AWS_SESSION_TOKEN` in the execution environment before they expire. Caching
/// an `SdkConfig` or a `Credentials` in a `OnceCell`/`lazy_static` pins whatever
/// the first invocation in a warm container happened to see, and eventually
/// signs with a dead session token -- producing URLs that 403 with "The
/// provided token has expired", intermittently, only on warm containers, and
/// never in local testing. Re-reading is three env lookups; do not optimize it.
///
/// Reading the variables directly also guarantees no IMDS probe, which would
/// need network the lambda may not have.
fn credentials_from_env() -> anyhow::Result<Credentials> {
    let access_key = std::env::var("AWS_ACCESS_KEY_ID")
        .map_err(|_| anyhow::anyhow!("AWS_ACCESS_KEY_ID is not set"))?;
    let secret_key = std::env::var("AWS_SECRET_ACCESS_KEY")
        .map_err(|_| anyhow::anyhow!("AWS_SECRET_ACCESS_KEY is not set"))?;
    // Absent when running under long-lived IAM user keys locally; present in
    // lambda, where it is mandatory for the signature to be accepted.
    let session_token = std::env::var("AWS_SESSION_TOKEN").ok();

    Ok(Credentials::new(
        access_key,
        secret_key,
        session_token,
        None,
        "dailp-backup-presigner",
    ))
}

/// SigV4 settings for S3 specifically.
///
/// Two of these diverge from the defaults and both are required for S3; getting
/// either wrong yields `SignatureDoesNotMatch` only for keys containing
/// characters that expose the difference, which is a miserable way to find out.
///
///   - `PercentEncodingMode::Single`: S3 is the service that does *not*
///     double-encode the canonical URI path. The default is `Double`.
///   - `UriPathNormalizationMode::Disabled`: S3 treats keys as opaque byte
///     strings, so `a/./b` is a different object from `a/b` and must not be
///     collapsed. The default is `Enabled`.
fn s3_signing_settings(expires_in: Duration) -> SigningSettings {
    let mut settings = SigningSettings::default();
    settings.signature_location = SignatureLocation::QueryParams;
    settings.expires_in = Some(expires_in);
    settings.percent_encoding_mode = PercentEncodingMode::Single;
    settings.uri_path_normalization_mode = UriPathNormalizationMode::Disabled;
    settings
}

/// Appends signing parameters to a URL that already has a (possibly empty)
/// query string.
///
/// Encoded with [`QUERY_ENCODE_SET`] to match SigV4's canonical query string.
/// This matters for real values, not just in theory: `X-Amz-Credential`
/// contains `/` and `X-Amz-Security-Token` is base64 with `+`, `/` and `=`.
fn append_query_params(base: &str, params: &[(&str, std::borrow::Cow<'_, str>)]) -> String {
    let mut url = String::from(base);
    let mut separator = if base.contains('?') { '&' } else { '?' };
    for (name, value) in params {
        url.push(separator);
        url.push_str(&utf8_percent_encode(name, QUERY_ENCODE_SET).to_string());
        url.push('=');
        url.push_str(&utf8_percent_encode(value, QUERY_ENCODE_SET).to_string());
        separator = '&';
    }
    url
}

fn expires_at_rfc3339(signed_at: SystemTime, expires_in: Duration) -> String {
    let deadline = signed_at + expires_in;
    let secs = deadline
        .duration_since(SystemTime::UNIX_EPOCH)
        .map(|d| d.as_secs() as i64)
        .unwrap_or_default();
    dailp::chrono::DateTime::from_timestamp(secs, 0)
        .map(|dt| dt.to_rfc3339())
        .unwrap_or_default()
}

/// Signs `url` as a GET and returns the presigned form.
///
/// `SignableBody::UnsignedPayload` is what makes the canonical request use the
/// literal string `UNSIGNED-PAYLOAD` as its payload hash, which is what S3
/// expects for a presigned URL -- the signer cannot know the body of a request
/// someone else will make later.
fn presign_get(
    url: &str,
    reported_key: &str,
    expires_in: Duration,
) -> anyhow::Result<PresignedBackupUrl> {
    let credentials = credentials_from_env()?;
    let identity = credentials.into();
    let region = aws_region();
    let signed_at = SystemTime::now();

    let signing_params = v4::SigningParams::builder()
        .identity(&identity)
        .region(&region)
        .name("s3")
        .time(signed_at)
        .settings(s3_signing_settings(expires_in))
        .build()
        .map_err(|e| anyhow::anyhow!("could not build S3 signing params: {e}"))?
        .into();

    let signable_request = SignableRequest::new(
        "GET",
        url,
        std::iter::empty(),
        SignableBody::UnsignedPayload,
    )
    .map_err(|e| anyhow::anyhow!("could not build signable request: {e}"))?;

    let (instructions, _signature) = sign(signable_request, &signing_params)
        .map_err(|e| anyhow::anyhow!("could not sign backup URL: {e}"))?
        .into_parts();

    let (_headers, params) = instructions.into_parts();

    Ok(PresignedBackupUrl {
        url: append_query_params(url, &params),
        key: reported_key.to_owned(),
        expires_at: expires_at_rfc3339(signed_at, expires_in),
        expires_in_seconds: expires_in.as_secs() as i32,
    })
}

/// Presigns a GET for a single backup object.
pub fn presign_backup_object(
    bucket: &str,
    key: &str,
    expires_in_seconds: u64,
) -> anyhow::Result<PresignedBackupUrl> {
    validate_key(key)?;
    let url = format!(
        "https://{bucket}.s3.{region}.amazonaws.com/{key}",
        region = aws_region(),
        key = utf8_percent_encode(key, PATH_ENCODE_SET),
    );
    presign_get(&url, key, Duration::from_secs(expires_in_seconds))
}

/// Presigns a `ListObjectsV2` call scoped to one backup prefix.
///
/// The listing is presigned rather than performed here for the egress reason in
/// the module docs: `ListObjectsV2` is a real API call, so making it from the
/// lambda would depend on a NAT path this repo does not assert. Signing it
/// instead keeps the whole feature offline, and the caller -- who does have
/// internet -- fetches the XML.
///
/// The response is `ListBucketResult` XML. Callers must handle
/// `<IsTruncated>true</IsTruncated>`: one page caps at 1000 keys and
/// continuing requires a *fresh* presigned URL carrying `continuation-token`.
pub fn presign_backup_listing(
    bucket: &str,
    prefix: &str,
    expires_in_seconds: u64,
) -> anyhow::Result<PresignedBackupUrl> {
    validate_prefix(prefix)?;
    // list-type=2 selects ListObjectsV2. Both name and value are encoded with
    // the query set so the URL matches the canonical query string exactly.
    let url = format!(
        "https://{bucket}.s3.{region}.amazonaws.com/?list-type=2&prefix={prefix}",
        region = aws_region(),
        prefix = utf8_percent_encode(prefix, QUERY_ENCODE_SET),
    );
    presign_get(&url, prefix, Duration::from_secs(expires_in_seconds))
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Credentials for signing tests. Values are the ones from the AWS SigV4
    /// test suite, so they are unmistakably not real.
    fn with_test_credentials<T>(body: impl FnOnce() -> T) -> T {
        std::env::set_var("AWS_ACCESS_KEY_ID", "AKIDEXAMPLE");
        std::env::set_var(
            "AWS_SECRET_ACCESS_KEY",
            "wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY",
        );
        std::env::set_var("AWS_SESSION_TOKEN", "test/session+token==");
        std::env::set_var("AWS_REGION", "us-east-1");
        body()
    }

    #[test]
    fn validate_key_accepts_both_backup_prefixes() {
        assert!(validate_key("db-backups/2026-09-11T12:00:00Z/dailp.dump").is_ok());
        assert!(validate_key("xml-backups/dailp-20260911T120000.zip").is_ok());
        assert!(validate_key("db-backups/logs/run/output.log").is_ok());
    }

    #[test]
    fn validate_key_rejects_traversal_and_foreign_prefixes() {
        // Path normalization is disabled to match S3, so traversal has to be
        // rejected here or it would be signed and served literally.
        assert!(validate_key("db-backups/../user-uploaded-audio/x.mp3").is_err());
        assert!(validate_key("..").is_err());
        assert!(validate_key("/db-backups/x.dump").is_err());
        assert!(validate_key("").is_err());
        assert!(validate_key("user-uploaded-audio/x.mp3").is_err());
        // A prefix that merely starts with the same letters must not pass.
        assert!(validate_key("db-backupsX/x.dump").is_err());
    }

    #[test]
    fn validate_prefix_is_stricter_than_validate_key() {
        assert!(validate_prefix("db-backups/").is_ok());
        assert!(validate_prefix("xml-backups/").is_ok());
        // Denied by the bucket policy's s3:prefix condition, so reject early.
        assert!(validate_prefix("").is_err());
        assert!(validate_prefix("db-backups").is_err());
        assert!(validate_prefix("db-backups/2026/").is_err());
    }

    #[test]
    fn validate_expiry_defaults_and_bounds() {
        assert_eq!(validate_expiry(None).unwrap(), DEFAULT_EXPIRY_SECS);
        assert_eq!(validate_expiry(Some(60)).unwrap(), 60);
        assert_eq!(validate_expiry(Some(3600)).unwrap(), 3600);
        // Rejected, not clamped -- a caller must learn their request was refused.
        assert!(validate_expiry(Some(3601)).is_err());
        assert!(validate_expiry(Some(59)).is_err());
        assert!(validate_expiry(Some(0)).is_err());
        assert!(validate_expiry(Some(-1)).is_err());
    }

    #[test]
    fn presigned_object_url_has_the_required_sigv4_parameters() {
        let presigned = with_test_credentials(|| {
            presign_backup_object("dailp-dev-backups", "db-backups/run/dailp.dump", 900).unwrap()
        });

        assert!(presigned.url.starts_with(
            "https://dailp-dev-backups.s3.us-east-1.amazonaws.com/db-backups/run/dailp.dump?"
        ));
        assert!(presigned.url.contains("X-Amz-Algorithm=AWS4-HMAC-SHA256"));
        assert!(presigned.url.contains("X-Amz-Expires=900"));
        assert!(presigned.url.contains("X-Amz-SignedHeaders=host"));
        assert!(presigned.url.contains("X-Amz-Signature="));
        // Credential scope must name the s3 service and terminate correctly.
        assert!(presigned.url.contains("%2Fus-east-1%2Fs3%2Faws4_request"));
        assert_eq!(presigned.expires_in_seconds, 900);
        assert_eq!(presigned.key, "db-backups/run/dailp.dump");
    }

    #[test]
    fn session_token_is_included_and_percent_encoded() {
        let presigned = with_test_credentials(|| {
            presign_backup_object("dailp-dev-backups", "db-backups/run/dailp.dump", 900).unwrap()
        });
        // Temporary credentials are the only kind the lambda has, so a missing
        // token would make every URL 403.
        assert!(presigned.url.contains("X-Amz-Security-Token="));
        // The raw token contains '/', '+' and '='; none may appear unencoded.
        assert!(!presigned.url.contains("test/session+token=="));
        assert!(presigned.url.contains("test%2Fsession%2Btoken%3D%3D"));
    }

    #[test]
    fn object_keys_with_plus_and_colon_are_encoded_in_the_path() {
        // The shape pg_dump_backup.sh actually produces: strftime %z leaves a
        // '+' and the timestamp carries ':'. Leaving either literal is what
        // caused 403s on the old CloudFront path.
        let presigned = with_test_credentials(|| {
            presign_backup_object(
                "dailp-dev-backups",
                "db-backups/2026-09-11T12:00:00+00:00/dailp.dump",
                900,
            )
            .unwrap()
        });
        assert!(presigned.url.contains("2026-09-11T12%3A00%3A00%2B00%3A00"));
        assert!(!presigned.url.contains("12:00:00+00:00"));
        // Separators stay literal so the key still addresses the same object.
        assert!(presigned.url.contains("/db-backups/"));
    }

    #[test]
    fn presigned_listing_url_keeps_its_query_and_gets_signed() {
        let presigned = with_test_credentials(|| {
            presign_backup_listing("dailp-dev-backups", "db-backups/", 900).unwrap()
        });
        assert!(presigned.url.contains("list-type=2"));
        // '/' must be %2F in a query value, matching the canonical query string.
        assert!(presigned.url.contains("prefix=db-backups%2F"));
        assert!(presigned.url.contains("X-Amz-Signature="));
        // Signing params are appended to the existing query, not a second '?'.
        assert_eq!(presigned.url.matches('?').count(), 1);
        assert_eq!(presigned.key, "db-backups/");
    }

    #[test]
    fn signatures_differ_by_key_and_by_expiry() {
        let (a, b, c) = with_test_credentials(|| {
            (
                presign_backup_object("dailp-dev-backups", "db-backups/a.dump", 900).unwrap(),
                presign_backup_object("dailp-dev-backups", "db-backups/b.dump", 900).unwrap(),
                presign_backup_object("dailp-dev-backups", "db-backups/a.dump", 1800).unwrap(),
            )
        });
        assert_ne!(a.url, b.url);
        assert_ne!(a.url, c.url);
    }

    #[test]
    fn expires_at_is_rfc3339_and_in_the_future() {
        let now = SystemTime::now();
        let formatted = expires_at_rfc3339(now, Duration::from_secs(900));
        let parsed = dailp::chrono::DateTime::parse_from_rfc3339(&formatted)
            .expect("expires_at should be valid RFC 3339");
        let now_secs = now
            .duration_since(SystemTime::UNIX_EPOCH)
            .unwrap()
            .as_secs() as i64;
        assert!(parsed.timestamp() >= now_secs + 899);
    }

    #[test]
    fn append_query_params_picks_the_right_separator() {
        let params = [("X-Amz-Test", std::borrow::Cow::Borrowed("a/b"))];
        assert_eq!(
            append_query_params("https://example.com/key", &params),
            "https://example.com/key?X-Amz-Test=a%2Fb"
        );
        assert_eq!(
            append_query_params("https://example.com/?list-type=2", &params),
            "https://example.com/?list-type=2&X-Amz-Test=a%2Fb"
        );
    }
}
