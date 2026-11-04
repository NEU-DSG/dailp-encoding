#!/usr/bin/env bash
#
# import_db_from_csv.sh
#
# TODO: Fix this prose
#
# Inverse of export_db_to_csv.sh: loads CSV files produced by that script
# (or hand-authored to match) into an existing database schema's tables,
# inside a single transaction, verifying completeness both before and
# after the import. This script is data-only -- it assumes the target
# tables/columns already exist (created by migrations or a prior schema
# restore) and never issues DDL.
#
# A manifest.csv (header: table,csv_filename,row_count,sha256) is a
# REQUIRED input, alongside INDIR's CSV files -- export_db_to_csv.sh
# writes one automatically. Without a valid manifest.csv, this script
# refuses to run: it is the sole source of the table list to import and
# the authoritative completeness record (expected row count + checksum
# per table) this script's pre/post-import checks are built around.
#
# Constraint on manifest.csv content: table names, CSV filenames, and
# checksums must not contain a comma, a single quote, or a newline --
# these are parsed as comma-separated fields and interpolated into a
# single-quoted \copy path, and are not otherwise escaped.
#
# Requirements:
#   - psql (PostgreSQL client) must be installed and on PATH
#   - sha256sum or shasum must be installed and on PATH
#   - log_utils.sh, file_utils.sh, pg_utils.sh, and defensive_utils.sh
#     must be present in ./utils/ next to this script
#
# Usage (unix equals-separated style; named flags are alphabetized):
#   ./import_db_from_csv.sh -d=DBNAME -h=HOST [-l=LOG_LOCATION] [-p=PORT] [-s=SCHEMA] [--truncate] -U=USER [-w] INDIR
#   ./import_db_from_csv.sh -c=CONNECTION_STRING [-l=LOG_LOCATION] [-s=SCHEMA] [--truncate] INDIR
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
#   ./import_db_from_csv.sh -d=mydb -h=db.example.com -U=myuser ./backups/pg_export/mydb_csv_export_20260101_120000+0000
#   ./import_db_from_csv.sh -d=mydb -h=db.example.com -U=myuser --truncate ./backups/pg_export/mydb_csv_export_20260101_120000+0000
#   DATABASE_PASSWORD=secret ./import_db_from_csv.sh -d=mydb -h=db.example.com -U=myuser ./mydb_csv
#   DATABASE_URL="postgresql://user:pass@host:5432/dbname" ./import_db_from_csv.sh ./mydb_csv
#
# Notes:
#   - You can also just pass a full connection string via -c= instead
#     of the individual -d=/-h=/-p=/-U= flags, e.g.:
#       ./import_db_from_csv.sh -c="postgresql://user:pass@host:5432/dbname" ./mydb_csv
#   - Target table state changes what this script does, and --truncate
#     is the only lever you have over it:
#       * Empty target tables (the common case: a fresh database, or a
#         schema just created by migrations): works with or without
#         --truncate -- there's nothing to truncate, and COPY has no
#         existing rows to collide with.
#       * Already-populated target tables (e.g. re-running against the
#         same INDIR a second time, or importing into a database that
#         already has overlapping data) *without* --truncate: expect a
#         duplicate-key violation as soon as COPY hits a row whose
#         primary/unique key already exists. Because the whole import
#         runs inside one --single-transaction, that one violation rolls
#         back everything in the run -- including any tables that had
#         already copied successfully earlier in the same script -- so
#         the database ends up completely unchanged, not partially
#         imported.
#       * Already-populated target tables *with* --truncate: every
#         target table is emptied (one combined TRUNCATE, inside the
#         same transaction, before any \copy runs) first, so the
#         duplicate-key case above can't happen -- this is what makes
#         reruns against the same INDIR idempotent.
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
# pg_utils.sh (check_sha256_tool_installed, compute_sha256,
# prompt_password_if_needed, resolve_pg_target, test_connection,
# validate_schema_name) is shared with export_db_to_csv.sh.
source "$(dirname "${BASH_SOURCE[0]}")/utils/pg_utils.sh"
# defensive_utils.sh (check_command_installed, ensure_dir, used below) is
# shared by every executable in this directory.
source "$(dirname "${BASH_SOURCE[0]}")/utils/defensive_utils.sh"

#######################################
# Top-level program flow: parse arguments, set up logging, load and
# validate the manifest, connect to database, run every pre-import validation, 
# import everything inside one transaction, then verify completeness.
# Globals:
#   PGPASSWORD (exported by prompt_password_if_needed, unset via trap)
# Arguments:
#   $@: raw command-line arguments.
# Outputs:
#   See the individual helper functions below.
# Returns:
#   Exits 1 on any validation/import/verification failure; otherwise
#   returns 0.
#######################################
function main() {
  local conn_string=""
  local pgdb_arg=""
  local pghost_arg=""
  local log_location=""
  local pgport_arg="5432"
  local schema="public"
  local truncate=0
  local pguser_arg=""
  local ask_pass=0
  local used_database_url=0
  local indir=""
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
      --truncate)
        truncate=1
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
          -p) pgport_arg="${value}" ;;
          -s) schema="${value}" ;;
          -U) pguser_arg="${value}" ;;
          *)
            echo "Error: unknown option '${key}'" >&2
            usage
            ;;
        esac
        ;;
      -*)
        echo "Error: unknown option '${arg}'" >&2
        usage
        ;;
      *)
        indir="${arg}"
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

  if [[ -z "${indir}" ]]; then
    echo "Error: no input directory provided" >&2
    usage
  fi

  validate_schema_name --schema="${schema}"

  if [[ -z "${log_location}" ]]; then
    log_location="$(pwd)/backups/pg_import/logs/"
  fi
  ensure_dir --reference=log_location

  local logfile=""
  create_logfile --location="${log_location}" --reference=logfile "import_db_from_csv"
  log_event -f="${logfile}" -m="Input folder: ${indir}" -s="INFO"

  if [[ "${used_database_url}" -eq 1 ]]; then
    log_event -f="${logfile}" \
      -m="Using connection string from DATABASE_URL environment variable." -s="INFO"
  fi

  validate_indir --indir="${indir}" --logfile="${logfile}"

  local manifest_map=""
  load_manifest --indir="${indir}" --logfile="${logfile}" --reference=manifest_map

  if [[ -z "${manifest_map}" ]]; then
    log_event -f="${logfile}" -m="manifest.csv lists no tables to import." -s="WARN"
    echo "manifest.csv lists no tables to import."
    return 0
  fi

  check_command_installed --command=psql --install-hint="the PostgreSQL client tools" --logfile="${logfile}"
  check_sha256_tool_installed --logfile="${logfile}"
  prompt_password_if_needed --ask_pass="${ask_pass}" --conn_string="${conn_string}" \
    --logfile="${logfile}" --user="${pguser_arg}"

  # PGPASSWORD is needed across every DB-touching call from here on
  # (connection test, pre-import validation, baseline counts, the import
  # itself, and post-import verification) -- a trap, rather than
  # exporting/unsetting around each call site individually, guarantees
  # it's unset on every exit path, including every "exit 1" failure path
  # below. Mirrors pg_restore_backup.sh's identical rationale.
  trap 'unset PGPASSWORD' EXIT

  test_connection --logfile="${logfile}" "${psql_target[@]}"

  local pre_failure_count=0
  validate_target_tables --failures=pre_failure_count --logfile="${logfile}" --schema="${schema}" \
    --table_map="${manifest_map}" "${psql_target[@]}"

  local extended_table_map=""
  validate_csv_headers --failures=pre_failure_count --indir="${indir}" --logfile="${logfile}" \
    --reference=extended_table_map --schema="${schema}" --table_map="${manifest_map}" "${psql_target[@]}"

  validate_manifest_checksums --failures=pre_failure_count --indir="${indir}" --logfile="${logfile}" \
    --table_map="${manifest_map}"

  if [[ "${pre_failure_count}" -gt 0 ]]; then
    log_event -e="${pre_failure_count}" -f="${logfile}" \
      -m="Aborting: ${pre_failure_count} pre-import validation failure(s), no changes attempted. See ${logfile}" \
      -s="ERROR"
    exit 1
  fi

  local ordered_table_map=""
  order_tables_by_dependency --logfile="${logfile}" --reference=ordered_table_map \
    --schema="${schema}" --table_map="${extended_table_map}" "${psql_target[@]}"

  local baseline_map=""
  capture_baseline_counts --logfile="${logfile}" --reference=baseline_map --schema="${schema}" \
    --table_map="${ordered_table_map}" "${psql_target[@]}"

  local scriptfile=""
  generate_import_script --indir="${indir}" --logfile="${logfile}" --outdir="${log_location}" \
    --reference=scriptfile --schema="${schema}" --table_map="${ordered_table_map}" --truncate="${truncate}"

  local output_file=""
  run_import --logfile="${logfile}" --reference=output_file --scriptfile="${scriptfile}" "${psql_target[@]}"

  local copy_counts=""
  parse_copy_counts --logfile="${logfile}" --output_file="${output_file}" --reference=copy_counts

  sanity_check_csv_line_counts --copy_counts="${copy_counts}" --indir="${indir}" --logfile="${logfile}" \
    --schema="${schema}" --table_map="${ordered_table_map}"

  local post_failure_count=0
  local total_rows=0
  verify_post_import --baseline="${baseline_map}" --copy_counts="${copy_counts}" \
    --failures=post_failure_count --logfile="${logfile}" --rows=total_rows --schema="${schema}" \
    --table_map="${ordered_table_map}" --truncate="${truncate}" "${psql_target[@]}"

  local table_count
  table_count=$(echo "${ordered_table_map}" | wc -l | tr -d ' ')

  if [[ "${post_failure_count}" -gt 0 ]]; then
    log_event -e="${post_failure_count}" -f="${logfile}" \
      -m="Import committed but ${post_failure_count}/${table_count} table(s) failed post-import verification. See ${logfile}" \
      -s="ERROR"
    exit 1
  fi

  log_event -f="${logfile}" \
    -m="Import verified: ${table_count}/${table_count} table(s) imported, ${total_rows} row(s) total." \
    -s="INFO"
  echo "Import verified: ${table_count}/${table_count} table(s) imported, ${total_rows} row(s) total."
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
Usage: $0 -d=DBNAME -h=HOST [-l=LOG_LOCATION] [-p=PORT] [-s=SCHEMA] [--truncate] -U=USER [-w] INDIR
   or: $0 -c=CONNECTION_STRING [-l=LOG_LOCATION] [-s=SCHEMA] [--truncate] INDIR

  -c=CONNSTR    Full connection string/URI, alternative to -d=/-h=/-p=/-U=
  -d=DBNAME     Database name
  -h=HOST       Database host (endpoint)
  -l=LOG_LOCATION  Folder to save logs to (default: ./backups/pg_import/logs/)
  -p=PORT       Database port (default: 5432)
  -s=SCHEMA     Schema to import into (default: public)
  --truncate    TRUNCATE each target table (inside the same transaction as
                its import) before loading it. Off by default. Needed for
                a rerun against a database that already has overlapping
                rows -- without it, expect a duplicate-key violation that
                rolls back the whole run (nothing partial gets committed).
  -U=USER       Database user
  -w            Force interactive password prompt (ignore DATABASE_PASSWORD env var)
  --help        Show this help
  INDIR         Directory containing manifest.csv and the CSV files it
                references (as produced by export_db_to_csv.sh, or
                hand-authored to match). Required.

If none of -c=/-d=/-h=/-U= are passed, DATABASE_URL is used as the
connection string if it's set in the environment.

INDIR must contain a manifest.csv (header:
table,csv_filename,row_count,sha256) -- this is required, not optional;
the script exits with an error if it's missing.
EOF
  exit 1
}

#######################################
# Verify the input directory exists and is readable.
# Globals:
#   None
# Arguments:
#   -i=PATH | --indir=PATH     Input directory.
#   -l=PATH | --logfile=PATH   Logfile path.
# Outputs:
#   Logs an ERROR event via log_event on failure.
# Returns:
#   Exits 1 directly (does not return) if the directory is missing or
#   unreadable.
#######################################
function validate_indir() {
  local indir=""
  local logfile=""
  local i

  for i in "$@"; do
    case "$i" in
      -i=* | --indir=*)
        indir="${i#*=}"
        shift
        ;;
      -l=* | --logfile=*)
        logfile="${i#*=}"
        shift
        ;;
    esac
  done

  if [[ ! -d "${indir}" || ! -r "${indir}" ]]; then
    log_event -e="1" -f="${logfile}" \
      -m="Input directory '${indir}' does not exist or is not readable." -s="ERROR"
    exit 1
  fi
}

#######################################
# Load and parse INDIR's manifest.csv -- the required source of the
# table list to import, plus each table's expected row count and
# checksum. This is a top-level precondition (like validate_indir), not
# an aggregated per-table failure: without a valid manifest there is
# nothing downstream can meaningfully validate against.
# Globals:
#   None
# Arguments:
#   -i=PATH | --indir=PATH        Input directory.
#   -l=PATH | --logfile=PATH      Logfile path.
#   -r=NAME | --reference=NAME    Name of a caller-scope variable (must
#                                 currently be empty) that will be set to
#                                 the parsed table map: newline-separated
#                                 "table,csv_filename,row_count,sha256"
#                                 rows (header not included). Left empty
#                                 if the manifest lists zero tables.
# Outputs:
#   Logs an INFO or ERROR event via log_event.
# Returns:
#   Exits 1 directly (does not return) if manifest.csv is missing,
#   unreadable, has the wrong header, or contains a malformed row.
#   Returns 0 on success (including the zero-table case).
#######################################
function load_manifest() {
  local indir=""
  local logfile=""
  local -n reference
  local reference_given=0
  local i

  for i in "$@"; do
    case "$i" in
      -i=* | --indir=*)
        indir="${i#*=}"
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

  local manifest_file="${indir}/manifest.csv"

  if [[ ! -f "${manifest_file}" || ! -r "${manifest_file}" ]]; then
    log_event -e="1" -f="${logfile}" \
      -m="No readable manifest.csv found at ${manifest_file}. import_db_from_csv.sh requires a manifest written by export_db_to_csv.sh (or a hand-authored one following the same header/column schema) -- see README." \
      -s="ERROR"
    exit 1
  fi

  local header
  header="$(head -n1 "${manifest_file}")"
  if [[ "${header}" != "table,csv_filename,row_count,sha256" ]]; then
    log_event -e="1" -f="${logfile}" \
      -m="Malformed manifest.csv at ${manifest_file}: expected header 'table,csv_filename,row_count,sha256', got '${header}'." \
      -s="ERROR"
    exit 1
  fi

  local rows=""
  local line
  local line_no=0
  local table
  local csv_filename
  local row_count
  local sha256

  while IFS= read -r line; do
    line_no=$((line_no + 1))
    [[ "${line_no}" -eq 1 ]] && continue
    [[ -z "${line}" ]] && continue

    IFS=',' read -r table csv_filename row_count sha256 <<< "${line}"

    if [[ -z "${table}" || -z "${csv_filename}" || ! "${row_count}" =~ ^[0-9]+$ || -z "${sha256}" ]]; then
      log_event -e="1" -f="${logfile}" \
        -m="Malformed manifest.csv row at ${manifest_file}:${line_no}: '${line}'." -s="ERROR"
      exit 1
    fi

    if [[ "${csv_filename}" == *"'"* || "${table}" == *"'"* ]]; then
      log_event -e="1" -f="${logfile}" \
        -m="manifest.csv row at ${manifest_file}:${line_no} contains an unsupported single-quote character in table/csv_filename." \
        -s="ERROR"
      exit 1
    fi

    rows+="${table},${csv_filename},${row_count},${sha256}"$'\n'
  done < "${manifest_file}"

  log_event -f="${logfile}" -m="Loaded manifest: ${manifest_file}" -s="INFO"

  if [[ "${reference_given}" -eq 1 ]]; then
    reference="${rows%$'\n'}"
  fi
}

#######################################
# Verify every manifest-listed table actually exists in the target
# schema.
# Globals:
#   None
# Arguments:
#   -f=NAME | --failures=NAME   Name of a caller-scope variable to
#                                accumulate the failure count into
#                                (nameref; ADDS to any existing value,
#                                since this is one of three functions
#                                that share one running pre-import
#                                failure total across separate calls).
#   -l=PATH | --logfile=PATH    Logfile path.
#   -s=NAME | --schema=NAME     Schema name.
#   -t=STR | --table_map=STR    Manifest table map (newline-separated
#                                "table,csv_filename,row_count,sha256").
#   (remaining, unnamed)        psql connection target arguments, passed
#                               through as-is.
# Outputs:
#   Logs an INFO/ERROR event per table.
# Returns:
#   0 always; failures are aggregated and reported via the nameref.
#######################################
function validate_target_tables() {
  local -n failures_out
  local failures_given=0
  local logfile=""
  local schema=""
  local table_map=""
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
      -s=* | --schema=*)
        schema="${i#*=}"
        shift
        ;;
      -t=* | --table_map=*)
        table_map="${i#*=}"
        shift
        ;;
      *)
        psql_target+=("$i")
        ;;
    esac
  done

  local _validate_tables_failure_count=0
  local line
  local table
  local csv_filename
  local row_count
  local sha256
  local exists

  while IFS= read -r line; do
    [[ -z "${line}" ]] && continue
    IFS=',' read -r table csv_filename row_count sha256 <<< "${line}"

    if ! exists=$(psql "${psql_target[@]}" -Atqc \
      "SELECT to_regclass('\"${schema}\".\"${table}\"') IS NOT NULL;" 2>/dev/null); then
      _validate_tables_failure_count=$((_validate_tables_failure_count + 1))
      log_event -e="1" -f="${logfile}" \
        -m="Failed to check existence of target table ${schema}.${table}." -s="ERROR"
      continue
    fi

    if [[ "${exists}" != "t" ]]; then
      _validate_tables_failure_count=$((_validate_tables_failure_count + 1))
      log_event -e="1" -f="${logfile}" \
        -m="Target table ${schema}.${table} does not exist. Cannot import ${csv_filename}." -s="ERROR"
      continue
    fi

    log_event -f="${logfile}" -m="Target table ${schema}.${table} exists." -s="INFO"
  done <<< "${table_map}"

  if [[ "${failures_given}" -eq 1 ]]; then
    failures_out=$((failures_out + _validate_tables_failure_count))
  fi
  return 0
}

#######################################
# Validate each manifest-listed CSV's header row against the target
# table's actual columns, and extend the table map with an explicit,
# validated column list per table (used later to build a column-list
# \copy that's immune to positional column-order drift between export
# and import).
# Globals:
#   None
# Arguments:
#   -f=NAME | --failures=NAME     Failure count accumulator (nameref;
#                                 ADDS to any existing value -- see
#                                 validate_target_tables).
#   -i=PATH | --indir=PATH        Input directory.
#   -l=PATH | --logfile=PATH      Logfile path.
#   -r=NAME | --reference=NAME    Name of a caller-scope variable (must
#                                 currently be empty) that will be set to
#                                 the extended table map:
#                                 newline-separated
#                                 "table,csv_filename,row_count,sha256,cols"
#                                 rows, where cols is a "|"-joined list of
#                                 validated column names (only tables that
#                                 passed validation are included).
#   -s=NAME | --schema=NAME       Schema name.
#   -t=STR | --table_map=STR      Manifest table map.
#   (remaining, unnamed)          psql connection target arguments.
# Outputs:
#   Logs an INFO/ERROR event per table.
# Returns:
#   0 always; failures are aggregated and reported via the nameref.
#######################################
function validate_csv_headers() {
  local -n failures_out
  local failures_given=0
  local indir=""
  local logfile=""
  local -n reference
  local reference_given=0
  local schema=""
  local table_map=""
  local -a psql_target=()
  local i

  for i in "$@"; do
    case "$i" in
      -f=* | --failures=*)
        failures_out="${i#*=}"
        failures_given=1
        shift
        ;;
      -i=* | --indir=*)
        indir="${i#*=}"
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
      -s=* | --schema=*)
        schema="${i#*=}"
        shift
        ;;
      -t=* | --table_map=*)
        table_map="${i#*=}"
        shift
        ;;
      *)
        psql_target+=("$i")
        ;;
    esac
  done

  local _validate_headers_failure_count=0
  local _validate_headers_extended_map=""
  local line
  local table
  local csv_filename
  local row_count
  local sha256
  local csvfile
  local header_line
  local -a header_cols
  local columns_info
  local col_name
  local col_nullable
  local col_default
  local col_is_generated
  local -a db_cols
  local -a required_missing
  local -a unknown_cols
  local found
  local hc
  local dc
  local joined_cols

  while IFS= read -r line; do
    [[ -z "${line}" ]] && continue
    IFS=',' read -r table csv_filename row_count sha256 <<< "${line}"
    csvfile="${indir}/${csv_filename}"

    header_line="$(head -n1 "${csvfile}" 2>/dev/null || true)"
    if [[ -z "${header_line}" ]]; then
      _validate_headers_failure_count=$((_validate_headers_failure_count + 1))
      log_event -e="1" -f="${logfile}" \
        -m="Could not read a header row from ${csvfile} (missing, unreadable, or empty)." -s="ERROR"
      continue
    fi

    IFS=',' read -ra header_cols <<< "${header_line}"

    columns_info=$(psql "${psql_target[@]}" -Atqc \
      "SELECT column_name || '|' || is_nullable || '|' || COALESCE(column_default, '') || '|' || is_generated FROM information_schema.columns WHERE table_schema = '${schema}' AND table_name = '${table}' ORDER BY ordinal_position;" \
      2>/dev/null)

    if [[ -z "${columns_info}" ]]; then
      _validate_headers_failure_count=$((_validate_headers_failure_count + 1))
      log_event -e="1" -f="${logfile}" \
        -m="Could not fetch column metadata for ${schema}.${table}." -s="ERROR"
      continue
    fi

    db_cols=()
    required_missing=()
    unknown_cols=()

    while IFS='|' read -r col_name col_nullable col_default col_is_generated; do
      [[ -z "${col_name}" ]] && continue
      db_cols+=("${col_name}")
      # GENERATED ALWAYS columns report is_nullable=NO with no column_default,
      # same as a genuinely required column -- but Postgres computes their
      # value automatically and refuses to let COPY (either direction)
      # reference them at all, so a plain-table export legitimately never
      # has them in its CSV. Excluding is_generated='ALWAYS' columns here
      # avoids flagging that expected absence as data loss.
      if [[ "${col_nullable}" == "NO" && -z "${col_default}" && "${col_is_generated}" != "ALWAYS" ]]; then
        found=0
        for hc in "${header_cols[@]}"; do
          if [[ "${hc}" == "${col_name}" ]]; then
            found=1
            break
          fi
        done
        [[ "${found}" -eq 0 ]] && required_missing+=("${col_name}")
      fi
    done <<< "${columns_info}"

    for hc in "${header_cols[@]}"; do
      found=0
      for dc in "${db_cols[@]}"; do
        if [[ "${hc}" == "${dc}" ]]; then
          found=1
          break
        fi
      done
      [[ "${found}" -eq 0 ]] && unknown_cols+=("${hc}")
    done

    if [[ "${#unknown_cols[@]}" -gt 0 ]]; then
      _validate_headers_failure_count=$((_validate_headers_failure_count + 1))
      log_event -e="1" -f="${logfile}" \
        -m="${csvfile} has column(s) not present on ${schema}.${table}: ${unknown_cols[*]}." -s="ERROR"
    fi

    if [[ "${#required_missing[@]}" -gt 0 ]]; then
      _validate_headers_failure_count=$((_validate_headers_failure_count + 1))
      log_event -e="1" -f="${logfile}" \
        -m="${csvfile} is missing required (NOT NULL, no default) column(s) for ${schema}.${table}: ${required_missing[*]}." \
        -s="ERROR"
    fi

    if [[ "${#unknown_cols[@]}" -eq 0 && "${#required_missing[@]}" -eq 0 ]]; then
      joined_cols=$(IFS='|'; echo "${header_cols[*]}")
      _validate_headers_extended_map+="${table},${csv_filename},${row_count},${sha256},${joined_cols}"$'\n'
      log_event -f="${logfile}" -m="Validated header for ${schema}.${table} against ${csvfile}." -s="INFO"
    fi
  done <<< "${table_map}"

  if [[ "${failures_given}" -eq 1 ]]; then
    failures_out=$((failures_out + _validate_headers_failure_count))
  fi
  if [[ "${reference_given}" -eq 1 ]]; then
    reference="${_validate_headers_extended_map%$'\n'}"
  fi
  return 0
}

#######################################
# Recompute each manifest-listed CSV's SHA-256 checksum and require it to
# match the manifest's recorded value -- a hard, required pre-import gate
# (not provenance-only): a mismatch means the file was altered, truncated,
# or corrupted since export.
# Globals:
#   None
# Arguments:
#   -f=NAME | --failures=NAME   Failure count accumulator (nameref; ADDS
#                                to any existing value -- see
#                                validate_target_tables).
#   -i=PATH | --indir=PATH      Input directory.
#   -l=PATH | --logfile=PATH    Logfile path.
#   -t=STR | --table_map=STR    Manifest table map.
# Outputs:
#   Logs an INFO/ERROR event per table.
# Returns:
#   0 always; failures are aggregated and reported via the nameref.
#######################################
function validate_manifest_checksums() {
  local -n failures_out
  local failures_given=0
  local indir=""
  local logfile=""
  local table_map=""
  local i

  for i in "$@"; do
    case "$i" in
      -f=* | --failures=*)
        failures_out="${i#*=}"
        failures_given=1
        shift
        ;;
      -i=* | --indir=*)
        indir="${i#*=}"
        shift
        ;;
      -l=* | --logfile=*)
        logfile="${i#*=}"
        shift
        ;;
      -t=* | --table_map=*)
        table_map="${i#*=}"
        shift
        ;;
    esac
  done

  local _validate_checksums_failure_count=0
  local line
  local table
  local csv_filename
  local row_count
  local sha256
  local csvfile
  local actual_sha256

  while IFS= read -r line; do
    [[ -z "${line}" ]] && continue
    IFS=',' read -r table csv_filename row_count sha256 <<< "${line}"
    csvfile="${indir}/${csv_filename}"

    if [[ ! -f "${csvfile}" || ! -r "${csvfile}" || ! -s "${csvfile}" ]]; then
      _validate_checksums_failure_count=$((_validate_checksums_failure_count + 1))
      log_event -e="1" -f="${logfile}" \
        -m="${csvfile} (for ${table}) does not exist, is not readable, or is empty." -s="ERROR"
      continue
    fi

    actual_sha256=$(compute_sha256 --file="${csvfile}")

    if [[ "${actual_sha256}" != "${sha256}" ]]; then
      _validate_checksums_failure_count=$((_validate_checksums_failure_count + 1))
      log_event -e="1" -f="${logfile}" \
        -m="Checksum mismatch for ${csvfile}: manifest recorded ${sha256}, actual is ${actual_sha256}. File may have been altered or corrupted since export." \
        -s="ERROR"
      continue
    fi

    log_event -f="${logfile}" -m="Checksum verified for ${csvfile}." -s="INFO"
  done <<< "${table_map}"

  if [[ "${failures_given}" -eq 1 ]]; then
    failures_out=$((failures_out + _validate_checksums_failure_count))
  fi
  return 0
}

#######################################
# Capture each target table's pre-import row count, needed to compute the
# expected post-import count in append (non-truncate) mode -- no baseline
# was ever recorded at export time, since manifest.csv records the
# *source* row count, not the target database's pre-existing one.
# Globals:
#   None
# Arguments:
#   -l=PATH | --logfile=PATH      Logfile path.
#   -r=NAME | --reference=NAME    Name of a caller-scope variable (must
#                                 currently be empty) that will be set to
#                                 the baseline map: newline-separated
#                                 "schema.table,count" rows.
#   -s=NAME | --schema=NAME       Schema name.
#   -t=STR | --table_map=STR      Extended table map.
#   (remaining, unnamed)          psql connection target arguments.
# Outputs:
#   Logs an INFO event per table.
# Returns:
#   0 always.
#######################################
function capture_baseline_counts() {
  local logfile=""
  local -n reference
  local reference_given=0
  local schema=""
  local table_map=""
  local -a psql_target=()
  local i

  for i in "$@"; do
    case "$i" in
      -l=* | --logfile=*)
        logfile="${i#*=}"
        shift
        ;;
      -r=* | --reference=*)
        reference="${i#*=}"
        reference_given=1
        shift
        ;;
      -s=* | --schema=*)
        schema="${i#*=}"
        shift
        ;;
      -t=* | --table_map=*)
        table_map="${i#*=}"
        shift
        ;;
      *)
        psql_target+=("$i")
        ;;
    esac
  done

  local baseline=""
  local line
  local table
  local rest
  local count

  while IFS= read -r line; do
    [[ -z "${line}" ]] && continue
    IFS=',' read -r table rest <<< "${line}"

    if ! count=$(psql "${psql_target[@]}" -Atqc "SELECT COUNT(*) FROM \"${schema}\".\"${table}\";" 2>/dev/null); then
      count=0
    fi
    baseline+="${schema}.${table},${count}"$'\n'
    log_event -f="${logfile}" -m="Baseline row count for ${schema}.${table}: ${count}." -s="INFO"
  done <<< "${table_map}"

  if [[ "${reference_given}" -eq 1 ]]; then
    reference="${baseline%$'\n'}"
  fi
}

#######################################
# Reorder --table_map= so every table comes after every other table it
# has a foreign key into (a topological sort by FK dependency), so
# generate_import_script's per-table \copy order won't violate a foreign
# key constraint.
#
# This matters because generate_import_script's "SET CONSTRAINTS ALL
# DEFERRED" only postpones checking constraints that were declared
# DEFERRABLE when created -- none of this schema's foreign keys are
# (grep types/migrations/ for "deferrable": zero hits), so Postgres's
# default (NOT DEFERRABLE INITIALLY IMMEDIATE) applies to all of them and
# every FK is checked immediately, mid-transaction, as each row is
# copied in. Without this reordering, --table_map='s incoming order (the
# manifest's, which is alphabetical -- see export_db_to_csv.sh's
# `ORDER BY tablename`) can and does put a child table before a parent
# it references (e.g. character_transcription before document_page),
# which fails with a foreign-key violation as soon as that child's
# \copy runs, even though the parent's own \copy appears later in the
# very same script.
#
# Cycles (a table referencing itself, or two-or-more tables referencing
# each other in a loop) can't be resolved by table-level reordering
# alone -- they're left in their original relative order and logged as
# a WARN; this is a pre-existing hazard (same as before this function
# existed for any table not part of a cycle), not a regression.
# Globals:
#   None
# Arguments:
#   -l=PATH | --logfile=PATH     Logfile path.
#   -r=NAME | --reference=NAME   Name of a caller-scope variable (must
#                                 currently be empty) that will be set to
#                                 the reordered table map (same
#                                 newline-separated row format as the
#                                 input -- rows are only reordered, never
#                                 altered).
#   -s=NAME | --schema=NAME      Schema name.
#   -t=STR | --table_map=STR     Extended table map to reorder.
#   (remaining, unnamed)         psql connection target arguments.
# Outputs:
#   Logs an INFO event summarizing the result, plus a WARN event listing
#   any dependency cycle found.
# Returns:
#   Exits 1 directly (does not return) if the FK-edge query itself
#   fails: without it, there's no safe way to know whether the incoming
#   order is safe to use as-is.
#######################################
function order_tables_by_dependency() {
  local logfile=""
  local -n reference
  local reference_given=0
  local schema=""
  local table_map=""
  local -a psql_target=()
  local i

  for i in "$@"; do
    case "$i" in
      -l=* | --logfile=*)
        logfile="${i#*=}"
        shift
        ;;
      -r=* | --reference=*)
        reference="${i#*=}"
        reference_given=1
        shift
        ;;
      -s=* | --schema=*)
        schema="${i#*=}"
        shift
        ;;
      -t=* | --table_map=*)
        table_map="${i#*=}"
        shift
        ;;
      *)
        psql_target+=("$i")
        ;;
    esac
  done

  local -a table_order=()
  local -A table_line
  local line
  local table
  local rest

  while IFS= read -r line; do
    [[ -z "${line}" ]] && continue
    IFS=',' read -r table rest <<< "${line}"
    table_order+=("${table}")
    table_line["${table}"]="${line}"
  done <<< "${table_map}"

  local edges
  if ! edges=$(psql "${psql_target[@]}" -Atqc \
    "SELECT DISTINCT tc.table_name || '|' || ccu.table_name FROM information_schema.table_constraints tc JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name AND tc.constraint_schema = ccu.constraint_schema WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = '${schema}';" \
    2>/dev/null); then
    log_event -e="1" -f="${logfile}" \
      -m="Failed to fetch foreign key dependencies for schema '${schema}'." -s="ERROR"
    exit 1
  fi

  # in_degree[child]: number of not-yet-placed parents (within this
  # import's own table set) child still depends on. adjacency[parent] is
  # a space-separated list of children that depend on parent. Edges
  # where either side isn't in this import's own table set, or that are
  # a self-reference, impose no ordering constraint here and are skipped.
  local -A in_table
  for table in "${table_order[@]}"; do
    in_table["${table}"]=1
  done

  local -A in_degree
  local -A adjacency
  for table in "${table_order[@]}"; do
    in_degree["${table}"]=0
  done

  local edge child parent
  while IFS='|' read -r child parent; do
    [[ -z "${child}" ]] && continue
    [[ "${child}" == "${parent}" ]] && continue
    [[ -n "${in_table[${child}]:-}" && -n "${in_table[${parent}]:-}" ]] || continue
    adjacency["${parent}"]+="${child} "
    in_degree["${child}"]=$((in_degree["${child}"] + 1))
  done <<< "${edges}"

  # Repeated-pass topological sort: each pass peels off every
  # still-remaining table with no unplaced dependencies, in their
  # original (alphabetical) relative order, which keeps the output as
  # close to the original order as the dependency graph allows. A pass
  # that places nothing means whatever's left is a dependency cycle.
  local -a remaining=("${table_order[@]}")
  local -a ordered=()
  local -a next_remaining
  local progress
  local dep

  while [[ "${#remaining[@]}" -gt 0 ]]; do
    progress=0
    next_remaining=()
    for table in "${remaining[@]}"; do
      if [[ "${in_degree[${table}]}" -eq 0 ]]; then
        ordered+=("${table}")
        progress=1
        for dep in ${adjacency[${table}]:-}; do
          in_degree["${dep}"]=$((in_degree["${dep}"] - 1))
        done
      else
        next_remaining+=("${table}")
      fi
    done
    remaining=("${next_remaining[@]}")
    if [[ "${progress}" -eq 0 ]]; then
      log_event -f="${logfile}" \
        -m="Foreign key dependency cycle involving: ${remaining[*]}. Importing them in their original relative order; this may still fail if any of them has a non-deferrable FK into another table in the cycle." \
        -s="WARN"
      ordered+=("${remaining[@]}")
      break
    fi
  done

  local ordered_map=""
  for table in "${ordered[@]}"; do
    ordered_map+="${table_line[${table}]}"$'\n'
  done

  log_event -f="${logfile}" -m="Reordered ${#ordered[@]} table(s) for FK-safe import: ${ordered[*]}" -s="INFO"

  if [[ "${reference_given}" -eq 1 ]]; then
    reference="${ordered_map%$'\n'}"
  fi
}

#######################################
# Generate a psql script that imports every table in --table_map= inside
# a single transaction: --single-transaction (applied by run_import, not
# here) wraps the whole -f script in BEGIN/COMMIT, and each table's
# import is bracketed with \echo markers so parse_copy_counts can later
# attribute each "COPY <n>" line back to its table unambiguously.
# Globals:
#   None
# Arguments:
#   -i=PATH | --indir=PATH        Input directory (CSV paths are resolved
#                                 relative to this).
#   -l=PATH | --logfile=PATH      Logfile path.
#   -o=PATH | --outdir=PATH       Directory the generated .sql file itself
#                                 is written to (the run's log location).
#   -r=NAME | --reference=NAME    Name of a caller-scope variable (must
#                                 currently be empty) that will be set to
#                                 the generated script's path.
#   -s=NAME | --schema=NAME       Schema name.
#   -t=STR | --table_map=STR      Extended table map (must include each
#                                 table's validated column list).
#   -u=0|1 | --truncate=0|1       1: emit "TRUNCATE ONLY" for each table,
#                                 inside the same transaction, immediately
#                                 before its \copy.
# Outputs:
#   Logs an INFO event via log_event.
# Returns:
#   0 always.
#######################################
function generate_import_script() {
  local indir=""
  local logfile=""
  local outdir=""
  local -n reference
  local reference_given=0
  local schema=""
  local table_map=""
  local truncate=0
  local i

  for i in "$@"; do
    case "$i" in
      -i=* | --indir=*)
        indir="${i#*=}"
        shift
        ;;
      -l=* | --logfile=*)
        logfile="${i#*=}"
        shift
        ;;
      -o=* | --outdir=*)
        outdir="${i#*=}"
        shift
        ;;
      -r=* | --reference=*)
        reference="${i#*=}"
        reference_given=1
        shift
        ;;
      -s=* | --schema=*)
        schema="${i#*=}"
        shift
        ;;
      -t=* | --table_map=*)
        table_map="${i#*=}"
        shift
        ;;
      -u=* | --truncate=*)
        truncate="${i#*=}"
        shift
        ;;
    esac
  done

  # NOTE: named "_generated_scriptfile", not "scriptfile" -- if this
  # matched whatever variable name a caller passes via --reference=
  # (every call site in this file uses "scriptfile"), the nameref above
  # would resolve to *this* local instead of the caller's variable (bash
  # namerefs prefer the nearest same-named variable on the call stack),
  # and the path would never propagate back. Same rationale as
  # "_export_failure_count" elsewhere in this codebase.
  local _generated_scriptfile="${outdir}/pg_import_$(date +%Y%m%d_%H%M%S%z).sql"
  local line
  local table
  local csv_filename
  local row_count
  local sha256
  local columns_joined
  local -a col_arr
  local quoted_cols
  local c
  local abs_csv_path
  local copy_line
  local -a truncate_targets=()
  local truncate_line

  # Postgres refuses TRUNCATE on a table another (live) table still holds
  # a foreign key against, EVEN with SET CONSTRAINTS ALL DEFERRED above --
  # that only defers row-level FK checks (for INSERT/UPDATE/DELETE), not
  # TRUNCATE's own separate, immediate referential-safety check. So a
  # per-table "TRUNCATE ONLY tbl;" right before each \copy (as this used
  # to do) fails as soon as any two FK-related tables are both being
  # imported: truncating the referenced table first fails because the
  # referencing table hasn't been truncated *yet* in the same statement.
  # Postgres's own answer is to truncate every FK-related table together
  # in ONE statement -- so all of --truncate='s targets are collected
  # up front and truncated in a single combined TRUNCATE before any
  # \copy runs, rather than interleaved per table. (CASCADE is still
  # deliberately not used: a table outside this import's own set that
  # references one of these tables will still make TRUNCATE fail loudly,
  # exactly as documented.)
  if [[ "${truncate}" -eq 1 ]]; then
    while IFS= read -r line; do
      [[ -z "${line}" ]] && continue
      IFS=',' read -r table csv_filename row_count sha256 columns_joined <<< "${line}"
      truncate_targets+=("\"${schema}\".\"${table}\"")
    done <<< "${table_map}"
  fi

  {
    printf '%s\n' '\set ON_ERROR_STOP on'
    printf '%s\n' 'SET CONSTRAINTS ALL DEFERRED;'

    if [[ "${#truncate_targets[@]}" -gt 0 ]]; then
      truncate_line="TRUNCATE ONLY $(
        IFS=','
        echo "${truncate_targets[*]}"
      );"
      printf '\n'
      printf '%s\n' "${truncate_line}"
    fi
    printf '\n'

    while IFS= read -r line; do
      [[ -z "${line}" ]] && continue
      IFS=',' read -r table csv_filename row_count sha256 columns_joined <<< "${line}"

      IFS='|' read -ra col_arr <<< "${columns_joined}"
      quoted_cols=""
      for c in "${col_arr[@]}"; do
        if [[ -n "${quoted_cols}" ]]; then
          quoted_cols+=", "
        fi
        quoted_cols+="\"${c}\""
      done

      abs_csv_path="${indir}/${csv_filename}"

      printf '%s\n' "\\echo @@@COPY_START ${schema}.${table}"
      copy_line="\\copy \"${schema}\".\"${table}\" (${quoted_cols}) FROM '${abs_csv_path}' WITH (FORMAT csv, HEADER true)"
      printf '%s\n' "${copy_line}"
      printf '%s\n' "\\echo @@@COPY_END ${schema}.${table}"
      printf '\n'
    done <<< "${table_map}"
  } > "${_generated_scriptfile}"

  log_event -f="${logfile}" -m="Generated import script: ${_generated_scriptfile}" -s="INFO"

  if [[ "${reference_given}" -eq 1 ]]; then
    reference="${_generated_scriptfile}"
  fi
}

#######################################
# Run the generated import script inside a single transaction.
# --single-transaction wraps the entire -f script (including every \copy
# meta-command in it) in one BEGIN/COMMIT; ON_ERROR_STOP=1 means any
# failure anywhere in the script rolls back everything, leaving the
# target database exactly as it was beforehand.
# Globals:
#   PGPASSWORD   Read; must already be exported by the caller.
# Arguments:
#   -l=PATH | --logfile=PATH      Logfile path.
#   -r=NAME | --reference=NAME    Name of a caller-scope variable (must
#                                 currently be empty) that will be set to
#                                 the path of the captured combined
#                                 stdout/stderr output file.
#   -s=PATH | --scriptfile=PATH   Path to the generated .sql script.
#   (remaining, unnamed)          psql connection target arguments.
# Outputs:
#   Logs an INFO/ERROR event via log_event.
# Returns:
#   Exits 1 directly (does not return) if psql fails: nothing was
#   committed (--single-transaction), so this is retryable once the
#   underlying cause (e.g. a duplicate-key violation on a rerun without
#   --truncate) is addressed.
#######################################
function run_import() {
  local logfile=""
  local -n reference
  local reference_given=0
  local scriptfile=""
  local -a psql_target=()
  local i

  for i in "$@"; do
    case "$i" in
      -l=* | --logfile=*)
        logfile="${i#*=}"
        shift
        ;;
      -r=* | --reference=*)
        reference="${i#*=}"
        reference_given=1
        shift
        ;;
      -s=* | --scriptfile=*)
        scriptfile="${i#*=}"
        shift
        ;;
      *)
        psql_target+=("$i")
        ;;
    esac
  done

  # NOTE: named "_run_import_output_file", not "output_file" -- same
  # nameref-collision rationale as "_generated_scriptfile" in
  # generate_import_script: every call site in this file binds this
  # function's --reference= to a caller variable named "output_file".
  local _run_import_output_file="${scriptfile%.sql}.out"

  log_event -f="${logfile}" -m="Running import inside a single transaction: ${scriptfile}" -s="INFO"

  if ! psql "${psql_target[@]}" --single-transaction -v ON_ERROR_STOP=1 -f "${scriptfile}" \
    > "${_run_import_output_file}" 2>&1; then
    log_event -e="1" -f="${logfile}" \
      -m="Import failed and was rolled back -- no changes were committed. See ${_run_import_output_file} for details." \
      -s="ERROR"
    exit 1
  fi

  log_event -f="${logfile}" -m="Import transaction committed successfully." -s="INFO"

  if [[ "${reference_given}" -eq 1 ]]; then
    reference="${_run_import_output_file}"
  fi
}

#######################################
# Parse each table's authoritative "COPY <n>" row count straight from
# psql's own captured output, using the \echo @@@COPY_START/@@@COPY_END
# markers generate_import_script wrote -- self-labeling, so this doesn't
# depend on fragile ordinal position.
# Globals:
#   None
# Arguments:
#   -l=PATH | --logfile=PATH       Logfile path.
#   -o=PATH | --output_file=PATH   Captured psql output file (from
#                                  run_import).
#   -r=NAME | --reference=NAME     Name of a caller-scope variable (must
#                                  currently be empty) that will be set to
#                                  the copy-counts map: newline-separated
#                                  "schema.table,n" rows.
# Outputs:
#   Logs an INFO event via log_event.
# Returns:
#   0 always.
#######################################
function parse_copy_counts() {
  local logfile=""
  local output_file=""
  local -n reference
  local reference_given=0
  local i

  for i in "$@"; do
    case "$i" in
      -l=* | --logfile=*)
        logfile="${i#*=}"
        shift
        ;;
      -o=* | --output_file=*)
        output_file="${i#*=}"
        shift
        ;;
      -r=* | --reference=*)
        reference="${i#*=}"
        reference_given=1
        shift
        ;;
    esac
  done

  local current=""
  local line
  local result=""

  while IFS= read -r line; do
    if [[ "${line}" == "@@@COPY_START "* ]]; then
      current="${line#@@@COPY_START }"
    elif [[ "${line}" == "@@@COPY_END "* ]]; then
      current=""
    elif [[ -n "${current}" && "${line}" =~ ^COPY\ ([0-9]+)$ ]]; then
      result+="${current},${BASH_REMATCH[1]}"$'\n'
      current=""
    fi
  done < "${output_file}"

  log_event -f="${logfile}" -m="Parsed per-table COPY row counts from ${output_file}." -s="INFO"

  if [[ "${reference_given}" -eq 1 ]]; then
    reference="${result%$'\n'}"
  fi
}

#######################################
# Look up a single "key,value" pair's value out of a newline-separated
# map string. Shared by sanity_check_csv_line_counts and
# verify_post_import.
# Globals:
#   None
# Arguments:
#   -k=STR | --key=STR   Key to look up.
#   -m=STR | --map=STR   Map to search (newline-separated "key,value").
# Outputs:
#   Writes the matching value to STDOUT, if found.
# Returns:
#   0 if the key was found (value printed); 1 if not (nothing printed).
#######################################
function lookup_count() {
  local key=""
  local map=""
  local i

  for i in "$@"; do
    case "$i" in
      -k=* | --key=*)
        key="${i#*=}"
        shift
        ;;
      -m=* | --map=*)
        map="${i#*=}"
        shift
        ;;
    esac
  done

  local line_key
  local line_val

  while IFS=',' read -r line_key line_val; do
    if [[ "${line_key}" == "${key}" ]]; then
      printf '%s' "${line_val}"
      return 0
    fi
  done <<< "${map}"

  return 1
}

#######################################
# Cross-check each CSV's line count (minus its header) against the
# authoritative COPY row count -- informational only. wc -l undercounts
# whenever a quoted CSV field embeds a newline, so a mismatch here is
# logged as a WARN sanity signal, never as a failure.
# Globals:
#   None
# Arguments:
#   -c=STR | --copy_counts=STR   Copy-counts map (from parse_copy_counts).
#   -i=PATH | --indir=PATH       Input directory.
#   -l=PATH | --logfile=PATH     Logfile path.
#   -s=NAME | --schema=NAME      Schema name.
#   -t=STR | --table_map=STR     Extended table map.
# Outputs:
#   Logs an INFO/WARN event per table.
# Returns:
#   0 always. Never contributes to any failure count.
#######################################
function sanity_check_csv_line_counts() {
  local copy_counts=""
  local indir=""
  local logfile=""
  local schema=""
  local table_map=""
  local i

  for i in "$@"; do
    case "$i" in
      -c=* | --copy_counts=*)
        copy_counts="${i#*=}"
        shift
        ;;
      -i=* | --indir=*)
        indir="${i#*=}"
        shift
        ;;
      -l=* | --logfile=*)
        logfile="${i#*=}"
        shift
        ;;
      -s=* | --schema=*)
        schema="${i#*=}"
        shift
        ;;
      -t=* | --table_map=*)
        table_map="${i#*=}"
        shift
        ;;
    esac
  done

  local line
  local table
  local csv_filename
  local rest
  local csvfile
  local key
  local wc_count
  local copy_n

  while IFS= read -r line; do
    [[ -z "${line}" ]] && continue
    IFS=',' read -r table csv_filename rest <<< "${line}"
    csvfile="${indir}/${csv_filename}"
    key="${schema}.${table}"

    wc_count=$(($(wc -l < "${csvfile}") - 1))
    copy_n=$(lookup_count --key="${key}" --map="${copy_counts}") || copy_n=""

    if [[ -n "${copy_n}" && "${wc_count}" -ne "${copy_n}" ]]; then
      log_event -f="${logfile}" \
        -m="Informational: ${csvfile} line count (${wc_count}) differs from the COPY count (${copy_n}) for ${key} -- expected if any field contains an embedded newline; not treated as a failure." \
        -s="WARN"
    else
      log_event -f="${logfile}" -m="CSV line count sanity check passed for ${key}." -s="INFO"
    fi
  done <<< "${table_map}"
}

#######################################
# Data-integrity check: for every imported table, require the manifest's
# recorded export-time row count to exactly equal the import-time
# "COPY <n>", and require the post-import SELECT COUNT(*) to equal the
# pre-import baseline plus that same count (or just that count, in
# --truncate mode).
# Globals:
#   PGPASSWORD    Read; must already be exported by the caller.
# Arguments:
#   -b=STR | --baseline=STR       Baseline map (from capture_baseline_counts).
#   -c=STR | --copy_counts=STR    Copy-counts map (from parse_copy_counts).
#   -f=NAME | --failures=NAME     Name of a caller-scope variable to
#                                 receive the failure count (nameref).
#   -l=PATH | --logfile=PATH      Logfile path.
#   -r=NAME | --rows=NAME         Name of a caller-scope variable to
#                                 receive the total row count summed
#                                 across every verified table (nameref).
#   -s=NAME | --schema=NAME       Schema name.
#   -t=STR | --table_map=STR      Extended table map.
#   -u=0|1 | --truncate=0|1       Must match the value passed to
#                                 generate_import_script.
#   (remaining, unnamed)          psql connection target arguments.
# Outputs:
#   Logs an INFO/ERROR event per table, plus a final INFO summary.
# Returns:
#   0 always; failures are aggregated and reported via the nameref.
#######################################
function verify_post_import() {
  local baseline=""
  local copy_counts=""
  local -n failures_out
  local failures_given=0
  local logfile=""
  local -n rows_out
  local rows_given=0
  local schema=""
  local table_map=""
  local truncate=0
  local -a psql_target=()
  local i

  for i in "$@"; do
    case "$i" in
      -b=* | --baseline=*)
        baseline="${i#*=}"
        shift
        ;;
      -c=* | --copy_counts=*)
        copy_counts="${i#*=}"
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
      -r=* | --rows=*)
        rows_out="${i#*=}"
        rows_given=1
        shift
        ;;
      -s=* | --schema=*)
        schema="${i#*=}"
        shift
        ;;
      -t=* | --table_map=*)
        table_map="${i#*=}"
        shift
        ;;
      -u=* | --truncate=*)
        truncate="${i#*=}"
        shift
        ;;
      *)
        psql_target+=("$i")
        ;;
    esac
  done

  # NOTE: named "_verify_failure_count"/"_verify_row_total", not
  # "failure_count"/"row_total" -- same nameref-collision rationale as
  # export_db_to_csv.sh's export_tables/pg_restore_backup.sh's
  # verify_restore.
  local _verify_failure_count=0
  local _verify_row_total=0
  local line
  local table
  local csv_filename
  local manifest_row_count
  local sha256
  local rest
  local key
  local copy_n
  local baseline_n
  local expected
  local final_count

  while IFS= read -r line; do
    [[ -z "${line}" ]] && continue
    IFS=',' read -r table csv_filename manifest_row_count sha256 rest <<< "${line}"
    key="${schema}.${table}"

    copy_n=$(lookup_count --key="${key}" --map="${copy_counts}") || copy_n=""
    if [[ -z "${copy_n}" ]]; then
      _verify_failure_count=$((_verify_failure_count + 1))
      log_event -e="1" -f="${logfile}" \
        -m="No COPY row count was recorded for ${key} -- cannot verify completeness." -s="ERROR"
      continue
    fi

    if [[ "${copy_n}" -ne "${manifest_row_count}" ]]; then
      _verify_failure_count=$((_verify_failure_count + 1))
      log_event -e="1" -f="${logfile}" \
        -m="Row-count mismatch for ${key}: manifest recorded ${manifest_row_count} row(s) at export time, but ${copy_n} row(s) were copied at import time." \
        -s="ERROR"
    fi

    baseline_n=$(lookup_count --key="${key}" --map="${baseline}") || baseline_n=0

    if [[ "${truncate}" -eq 1 ]]; then
      expected="${copy_n}"
    else
      expected=$((baseline_n + copy_n))
    fi

    final_count=$(psql "${psql_target[@]}" -Atqc "SELECT COUNT(*) FROM \"${schema}\".\"${table}\";" 2>/dev/null)

    if [[ "${final_count}" != "${expected}" ]]; then
      _verify_failure_count=$((_verify_failure_count + 1))
      log_event -e="1" -f="${logfile}" \
        -m="Post-import row count mismatch for ${key}: expected ${expected} (baseline ${baseline_n} + copied ${copy_n}), found ${final_count}." \
        -s="ERROR"
    else
      log_event -f="${logfile}" -m="Verified ${key}: ${final_count} row(s), matches expected." -s="INFO"
    fi

    _verify_row_total=$((_verify_row_total + copy_n))
  done <<< "${table_map}"

  log_event -f="${logfile}" \
    -m="Verification complete. ${_verify_failure_count} failure(s), ${_verify_row_total} row(s) total." \
    -s="INFO"

  if [[ "${failures_given}" -eq 1 ]]; then
    failures_out="${_verify_failure_count}"
  fi
  if [[ "${rows_given}" -eq 1 ]]; then
    rows_out="${_verify_row_total}"
  fi
  return 0
}

main "$@"
