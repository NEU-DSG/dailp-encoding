#!/usr/bin/env bash
#
# export_db_to_csv.sh
#
# Connects to a PostgreSQL database and exports every table (in a given
# schema, except sqlx's own _sqlx_migrations bookkeeping table) to its
# own CSV file inside an output folder, alongside a
# manifest.csv recording each table's row count and SHA-256 checksum --
# the authoritative completeness record import_db_from_csv.sh (this
# script's inverse) relies on. Every success and failure along the way is
# recorded via log_utils.sh's create_logfile / log_event functions.
#
# Requirements:
#   - psql (PostgreSQL client) must be installed and on PATH
#   - sha256sum or shasum must be installed and on PATH (used to compute
#     manifest.csv's checksum column)
#   - log_utils.sh, file_utils.sh, pg_utils.sh, and defensive_utils.sh
#     must be present in ./utils/ next to this script
#
# Usage (unix equals-separated style; named flags are alphabetized):
#   ./export_db_to_csv.sh -d=DBNAME -h=HOST [-l=LOG_LOCATION] [-o=OUTDIR] [-p=PORT] [-s=SCHEMA] -U=USER [-w]
#   ./export_db_to_csv.sh -c=CONNECTION_STRING [-l=LOG_LOCATION] [-o=OUTDIR] [-s=SCHEMA]
#
# You will be prompted for the password interactively unless DATABASE_PASSWORD
# is already set in the environment, or you pass -w to force a prompt anyway.
# PGPASSWORD itself is never read as an input -- only ever set internally,
# from DATABASE_PASSWORD or the interactive prompt, for psql to pick up.
#
# If none of -c=/-d=/-h=/-U= are passed, DATABASE_URL is used as the
# connection string if it's set in the environment.
#
# Examples:
#   ./export_db_to_csv.sh -d=mydb -h=db.example.com -p=5432 -U=myuser
#   ./export_db_to_csv.sh -d=mydb -h=db.example.com -o=./mydb_csv -s=public -U=myuser
#   DATABASE_PASSWORD=secret ./export_db_to_csv.sh -d=mydb -h=db.example.com -U=myuser
#   DATABASE_URL="postgresql://user:pass@host:5432/dbname" ./export_db_to_csv.sh -o=./out
#
# Notes:
#   - You can also just pass a full connection string via -c= instead
#     of the individual -d=/-h=/-p=/-U= flags, e.g.:
#       ./export_db_to_csv.sh -c="postgresql://user:pass@host:5432/dbname" -o=./out
#
set -euo pipefail
# nounset (-u) is enabled: every variable in this file, and in the sourced
# log_utils.sh / file_utils.sh / pg_utils.sh / defensive_utils.sh, is
# either given an explicit default at declaration or is guaranteed to be
# assigned before it's ever read. See bash_standards.md, BASH-024.

# log_utils.sh (create_logfile, log_event) must live in ./utils/ next to
# this script. BASH_SOURCE (not $0) is used so this resolves correctly
# even if this script is sourced or invoked in an unusual way; see
# https://mywiki.wooledge.org/BashFAQ/028.
source "$(dirname "${BASH_SOURCE[0]}")/utils/log_utils.sh"
# file_utils.sh (create_file) is used directly here (for manifest.csv),
# not just transitively through create_logfile.
source "$(dirname "${BASH_SOURCE[0]}")/utils/file_utils.sh"
# pg_utils.sh (check_sha256_tool_installed, compute_sha256,
# prompt_password_if_needed, resolve_pg_target, test_connection,
# validate_schema_name) is shared with import_db_from_csv.sh.
source "$(dirname "${BASH_SOURCE[0]}")/utils/pg_utils.sh"
# defensive_utils.sh (check_command_installed, used below for the psql
# check that used to be pg_utils.sh's check_psql_installed) is shared by
# every executable in this directory.
source "$(dirname "${BASH_SOURCE[0]}")/utils/defensive_utils.sh"

#######################################
# Top-level program flow: parse arguments, set up logging, verify
# connectivity, and export every table in the target schema to CSV.
# Globals:
#   PGPASSWORD (exported by prompt_password_if_needed, unset before exit)
# Arguments:
#   $@: raw command-line arguments.
# Outputs:
#   See the individual helper functions above.
# Returns:
#   Exits 1 if any table export failed; otherwise returns 0.
#######################################
function main() {
  local conn_string=""
  local pgdb_arg=""
  local pghost_arg=""
  local log_location=""
  local outdir=""
  local pgport_arg="5432"
  local schema="public"
  local pguser_arg=""
  local ask_pass=0
  local used_database_url=0
  local arg
  local key
  local value

  for arg in "$@"; do
    case "${arg}" in
      --help)
        usage
        ;;
      -l=* | --log-location=*)
        log_location="${arg#*=}"
        ;;
      -w | -w=*)
        ask_pass=1
        ;;
      -*=*)
        key="${arg%%=*}"
        value="${arg#*=}"
        case "${key}" in
          -c) conn_string="${value}" ;;
          -d) pgdb_arg="${value}" ;;
          -h) pghost_arg="${value}" ;;
          -o) outdir="${value}" ;;
          -p) pgport_arg="${value}" ;;
          -s) schema="${value}" ;;
          -U) pguser_arg="${value}" ;;
          *)
            echo "Error: unknown option '${key}'" >&2
            usage
            ;;
        esac
        ;;
      *)
        echo "Error: invalid argument '${arg}' (expected -flag=value form)" >&2
        usage
        ;;
    esac
  done

  # Resolve the DATABASE_URL fallback, required-connection-info
  # validation, and the psql_target array via pg_utils.sh's shared
  # resolve_pg_target -- it can't call this script's own usage() (usage()
  # is script-local), so it returns 1 on validation failure and leaves
  # calling usage() to us.
  local -a psql_target
  if ! resolve_pg_target --conn_string=conn_string --pgdb_arg="${pgdb_arg}" \
    --pghost_arg="${pghost_arg}" --pgport_arg="${pgport_arg}" --pguser_arg="${pguser_arg}" \
    --psql_target=psql_target --used_database_url=used_database_url; then
    usage
  fi

  validate_schema_name --schema="${schema}"

  local dbname_for_dir="${pgdb_arg:-dailp}"
  if [[ -z "${outdir}" ]]; then
    outdir="./backups/pg_export/${dbname_for_dir}_csv_export_$(date +%Y%m%d_%H%M%S%z)"
  fi
  mkdir -p "${outdir}"

  # Log location is independent of --outdir (a fixed subfolder, not nested
  # inside each run's own timestamped export folder), matching
  # pg_dump_backup.sh/import_db_from_csv.sh/pg_restore_backup.sh's
  # -l=/--log-location= convention.
  if [[ -z "${log_location}" ]]; then
    log_location="$(pwd)/backups/pg_export/logs/"
  fi
  mkdir -p "${log_location}"

  # Creates the logfile and binds its path into logfile via nameref.
  local logfile=""
  create_logfile --location="${log_location}" --reference=logfile "export_db_to_csv"

  log_event -f="${logfile}" -m="Output folder: ${outdir}" -s="INFO"

  if [[ "${used_database_url}" -eq 1 ]]; then
    log_event -f="${logfile}" \
      -m="Using connection string from DATABASE_URL environment variable." -s="INFO"
  fi

  check_command_installed --command=psql --install-hint="the PostgreSQL client tools" --logfile="${logfile}"
  check_sha256_tool_installed --logfile="${logfile}"
  prompt_password_if_needed --ask_pass="${ask_pass}" --conn_string="${conn_string}" \
    --logfile="${logfile}" --user="${pguser_arg}"

  test_connection --logfile="${logfile}" "${psql_target[@]}"

  local tables
  tables=$(get_tables --logfile="${logfile}" --schema="${schema}" "${psql_target[@]}")

  if [[ -z "${tables}" ]]; then
    log_event -f="${logfile}" -m="No tables found in schema '${schema}'." -s="WARN"
    echo "No tables found in schema '${schema}'."
    unset PGPASSWORD
    return 0
  fi

  local failure_count=0
  local manifest_rows=""
  export_tables --failures=failure_count --logfile="${logfile}" --manifest=manifest_rows \
    --outdir="${outdir}" --schema="${schema}" --tables="${tables}" "${psql_target[@]}"

  unset PGPASSWORD

  # Written regardless of failure_count: a partial export still gets a
  # manifest covering whichever tables actually succeeded, so
  # import_db_from_csv.sh can still work with what did land.
  write_manifest --logfile="${logfile}" --manifest_rows="${manifest_rows}" --outdir="${outdir}"

  if [[ "${failure_count}" -gt 0 ]]; then
    log_event -e="${failure_count}" -f="${logfile}" \
      -m="Completed with ${failure_count} table export failure(s). See ${logfile}" -s="ERROR"
    exit 1
  fi

  log_event -f="${logfile}" -m="All tables exported successfully." -s="INFO"
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
#   Always exits 1. This is a misuse signal (bad/missing arguments), so it
#   always requires the invocation to be fixed -- never a runtime retry.
#######################################
function usage() {
  cat <<EOF
Usage: $0 -d=DBNAME -h=HOST [-l=LOG_LOCATION] [-o=OUTDIR] [-p=PORT] [-s=SCHEMA] -U=USER [-w]
   or: $0 -c=CONNECTION_STRING [-l=LOG_LOCATION] [-o=OUTDIR] [-s=SCHEMA]

  -c=CONNSTR    Full connection string/URI, alternative to -d=/-h=/-p=/-U=
  -d=DBNAME     Database name
  -h=HOST       Database host (endpoint)
  -l=LOG_LOCATION  Folder to save logs to (default: ./backups/pg_export/logs/)
  -o=OUTDIR     Output folder for CSVs (default: ./backups/pg_export/<dbname>_csv_export_<timestamp>)
  -p=PORT       Database port (default: 5432)
  -s=SCHEMA     Schema to export (default: public)
  -U=USER       Database user
  -w            Force interactive password prompt (ignore DATABASE_PASSWORD env var)
  --help        Show this help

If none of -c=/-d=/-h=/-U= are passed, DATABASE_URL is used as the
connection string if it's set in the environment.

Alongside the CSVs, writes a manifest.csv (table,csv_filename,row_count,sha256)
that import_db_from_csv.sh requires as its completeness record.
EOF
  exit 1
}

#######################################
# Fetch newline-separated table names for a schema, excluding
# _sqlx_migrations: it's sqlx's own migration-tracking table, not
# application data, and re-importing it via import_db_from_csv.sh would
# fight with sqlx's own bookkeeping on the target database.
# Globals:
#   None
# Arguments:
#   -l=PATH | --logfile=PATH   Logfile path.
#   -s=NAME | --schema=NAME    Schema name (must already be validated by
#                              the caller).
#   (remaining, unnamed)       psql connection target arguments, passed
#                              through as-is.
# Outputs:
#   Writes the newline-separated table list to STDOUT (the function's
#   actual return value, meant to be captured via command substitution).
#   Logs INFO/ERROR events via log_event; log_event now sends all of its
#   own output to STDERR internally, so it's always safe to call from
#   inside a function whose STDOUT is being captured.
# Returns:
#   Exits 1 directly (does not return) if the query itself fails: this
#   blocks everything downstream and needs operator investigation, not a
#   runtime retry.
#######################################
function get_tables() {
  local logfile=""
  local schema=""
  local -a psql_target=()
  local i
  local tables

  for i in "$@"; do
    case "$i" in
      -l=* | --logfile=*)
        logfile="${i#*=}"
        shift
        ;;
      -s=* | --schema=*)
        schema="${i#*=}"
        shift
        ;;
      *)
        psql_target+=("$i")
        ;;
    esac
  done

  if ! tables=$(psql "${psql_target[@]}" -Atqc \
    "SELECT tablename FROM pg_tables WHERE schemaname = '${schema}' AND tablename != '_sqlx_migrations' ORDER BY tablename;"); then
    log_event -e="1" -f="${logfile}" \
      -m="Failed to fetch table list for schema '${schema}'." -s="ERROR"
    exit 1
  fi

  log_event -f="${logfile}" -m="Fetched table list for schema '${schema}'." -s="INFO"

  printf '%s' "${tables}"
}

#######################################
# Export each table in --tables= to its own CSV file, logging each
# success or failure, and continuing on to the next table if one export
# fails.
# Globals:
#   None
# Arguments:
#   -f=NAME | --failures=NAME   Name of a caller-scope variable to
#                                receive the failure count (bound via
#                                nameref, following the same --reference=
#                                convention log_utils.sh's create_logfile
#                                uses).
#   -l=PATH | --logfile=PATH    Logfile path.
#   -m=NAME | --manifest=NAME   Name of a caller-scope variable to
#                                receive the manifest data rows built up
#                                for every table that exported
#                                successfully (bound via nameref;
#                                newline-separated
#                                "table,csv_filename,row_count,sha256",
#                                header not included -- see write_manifest).
#   -o=PATH | --outdir=PATH     Output directory.
#   -s=NAME | --schema=NAME     Schema name.
#   -t=STR | --tables=STR       Tables to export (newline-separated).
#   (remaining, unnamed)        psql connection target arguments, passed
#                               through as-is.
# Outputs:
#   Logs an INFO/ERROR event per table, plus INFO progress lines to
#   STDOUT, plus a final INFO summary event.
# Returns:
#   0 always. Per-table export failures are a runtime-checkable outcome
#   (a bad table shouldn't abort the whole run) -- they're counted and
#   reported back to the caller via the nameref, rather than exiting or
#   overloading the function's own exit status with a count (exit/return
#   codes are 0-255 and wrap silently past that, so they shouldn't carry
#   arbitrary data).
#######################################
function export_tables() {
  local -n failures_out
  # NOTE: needed for nounset (set -u) safety. If --failures was
  # never passed, failures_out is never bound, and unconditionally writing
  # to it later would be the *first* write to an unbound nameref -- which
  # binds it to whatever string is being assigned (the failure count
  # itself, e.g. "0"), not to a caller's variable. This flag guards that.
  local failures_given=0
  local -n manifest_out
  local manifest_given=0
  local logfile=""
  local outdir=""
  local schema=""
  local tables=""
  local -a psql_target=()
  local i

  for i in "$@"; do
    case "$i" in
      -f=* | --failures=*)
        failures_out="${i#*=}"
        failures_given=1
        shift
        ;;
      -l=* | --logfile=*)
        logfile="${i#*=}"
        shift
        ;;
      -m=* | --manifest=*)
        manifest_out="${i#*=}"
        manifest_given=1
        shift
        ;;
      -o=* | --outdir=*)
        outdir="${i#*=}"
        shift
        ;;
      -s=* | --schema=*)
        schema="${i#*=}"
        shift
        ;;
      -t=* | --tables=*)
        tables="${i#*=}"
        shift
        ;;
      *)
        psql_target+=("$i")
        ;;
    esac
  done

  local table_count
  table_count=$(echo "${tables}" | wc -l | tr -d ' ')
  log_event -f="${logfile}" -m="Found ${table_count} table(s). Exporting..." -s="INFO"

  local table_index=0
  local table
  local outfile
  local success_count=0
  # NOTE: named "_export_failure_count", not "failure_count" -- if this
  # matched whatever variable name a caller passes via --failures=, the
  # nameref above would resolve to *this* local instead of the caller's
  # variable (bash namerefs prefer the nearest same-named variable on the
  # call stack), and the count would never propagate back. 
  local _export_failure_count=0
  # NOTE: named "_export_manifest_rows", not "manifest_rows" -- same
  # nameref-collision rationale as "_export_failure_count" above: if this
  # matched whatever variable name a caller passes via --manifest=, the
  # nameref would resolve to *this* local instead of the caller's
  # variable.
  local _export_manifest_rows=""
  local rc
  local copy_output
  local row_count
  local checksum

  while IFS= read -r table; do
    [[ -z "${table}" ]] && continue
    table_index=$((table_index + 1))
    outfile="${outdir}/${table}_$(date +%Y%m%d_%H%M%S%z).csv"
    echo "[${table_index}/${table_count}] Exporting ${schema}.${table} -> ${outfile}"

    # -q (quiet) is deliberately omitted here, unlike other psql calls in
    # this file: it suppresses the "COPY <n>" command-completion tag we
    # need to parse below for the manifest's row_count column.
    if copy_output=$(psql "${psql_target[@]}" -Atc \
      "\\copy \"${schema}\".\"${table}\" TO '${outfile}' WITH (FORMAT csv, HEADER true)" \
      2>&1); then
      success_count=$((success_count + 1))
      log_event -f="${logfile}" -m="Exported ${schema}.${table} -> ${outfile}" -s="INFO"

      if [[ "${copy_output}" =~ COPY[[:space:]]+([0-9]+) ]]; then
        row_count="${BASH_REMATCH[1]}"
      else
        # Shouldn't happen if the \copy above succeeded, but a missing
        # tag must not silently produce a wrong manifest entry -- log it
        # loudly and record 0, which import_db_from_csv.sh's completeness
        # check will then correctly flag as a mismatch if the CSV isn't
        # actually empty.
        log_event -f="${logfile}" \
          -m="Could not parse a row count from psql's output for ${schema}.${table}; recording 0 in manifest.csv." \
          -s="WARN"
        row_count="0"
      fi

      checksum=$(compute_sha256 --file="${outfile}")
      _export_manifest_rows+="${table},$(basename "${outfile}"),${row_count},${checksum}"$'\n'
    else
      rc=$?
      _export_failure_count=$((_export_failure_count + 1))
      log_event -e="${rc}" -f="${logfile}" \
        -m="Failed to export ${schema}.${table} -> ${outfile}" -s="ERROR"
    fi
  done <<< "${tables}"

  log_event -f="${logfile}" \
    -m="Done. ${success_count} succeeded, ${_export_failure_count} failed, out of ${table_count} table(s). Output: ${outdir}" \
    -s="INFO"

  echo "Done. ${success_count} succeeded, ${_export_failure_count} failed, out of ${table_count} table(s)."
  echo "Output folder: ${outdir}"

  if [[ "${failures_given}" -eq 1 ]]; then
    failures_out="${_export_failure_count}"
  fi
  if [[ "${manifest_given}" -eq 1 ]]; then
    manifest_out="${_export_manifest_rows}"
  fi
  return 0
}

#######################################
# Write the completeness manifest (manifest.csv: header
# "table,csv_filename,row_count,sha256" plus one data row per
# successfully exported table) that import_db_from_csv.sh requires as
# its authoritative pre/post-import completeness record.
# Globals:
#   None
# Arguments:
#   -l=PATH | --logfile=PATH        Logfile path.
#   -m=STR | --manifest_rows=STR    Manifest data rows built by
#                                    export_tables (newline-separated
#                                    "table,csv_filename,row_count,sha256",
#                                    header not included; may be empty if
#                                    every table failed to export).
#   -o=PATH | --outdir=PATH         Output directory (manifest is written
#                                    to "${outdir}/manifest.csv").
# Outputs:
#   Logs an INFO or ERROR event via log_event.
# Returns:
#   Exits 1 directly (does not return) if manifest.csv could not be
#   created: without it, import_db_from_csv.sh has no completeness
#   record to import against, so a missing manifest is as bad as a
#   failed export.
#######################################
function write_manifest() {
  local logfile=""
  local manifest_rows=""
  local outdir=""
  local i

  for i in "$@"; do
    case "$i" in
      -l=* | --logfile=*)
        logfile="${i#*=}"
        shift
        ;;
      -m=* | --manifest_rows=*)
        manifest_rows="${i#*=}"
        shift
        ;;
      -o=* | --outdir=*)
        outdir="${i#*=}"
        shift
        ;;
    esac
  done

  local manifest_content="table,csv_filename,row_count,sha256"
  if [[ -n "${manifest_rows}" ]]; then
    # Strip the loop's trailing newline so the file doesn't end with a
    # blank line.
    manifest_content+=$'\n'"${manifest_rows%$'\n'}"
  fi

  if ! create_file --header="${manifest_content}" --directory="${outdir}" "manifest.csv"; then
    log_event -e="1" -f="${logfile}" \
      -m="Failed to write manifest.csv to ${outdir}." -s="ERROR"
    exit 1
  fi

  log_event -f="${logfile}" -m="Wrote manifest: ${outdir}/manifest.csv" -s="INFO"
}

main "$@"
