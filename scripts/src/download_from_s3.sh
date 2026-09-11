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
# There are three transports, and which one you want is a security
# decision rather than a preference:
#
#   -B/--backup   For a HUMAN retrieving a backup. Authenticates against
#                 Cognito with a DAILP login, asks the GraphQL API for a
#                 short-lived presigned URL, and fetches that. Needs no AWS
#                 credentials whatsoever. Requires membership of the
#                 Administrators group.
#   -b=BUCKET     For AUTOMATION. Reads the object directly with
#                 "aws s3 cp" under whatever IAM role the caller already
#                 has. This is how a restore job on the bastion retrieves a
#                 backup: no tokens, no Cognito, no presigning. Do not wire
#                 automation through the -B/--backup path.
#   (default)     CloudFront, for media objects. Unauthenticated. It cannot
#                 reach backups at all any more -- they live in a separate
#                 bucket with no distribution in front of it.
#
# Requirements:
#   - curl must be installed and on PATH for the default (CloudFront) and
#     the -B/--backup download paths.
#   - aws (AWS CLI) must be installed and on PATH when -b/--bucket is used
#     to force the S3 (aws-cli) download path, for -r/--recursive outside
#     -B/--backup mode (listing objects is only possible via the AWS API,
#     since CloudFront has no listing capability), and in -B/--backup mode
#     for the Cognito call -- which is unsigned, so it needs the binary but
#     not credentials.
#   - jq must be installed and on PATH for -B/--backup, which has to build
#     and parse JSON.
#   - log_utils.sh, s3_utils.sh, and defensive_utils.sh must be present
#     in ./utils/ next to this script.
#   - AWS credentials/region must already be available in the environment
#     when using the -b/--bucket or -r/--recursive paths (e.g.
#     AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY/AWS_SESSION_TOKEN,
#     AWS_DEFAULT_REGION). Note that the *media* bucket
#     (terraform/media-storage.nix, terraform/user-roles.nix) still grants
#     s3:ListBucket to no principal at all, only object-level
#     GetObject/PutObject, so -r/--recursive against it continues to
#     require separately-elevated credentials such as an account admin's.
#     The backup bucket is different: terraform/backup-storage.nix grants
#     prefix-scoped s3:ListBucket to the bastion instance role, so
#     "-b=dailp-<stage>-backups -r -p=db-backups/" works under that role,
#     and -B/--backup -r works for a human via a presigned listing. Note
#     the s3:prefix condition means a prefix is mandatory in both cases:
#     listing the whole backup bucket is denied by design.
#
# Usage (unix equals-separated style; named flags are alphabetized):
#   ./download_from_s3.sh [-B] [-b=BUCKET] [-l=LOG_LOCATION] [-o=OUTDIR] [-p=PREFIX] [-r] KEY [KEY ...]
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
#   # A human retrieving a backup (prompts for DAILP email and password):
#   ./download_from_s3.sh -B -o=./out/ db-backups/2026-09-11T12:00:00Z/dailp.dump
#   ./download_from_s3.sh -B -o=./out/ -p=db-backups/ -r
#
#   # Restore automation on the bastion, under the instance role:
#   ./download_from_s3.sh -b=dailp-dev-backups -o=./out/ db-backups/2026-09-11T12:00:00Z/dailp.dump
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
  local backup=0
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
      -B | --backup)
        backup=1
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

  # -B/--backup and -b/--bucket are two different answers to "who is
  # retrieving this", so asking for both is a contradiction rather than a
  # combination: one authenticates a human via Cognito and holds no AWS
  # credentials, the other uses the caller's IAM role and no human identity.
  if [[ "${backup}" -eq 1 && -n "${bucket}" ]]; then
    echo "Error: -B/--backup and -b/--bucket are mutually exclusive. Use -B/--backup to download as a human via a presigned URL, or -b=BUCKET to read the bucket directly under an IAM role (how restore automation should do it)." >&2
    usage
  fi

  # Resolve the download source once, up front: -B/--backup selects the
  # presigned-URL path; -b/--bucket forces the direct S3/aws-cli path;
  # otherwise $CF_URL is required and the curl/CloudFront path is used.
  local source_mode
  if [[ "${backup}" -eq 1 ]]; then
    source_mode="backup"
  elif [[ -n "${bucket}" ]]; then
    source_mode="s3"
  elif [[ -n "${CF_URL:-}" ]]; then
    source_mode="cf"
  else
    echo "Error: -b/--bucket not provided, -B/--backup not given, and CF_URL not set; cannot determine download source." >&2
    usage
  fi

  # In backup mode the bucket is never named here: the GraphQL API signs
  # against whatever BACKUP_BUCKET its own deployment is configured with, so a
  # bucket name passed from the client would be ignored at best and misleading
  # at worst.
  local api_url=""
  local id_token=""
  if [[ "${source_mode}" == "backup" ]]; then
    api_url="${DAILP_API_URL:-}"
    if [[ -z "${api_url}" ]]; then
      echo "Error: -B/--backup requires DAILP_API_URL (the API Gateway stage URL; 'nix run --impure .#tf-output functions_url')." >&2
      usage
    fi
    if [[ -z "${DAILP_USER_POOL_CLIENT_ID:-}" ]]; then
      echo "Error: -B/--backup requires DAILP_USER_POOL_CLIENT_ID (the CLI app client; 'nix run --impure .#tf-output cli_user_pool_client_id')." >&2
      usage
    fi
    # The s3:prefix condition on the bucket policy denies an unprefixed
    # listing, so catch that here rather than surfacing it as an AccessDenied
    # that looks like a permissions bug.
    if [[ "${recursive}" -eq 1 && -z "${prefix}" ]]; then
      echo "Error: -r/--recursive with -B/--backup requires -p/--prefix (e.g. -p=db-backups/); listing the whole backup bucket is denied by design." >&2
      usage
    fi
  fi

  # Listing (only needed for -r/--recursive) goes through the AWS API in the
  # cf and s3 modes, so those need a real bucket name. Derive one from
  # TF_STAGE, the same way upload_to_s3.sh does, when the caller didn't give
  # one explicitly. Backup mode lists via a presigned URL instead and so needs
  # no bucket name at all.
  local list_bucket="${bucket}"
  if [[ "${recursive}" -eq 1 && -z "${list_bucket}" && "${source_mode}" != "backup" ]]; then
    list_bucket="$(default_media_bucket)"
  fi

  ensure_dir --reference=log_location
  ensure_dir --reference=outdir

  local logfile=""
  create_logfile --location="${log_location}" --reference=logfile "download_from_s3"

  case "${source_mode}" in
    cf)
      log_event -f="${logfile}" -m="Download source: CloudFront (CF_URL=${CF_URL})" -s="INFO"
      ;;
    backup)
      log_event -f="${logfile}" \
        -m="Download source: presigned backup URLs via ${api_url%/}/graphql-edit" -s="INFO"
      ;;
    *)
      log_event -f="${logfile}" -m="Download source: S3 bucket '${bucket}' (aws s3 cp)" -s="INFO"
      ;;
  esac

  # aws is needed for listing (-r/--recursive outside backup mode), for the
  # S3 transfer path, and in backup mode for the unsigned Cognito call; curl
  # is needed whenever the transfer itself is an HTTP fetch; jq only in backup
  # mode, which is the only path that handles JSON.
  if [[ "${source_mode}" == "s3" || "${source_mode}" == "backup" ||
    ("${recursive}" -eq 1 && "${source_mode}" != "backup") ]]; then
    check_command_installed --command=aws --install-hint="the AWS CLI" --logfile="${logfile}"
  fi
  if [[ "${source_mode}" == "cf" || "${source_mode}" == "backup" ]]; then
    check_command_installed --command=curl --logfile="${logfile}"
  fi
  if [[ "${source_mode}" == "backup" ]]; then
    check_command_installed --command=jq --logfile="${logfile}"
    # Done once, up front, rather than per object: a token is good for an hour
    # and a recursive restore can be many objects. Also fails fast, before any
    # partial downloads, if the caller is not an Administrator.
    cognito_id_token --client-id="${DAILP_USER_POOL_CLIENT_ID}" --logfile="${logfile}" \
      --reference=id_token
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
    if [[ -z "${prefix}" && "${source_mode}" != "backup" ]]; then
      log_event -f="${logfile}" -m="No -p/--prefix given; listing every object in bucket '${list_bucket}'." -s="INFO"
    fi
    local -a discovered_keys=()
    if [[ "${source_mode}" == "backup" ]]; then
      list_backup_keys --api-url="${api_url}" --keys=discovered_keys --logfile="${logfile}" \
        --prefix="${prefix}" --token="${id_token}"
    else
      list_s3_keys --bucket="${list_bucket}" --keys=discovered_keys --logfile="${logfile}" --prefix="${prefix}"
    fi

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
  download_objects --api-url="${api_url}" --bucket="${bucket}" --destinations=target_destinations \
    --failures=failure_count --logfile="${logfile}" --source="${source_mode}" \
    --token="${id_token}" "${target_keys[@]}"

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
Usage: $0 [-B] [-b=BUCKET] [-l=LOG_LOCATION] [-o=OUTDIR] [-p=PREFIX] [-r] KEY [KEY ...]

  -B, --backup     Download a backup as a human: authenticate with a DAILP
                   login and fetch a short-lived presigned URL. Needs no AWS
                   credentials. Requires membership of the Administrators
                   group, plus curl, jq and the aws CLI binary. Mutually
                   exclusive with -b/--bucket.
                   Restore automation should NOT use this -- see -b below.
  -b=BUCKET        Force downloading via "aws s3 cp" from this S3 bucket,
                   overriding the default CloudFront (\$CF_URL) path. If
                   omitted, requires \$CF_URL to be set. This is the path
                   for automation: it uses the caller's existing IAM role,
                   so a restore job on the bastion needs no token
                   (-b=dailp-\${TF_STAGE}-backups).
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

-B/--backup uses neither. It reads these instead:
  DAILP_API_URL                API Gateway stage URL. Required.
                                 nix run --impure .#tf-output functions_url
  DAILP_USER_POOL_CLIENT_ID    CLI app client id. Required.
                                 nix run --impure .#tf-output cli_user_pool_client_id
  DAILP_USER_EMAIL             DAILP login email. Prompted for if unset.
  DAILP_USER_PASSWORD          DAILP password. Prompted for (without echo)
                                 if unset. Prefer the prompt: an exported
                                 password is readable by anything in the
                                 environment and lands in shell history.
  AWS_DEFAULT_REGION           Optional, defaults to us-east-1.
EOF
  exit 1
}

#######################################
# Exchange a DAILP email and password for a Cognito id token.
#
# Uses the dedicated CLI app client (terraform/auth.nix's
# aws_cognito_user_pool_client.cli), which is the only one with
# USER_PASSWORD_AUTH enabled. The web client is SRP-only and stays that way:
# SRP is not implementable in bash, and enabling password auth there would let
# any web client send a cleartext password.
#
# InitiateAuth is an unauthenticated API, hence --no-sign-request: without it
# the AWS CLI can fail looking for credentials before it ever gets to the call,
# which is exactly the situation this path exists to avoid.
#
# The password is passed to the CLI as JSON on stdin, never as an argument.
# Process arguments are world-readable via ps(1) on a shared machine, so
# --cli-input-json with a literal here would leak it for the life of the call.
# Globals:
#   AWS_DEFAULT_REGION    Optional, default "us-east-1".
#   DAILP_USER_EMAIL      Optional; prompted for when unset.
#   DAILP_USER_PASSWORD   Optional; prompted for (no echo) when unset.
# Arguments:
#   -c=ID | --client-id=ID    Cognito app client id. Required.
#   -l=PATH | --logfile=PATH  Logfile path.
#   -r=NAME | --reference=NAME  Name of a caller-scope variable to receive the
#                               id token (bound via nameref, following
#                               create_logfile's --reference= convention).
# Outputs:
#   Logs an INFO event on success, an ERROR event on failure. Never logs the
#   token or the password.
# Returns:
#   0 on success. Exits 1 on any authentication failure: without a token there
#   is nothing else the run can do, so this is a whole-run precondition in the
#   same sense as check_command_installed. Retryable once the credentials, the
#   group membership, or the client id are fixed.
#######################################
function cognito_id_token() {
  local client_id=""
  local logfile=""
  local -n token_out
  local i

  for i in "$@"; do
    case "$i" in
      -c=* | --client-id=*)
        client_id="${i#*=}"
        shift
        ;;
      -l=* | --logfile=*)
        logfile="${i#*=}"
        shift
        ;;
      -r=* | --reference=*)
        token_out="${i#*=}"
        shift
        ;;
    esac
  done

  local email="${DAILP_USER_EMAIL:-}"
  if [[ -z "${email}" ]]; then
    read -rp "DAILP email: " email
  fi
  local password="${DAILP_USER_PASSWORD:-}"
  if [[ -z "${password}" ]]; then
    read -rsp "DAILP password: " password
    echo
  fi
  if [[ -z "${email}" || -z "${password}" ]]; then
    log_event -e="1" -f="${logfile}" -m="No DAILP email/password supplied; cannot authenticate." -s="ERROR"
    exit 1
  fi

  # jq --arg rather than string interpolation: a password may contain quotes,
  # backslashes or newlines, any of which would produce invalid JSON or, worse,
  # inject into it.
  local payload
  payload="$(jq -n --arg cid "${client_id}" --arg user "${email}" --arg pass "${password}" \
    '{ClientId: $cid, AuthFlow: "USER_PASSWORD_AUTH", AuthParameters: {USERNAME: $user, PASSWORD: $pass}}')"

  local response
  if ! response="$(printf '%s' "${payload}" |
    aws cognito-idp initiate-auth --no-sign-request \
      --region "${AWS_DEFAULT_REGION:-us-east-1}" \
      --cli-input-json file:///dev/stdin 2>&1)"; then
    # ${response} here is the CLI's own stderr, which names the failure
    # (NotAuthorizedException for a bad password, UserNotFoundException,
    # InvalidParameterException when the client lacks USER_PASSWORD_AUTH).
    log_event -e="1" -f="${logfile}" -m="Cognito authentication failed: ${response}" -s="ERROR"
    exit 1
  fi

  # A challenge means Cognito wants something more before it will issue tokens
  # -- most often NEW_PASSWORD_REQUIRED, for an admin-created account still in
  # FORCE_CHANGE_PASSWORD. This script cannot answer challenges, so say which
  # one it was rather than failing with an empty token.
  local challenge
  challenge="$(printf '%s' "${response}" | jq -r '.ChallengeName // empty')"
  if [[ -n "${challenge}" ]]; then
    log_event -e="1" -f="${logfile}" \
      -m="Cognito returned challenge '${challenge}' instead of tokens. Resolve it in the web app (or, for a new account, via 'aws cognito-idp admin-set-user-password --permanent') and retry." -s="ERROR"
    exit 1
  fi

  local token
  token="$(printf '%s' "${response}" | jq -r '.AuthenticationResult.IdToken // empty')"
  if [[ -z "${token}" ]]; then
    log_event -e="1" -f="${logfile}" -m="Cognito returned no id token." -s="ERROR"
    exit 1
  fi

  log_event -f="${logfile}" -m="Authenticated to Cognito as ${email}." -s="INFO"
  token_out="${token}"
  return 0
}

#######################################
# Ask the GraphQL API for a presigned backup URL.
#
# Posts to the graphql-edit route, which is the one behind the API Gateway
# Cognito authorizer. The field is guarded on the Administrators group
# (graphql/src/query.rs), and the presigning itself happens in the lambda
# (graphql/src/service_integrations/backups.rs) under its own IAM role -- this
# script never holds AWS credentials.
#
# Neither the token nor the request body is passed as a process argument. The
# token goes to curl through a --config file on stdin and the body through a
# mode-600 temporary file, so neither appears in ps(1) output.
# Globals:
#   None
# Arguments:
#   -a=URL | --api-url=URL      API Gateway stage URL. Required.
#   -f=KIND | --field=KIND      "download" (presign one object, --value is a
#                                 key) or "listing" (presign a ListObjectsV2
#                                 call, --value is a prefix). Required.
#   -l=PATH | --logfile=PATH    Logfile path.
#   -r=NAME | --reference=NAME  Name of a caller-scope variable to receive the
#                                 presigned URL (bound via nameref).
#   -t=TOKEN | --token=TOKEN    Cognito id token. Required.
#   -v=STR | --value=STR        The key or prefix to presign. Required.
# Outputs:
#   Logs an ERROR event on failure, including the API's own message verbatim.
#   Never logs the token or the presigned URL (which is itself a bearer
#   credential for the object until it expires).
# Returns:
#   0 on success. 1 on failure -- a per-object recoverable outcome reported
#   back to the caller, so one unreadable key does not abandon a whole
#   recursive download.
#######################################
function presign_backup_url() {
  local api_url=""
  local field=""
  local logfile=""
  local -n url_out
  local token=""
  local value=""
  local i

  for i in "$@"; do
    case "$i" in
      -a=* | --api-url=*)
        api_url="${i#*=}"
        shift
        ;;
      -f=* | --field=*)
        field="${i#*=}"
        shift
        ;;
      -l=* | --logfile=*)
        logfile="${i#*=}"
        shift
        ;;
      -r=* | --reference=*)
        url_out="${i#*=}"
        shift
        ;;
      -t=* | --token=*)
        token="${i#*=}"
        shift
        ;;
      -v=* | --value=*)
        value="${i#*=}"
        shift
        ;;
    esac
  done

  local query
  local variables
  if [[ "${field}" == "listing" ]]; then
    query='query BackupListingUrl($prefix: String!) { backupListingUrl(prefix: $prefix) { url } }'
    variables="$(jq -n --arg prefix "${value}" '{prefix: $prefix}')"
  else
    query='query BackupDownloadUrl($key: String!) { backupDownloadUrl(key: $key) { url } }'
    variables="$(jq -n --arg key "${value}" '{key: $key}')"
  fi

  local body_file
  body_file="$(mktemp)"
  # Readable only by this user: the body is not secret, but the file sits in a
  # world-readable directory and this keeps the habit consistent.
  chmod 600 "${body_file}"
  jq -n --arg query "${query}" --argjson variables "${variables}" \
    '{query: $query, variables: $variables}' >"${body_file}"

  local response=""
  local curl_status=0
  # The Authorization header arrives via --config on stdin so the token stays
  # out of the process list.
  response="$(printf 'header = "Authorization: Bearer %s"\n' "${token}" |
    curl --config - \
      --data "@${body_file}" \
      --header "Content-Type: application/json" \
      --show-error --silent \
      "${api_url%/}/graphql-edit" 2>&1)" || curl_status=$?
  rm -f "${body_file}"

  if [[ "${curl_status}" -ne 0 ]]; then
    log_event -e="1" -f="${logfile}" \
      -m="Failed to reach ${api_url%/}/graphql-edit: ${response}" -s="ERROR"
    return 1
  fi

  # GraphQL reports application errors in a 200 response body, so the HTTP
  # status above proves nothing. Surface the API's message verbatim: the most
  # likely one by far is the guard's "Forbidden, user not in group
  # 'Administrators'", i.e. a real account that simply has not been added to
  # the group, and paraphrasing it would only obscure the fix.
  local error_message
  error_message="$(printf '%s' "${response}" | jq -r '.errors[0].message // empty' 2>/dev/null || true)"
  if [[ -n "${error_message}" ]]; then
    log_event -e="1" -f="${logfile}" -m="API rejected the request: ${error_message}" -s="ERROR"
    return 1
  fi

  # NOTE: named "_presigned_url", not "presigned" -- if this matched whatever
  # variable name a caller passes via --reference=, the nameref above would
  # resolve to *this* local instead of the caller's variable (bash namerefs
  # prefer the nearest same-named variable on the call stack), and the URL
  # would never propagate back. download_one_object does in fact call this
  # with --reference=presigned. See BASH-022, and the equivalent notes on
  # list_s3_keys' "_listed_keys" and download_objects'
  # "_download_failure_count".
  local _presigned_url
  if [[ "${field}" == "listing" ]]; then
    _presigned_url="$(printf '%s' "${response}" | jq -r '.data.backupListingUrl.url // empty' 2>/dev/null || true)"
  else
    _presigned_url="$(printf '%s' "${response}" | jq -r '.data.backupDownloadUrl.url // empty' 2>/dev/null || true)"
  fi
  if [[ -z "${_presigned_url}" ]]; then
    log_event -e="1" -f="${logfile}" \
      -m="API returned no presigned URL for '${value}'. Response: ${response}" -s="ERROR"
    return 1
  fi

  url_out="${_presigned_url}"
  return 0
}

#######################################
# List the backup object keys under a prefix, via a presigned ListObjectsV2
# URL rather than the AWS API.
#
# The listing is presigned for the same reason the download is: this script
# holds no AWS credentials. It is presigned *by the lambda* rather than
# performed there because the lambda sits in a VPC with no asserted egress
# path, so a real ListObjectsV2 call from it could hang until its timeout.
# Globals:
#   None
# Arguments:
#   -a=URL | --api-url=URL    API Gateway stage URL. Required.
#   -k=NAME | --keys=NAME     Name of a caller-scope array variable to receive
#                               the discovered keys (bound via nameref).
#   -l=PATH | --logfile=PATH  Logfile path.
#   -p=STR | --prefix=STR     Prefix to list under. Required -- the bucket
#                               policy's s3:prefix condition denies a listing
#                               that sends no prefix.
#   -t=TOKEN | --token=TOKEN  Cognito id token. Required.
# Outputs:
#   Logs an INFO event with the number of keys found, or an ERROR event on
#   failure.
# Returns:
#   0 on success. Exits 1 if the listing could not be obtained or is
#   truncated, matching list_s3_keys: without a complete key list there is
#   nothing the rest of the run can usefully do.
#######################################
function list_backup_keys() {
  local api_url=""
  local -n keys_out
  local logfile=""
  local prefix=""
  local token=""
  local i

  for i in "$@"; do
    case "$i" in
      -a=* | --api-url=*)
        api_url="${i#*=}"
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
      -t=* | --token=*)
        token="${i#*=}"
        shift
        ;;
    esac
  done

  local listing_url=""
  if ! presign_backup_url --api-url="${api_url}" --field=listing --logfile="${logfile}" \
    --reference=listing_url --token="${token}" --value="${prefix}"; then
    exit 1
  fi

  local xml
  # Fetched verbatim: the URL is already signed and encoded.
  if ! xml="$(curl --fail --location --show-error --silent "${listing_url}" 2>&1)"; then
    log_event -e="1" -f="${logfile}" \
      -m="Failed to fetch the presigned listing for '${prefix}': ${xml}" -s="ERROR"
    exit 1
  fi

  # One ListObjectsV2 page caps at 1000 keys, and continuing needs a *fresh*
  # presigned URL carrying a continuation-token. Rather than silently
  # returning a partial list -- which for a backup restore would be a
  # correctness bug, not an inconvenience -- say so and stop.
  if [[ "${xml}" == *"<IsTruncated>true</IsTruncated>"* ]]; then
    log_event -e="1" -f="${logfile}" \
      -m="Listing for '${prefix}' is truncated at 1000 keys; pagination is not implemented. Narrow the prefix (e.g. -p=db-backups/<run-timestamp>/)." -s="ERROR"
    exit 1
  fi

  # grep -o rather than sed, because S3 returns the whole document on one line,
  # so there are many <Key> elements per "line". Entities are decoded after
  # extraction, with &amp; last so a literal "&amp;lt;" in a key survives.
  local -a _listed_backup_keys=()
  local line
  while IFS= read -r line; do
    [[ -n "${line}" ]] && _listed_backup_keys+=("${line}")
  done < <(
    printf '%s' "${xml}" |
      { grep -o '<Key>[^<]*</Key>' || true; } |
      sed 's|^<Key>||; s|</Key>$||' |
      sed 's|&lt;|<|g; s|&gt;|>|g; s|&quot;|"|g; s|&apos;|'"'"'|g; s|&amp;|\&|g'
  )

  log_event -f="${logfile}" \
    -m="Found ${#_listed_backup_keys[@]} backup object(s) under '${prefix}'." -s="INFO"
  keys_out=("${_listed_backup_keys[@]}")
  return 0
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
#   -a=URL | --api-url=URL        API Gateway stage URL. Only used when
#                                   --source=backup.
#   -b=NAME | --bucket=NAME       Source S3 bucket. Only used when
#                                   --source=s3.
#   -d=PATH | --destination=PATH  Exact local file path to write to.
#   -k=KEY | --key=KEY            Full S3 object key (already includes any
#                                   prefix).
#   -l=PATH | --logfile=PATH      Logfile path.
#   -s=KIND | --source=KIND       Which transport to use: "cf" for
#                                   curl-against-CF_URL, "s3" for
#                                   aws-s3-cp-against-bucket, "backup" for
#                                   a presigned URL from the GraphQL API.
#   -t=TOKEN | --token=TOKEN      Cognito id token. Only used when
#                                   --source=backup.
# Outputs:
#   Logs an INFO/ERROR event for this object. In backup mode the key is
#   logged but never the presigned URL, which is a bearer credential for the
#   object until it expires.
# Returns:
#   0 on success. 1 on any failure (destination already exists, missing
#   source object, transport failure) -- always a per-object recoverable
#   outcome reported back to the caller, never exits.
#######################################
function download_one_object() {
  local api_url=""
  local bucket=""
  local destination=""
  local key=""
  local logfile=""
  local source_mode=""
  local token=""
  local i

  for i in "$@"; do
    case "$i" in
      -a=* | --api-url=*)
        api_url="${i#*=}"
        shift
        ;;
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
      -t=* | --token=*)
        token="${i#*=}"
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
  if [[ "${source_mode}" == "backup" ]]; then
    local presigned=""
    if ! presign_backup_url --api-url="${api_url}" --field=download --logfile="${logfile}" \
      --reference=presigned --token="${token}" --value="${key}"; then
      return 1
    fi

    # Fetched verbatim. Unlike the "cf" branch below, the URL must NOT go
    # through normalize_cf_url or url_encode_key: it arrives already signed and
    # percent-encoded, and re-encoding it would turn every "%" into "%25" and
    # invalidate the signature.
    #
    # A single curl, deliberately, with no --continue-at: S3 checks the expiry
    # when it authorizes the request rather than throughout the response, so
    # one long transfer is fine however large the dump, but a *resumed*
    # transfer issues a second request that may land after the URL has died.
    # On failure, re-run to mint a fresh URL instead of resuming.
    if curl --fail --location --show-error --silent --output "${destination}" "${presigned}"; then
      # The presigned URL is itself a bearer credential for this object until
      # it expires, so the log records the key, never the URL.
      log_event -f="${logfile}" -m="Downloaded backup '${key}' -> ${destination}" -s="INFO"
      return 0
    fi
    rm -f "${destination}"
    log_event -e="1" -f="${logfile}" \
      -m="Failed to download backup '${key}' -> ${destination}" -s="ERROR"
    return 1
  fi

  if [[ "${source_mode}" == "cf" ]]; then
    # Encoded here but not in the `aws s3 cp` branch below, which takes the
    # key literally. Without this, any key containing a "+" -- which every
    # pg_dump filename does, via pg_dump_backup.sh's %z suffix -- comes back
    # 403 rather than downloading. See url_encode_key in utils/s3_utils.sh.
    url="$(normalize_cf_url --url="${CF_URL}")/$(url_encode_key --key="${key}")"

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
#   -a=URL | --api-url=URL          API Gateway stage URL. Forwarded to
#                                     download_one_object.
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
#   -s=KIND | --source=KIND         Which transport to use ("cf", "s3" or
#                                     "backup"). Forwarded to
#                                     download_one_object.
#   -t=TOKEN | --token=TOKEN        Cognito id token. Forwarded to
#                                     download_one_object.
#   (remaining, unnamed)            S3 object keys to download.
# Outputs:
#   INFO progress lines to STDOUT, plus a final INFO summary event.
# Returns:
#   0 always. Per-key download failures are accumulated in logs, then counted and
#   reported back to the caller via --failures, rather than exiting.
#######################################
function download_objects() {
  local api_url=""
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
  local token=""
  local -a target_keys=()
  local i

  for i in "$@"; do
    case "$i" in
      -a=* | --api-url=*)
        api_url="${i#*=}"
        shift
        ;;
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
      -t=* | --token=*)
        token="${i#*=}"
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

    if download_one_object --api-url="${api_url}" --bucket="${bucket}" \
      --destination="${destination}" --key="${key}" --logfile="${logfile}" \
      --source="${source_mode}" --token="${token}"; then
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
