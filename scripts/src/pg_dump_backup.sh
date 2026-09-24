#!/usr/bin/env bash
#
# pg_dump_backup.sh
#
# Connects to a PostgreSQL database and produces a single backup file
# using the pg_dump utility, in the custom (-Fc) archive format. Every
# success and failure along the way is recorded via log_utils.sh's
# create_logfile / log_event functions.
#
# Requirements:
#   - pg_dump (PostgreSQL client) must be installed and on PATH
#   - log_utils.sh and file_utils.sh must sit alongside this script
#
# Usage (unix equals-separated style; named flags are alphabetized):
#   ./pg_dump_backup.sh [-d=DESTINATION] [-l=LOG_LOCATION]
#
# Requires $DATABASE_URL (connection endpoint) and $DATABASE_PASSWORD
# (database password) to be set in the environment.
#
# Examples:
#   ./pg_dump_backup.sh
#   ./pg_dump_backup.sh -d=./backups/pg_dump/ -l=./backups/pg_dump/logs/
#
set -euo pipefail
# nounset (-u) is enabled: every variable in this file, and in the sourced
# log_utils.sh / file_utils.sh, is either given an explicit default at
# declaration or is guaranteed to be assigned before it's ever read. See
# bash_standards.md, BASH-024.

# file_utils.sh (create_file) and log_utils.sh (create_logfile,
# log_event) must live next to this script. BASH_SOURCE (not $0) is used
# so this resolves correctly even if this script is sourced or invoked in
# an unusual way; see https://mywiki.wooledge.org/BashFAQ/028.
source "$(dirname "${BASH_SOURCE[0]}")/file_utils.sh"
source "$(dirname "${BASH_SOURCE[0]}")/log_utils.sh"

#######################################
# Top-level program flow: parse arguments, set up logging, and produce a
# pg_dump backup file.
# Globals:
#   None
# Arguments:
#   $@: raw command-line arguments.
# Outputs:
#   See the individual helper functions below.
# Returns:
#   Exits 0 on success; see create_backup for failure exit codes.
#######################################
function main() {
  local destination
  destination="$(pwd)/backups/pg_dump/"
  local log_location
  log_location="$(pwd)/backups/pg_dump/logs/"
  local arg

  for arg in "$@"; do
    case "${arg}" in
      --help)
        usage
        ;;
      -d=* | --destination=*)
        destination="${arg#*=}"
        ;;
      -l=* | --log-location=*)
        log_location="${arg#*=}"
        ;;
      *)
        echo "Error: unknown option '${arg}'" >&2
        usage
        ;;
    esac
  done

  # Normalize both paths to end in a trailing slash: create_backup below
  # concatenates destination directly onto the dump filename, and
  # create_logfile does the same for log_location internally.
  if [[ "${destination}" != */ ]]; then
    destination+="/"
  fi
  if [[ "${log_location}" != */ ]]; then
    log_location+="/"
  fi

  mkdir -p "${log_location}"
  mkdir -p "${destination}"

  local logfile=""
  create_logfile --location="${log_location}" --reference=logfile "dailp_pg-dump"
  log_event -f="${logfile}" -m="Hooking up logfile: ${logfile}" -s="INFO"

  create_backup --destination="${destination}" --logfile="${logfile}"

  log_event -f="${logfile}" -m="Exiting successfully." -s="INFO"
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
Usage: $0 [-d=DESTINATION] [-l=LOG_LOCATION]

  -d=DESTINATION     Folder to save the dump file to (default: ./backups/pg_dump/)
  -l=LOG_LOCATION    Folder to save logs to (default: ./backups/pg_dump/logs/)
  --help             Show this help

Requires \$DATABASE_URL and \$DATABASE_PASSWORD to be set in the environment.
EOF
  exit 1
}

#######################################
# Connect to the target database and produce a single pg_dump backup file
# in the custom (-Fc) archive format, verifying it was created and is
# non-empty before returning.
# Globals:
#   DATABASE_URL       Database connection endpoint. Required.
#   DATABASE_PASSWORD  Database password. Required; exported as
#                      PGPASSWORD for pg_dump to pick up (rather than
#                      passed as a command-line flag, so it never appears
#                      in `ps` output), then unset again once pg_dump
#                      returns.
# Arguments:
#   -d=PATH | --destination=PATH   Folder to save the dump file to.
#   -l=PATH | --logfile=PATH       Logfile path.
# Outputs:
#   Logs INFO/ERROR events via log_event. Writes the dump file to
#   --destination and echoes its path to STDOUT on success.
# Returns:
#   Exits 1 for every failure here -- a missing endpoint/password, a
#   failed create_file, a failed pg_dump invocation, or an empty output
#   file are all conditions an operator can retry after fixing the
#   environment (credentials, connectivity, disk space), per BASH-027.
#   Returns 0 on success.
#######################################
function create_backup() {
  local destination=""
  local logfile=""
  local arg

  for arg in "$@"; do
    case "${arg}" in
      -d=* | --destination=*)
        destination="${arg#*=}"
        ;;
      -l=* | --logfile=*)
        logfile="${arg#*=}"
        ;;
    esac
  done

  if [[ -z "${DATABASE_URL:-}" ]]; then
    log_event -f="${logfile}" \
      -m="DATABASE_URL not set. Cannot connect to database." -s="ERROR"
    exit 1
  fi

  if [[ -z "${DATABASE_PASSWORD:-}" ]]; then
    log_event -f="${logfile}" \
      -m="DATABASE_PASSWORD not set. Cannot connect to database." -s="ERROR"
    exit 1
  fi

  local current_time
  current_time="$(date +%Y%m%d_%H%M%S%z)"
  local dumpfile="${destination}dailp_${current_time}.dump"

  log_event -f="${logfile}" -m="Creating pg_dump backup..." -s="INFO"

  if ! create_file "${dumpfile}"; then
    log_event -f="${logfile}" -m="Failed to create file ${dumpfile}" -s="ERROR"
    exit 1
  fi

  log_event -f="${logfile}" -m="...running pg_dump utility..." -s="INFO"

  # Export the password as PGPASSWORD (rather than a -p/--password flag)
  # so it never appears in `ps` output; unset it again as soon as pg_dump
  # returns, win or lose.
  export PGPASSWORD="${DATABASE_PASSWORD}"
  if ! pg_dump -Fc --file="${dumpfile}" "${DATABASE_URL}"; then
    unset PGPASSWORD
    log_event -f="${logfile}" -m="pg_dump failed." -s="ERROR"
    exit 1
  fi
  unset PGPASSWORD

  if [[ ! -s "${dumpfile}" ]]; then
    log_event -f="${logfile}" -m="pg_dump produced empty file." -s="ERROR"
    exit 1
  fi

  echo "${dumpfile}"
  log_event -f="${logfile}" -m="Backup written to ${dumpfile}" -s="INFO"
}

main "$@"
