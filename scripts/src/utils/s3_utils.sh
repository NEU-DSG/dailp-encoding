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
# Renders the reportable location of an S3 object: its public CloudFront URL when
# $CF_URL is set, and the "s3://bucket/key" URI only as a fallback when it isn't.
#
# Every location this project reports to a human -- a log line, a GitHub Actions run
# summary -- goes through here, so that none of them is a bare "s3://" URI. Those
# aren't fetchable without the AWS CLI and credentials, aren't clickable in the
# Actions log viewer, and name a bucket that grants s3:ListBucket to no principal
# (see the note in download_from_s3.sh), so an operator handed one has no way to act
# on it. The CloudFront URL is the form they can actually open.
# Globals:
#   CF_URL   CloudFront distribution domain, with or without a scheme. Optional; when
#            unset, the s3:// form is returned instead of nothing, since a location
#            an operator has to translate beats no location at all.
# Arguments:
#   -b=NAME | --bucket=NAME   Bucket the object lives in, for the fallback form.
#   -k=KEY | --key=KEY        Full destination key, including any prefix.
# Outputs:
#   Writes the location to STDOUT (the function's actual return value, meant to be
#   captured via command substitution).
# Returns:
#   0 always.
#######################################
function object_location() {
  local bucket=""
  local key=""
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
    esac
  done

  if [[ -n "${CF_URL:-}" ]]; then
    echo "$(normalize_cf_url --url="${CF_URL}")/${key}"
  else
    echo "s3://${bucket}/${key}"
  fi
}
