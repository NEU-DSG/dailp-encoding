#!/usr/bin/env bash
#
# Shared CloudFront/bucket-naming helpers used by more than one s3
# script. Extracted from upload_to_s3.sh and download_from_s3.sh, which
# previously carried near-identical inline CF_URL scheme-normalization
# and default-bucket-name logic.
#
# check_aws_installed used to live here too, but it was identical in
# shape to check_curl_installed/check_pg_dump_installed/
# check_psql_installed elsewhere in this project; it has moved to
# defensive_utils.sh's generic check_command_installed, and every call
# site now calls that directly instead. Neither remaining function here
# (default_media_bucket, normalize_cf_url) calls log_event, so this file
# no longer depends on logging utilities at all.

#######################################
# Derive the default media-storage S3 bucket name from $TF_STAGE, following
# the "dailp-${TF_STAGE}-media-storage" convention also used by
# website/src/utils/s3.ts. Shared by upload_to_s3.sh (deriving the
# destination bucket when -b/--bucket is omitted, gated on $CF_URL being
# set) and download_from_s3.sh (deriving the bucket to list against for
# -r/--recursive, independent of $CF_URL).
# Globals:
#   TF_STAGE   Deployment stage (e.g. dev/uat/prod). Optional, default
#              "dev".
# Arguments:
#   None
# Outputs:
#   Writes the derived bucket name to STDOUT (the function's actual return
#   value, meant to be captured via command substitution).
# Returns:
#   0 always.
#######################################
function default_media_bucket() {
  echo "dailp-${TF_STAGE:-dev}-media-storage"
}

#######################################
# Derive the default backup S3 bucket name from $TF_STAGE, following the
# "dailp-${TF_STAGE}-backups" convention established by
# terraform/backup-storage.nix.
#
# This is a different bucket from default_media_bucket, deliberately. Backups
# used to live under db-backups/ and xml-backups/ inside the media bucket, which
# is fronted by an unauthenticated CloudFront distribution -- so every dump was
# world-readable to anyone who guessed the key, and the key is only a UTC
# timestamp. The backup bucket has a full public access block and no
# distribution, which is why object_location refuses to report a CloudFront URL
# for it.
# Globals:
#   TF_STAGE   Deployment stage (e.g. dev/uat/prod). Optional, default "dev".
# Arguments:
#   None
# Outputs:
#   Writes the derived bucket name to STDOUT (the function's actual return
#   value, meant to be captured via command substitution).
# Returns:
#   0 always.
#######################################
function default_backup_bucket() {
  echo "dailp-${TF_STAGE:-dev}-backups"
}

#######################################
# Normalize a CloudFront (or other) base URL for use as a download/link
# URL: strips one trailing slash, then adds an "https://" scheme if the
# value doesn't already start with "http://" or "https://". Shared by
# upload_to_s3.sh (building the logged public URL for an uploaded object)
# and download_from_s3.sh (building the actual curl download target) --
# both need the exact same normalization of $CF_URL before appending a key.
# Globals:
#   None
# Arguments:
#   -u=URL | --url=URL   URL to normalize (e.g. $CF_URL). Required.
# Outputs:
#   Writes the normalized URL to STDOUT (the function's actual return
#   value, meant to be captured via command substitution).
# Returns:
#   0 always.
#######################################
function normalize_cf_url() {
  local url=""
  local i

  for i in "$@"; do
    case "$i" in
      -u=* | --url=*)
        url="${i#*=}"
        shift
        ;;
    esac
  done

  url="${url%/}"
  if [[ "${url}" != http://* && "${url}" != https://* ]]; then
    url="https://${url}"
  fi
  echo "${url}"
}

#######################################
# Percent-encode an S3 key for use as the path portion of a URL, leaving
# everything in RFC 3986's unreserved set (A-Za-z0-9-._~) alone.
#
# "/" is deliberately NOT encoded: it is the key's path separator, and
# encoding it as %2F would ask CloudFront for one flatly-named object
# rather than the key we mean.
#
# This exists because pg_dump_backup.sh names its output
# "dailp_$(date +%Y%m%d_%H%M%S%z).dump", and %z expands to a numeric UTC
# offset -- so every dump filename contains a literal "+". A "+" in a URL
# path is not the character "+", so the raw key produced a request that
# never resolved to the real object, and this bucket grants s3:ListBucket
# to no principal (see download_from_s3.sh), so S3 reported the miss as
# AccessDenied and CloudFront surfaced it as 403 Forbidden rather than
# 404 -- a lookup failure wearing a permissions failure's clothes.
#
# The loop runs under LC_ALL=C so it walks bytes rather than characters,
# which is what percent-encoding is defined over: a multi-byte character
# has to become one %XX per byte. Document names here carry Cherokee
# syllabary, so this is a live concern, not a theoretical one. The byte is
# masked to 0xFF because printf "%d" on a byte >= 0x80 can report it
# signed.
#
# Do NOT apply this to a presigned URL. A presigned URL arrives already
# percent-encoded, and its signature is computed over exactly those bytes, so
# encoding it again turns every "%" into "%25" and S3 rejects the request as
# SignatureDoesNotMatch. This function is for building a URL out of a bare key,
# which is the opposite situation.
# Globals:
#   None
# Arguments:
#   -k=KEY | --key=KEY   S3 key to encode, including any prefix. Required.
# Outputs:
#   Writes the encoded key to STDOUT (the function's actual return value,
#   meant to be captured via command substitution). A key that is already
#   URL-safe comes back byte for byte identical.
# Returns:
#   0 always.
#######################################
function url_encode_key() {
  local key=""
  local i

  for i in "$@"; do
    case "$i" in
      -k=* | --key=*)
        key="${i#*=}"
        shift
        ;;
    esac
  done

  # Saved and restored around the loop rather than left set, since callers
  # keep using their own locale afterwards. The ${LC_ALL+set} test tells
  # "was unset" apart from "was set to empty", which are different states
  # to put back.
  local had_lc_all="${LC_ALL+set}"
  local prev_lc_all="${LC_ALL-}"
  LC_ALL=C

  local encoded=""
  local char
  local index
  for ((index = 0; index < ${#key}; index++)); do
    char="${key:index:1}"
    case "${char}" in
      [A-Za-z0-9._~-] | /)
        encoded+="${char}"
        ;;
      *)
        printf -v char '%%%02X' "$(($(printf '%d' "'${char}") & 0xFF))"
        encoded+="${char}"
        ;;
    esac
  done

  if [[ -n "${had_lc_all}" ]]; then
    LC_ALL="${prev_lc_all}"
  else
    unset LC_ALL
  fi

  echo "${encoded}"
}

#######################################
# Renders the reportable location of an S3 object. What it returns depends on
# which bucket the object is in, because the two buckets are reachable in
# fundamentally different ways.
#
# --kind=media (the default) keeps the original behaviour: the public CloudFront
# URL when $CF_URL is set, and "s3://bucket/key" only as a fallback when it
# isn't. Media objects are served by an unauthenticated distribution, so the
# CloudFront URL is a link an operator can simply open.
#
# --kind=backup always returns "s3://bucket/key" and ignores $CF_URL entirely.
#
# That second case breaks an invariant this function used to hold and document:
# that no location this project reports is ever a bare "s3://" URI, on the
# grounds that such a URI isn't fetchable without credentials and isn't
# clickable in the Actions log viewer. For backups that is no longer a defect,
# it is the entire point. The backup bucket has a full public access block and
# no CloudFront origin precisely so that a leaked key is not a leaked backup, so
# there is no URL to report that would be both correct and openable. Reporting a
# CloudFront URL for a backup would be worse than useless: it would name a
# location that cannot work and imply the object is web-reachable.
#
# Retrieval of a backup therefore goes one of two ways, neither of which is a
# plain click:
#   - Restore automation on the bastion: download_from_s3.sh -b=BUCKET, which
#     reads the object under the instance role.
#   - A human: download_from_s3.sh --backup, which authenticates against Cognito
#     and gets a short-lived presigned URL.
# Globals:
#   CF_URL   CloudFront distribution domain, with or without a scheme. Read only
#            for --kind=media. Optional even then; when unset the s3:// form is
#            returned instead of nothing, since a location an operator has to
#            translate beats no location at all.
# Arguments:
#   -b=NAME | --bucket=NAME   Bucket the object lives in.
#   -k=KEY | --key=KEY        Full destination key, including any prefix.
#   -K=KIND | --kind=KIND     "media" (default) or "backup". Any other value is
#                             treated as media, matching this file's other
#                             argument parsers, which also ignore what they do
#                             not recognize.
# Outputs:
#   Writes the location to STDOUT (the function's actual return value, meant to be
#   captured via command substitution).
# Returns:
#   0 always.
#######################################
function object_location() {
  local bucket=""
  local key=""
  local kind="media"
  local i

  for i in "$@"; do
    case "$i" in
      -b=* | --bucket=*)
        bucket="${i#*=}"
        shift
        ;;
      -k=* | --key=*)
        key="${i#*=}"
        shift
        ;;
      -K=* | --kind=*)
        kind="${i#*=}"
        shift
        ;;
    esac
  done

  # Checked before $CF_URL so that a backup location is never a CloudFront URL,
  # even in an environment where CF_URL happens to be exported -- which is the
  # normal case in the backup workflow, since the XML bundler still needs it for
  # media links.
  if [[ "${kind}" == "backup" ]]; then
    echo "s3://${bucket}/${key}"
    return 0
  fi

  # Only the CloudFront form is encoded. The s3:// form is read by the AWS
  # CLI, which takes keys literally -- percent-encoding it there would turn
  # a working URI into a request for an object whose name contains "%2B".
  if [[ -n "${CF_URL:-}" ]]; then
    echo "$(normalize_cf_url --url="${CF_URL}")/$(url_encode_key --key="${key}")"
  else
    echo "s3://${bucket}/${key}"
  fi
}
