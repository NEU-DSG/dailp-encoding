#!/usr/bin/env bash
#
# download_from_s3.sh
#
# Downloads one or more objects -- or, with -r/--recursive, every object
# under a prefix -- from an S3 bucket to local files, preferring the public
# CloudFront distribution in front of it when available. Inverse of
# upload_to_s3.sh. Every success and failure along the way is recorded via
# log_utils.sh's create_logfile / log_event functions.
#
# Requirements:
#   - curl must be installed and on PATH for the default (CloudFront)
#     download path.
#   - aws (AWS CLI) must be installed and on PATH when -b/--bucket is used
#     to force the S3 (aws-cli) download path, and always for
#     -r/--recursive (listing objects under a prefix is only possible via
#     the AWS API since CloudFront has no listing capability, regardless of
#     credentials).
#   - log_utils.sh, s3_utils.sh, and defensive_utils.sh must be present
#     in ./utils/ next to this script.
#   - AWS credentials/region must already be available in the environment
#     when using the -b/--bucket or -r/--recursive paths (e.g.
#     AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY/AWS_SESSION_TOKEN,
#     AWS_DEFAULT_REGION). Note that this project's own Terraform
#     (terraform/media-storage.nix, terraform/user-roles.nix) never grants
#     s3:ListBucket to any principal, CloudFront or
#     Cognito-scoped user roles, only object-level GetObject/PutObject.
#     -r/--recursive therefore only works with separately-elevated AWS
#     credentials (e.g. an account admin's), not the app's own roles.
#     TODO This should be fixed in the future. 
#
# Usage (unix equals-separated style; named flags are alphabetized):
#   ./download_from_s3.sh [-b=BUCKET] [-l=LOG_LOCATION] [-o=OUTDIR] [-p=PREFIX] [-r] KEY [KEY ...]
#
# By default (no -b/--bucket given), $CF_URL must be set, and each key is
# fetched via curl from "${CF_URL}/${prefix:+${prefix%/}/}${key}" (an
# "https://" scheme is added only if $CF_URL doesn't already have one).
# This is the *preferred* path: the underlying S3 bucket is not itself
# publicly readable (see terraform/media-storage.nix's Origin Access
# Control bucket policy), only objects served through CloudFront are.
#
# Passing -b/--bucket explicitly overrides this and forces the object(s)
# to be fetched directly via "aws s3 cp s3://BUCKET/..." instead which could be
# useful for buckets that have no CloudFront distribution in front of them (e.g.
# a private/internal or staging bucket), where AWS credentials are
# available but there's no public CDN URL to fetch from.
#
# With -r/--recursive, no KEY arguments are given; instead every object
# under -p/--prefix (the whole bucket, if -p is omitted) is listed via
# "aws s3api list-objects-v2" and downloaded, still preferring curl/CF_URL
# for the actual transfer unless -b/--bucket forces the S3 path. Each
# object's key, relative to -p/--prefix, is preserved as nested folders
# under -o/--outdir (e.g. prefix "document-audio", key
# "document-audio/sub/word1.mp3" -> "${outdir}/sub/word1.mp3").
#
# Without -r/--recursive, each KEY is saved to
# "${outdir}/$(basename "${prefix:+${prefix%/}/}${key}")" -- flattened,
# regardless of any subdirectories in the key.
#
# In both modes, an existing file at the computed destination is treated
# as a per-key failure (not overwritten), mirroring file_utils.sh's
# create_file "File already exists!" behavior.
#
# Examples:
#   CF_URL=d123.cloudfront.net ./download_from_s3.sh document-audio/word1.mp3
#   CF_URL=d123.cloudfront.net ./download_from_s3.sh -o=./out -p=document-audio word1.mp3 word2.mp3
#   ./download_from_s3.sh -b=my-bucket -o=./out word1.mp3
#   CF_URL=d123.cloudfront.net ./download_from_s3.sh -o=./out -p=document-audio -r
#   ./download_from_s3.sh -b=my-bucket -o=./out -r
#
set -euo pipefail
# nounset (-u) is enabled: every variable in this file, and in the sourced
# log_utils.sh / file_utils.sh / s3_utils.sh / defensive_utils.sh, is
# either given an explicit default at declaration or is guaranteed to be
# assigned before it's ever read. See bash_standards.md, BASH-024.

# log_utils.sh (create_logfile, log_event) must live in ./utils/ next to
# this script. BASH_SOURCE (not $0) is used so this resolves correctly
# even if this script is sourced or invoked in an unusual way; see
# https://mywiki.wooledge.org/BashFAQ/028.
source "$(dirname "${BASH_SOURCE[0]}")/utils/log_utils.sh"
# s3_utils.sh (default_media_bucket, normalize_cf_url) is shared with
# upload_to_s3.sh.
source "$(dirname "${BASH_SOURCE[0]}")/utils/s3_utils.sh"
# defensive_utils.sh (check_command_installed, ensure_dir) is shared by
# every executable in this directory.
source "$(dirname "${BASH_SOURCE[0]}")/utils/defensive_utils.sh"

#######################################
# Top-level program flow: parse arguments, set up logging, resolve the
# download source (CloudFront vs. S3) and the set of (key, destination)
# pairs to download -- either the literal KEY arguments given, or (with
# -r/--recursive) everything discovered under -p/--prefix -- then downloads
# them all.
# Globals:
#   CF_URL     CloudFront distribution domain, with or without a scheme.
#              Required (unless -b/--bucket is given) and used to build
#              each key's download URL: "${CF_URL}/${key}".
#   TF_STAGE   Deployment stage (e.g. dev/uat/prod). Optional, default
#              "dev". Only consulted with -r/--recursive when -b/--bucket
#              is omitted, to derive a bucket name to list against (via
#              s3_utils.sh's default_media_bucket, the same convention
#              upload_to_s3.sh uses) -- listing always needs a real bucket
#              name, even though the resulting objects are still fetched
#              via CloudFront.
# Arguments:
#   $@: raw command-line arguments. See usage() for the full flag set.
# Outputs:
#   See the individual helper functions below.
# Returns:
#   Exits 1 if any key failed to download; otherwise returns 0.
#######################################
function main() {
  local bucket=""
  local log_location
  log_location="$(pwd)/logs/download_from_s3/"
  local outdir="."
  local prefix=""
  local recursive=0
  local -a raw_keys=()
  local arg

  for arg in "$@"; do
    case "${arg}" in
      --help)
        usage
        ;;
      -b=* | --bucket=*)
        bucket="${arg#*=}"
        ;;
      -l=* | --log-location=*)
        log_location="${arg#*=}"
        ;;
      -o=* | --outdir=*)
        outdir="${arg#*=}"
        ;;
      -p=* | --prefix=*)
        prefix="${arg#*=}"
        ;;
      -r | --recursive)
        recursive=1
        ;;
      -*)
        echo "Error: unknown option '${arg}'" >&2
        usage
        ;;
      *)
        raw_keys+=("${arg}")
        ;;
    esac
  done

  # RETURN (via usage, which exits 1): both of these are argument-shape
  # mistakes a caller can fix and re-run, not code bugs.
  if [[ "${recursive}" -eq 1 && "${#raw_keys[@]}" -gt 0 ]]; then
    echo "Error: KEY arguments are not used with -r/--recursive; specify the directory via -p/--prefix instead." >&2
    usage
  fi
  if [[ "${recursive}" -eq 0 && "${#raw_keys[@]}" -eq 0 ]]; then
    echo "Error: no S3 keys provided to download" >&2
    usage
  fi

  # Resolve the download source once, up front: -b/--bucket (if given)
  # always forces the direct S3/aws-cli path; otherwise $CF_URL is
  # required, and the (preferred) curl/CloudFront path is used.
  local source_mode
  if [[ -n "${bucket}" ]]; then
    source_mode="s3"
  elif [[ -n "${CF_URL:-}" ]]; then
    source_mode="cf"
  else
    echo "Error: -b/--bucket not provided and CF_URL not set; cannot determine download source." >&2
    usage
  fi

  # Listing (only needed for -r/--recursive) always goes through the AWS
  # API regardless of source_mode, so it always needs a real bucket name.
  # Derive one from TF_STAGE, the same way upload_to_s3.sh does, when the
  # caller didn't give one explicitly.
  local list_bucket="${bucket}"
  if [[ "${recursive}" -eq 1 && -z "${list_bucket}" ]]; then
    list_bucket="$(default_media_bucket)"
  fi

  ensure_dir --reference=log_location
  ensure_dir --reference=outdir

  local logfile=""
  create_logfile --location="${log_location}" --reference=logfile "download_from_s3"

  if [[ "${source_mode}" == "cf" ]]; then
    log_event -f="${logfile}" -m="Download source: CloudFront (CF_URL=${CF_URL})" -s="INFO"
  else
    log_event -f="${logfile}" -m="Download source: S3 bucket '${bucket}' (aws s3 cp)" -s="INFO"
  fi

  # aws is needed for listing (-r/--recursive, regardless of source_mode)
  # and/or for the S3 transfer path (source_mode=s3); curl is needed
  # whenever the transfer itself goes through CloudFront.
  if [[ "${recursive}" -eq 1 || "${source_mode}" == "s3" ]]; then
    check_command_installed --command=aws --install-hint="the AWS CLI" --logfile="${logfile}"
  fi
  if [[ "${source_mode}" == "cf" ]]; then
    check_command_installed --command=curl --logfile="${logfile}"
  fi

  # Build the (key, destination) pairs to download, as two parallel
  # arrays, either from the literal KEY arguments given (flattened to
  # outdir/basename) or with -r/--recursive, from every key discovered
  # under -p/--prefix (mirrored as nested folders under outdir).
  local -a target_keys=()
  local -a target_destinations=()
  local key
  local relative

  if [[ "${recursive}" -eq 1 ]]; then
    if [[ -z "${prefix}" ]]; then
      log_event -f="${logfile}" -m="No -p/--prefix given; listing every object in bucket '${list_bucket}'." -s="INFO"
    fi
    local -a discovered_keys=()
    list_s3_keys --bucket="${list_bucket}" --keys=discovered_keys --logfile="${logfile}" --prefix="${prefix}"

    for key in "${discovered_keys[@]}"; do
      relative="${key}"
      if [[ -n "${prefix}" ]]; then
        relative="${key#"${prefix%/}"/}"
      fi
      target_keys+=("${key}")
      target_destinations+=("${outdir}${relative}")
    done
  else
    for key in "${raw_keys[@]}"; do
      target_keys+=("${prefix:+${prefix%/}/}${key}")
      target_destinations+=("${outdir}$(basename "${prefix:+${prefix%/}/}${key}")")
    done
  fi

  local failure_count=0
  download_objects --bucket="${bucket}" --destinations=target_destinations --failures=failure_count \
    --logfile="${logfile}" --source="${source_mode}" "${target_keys[@]}"

  if [[ "${failure_count}" -gt 0 ]]; then
    log_event -e="${failure_count}" -f="${logfile}" \
      -m="Completed with ${failure_count} download failure(s). See ${logfile}" -s="ERROR"
    exit 1
  fi

  log_event -f="${logfile}" -m="All files downloaded successfully." -s="INFO"
}

#######################################
# Print usage information and exit.
# Globals:
#   None
# Arguments:
#   None
# Outputs:
#   Writes usage text to STDOUT; the calling
#   argument-parsing errors that invoke this write their own error first.
# Returns:
#   Always exits 1.
#######################################
function usage() {
  cat <<EOF
Usage: $0 [-b=BUCKET] [-l=LOG_LOCATION] [-o=OUTDIR] [-p=PREFIX] [-r] KEY [KEY ...]

  -b=BUCKET        Force downloading via "aws s3 cp" from this S3 bucket,
                   overriding the default CloudFront (\$CF_URL) path. If
                   omitted, requires \$CF_URL to be set.
  -l=LOG_LOCATION  Folder to save logs to (default: ./logs/download_from_s3/)
  -o=OUTDIR        Folder to save downloaded files to (default: .)
  -p=PREFIX        S3 key prefix/folder to download from (default: none).
                   With -r/--recursive, this is the directory to download;
                   without it, each KEY is downloaded from under this
                   prefix.
  -r, --recursive  Download every object under -p/--prefix (the whole
                   bucket, if -p is omitted) instead of specific KEY
                   arguments. Always requires aws (listing objects is not
                   possible via CloudFront); requires AWS credentials with
                   s3:ListBucket on the bucket, which this project's own
                   Terraform-managed roles are never granted -- see
                   "Requirements" at the top of this file.
  --help           Show this help

By default (no -b/--bucket), \$CF_URL must be set: each object is fetched
via curl from "https://\${CF_URL}/\${PREFIX}/\${KEY}" -- the underlying S3
bucket is not itself publicly readable. Requires curl on PATH.

Passing -b/--bucket instead fetches directly via "aws s3 cp
s3://BUCKET/...". Requires the AWS CLI's usual credential/region
environment variables to already be set (e.g. AWS_ACCESS_KEY_ID,
AWS_SECRET_ACCESS_KEY, AWS_DEFAULT_REGION).
EOF
  exit 1
}

#######################################
# List every object key under a bucket/prefix via
# "aws s3api list-objects-v2" and hand the results back to the caller.
# CloudFront cannot list objects under any circumstances (see the
# Requirements note at the top of this file), so this always goes through
# the AWS API, independent of the transfer source_mode used elsewhere in
# this script.
# Globals:
#   None
# Arguments:
#   -b=NAME | --bucket=NAME   Bucket to list. Required.
#   -k=NAME | --keys=NAME     Name of a caller-scope array variable to
#                               receive the discovered keys (bound via
#                               nameref, following the same --reference=
#                               convention log_utils.sh's create_logfile
#                               uses).
#   -l=PATH | --logfile=PATH  Logfile path.
#   -p=STR | --prefix=STR     Key prefix to list under (may be empty, to
#                               list the whole bucket).
# Outputs:
#   Logs an INFO event with the number of keys found, or an ERROR event on
#   failure.
# Returns:
#   0 on success (--keys receives the discovered keys, zero or more).
#   Exits 1 directly if the aws s3api call itself fails (e.g. missing
#   credentials, no s3:ListBucket permission, bucket doesn't exist) --
#   without a key list there is nothing left for the rest of the run to
#   do, so this is treated the same as check_command_installed's
#   "precondition for the whole run" failures.
#   Retryable once the underlying issue (credentials, permissions, bucket
#   name) is fixed.
#######################################
function list_s3_keys() {
  local bucket=""
  local -n keys_out
  local logfile=""
  local prefix=""
  local i

  for i in "$@"; do
    case "$i" in
      -b=* | --bucket=*)
        bucket="${i#*=}"
        shift
        ;;
      -k=* | --keys=*)
        keys_out="${i#*=}"
        shift
        ;;
      -l=* | --logfile=*)
        logfile="${i#*=}"
        shift
        ;;
      -p=* | --prefix=*)
        prefix="${i#*=}"
        shift
        ;;
    esac
  done

  local -a list_args=(s3api list-objects-v2 --bucket "${bucket}" --output text --query "Contents[].Key")
  if [[ -n "${prefix}" ]]; then
    list_args+=(--prefix "${prefix}")
  fi

  local raw_output
  if ! raw_output="$(aws "${list_args[@]}" 2>&1)"; then
    log_event -e="1" -f="${logfile}" \
      -m="Failed to list objects under s3://${bucket}/${prefix}: ${raw_output}" -s="ERROR"
    exit 1
  fi

  # NOTE: named "_listed_keys", not e.g. "found_keys" -- deliberately
  # distinct from any plausible name a caller might pass via --keys=, so
  # the nameref above can never accidentally resolve to this local instead
  # of the caller's variable (see BASH-022, and download_objects'
  # equivalent "_download_failure_count" note below).
  local -a _listed_keys=()
  # An empty/no-match result renders as the literal text "None" (aws
  # cli's --output text for a null query result), not an empty string.
  if [[ -n "${raw_output}" && "${raw_output}" != "None" ]]; then
    while IFS= read -r line; do
      [[ -n "${line}" ]] && _listed_keys+=("${line}")
    done <<< "${raw_output}"
  fi

  log_event -f="${logfile}" -m="Found ${#_listed_keys[@]} object(s) under s3://${bucket}/${prefix}." -s="INFO"
  keys_out=("${_listed_keys[@]}")
  return 0
}

#######################################
# Download a single S3 object to an exact local destination path, via curl
# (CloudFront) or aws s3 cp (S3), refusing to overwrite an existing
# destination. Shared by download_objects, for both flattened (literal
# KEY) and structure-preserving (-r/--recursive) destinations.
# Globals:
#   CF_URL   CloudFront distribution domain, with or without a scheme.
#            Read only when --source=cf; used to build the object's
#            download URL.
# Arguments:
#   -b=NAME | --bucket=NAME       Source S3 bucket. Only used when
#                                   --source=s3.
#   -d=PATH | --destination=PATH  Exact local file path to write to.
#   -k=KEY | --key=KEY            Full S3 object key (already includes any
#                                   prefix).
#   -l=PATH | --logfile=PATH      Logfile path.
#   -s=cf|s3 | --source=cf|s3     Which transport to use: "cf" for
#                                   curl-against-CF_URL, "s3" for
#                                   aws-s3-cp-against-bucket.
# Outputs:
#   Logs an INFO/ERROR event for this object.
# Returns:
#   0 on success. 1 on any failure (destination already exists, missing
#   source object, transport failure) -- always a per-object recoverable
#   outcome reported back to the caller, never exits.
#######################################
function download_one_object() {
  local bucket=""
  local destination=""
  local key=""
  local logfile=""
  local source_mode=""
  local i

  for i in "$@"; do
    case "$i" in
      -b=* | --bucket=*)
        bucket="${i#*=}"
        shift
        ;;
      -d=* | --destination=*)
        destination="${i#*=}"
        shift
        ;;
      -k=* | --key=*)
        key="${i#*=}"
        shift
        ;;
      -l=* | --logfile=*)
        logfile="${i#*=}"
        shift
        ;;
      -s=* | --source=*)
        source_mode="${i#*=}"
        shift
        ;;
    esac
  done

  if [[ -e "${destination}" ]]; then
    log_event -e="1" -f="${logfile}" \
      -m="Skipping '${key}': destination '${destination}' already exists." -s="ERROR"
    return 1
  fi

  mkdir -p "$(dirname "${destination}")"

  local url
  if [[ "${source_mode}" == "cf" ]]; then
    url="$(normalize_cf_url --url="${CF_URL}")/${key}"

    if curl --fail --location --show-error --silent --output "${destination}" "${url}"; then
      log_event -f="${logfile}" -m="Downloaded ${url} -> ${destination}" -s="INFO"
      return 0
    fi
    rm -f "${destination}"
    log_event -e="1" -f="${logfile}" -m="Failed to download ${url} -> ${destination}" -s="ERROR"
    return 1
  fi

  if aws s3 cp "s3://${bucket}/${key}" "${destination}" >/dev/null; then
    log_event -f="${logfile}" -m="Downloaded s3://${bucket}/${key} -> ${destination}" -s="INFO"
    return 0
  fi
  log_event -e="1" -f="${logfile}" -m="Failed to download s3://${bucket}/${key} -> ${destination}" -s="ERROR"
  return 1
}

#######################################
# Download each key in the trailing argument list -- to the corresponding
# entry (by index) in --destinations -- via download_one_object, logging
# progress and continuing on to the next key if one download fails.
# Globals:
#   None (see download_one_object for the transport-level globals).
# Arguments:
#   -b=NAME | --bucket=NAME         Source S3 bucket. Forwarded to
#                                     download_one_object.
#   -d=NAME | --destinations=NAME   Name of a caller-scope array variable,
#                                     already populated with one local
#                                     destination path per trailing key, in
#                                     the same order (bound via nameref).
#   -f=NAME | --failures=NAME       Name of a caller-scope variable to
#                                     receive the failure count (bound via
#                                     nameref, following the same
#                                     --reference= convention
#                                     log_utils.sh's create_logfile uses).
#   -l=PATH | --logfile=PATH        Logfile path.
#   -s=cf|s3 | --source=cf|s3       Which transport to use. Forwarded to
#                                     download_one_object.
#   (remaining, unnamed)            S3 object keys to download.
# Outputs:
#   INFO progress lines to STDOUT, plus a final INFO summary event.
# Returns:
#   0 always. Per-key download failures are accumulated in logs, then counted and
#   reported back to the caller via --failures, rather than exiting.
#######################################
function download_objects() {
  local bucket=""
  local -n destinations_in
  local -n failures_out
  # NOTE: needed for nounset (set -u) safety. If --failures was never
  # passed, failures_out is never bound, and unconditionally writing to it
  # later would be the *first* write to an unbound nameref -- which binds
  # it to whatever string is being assigned (the failure count itself,
  # e.g. "0"), not to a caller's variable. This flag guards that.
  local failures_given=0
  local logfile=""
  local source_mode=""
  local -a target_keys=()
  local i

  for i in "$@"; do
    case "$i" in
      -b=* | --bucket=*)
        bucket="${i#*=}"
        shift
        ;;
      -d=* | --destinations=*)
        destinations_in="${i#*=}"
        shift
        ;;
      -f=* | --failures=*)
        failures_out="${i#*=}"
        failures_given=1
        shift
        ;;
      -l=* | --logfile=*)
        logfile="${i#*=}"
        shift
        ;;
      -s=* | --source=*)
        source_mode="${i#*=}"
        shift
        ;;
      *)
        target_keys+=("$i")
        ;;
    esac
  done

  local key_count="${#target_keys[@]}"
  log_event -f="${logfile}" -m="Found ${key_count} key(s). Downloading..." -s="INFO"

  local key_index
  local key
  local destination
  local success_count=0
  # NOTE: named "_download_failure_count", not "failure_count" -- if this
  # matched whatever variable name a caller passes via --failures=, the
  # nameref above would resolve to *this* local instead of the caller's
  # variable (bash namerefs prefer the nearest same-named variable on the
  # call stack), and the count would never propagate back.
  local _download_failure_count=0

  for key_index in "${!target_keys[@]}"; do
    key="${target_keys[key_index]}"
    destination="${destinations_in[key_index]}"
    echo "[$((key_index + 1))/${key_count}] Downloading ${key} -> ${destination}"

    if download_one_object --bucket="${bucket}" --destination="${destination}" --key="${key}" \
      --logfile="${logfile}" --source="${source_mode}"; then
      success_count=$((success_count + 1))
    else
      _download_failure_count=$((_download_failure_count + 1))
    fi
  done

  log_event -f="${logfile}" \
    -m="Done. ${success_count} succeeded, ${_download_failure_count} failed, out of ${key_count} key(s)." \
    -s="INFO"

  echo "Done. ${success_count} succeeded, ${_download_failure_count} failed, out of ${key_count} key(s)."

  if [[ "${failures_given}" -eq 1 ]]; then
    failures_out="${_download_failure_count}"
  fi
  return 0
}

main "$@"
