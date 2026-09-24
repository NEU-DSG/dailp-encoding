#!/usr/bin/env bash
#
# pg_restore_backup.sh
#
# Inverse of pg_dump_backup.sh: restores a custom-format (-Fc) pg_dump
# archive into a target PostgreSQL database via the pg_restore utility,
# then verifies every table recorded in the archive actually landed by
# cross-checking row counts against the restored database. Every success
# and failure along the way is recorded via log_utils.sh's
# create_logfile / log_event functions.
#
# The restore itself runs inside a single transaction (--single-
# transaction), so a failure partway through rolls back everything --
# the target database is left exactly as it was beforehand, never
# half-restored.
#
# Requirements:
#   - pg_restore and psql (PostgreSQL client) must be installed and on PATH
#   - log_utils.sh, file_utils.sh, and defensive_utils.sh must be present
#     in ./utils/ next to this script
#
# Usage (unix equals-separated style; named flags are alphabetized):
#   ./pg_restore_backup.sh [--clean] [-l=LOG_LOCATION] DUMPFILE
#
# Requires $DATABASE_URL (connection endpoint) and $DATABASE_PASSWORD
# (database password) to be set in the environment -- these identify the
# *restore target*, the same convention pg_dump_backup.sh uses for its
# source.
#
# Examples:
#   ./pg_restore_backup.sh ./backups/pg_dump/dailp_20260101_120000+0000.dump
#   ./pg_restore_backup.sh --clean -l=./backups/pg_restore/logs/ \
#     ./backups/pg_dump/dailp_20260101_120000+0000.dump
#
set -euo pipefail
# nounset (-u) is enabled: every variable in this file, and in the sourced
# log_utils.sh / file_utils.sh / defensive_utils.sh, is either given an
# explicit default at declaration or is guaranteed to be assigned before
# it's ever read. See bash_standards.md, BASH-024.

# log_utils.sh (create_logfile, log_event) must live in ./utils/ next to
# this script. BASH_SOURCE (not $0) is used so this resolves correctly
# even if this script is sourced or invoked in an unusual way; see
# https://mywiki.wooledge.org/BashFAQ/028.
source "$(dirname "${BASH_SOURCE[0]}")/utils/log_utils.sh"
# defensive_utils.sh (check_command_installed, ensure_dir,
# require_env_vars) is shared by every executable in this directory.
# pg_utils.sh is no longer sourced here: check_psql_installed -- the only
# function this script used from it -- has moved into
# defensive_utils.sh's generic check_command_installed.
source "$(dirname "${BASH_SOURCE[0]}")/utils/defensive_utils.sh"

#######################################
# Top-level program flow: parse arguments, set up logging, validate the
# archive, restore it, and verify every table it contains actually
# landed.
#
# Globals:
#   DATABASE_URL       Restore target's connection endpoint. Required.
#   DATABASE_PASSWORD  Restore target's password. Required; exported as
#                      PGPASSWORD for pg_restore/psql to pick up (rather
#                      than passed as a command-line flag, so it never
#                      appears in `ps` output). A trap guarantees it's
#                      unset again on every exit path, since (unlike
#                      pg_dump_backup.sh) it's needed across two separate
#                      commands here: pg_restore itself, and the
#                      verification psql queries afterward.
# Arguments:
#   $@: raw command-line arguments.
# Outputs:
#   See the individual helper functions below.
# Returns:
#   Exits 0 on success; see the individual helper functions for failure
#   exit codes.
#######################################
function main() {
  local clean=0
  local log_location
  log_location="$(pwd)/backups/pg_restore/logs/"
  local dumpfile=""
  local arg

  for arg in "$@"; do
    case "${arg}" in
      --help)
        usage
        ;;
      --clean)
        clean=1
        ;;
      -l=* | --log-location=*)
        log_location="${arg#*=}"
        ;;
      -*)
        echo "Error: unknown option '${arg}'" >&2
        usage
        ;;
      *)
        dumpfile="${arg}"
        ;;
    esac
  done

  if [[ -z "${dumpfile}" ]]; then
    echo "Error: no dump file provided" >&2
    usage
  fi

  ensure_dir --reference=log_location

  local logfile=""
  create_logfile --location="${log_location}" --reference=logfile "pg_restore_backup"
  log_event -f="${logfile}" -m="Hooking up logfile: ${logfile}" -s="INFO"

  require_env_vars --logfile="${logfile}" \
    --purpose="Cannot connect to database." DATABASE_URL DATABASE_PASSWORD
  validate_dumpfile --dumpfile="${dumpfile}" --logfile="${logfile}"
  check_dependencies --logfile="${logfile}"

  local expected_tables=""
  inspect_archive --dumpfile="${dumpfile}" --logfile="${logfile}" --reference=expected_tables

  # PGPASSWORD is needed across both restore_backup (pg_restore) and
  # verify_restore (psql) below. A trap -- rather than exporting/unsetting
  # around each call individually, as pg_dump_backup.sh does for its
  # single call site -- guarantees it's unset on every exit path from
  # here on, including the "exit 1" failure paths inside those functions.
  export PGPASSWORD="${DATABASE_PASSWORD}"
  trap 'unset PGPASSWORD' EXIT

  restore_backup --clean="${clean}" --dumpfile="${dumpfile}" --logfile="${logfile}"

  local failure_count=0
  local total_rows=0
  verify_restore --expected-tables="${expected_tables}" --failures=failure_count \
    --logfile="${logfile}" --rows=total_rows

  local expected_count=0
  if [[ -n "${expected_tables}" ]]; then
    expected_count=$(echo "${expected_tables}" | wc -l | tr -d ' ')
  fi

  if [[ "${failure_count}" -gt 0 ]]; then
    log_event -e="${failure_count}" -f="${logfile}" \
      -m="Restore completed but ${failure_count}/${expected_count} table(s) failed verification. See ${logfile}" \
      -s="ERROR"
    exit 1
  fi

  log_event -f="${logfile}" \
    -m="Restore verified: ${expected_count}/${expected_count} table(s) present, ${total_rows} row(s) total." \
    -s="INFO"
  echo "Restore verified: ${expected_count}/${expected_count} table(s) present, ${total_rows} row(s) total."
}

#######################################
# Print usage information and exit.
# Globals:
#   None
# Arguments:
#   None
# Outputs:
#   Writes usage text to STDOUT (conventional for --help); the calling
#   argument-parsing errors that invoke this write their own error first.
# Returns:
#   Always exits 1.
#######################################
function usage() {
  cat <<EOF
Usage: $0 [--clean] [-l=LOG_LOCATION] DUMPFILE

  --clean            Drop existing objects (--clean --if-exists) before
                      restoring them. Without this, restoring into a
                      database with conflicting tables fails loudly
                      instead of overwriting them.
  -l=LOG_LOCATION    Folder to save logs to (default: ./backups/pg_restore/logs/)
  DUMPFILE           Path to a custom-format (-Fc) pg_dump archive, as
                      produced by pg_dump_backup.sh. Required.
  --help             Show this help

Requires \$DATABASE_URL and \$DATABASE_PASSWORD to be set in the
environment, identifying the *restore target*.
EOF
  exit 1
}

#######################################
# Verify the dump file exists, is readable, and is non-empty.
# Globals:
#   None
# Arguments:
#   -d=PATH | --dumpfile=PATH   Path to the dump file.
#   -l=PATH | --logfile=PATH    Logfile path.
# Outputs:
#   Logs an ERROR event via log_event on failure.
# Returns:
#   Exits 1 for a missing/unreadable/empty file -- an operator can fix
#   the path or re-fetch the archive and retry the exact same command.
#######################################
function validate_dumpfile() {
  local dumpfile=""
  local logfile=""
  local i

  for i in "$@"; do
    case "$i" in
      -d=* | --dumpfile=*)
        dumpfile="${i#*=}"
        shift
        ;;
      -l=* | --logfile=*)
        logfile="${i#*=}"
        shift
        ;;
    esac
  done

  if [[ ! -f "${dumpfile}" || ! -r "${dumpfile}" ]]; then
    log_event -f="${logfile}" \
      -m="Dump file '${dumpfile}' does not exist or is not readable." -s="ERROR"
    exit 1
  fi

  if [[ ! -s "${dumpfile}" ]]; then
    log_event -f="${logfile}" \
      -m="Dump file '${dumpfile}' is empty." -s="ERROR"
    exit 1
  fi
}

#######################################
# Verify pg_restore and psql are on PATH, logging the outcome either way.
# Both checks now delegate to defensive_utils.sh's generic
# check_command_installed; previously the pg_restore half was inline here
# and the psql half delegated to pg_utils.sh's check_psql_installed
# (which has since moved into check_command_installed itself).
# Globals:
#   None
# Arguments:
#   -l=PATH | --logfile=PATH   Logfile path.
# Outputs:
#   Logs an INFO or ERROR event via log_event (via check_command_installed).
# Returns:
#   Exits 1 directly if either command is missing.
#######################################
function check_dependencies() {
  local logfile=""
  local i

  for i in "$@"; do
    case "$i" in
      -l=* | --logfile=*)
        logfile="${i#*=}"
        shift
        ;;
    esac
  done

  check_command_installed --command=pg_restore --install-hint="the PostgreSQL client tools" --logfile="${logfile}"
  check_command_installed --command=psql --install-hint="the PostgreSQL client tools" --logfile="${logfile}"

  log_event -f="${logfile}" -m="pg_restore and psql found on PATH." -s="INFO"
}

#######################################
# Read a dump file's table of contents and extract the "schema table"
# pairs it holds table data for. Doubles as an archive-integrity check:
# an unreadable/corrupt archive is caught here, before anything is ever
# restored into the target database.
# Globals:
#   None
# Arguments:
#   -d=PATH | --dumpfile=PATH     Path to the dump file.
#   -l=PATH | --logfile=PATH      Logfile path.
#   -r=NAME | --reference=NAME    Name of a caller-scope variable (must
#                                 currently be empty) that will be set to
#                                 the newline-separated "schema table"
#                                 pairs found. Example:
#                                 `public document\npublic document_page`
# Outputs:
#   Logs INFO/WARN/ERROR events via log_event.
# Returns:
#   Exits 1 directly if `pg_restore --list` fails since the archive itself
#   is unreadable or corrupt.
#   Returns 0 on success (including the schema-only, zero-table case).
#######################################
function inspect_archive() {
  local dumpfile=""
  local logfile=""
  local -n reference
  local reference_given=0
  local i

  for i in "$@"; do
    case "$i" in
      -d=* | --dumpfile=*)
        dumpfile="${i#*=}"
        shift
        ;;
      -l=* | --logfile=*)
        logfile="${i#*=}"
        shift
        ;;
      -r=* | --reference=*)
        reference="${i#*=}"
        reference_given=1
        shift
        ;;
    esac
  done

  local toc
  if ! toc=$(pg_restore --list "${dumpfile}" 2>&1); then
    log_event -e="1" -f="${logfile}" \
      -m="Failed to read table of contents for '${dumpfile}'. Archive may be corrupt." -s="ERROR"
    exit 1
  fi

  # TOC lines for a table's data look like:
  #   3418; 0 24576 TABLE DATA public users postgres
  # Fields 4 and 5 are the literal words "TABLE DATA",
  # field 6 is the schema,
  # field 7 the table name.
  local tables
  tables=$(echo "${toc}" | awk '$4 == "TABLE" && $5 == "DATA" {print $6, $7}')

  if [[ -z "${tables}" ]]; then
    log_event -f="${logfile}" \
      -m="No table data entries found in archive '${dumpfile}' (schema-only dump?)." -s="WARN"
  else
    local table_count
    table_count=$(echo "${tables}" | wc -l | tr -d ' ')
    log_event -f="${logfile}" \
      -m="Archive '${dumpfile}' contains ${table_count} table(s) of data." -s="INFO"
  fi

  if [[ "${reference_given}" -eq 1 ]]; then
    reference="${tables}"
  fi
}

#######################################
# Restore a dump file into the target database inside a single
# transaction, so a failure partway through leaves the target exactly as
# it was beforehand.
# Globals:
#   PGPASSWORD   Read; must already be exported by the caller.
#   DATABASE_URL Read; the restore target.
# Arguments:
#   -c=0|1 | --clean=0|1        1: passes --clean --if-exists to
#                                pg_restore, dropping existing objects
#                                before recreating them. 
#                               0: (default behavior) leaves conflicting
#                                objects in place, so pg_restore fails
#                                loudly instead of overwriting them.
#   -d=PATH | --dumpfile=PATH   Path to the dump file.
#   -l=PATH | --logfile=PATH    Logfile path.
# Outputs:
#   Logs INFO/ERROR events via log_event.
# Returns:
#   Exits 1 if pg_restore fails. Requires fixing connectivity,
#   permissions, or passing --clean, then retrying the exact same command.
#   Returns 0 on success.
#######################################
function restore_backup() {
  local clean=0
  local dumpfile=""
  local logfile=""
  local i

  for i in "$@"; do
    case "$i" in
      -c=* | --clean=*)
        clean="${i#*=}"
        shift
        ;;
      -d=* | --dumpfile=*)
        dumpfile="${i#*=}"
        shift
        ;;
      -l=* | --logfile=*)
        logfile="${i#*=}"
        shift
        ;;
    esac
  done

  # dbname can be a connection string:
  # https://www.postgresql.org/docs/current/app-pgrestore.html
  local -a restore_args=(--single-transaction "--dbname=${DATABASE_URL}")
  if [[ "${clean}" -eq 1 ]]; then
    restore_args+=(--clean --if-exists)
  fi
  restore_args+=("${dumpfile}")

  log_event -f="${logfile}" -m="Restoring ${dumpfile} into target database..." -s="INFO"

  if ! pg_restore "${restore_args[@]}"; then
    log_event -f="${logfile}" -m="pg_restore failed. No changes were committed (--single-transaction)." -s="ERROR"
    exit 1
  fi

  log_event -f="${logfile}" -m="pg_restore completed successfully." -s="INFO"
}

#######################################
# Data-integrity check: for every "schema table" pair the archive's table
# of contents recorded, confirm the table exists and is queryable in the
# now-restored database, and total up its row count.
# Globals:
#   PGPASSWORD    Read; must already be exported by the caller.
#   DATABASE_URL  Read; the restore target.
# Arguments:
#   -e=STR | --expected-tables=STR   Newline-separated "schema table"
#                                     pairs, as produced by
#                                     inspect_archive.
#   -f=NAME | --failures=NAME        Name of a caller-scope variable to
#                                     receive the count of tables that
#                                     failed verification (nameref).
#   -l=PATH | --logfile=PATH         Logfile path.
#   -r=NAME | --rows=NAME            Name of a caller-scope variable to
#                                     receive the total row count summed
#                                     across every verified table
#                                     (nameref).
# Outputs:
#   Logs an INFO/ERROR/WARN event per table, plus a final INFO summary.
# Returns:
#   0 always. Failures are counted and reported back via --failures
#   rather than exiting, so main can log one combined summary regardless
#   of outcome.
#######################################
function verify_restore() {
  local expected_tables=""
  local -n verify_failures_out
  local failures_given=0
  local logfile=""
  local -n verify_rows_out
  local rows_given=0
  local i

  for i in "$@"; do
    case "$i" in
      -e=* | --expected-tables=*)
        expected_tables="${i#*=}"
        shift
        ;;
      -f=* | --failures=*)
        verify_failures_out="${i#*=}"
        failures_given=1
        shift
        ;;
      -l=* | --logfile=*)
        logfile="${i#*=}"
        shift
        ;;
      -r=* | --rows=*)
        verify_rows_out="${i#*=}"
        rows_given=1
        shift
        ;;
    esac
  done

  if [[ -z "${expected_tables}" ]]; then
    log_event -f="${logfile}" -m="No tables to verify." -s="INFO"
    # As cleanup, initialize uninitialized namerefs before returning
    if [[ "${failures_given}" -eq 1 ]]; then
      verify_failures_out=0
    fi
    if [[ "${rows_given}" -eq 1 ]]; then
      verify_rows_out=0
    fi
    return 0
  fi

  local schema
  local table
  local row_count
  # NOTE: named "_verify_failure_count"/"_verify_row_total", not
  # "failure_count"/"row_total" -- if either matched whatever variable
  # name a caller passes via --failures=/--rows=, the namerefs above
  # would resolve to *this* local instead of the caller's variable (bash
  # namerefs prefer the nearest same-named variable on the call stack),
  # and the value would never propagate back.
  local _verify_failure_count=0
  local _verify_row_total=0

  while IFS=' ' read -r schema table; do
    [[ -z "${schema}" || -z "${table}" ]] && continue

    # Defense-in-depth (BASH-021): these names come from the archive's
    # own table of contents rather than raw user input, but a stray `"`
    # would still break out of the double-quoted identifiers below, so
    # skip (rather than interpolate) anything that contains one.
    if [[ "${schema}" == *'"'* || "${table}" == *'"'* ]]; then
      _verify_failure_count=$((_verify_failure_count + 1))
      log_event -e="1" -f="${logfile}" \
        -m="Skipping verification of '${schema}.${table}': name contains an unsupported character." \
        -s="WARN"
      continue
    fi

    if row_count=$(psql "${DATABASE_URL}" -Atqc \
      "SELECT COUNT(*) FROM \"${schema}\".\"${table}\";" 2>/dev/null); then
      _verify_row_total=$((_verify_row_total + row_count))
      log_event -f="${logfile}" \
        -m="Verified ${schema}.${table}: ${row_count} row(s)." -s="INFO"
    else
      _verify_failure_count=$((_verify_failure_count + 1))
      log_event -e="1" -f="${logfile}" \
        -m="Failed to verify ${schema}.${table}: table missing or unreadable after restore." \
        -s="ERROR"
    fi
  done <<< "${expected_tables}"

  log_event -f="${logfile}" \
    -m="Verification complete. ${_verify_failure_count} failure(s), ${_verify_row_total} row(s) total." \
    -s="INFO"

  if [[ "${failures_given}" -eq 1 ]]; then
    verify_failures_out="${_verify_failure_count}"
  fi
  if [[ "${rows_given}" -eq 1 ]]; then
    verify_rows_out="${_verify_row_total}"
  fi
  return 0
}

main "$@"
