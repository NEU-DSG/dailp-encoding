#!/usr/bin/env bash
#
# Generic (no Postgres/S3-specific knowledge) defensive-programming
# helpers shared by every executable in this directory:
# upload_to_s3.sh, download_from_s3.sh, pg_dump_backup.sh,
# pg_restore_backup.sh, export_db_to_csv.sh, and import_db_from_csv.sh.
# Extracted from:
#   - s3_utils.sh's check_aws_installed, download_from_s3.sh's
#     check_curl_installed, pg_dump_backup.sh's check_pg_dump_installed,
#     pg_utils.sh's check_psql_installed, and the inline pg_restore check
#     inside pg_restore_backup.sh's check_dependencies, all of which
#     near-identically check if a particular binary is on PATH.
#   - pg_dump_backup.sh's create_backup and pg_restore_backup.sh's
#     validate_environment, which previously contained
#     identical DATABASE_URL/DATABASE_PASSWORD presence checks.
#   - upload_to_s3.sh, download_from_s3.sh, pg_dump_backup.sh, and
#     pg_restore_backup.sh, which previously repeated the same 3-line
#     "normalize a directory path to end in one trailing slash, then
#     mkdir -p it" pattern seven times between them.
# Like pg_utils.sh/s3_utils.sh, this file does not self-source
# log_utils.sh: every function below calls log_event directly and relies
# on the sourcing script having already sourced log_utils.sh itself.

#######################################
# Verify a single command is on PATH, logging the outcome either way and
# exiting 1 if it's missing. Generic replacement for this project's old
# per-command wrapper functions (check_aws_installed, check_curl_installed,
# check_pg_dump_installed, check_psql_installed, and the inline pg_restore
# check inside pg_restore_backup.sh's check_dependencies).
# Globals:
#   None
# Arguments:
#   -c=NAME | --command=NAME       Command to look for on PATH. Required.
#   -i=STR | --install-hint=STR    What to tell the operator to install,
#                                   e.g. "the AWS CLI" or "the PostgreSQL
#                                   client tools". Optional; defaults to
#                                   --command's own value, so a plain
#                                   command like curl reads "Please
#                                   install curl." with no override
#                                   needed.
#   -l=PATH | --logfile=PATH       Logfile path.
# Outputs:
#   Logs an INFO event ("<command> found on PATH.") on success, or an
#   ERROR event ("<command> not found. Please install <install-hint>.")
#   on failure.
# Returns:
#   Exits 1 directly (does not return) if the command is missing: nothing
#   else in the calling script can proceed, and fixing it requires the
#   operator to install the missing tool.
#######################################
function check_command_installed() {
  local command_name=""
  local install_hint=""
  local logfile=""
  local i

  for i in "$@"; do
    case "$i" in
      -c=* | --command=*)
        command_name="${i#*=}"
        shift
        ;;
      -i=* | --install-hint=*)
        install_hint="${i#*=}"
        shift
        ;;
      -l=* | --logfile=*)
        logfile="${i#*=}"
        shift
        ;;
    esac
  done

  if ! command_exists --command="${command_name}"; then
    log_event -e="1" -f="${logfile}" \
      -m="${command_name} not found. Please install ${install_hint:-${command_name}}." -s="ERROR"
    exit 1
  fi
  log_event -f="${logfile}" -m="${command_name} found on PATH." -s="INFO"
}

#######################################
# Test whether a command is on PATH, without logging or exiting. The
# low-level primitive check_command_installed (above) is built on this,
# as is pg_utils.sh's check_sha256_tool_installed, which needs to test two
# candidate commands (sha256sum, shasum) rather than one, so it doesn't
# fit check_command_installed's single-command signature.
# Globals:
#   None
# Arguments:
#   -c=NAME | --command=NAME   Command name to look for. Required.
# Outputs:
#   None.
# Returns:
#   0 if the command is found on PATH, 1 if not -- a plain boolean a
#   caller can use directly in an `if`. This is a checkable outcome, not
#   a misuse case, so it returns rather than exits, per BASH-019.
#######################################
function command_exists() {
  local command_name=""
  local i

  for i in "$@"; do
    case "$i" in
      -c=* | --command=*)
        command_name="${i#*=}"
        shift
        ;;
    esac
  done

  command -v "${command_name}" >/dev/null 2>&1
}

#######################################
# Normalize a directory-path variable to end in exactly one trailing
# slash, then create it (and any missing parents) via mkdir -p. Replaces
# the identical 3-line pattern this project previously repeated seven
# times across upload_to_s3.sh, download_from_s3.sh, pg_dump_backup.sh,
# and pg_restore_backup.sh. Deliberately NOT used by export_db_to_csv.sh:
# see the "Defensive Utilities" section of README.md for why.
# Globals:
#   None
# Arguments:
#   -r=NAME | --reference=NAME   Name of a caller-scope variable, already
#                                 holding a path, to normalize and create
#                                 in place (bound via nameref). Required.
#                                 NOTE (BASH-022): this function's own
#                                 local variables are deliberately named
#                                 "dir_target"/"dir_target_given", not
#                                 "log_location" or "outdir" (used elsewhere)
#                                 so the nameref can
#                                 never accidentally resolve to one of
#                                 this function's own locals instead of
#                                 the caller's variable.
# Outputs:
#   None beyond mkdir -p's own (silent-on-success) behavior.
# Returns:
#   0 on success (the referenced variable now ends in "/" and the
#   directory exists).
#   Exits 2 directly (does not return) if --reference was omitted: that's
#   a caller code bug, not a runtime condition to retry, per BASH-019.
#######################################
function ensure_dir() {
  local -n dir_target
  local dir_target_given=0
  local i

  for i in "$@"; do
    case "$i" in
      -r=* | --reference=*)
        dir_target="${i#*=}"
        dir_target_given=1
        shift
        ;;
    esac
  done

  if [[ "${dir_target_given}" -eq 0 ]]; then
    log_event -e="2" -m="ensure_dir: --reference is required." -s="ERROR"
    exit 2
  fi

  if [[ "${dir_target}" != */ ]]; then
    dir_target+="/"
  fi
  mkdir -p "${dir_target}"
}

#######################################
# Verify one or more named environment variables are non-empty, logging
# and exiting 1 on the first one found unset. Variables are checked in the order
# given, with the function short-circuting upon its first encountered error.
# Replaces the byte-for-byte-identical
# DATABASE_URL/DATABASE_PASSWORD check this project previously carried in
# both pg_dump_backup.sh's create_backup and pg_restore_backup.sh's
# validate_environment.
# Globals:
#   Reads whichever variable name(s) are passed as trailing arguments.
# Arguments:
#   -l=PATH | --logfile=PATH   Logfile path.
#   -p=STR | --purpose=STR     Optional text appended to the error
#                               message (e.g. "Cannot connect to
#                               database."), so this generic file never
#                               has to hardcode any project-specific
#                               wording itself. Default: none.
#   (remaining, unnamed)       One or more environment variable names to
#                               check for a non-empty value, in the order
#                               they should be checked. At least one
#                               required.
# Outputs:
#   Logs an ERROR event via log_event on the first unset variable found.
# Returns:
#   Exits 1 directly (does not return) if any named variable is unset --
#   retryable once the operator sets it and re-runs, per BASH-027.
#   Returns 0 if every named variable is non-empty.
#######################################
function require_env_vars() {
  local logfile=""
  local purpose=""
  local -a var_names=()
  local i

  for i in "$@"; do
    case "$i" in
      -l=* | --logfile=*)
        logfile="${i#*=}"
        shift
        ;;
      -p=* | --purpose=*)
        purpose="${i#*=}"
        shift
        ;;
      *)
        var_names+=("$i")
        ;;
    esac
  done

  local var_name
  for var_name in "${var_names[@]}"; do
    if [[ -z "${!var_name:-}" ]]; then
      log_event -f="${logfile}" \
        -m="${var_name} not set.${purpose:+ ${purpose}}" -s="ERROR"
      exit 1
    fi
  done
}
