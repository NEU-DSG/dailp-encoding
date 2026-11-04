#!/usr/bin/env bash
#
# pg_export_to_csv.sh
#
# Connects to a PostgreSQL database and exports every table (in a given
# schema) to its own CSV file inside an output folder. Every success and
# failure along the way is recorded via log_utils.sh's create_logfile /
# log_event functions.
#
# Requirements:
#   - psql (PostgreSQL client) must be installed and on PATH
#   - log_utils.sh and file_utils.sh must sit alongside this script
#
# Usage (unix equals-separated style; named flags are alphabetized):
#   ./pg_export_to_csv.sh -d=DBNAME -h=HOST [-o=OUTDIR] [-p=PORT] [-s=SCHEMA] -U=USER [-w]
#   ./pg_export_to_csv.sh -c=CONNECTION_STRING [-o=OUTDIR] [-s=SCHEMA]
#
# You will be prompted for the password interactively unless PGPASSWORD
# is already set in the environment, or you pass -w to supply it.
#
# Examples:
#   ./pg_export_to_csv.sh -d=mydb -h=db.example.com -p=5432 -U=myuser
#   ./pg_export_to_csv.sh -d=mydb -h=db.example.com -o=./mydb_csv -s=public -U=myuser
#   PGPASSWORD=secret ./pg_export_to_csv.sh -d=mydb -h=db.example.com -U=myuser
#
# Notes:
#   - You can also just pass a full connection string via -c= instead
#     of the individual -d=/-h=/-p=/-U= flags, e.g.:
#       ./pg_export_to_csv.sh -c="postgresql://user:pass@host:5432/dbname" -o=./out
#
set -euo pipefail
# nounset (-u) is enabled: every variable in this file, and in the sourced
# log_utils.sh / file_utils.sh, is either given an explicit default at
# declaration or is guaranteed to be assigned before it's ever read. See
# bash_standards.md, BASH-024.

# log_utils.sh (create_logfile, log_event) must live next to this script.
# BASH_SOURCE (not $0) is used so this resolves correctly even if this
# script is sourced or invoked in an unusual way; see
# https://mywiki.wooledge.org/BashFAQ/028.
source "$(dirname "${BASH_SOURCE[0]}")/log_utils.sh"

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
  local outdir=""
  local pgport_arg="5432"
  local schema="public"
  local pguser_arg=""
  local ask_pass=0
  local arg
  local key
  local value

  for arg in "$@"; do
    case "${arg}" in
      --help)
        usage
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

  if [[ -z "${conn_string}" ]]; then
    if [[ -z "${pghost_arg}" || -z "${pguser_arg}" || -z "${pgdb_arg}" ]]; then
      echo "Error: must supply either -c=CONNSTR, or -d=DBNAME -h=HOST -U=USER" >&2
      usage
    fi
  fi

  # Restrict the schema name to a safe identifier before it's ever
  # interpolated into a SQL string or a psql \copy command below. -s= is
  # attacker/typo-controlled input; without this check a value like
  # "public'; --" could break out of the intended query.
  if [[ ! "${schema}" =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]]; then
    echo "Error: invalid schema name '${schema}'" >&2
    exit 1
  fi

  local dbname_for_dir="${pgdb_arg:-dailp}"
  if [[ -z "${outdir}" ]]; then
    outdir="./backups/csv/${dbname_for_dir}_csv_export_$(date +%Y%m%d_%H%M%S%z)"
  fi
  mkdir -p "${outdir}"

  # Creates the logfile and binds its path into logfile via nameref.
  local logfile=""
  create_logfile --location="${outdir}/logs" --reference=logfile "pg_export_to_csv"

  log_event -f="${logfile}" -m="Output folder: ${outdir}" -s="INFO"

  check_psql_installed --logfile="${logfile}"
  prompt_password_if_needed --ask_pass="${ask_pass}" --conn_string="${conn_string}" \
    --logfile="${logfile}" --user="${pguser_arg}"

  local -a psql_target
  if [[ -n "${conn_string}" ]]; then
    psql_target=("${conn_string}")
  else
    psql_target=(-d "${pgdb_arg}" -h "${pghost_arg}" -p "${pgport_arg}" -U "${pguser_arg}")
  fi

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
  export_tables --failures=failure_count --logfile="${logfile}" --outdir="${outdir}" \
    --schema="${schema}" --tables="${tables}" "${psql_target[@]}"

  unset PGPASSWORD

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
Usage: $0 -d=DBNAME -h=HOST [-o=OUTDIR] [-p=PORT] [-s=SCHEMA] -U=USER [-w]
   or: $0 -c=CONNECTION_STRING [-o=OUTDIR] [-s=SCHEMA]

  -c=CONNSTR    Full connection string/URI, alternative to -d=/-h=/-p=/-U=
  -d=DBNAME     Database name
  -h=HOST       Database host (endpoint)
  -o=OUTDIR     Output folder for CSVs (default: ./<dbname>_csv_export_<timestamp>)
  -p=PORT       Database port (default: 5432)
  -s=SCHEMA     Schema to export (default: public)
  -U=USER       Database user
  -w            Force interactive password prompt (ignore PGPASSWORD env var)
  --help        Show this help
EOF
  exit 1
}

#######################################
# Verify the psql client is on PATH, logging the outcome either way.
# Globals:
#   None
# Arguments:
#   -l=PATH | --logfile=PATH   Logfile path.
# Outputs:
#   Logs an INFO or ERROR event via log_event.
# Returns:
#   Exits 1 directly (does not return) if psql is missing: nothing else in
#   this script can proceed, and fixing it requires the operator to
#   install the PostgreSQL client -- a genuine "developer/operator
#   intervention" case, not something to retry at runtime.
#######################################
function check_psql_installed() {
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

  if ! command -v psql >/dev/null 2>&1; then
    log_event -e="1" -f="${logfile}" \
      -m="psql not found. Please install the PostgreSQL client tools." -s="ERROR"
    exit 1
  fi
  log_event -f="${logfile}" -m="psql client found on PATH." -s="INFO"
}

#######################################
# Resolve the database password, prompting interactively if needed, and
# export it as PGPASSWORD for psql to pick up.
# Globals:
#   PGPASSWORD (read and, if empty, set)
# Arguments:
#   -a=0|1 | --ask_pass=0|1        1 forces an interactive prompt; 0 uses
#                                   PGPASSWORD/connection string if
#                                   available.
#   -c=STR | --conn_string=STR     Connection string, if one was supplied
#                                   (may be empty).
#   -l=PATH | --logfile=PATH       Logfile path.
#   -u=NAME | --user=NAME          Username (used only for the
#                                   interactive prompt text).
# Outputs:
#   Logs an INFO event via log_event describing how the password was
#   resolved.
# Returns:
#   0 always.
#######################################
function prompt_password_if_needed() {
  local ask_pass=0
  local conn_string=""
  local logfile=""
  local user_for_prompt=""
  local pgpassword_input
  local i

  for i in "$@"; do
    case "$i" in
      -a=* | --ask_pass=*)
        ask_pass="${i#*=}"
        shift
        ;;
      -c=* | --conn_string=*)
        conn_string="${i#*=}"
        shift
        ;;
      -l=* | --logfile=*)
        logfile="${i#*=}"
        shift
        ;;
      -u=* | --user=*)
        user_for_prompt="${i#*=}"
        shift
        ;;
    esac
  done
  # Use dailp $DATABASE_PASSWORD if provided...
  if [[ -n "${DATABASE_PASSWORD}" ]]; then
    export PGPASSWORD="${DATABASE_PASSWORD}"
    log_event -f="${logfile}" -m="Password passed from environment." -s="INFO"
  # ... otherwise, prompt for password if requested by caller or password is not provided some other way
  elif [[ "${ask_pass}" -eq 1 || ( -z "${PGPASSWORD:-}" && -z "${conn_string}" ) ]]; then
    read -rsp "Password for user ${user_for_prompt:-<from connstring>}: " pgpassword_input
    echo
    export PGPASSWORD="${pgpassword_input}"
    log_event -f="${logfile}" -m="Password captured via interactive prompt." -s="INFO"
  else
    log_event -f="${logfile}" -m="Using password from PGPASSWORD/connection string." -s="INFO"
  fi
}

#######################################
# Test connectivity to the database with a trivial query.
# Globals:
#   None
# Arguments:
#   -l=PATH | --logfile=PATH   Logfile path.
#   (remaining, unnamed)       psql connection target arguments, passed
#                              through as-is (e.g. -h host -p port).
# Outputs:
#   Logs an INFO or ERROR event via log_event.
# Returns:
#   Exits 1 directly (does not return) on failure: nothing downstream can
#   proceed without a working connection, and fixing it requires the
#   operator to correct host/port/user/password/network access.
#######################################
function test_connection() {
  local logfile=""
  local -a psql_target=()
  local i

  for i in "$@"; do
    case "$i" in
      -l=* | --logfile=*)
        logfile="${i#*=}"
        shift
        ;;
      *)
        # Anything not matching one of our own --flag=value options is
        # forwarded to psql verbatim (e.g. -h host -p port).
        psql_target+=("$i")
        ;;
    esac
  done

  log_event -f="${logfile}" -m="Testing connection..." -s="INFO"
  if ! psql "${psql_target[@]}" -Atqc "SELECT 1;" >/dev/null 2>&1; then
    log_event -e="1" -f="${logfile}" \
      -m="Could not connect to the database. Check host/port/user/db/password." -s="ERROR"
    exit 1
  fi
  log_event -f="${logfile}" -m="Connection OK." -s="INFO"
}

#######################################
# Fetch newline-separated table names for a schema.
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
    "SELECT tablename FROM pg_tables WHERE schemaname = '${schema}' ORDER BY tablename;"); then
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
  local rc

  while IFS= read -r table; do
    [[ -z "${table}" ]] && continue
    table_index=$((table_index + 1))
    outfile="${outdir}/${table}_$(date +%Y%m%d_%H%M%S%z).csv"
    echo "[${table_index}/${table_count}] Exporting ${schema}.${table} -> ${outfile}"

    if psql "${psql_target[@]}" -Atqc \
      "\\copy \"${schema}\".\"${table}\" TO '${outfile}' WITH (FORMAT csv, HEADER true)" \
      >/dev/null 2>&1; then
      success_count=$((success_count + 1))
      log_event -f="${logfile}" -m="Exported ${schema}.${table} -> ${outfile}" -s="INFO"
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
  return 0
}

main "$@"
