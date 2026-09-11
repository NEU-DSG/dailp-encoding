#!/usr/bin/env bash
#
# upload_to_s3.sh
#
# Uploads one or more local files -- or, with -r/--recursive, every file
# under a local directory -- to an S3 bucket via the AWS CLI. Every success
# and failure along the way is recorded via log_utils.sh's create_logfile /
# log_event functions.
#
# Requirements:
#   - aws (AWS CLI) must be installed and on PATH
#   - log_utils.sh, file_utils.sh, s3_utils.sh, and defensive_utils.sh
#     must be present in ./utils/ next to this script
#   - AWS credentials/region must already be available in the environment
#     (e.g. AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY/AWS_SESSION_TOKEN,
#     AWS_DEFAULT_REGION).
#
# Usage (unix equals-separated style; named flags are alphabetized):
#   ./upload_to_s3.sh [-b=BUCKET] [-l=LOG_LOCATION] [-p=PREFIX] FILE [FILE ...]
#   ./upload_to_s3.sh [-b=BUCKET] [-l=LOG_LOCATION] [-p=PREFIX] -r DIRECTORY
#
# If -b/--bucket is omitted, $CF_URL must be set and the bucket is derived as
# "dailp-${TF_STAGE}-media-storage". By default every object location this script
# reports is the public CloudFront URL, "${CF_URL}/${key}" with an "https://" scheme
# added only if $CF_URL doesn't already have one; the bare "s3://bucket/key" form
# appears as a fallback when $CF_URL is unset. See object_location in utils/s3_utils.sh.
#
# Pass -K=backup when uploading to the backup bucket (dailp-${TF_STAGE}-backups). That
# bucket has no CloudFront distribution -- deliberately, so that knowing a key is not
# enough to read a database dump -- so locations there are always reported as s3://
# URIs. Without it, and with $CF_URL set as it is in the backup workflow, every logged
# location would be a CDN URL that cannot resolve.
#
# With -r/--recursive, exactly one DIRECTORY argument is given (no FILE
# arguments) and every regular file found under it is uploaded, with its
# path relative to DIRECTORY preserved under -p/--prefix (e.g. prefix
# "backups", local file "DIRECTORY/sub/a.csv" -> key "backups/sub/a.csv").
# Without -r/--recursive, each FILE is flattened to
# "${prefix:+${prefix%/}/}$(basename FILE)", regardless of its own path.
#
# Examples:
#   ./upload_to_s3.sh -b=my-bucket ./backup.dump
#   ./upload_to_s3.sh -b=my-bucket -p=backups ./backup.dump ./backup.csv
#   CF_URL=d123.cloudfront.net TF_STAGE=prod ./upload_to_s3.sh ./backup.dump
#   ./upload_to_s3.sh -b=my-bucket -p=backups -r ./backups_dir
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
# s3_utils.sh (default_media_bucket, normalize_cf_url, object_location) is
# shared with download_from_s3.sh.
source "$(dirname "${BASH_SOURCE[0]}")/utils/s3_utils.sh"
# defensive_utils.sh (check_command_installed, ensure_dir) is shared by
# every executable in this directory.
source "$(dirname "${BASH_SOURCE[0]}")/utils/defensive_utils.sh"

#######################################
# Top-level program flow: parse arguments, set up logging, resolve the
# destination bucket, and upload either every FILE given or (with
# -r/--recursive) every file under DIRECTORY.
# Globals:
#   CF_URL     CloudFront distribution domain, with or without a scheme.
#              Optional; if set, used to derive a default bucket, and to
#              report every object's location as a public URL rather than
#              an s3:// URI.
#   TF_STAGE   Deployment stage (e.g. dev/uat/prod). Optional, default
#              "dev"; only consulted when -b/--bucket is omitted.
# Arguments:
#   $@: raw command-line arguments. See usage() for the full flag set.
# Outputs:
#   See the individual helper functions below.
# Returns:
#   Exits 1 if any file failed to upload; otherwise returns 0.
#######################################
function main() {
  local bucket=""
  local kind="media"
  local log_location
  log_location="$(pwd)/logs/upload_to_s3/"
  local prefix=""
  local recursive=0
  local -a raw_args=()
  local arg

  for arg in "$@"; do
    case "${arg}" in
      --help)
        usage
        ;;
      -b=* | --bucket=*)
        bucket="${arg#*=}"
        ;;
      -K=* | --kind=*)
        kind="${arg#*=}"
        ;;
      -l=* | --log-location=*)
        log_location="${arg#*=}"
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
        raw_args+=("${arg}")
        ;;
    esac
  done

  # Argument-shape mistakes a caller can fix and re-run, not code bugs.
  # Exits 1 via usage.
  if [[ "${recursive}" -eq 1 && "${#raw_args[@]}" -ne 1 ]]; then
    echo "Error: -r/--recursive requires exactly one DIRECTORY argument (no FILE arguments)." >&2
    usage
  fi
  if [[ "${recursive}" -eq 0 && "${#raw_args[@]}" -eq 0 ]]; then
    echo "Error: no files provided to upload" >&2
    usage
  fi

  if [[ -z "${bucket}" ]]; then
    if [[ -z "${CF_URL:-}" ]]; then
      echo "Error: -b/--bucket not provided and CF_URL not set; cannot determine destination bucket." >&2
      usage
    fi
    bucket="$(default_media_bucket)"
  fi

  ensure_dir --reference=log_location

  local logfile=""
  create_logfile --location="${log_location}" --reference=logfile "upload_to_s3"
  log_event -f="${logfile}" -m="Destination bucket: ${bucket}" -s="INFO"

  check_command_installed --command=aws --install-hint="the AWS CLI" --logfile="${logfile}"

  # Build the (file, key) pairs to upload, as two parallel arrays, either
  # from the literal FILE arguments given (flattened to
  # prefix/basename(FILE)), or, with -r/--recursive, from every regular
  # file found under DIRECTORY (mirrored under prefix, preserving its path
  # relative to DIRECTORY).
  local -a target_files=()
  local -a target_keys=()
  local file
  local relative

  if [[ "${recursive}" -eq 1 ]]; then
    local directory="${raw_args[0]%/}"
    # EXIT: a DIRECTORY argument that isn't actually a
    # readable directory is a caller mistake, not something the rest of
    # this script can recover from.
    if [[ ! -d "${directory}" || ! -r "${directory}" ]]; then
      echo "Error: '${directory}' is not a readable directory." >&2
      usage
    fi

    while IFS= read -r file; do
      relative="${file#"${directory}"/}"
      target_files+=("${file}")
      target_keys+=("${prefix:+${prefix%/}/}${relative}")
    done < <(find "${directory}" -type f | sort)
  else
    for file in "${raw_args[@]}"; do
      target_files+=("${file}")
      target_keys+=("${prefix:+${prefix%/}/}$(basename "${file}")")
    done
  fi

  local failure_count=0
  upload_objects --bucket="${bucket}" --failures=failure_count --keys=target_keys \
    --kind="${kind}" --logfile="${logfile}" "${target_files[@]}"

  if [[ "${failure_count}" -gt 0 ]]; then
    log_event -e="${failure_count}" -f="${logfile}" \
      -m="Completed with ${failure_count} upload failure(s). See ${logfile}" -s="ERROR"
    exit 1
  fi

  log_event -f="${logfile}" -m="All files uploaded successfully." -s="INFO"
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
Usage: $0 [-b=BUCKET] [-K=KIND] [-l=LOG_LOCATION] [-p=PREFIX] FILE [FILE ...]
       $0 [-b=BUCKET] [-K=KIND] [-l=LOG_LOCATION] [-p=PREFIX] -r DIRECTORY

  -b=BUCKET        Destination S3 bucket. If omitted, requires \$CF_URL to
                   be set and derives "dailp-\${TF_STAGE:-dev}-media-storage"
  -K=KIND          How to report each object's location: "media" (default,
                   a CloudFront URL when \$CF_URL is set) or "backup" (always
                   an s3:// URI). Pass "backup" when uploading to the backup
                   bucket: it has no CloudFront distribution, so a CDN URL
                   there would name a location that cannot work.
  -l=LOG_LOCATION  Folder to save logs to (default: ./logs/upload_to_s3/)
  -p=PREFIX        S3 key prefix/folder to upload into (default: none)
  -r, --recursive  Upload every regular file found under DIRECTORY instead
                   of specific FILE arguments, preserving each file's path
                   relative to DIRECTORY under -p/--prefix. Requires
                   exactly one DIRECTORY argument (no FILE arguments).
  --help           Show this help

Requires the AWS CLI's usual credential/region environment variables to
already be set (e.g. AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY,
AWS_DEFAULT_REGION).
EOF
  exit 1
}

#######################################
# Upload a single local file to an exact S3 key via aws s3 cp, logging the
# object's public CloudFront URL as its location. Shared by upload_objects,
# for both flattened (literal FILE) and structure-preserving
# (-r/--recursive) keys.
# Globals:
#   CF_URL   CloudFront distribution domain, with or without a scheme.
#            Read by object_location to build the location this logs for
#            the object, on both the success and the failure path.
# Arguments:
#   -b=NAME | --bucket=NAME   Destination S3 bucket.
#   -f=PATH | --file=PATH     Local file path to upload.
#   -k=KEY | --key=KEY        Destination S3 key (already includes any
#                               prefix).
#   -l=PATH | --logfile=PATH  Logfile path.
# Outputs:
#   Logs an INFO/ERROR event for this file.
# Returns:
#   0 on success. 1 on any failure (file not a readable file, upload
#   failure) -- always a per-file recoverable outcome reported back to the
#   caller, never exits.
#######################################
function upload_one_object() {
  local bucket=""
  local file=""
  local key=""
  local kind="media"
  local logfile=""
  local i

  for i in "$@"; do
    case "$i" in
      -b=* | --bucket=*)
        bucket="${i#*=}"
        shift
        ;;
      -f=* | --file=*)
        file="${i#*=}"
        shift
        ;;
      -K=* | --kind=*)
        kind="${i#*=}"
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
    esac
  done

  if [[ ! -f "${file}" || ! -r "${file}" ]]; then
    log_event -e="1" -f="${logfile}" \
      -m="Skipping '${file}': not a readable file." -s="ERROR"
    return 1
  fi

  # Reported instead of the raw "s3://${bucket}/${key}" this used to log, so that the
  # location an operator reads out of the log is one they can open -- see
  # object_location. The aws s3 cp target below is of course still the s3:// URI; it's
  # the transport, not the report.
  #
  # --kind matters here even though it looks like a formatting detail: with kind=media
  # and CF_URL set, a backup object would be logged as a CloudFront URL, which for the
  # backup bucket is a location that cannot work. Better a bare s3:// URI that is true.
  local location
  location="$(object_location --bucket="${bucket}" --key="${key}" --kind="${kind}")"

  if ! aws s3 cp "${file}" "s3://${bucket}/${key}" >/dev/null; then
    log_event -e="1" -f="${logfile}" \
      -m="Failed to upload ${file} -> ${location}" -s="ERROR"
    return 1
  fi

  log_event -f="${logfile}" -m="Uploaded ${file} -> ${location}" -s="INFO"
  return 0
}

#######################################
# Upload each file in the trailing argument list -- to the corresponding
# entry (by index) in --keys -- via upload_one_object, logging progress and
# continuing on to the next file if one upload fails.
# Globals:
#   None (see upload_one_object for the transport-level globals).
# Arguments:
#   -b=NAME | --bucket=NAME     Destination S3 bucket. Forwarded to
#                                 upload_one_object.
#   -f=NAME | --failures=NAME   Name of a caller-scope variable to receive
#                                 the failure count (bound via nameref,
#                                 following the same --reference=
#                                 convention log_utils.sh's create_logfile
#                                 uses).
#   -k=NAME | --keys=NAME       Name of a caller-scope array variable,
#                                 already populated with one destination S3
#                                 key per trailing file, in the same order
#                                 (bound via nameref).
#   -l=PATH | --logfile=PATH    Logfile path.
#   (remaining, unnamed)        Local file paths to upload.
# Outputs:
#   Logs an INFO/ERROR event per file, plus INFO progress lines to STDOUT,
#   plus a final INFO summary event.
# Returns:
#   0 always. Per-file upload failures are accumulated in logs, then counted and
#   reported back to the caller via --failures, rather than exiting.
#######################################
function upload_objects() {
  local bucket=""
  local kind="media"
  local -n failures_out
  # NOTE: needed for nounset (set -u) safety. If --failures was never
  # passed, failures_out is never bound, and unconditionally writing to it
  # later would be the *first* write to an unbound nameref, which binds
  # it to whatever string is being assigned (the failure count itself,
  # e.g. "0"), not to a caller's variable. This flag guards that.
  local failures_given=0
  local -n keys_in
  local logfile=""
  local -a target_files=()
  local i

  for i in "$@"; do
    case "$i" in
      -b=* | --bucket=*)
        bucket="${i#*=}"
        shift
        ;;
      -f=* | --failures=*)
        failures_out="${i#*=}"
        failures_given=1
        shift
        ;;
      -K=* | --kind=*)
        kind="${i#*=}"
        shift
        ;;
      -k=* | --keys=*)
        keys_in="${i#*=}"
        shift
        ;;
      -l=* | --logfile=*)
        logfile="${i#*=}"
        shift
        ;;
      *)
        target_files+=("$i")
        ;;
    esac
  done

  local file_count="${#target_files[@]}"
  log_event -f="${logfile}" -m="Found ${file_count} file(s). Uploading..." -s="INFO"

  local file_index
  local file
  local key
  local success_count=0
  # NOTE: named "_upload_failure_count", not "failure_count". If this
  # matched whatever variable name a caller passes via --failures=, the
  # nameref above would resolve to *this* local instead of the caller's
  # variable (bash namerefs prefer the nearest same-named variable on the
  # call stack), and the count would never propagate back.
  local _upload_failure_count=0

  for file_index in "${!target_files[@]}"; do
    file="${target_files[file_index]}"
    key="${keys_in[file_index]}"
    echo "[$((file_index + 1))/${file_count}] Uploading ${file} -> $(object_location --bucket="${bucket}" --key="${key}" --kind="${kind}")"

    if upload_one_object --bucket="${bucket}" --file="${file}" --key="${key}" \
      --kind="${kind}" --logfile="${logfile}"; then
      success_count=$((success_count + 1))
    else
      _upload_failure_count=$((_upload_failure_count + 1))
    fi
  done

  log_event -f="${logfile}" \
    -m="Done. ${success_count} succeeded, ${_upload_failure_count} failed, out of ${file_count} file(s)." \
    -s="INFO"

  echo "Done. ${success_count} succeeded, ${_upload_failure_count} failed, out of ${file_count} file(s)."

  if [[ "${failures_given}" -eq 1 ]]; then
    failures_out="${_upload_failure_count}"
  fi
  return 0
}

main "$@"
