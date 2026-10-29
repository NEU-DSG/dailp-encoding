#!/usr/bin/env bash
#
# Shared psql/checksum helpers used by more than one pg_*.sh script.
# Extracted from export_db_to_csv.sh and import_db_from_csv.sh, which
# previously carried byte-for-byte duplicate copies of every function
# below.
#
# check_psql_installed has been removed: it was identical in shape to
# check_aws_installed/check_curl_installed/check_pg_dump_installed
# elsewhere in this project, and has been replaced at every call site by
# defensive_utils.sh's generic check_command_installed. This file relies
# on the sourcing script having already sourced defensive_utils.sh too
# (for command_exists, used internally by check_sha256_tool_installed
# below) -- the same implicit convention by which this file already
# relies on log_utils.sh being sourced by its caller, rather than
# self-sourcing either.

#######################################
# Verify a SHA-256 hashing tool (sha256sum or shasum) is on PATH, logging
# the outcome either way. manifest.csv's checksum column is required by
# import_db_from_csv.sh's pre-import validation and written by
# export_db_to_csv.sh, so this is checked as a hard precondition in both,
# the same way psql's own presence is (via defensive_utils.sh's
# check_command_installed), rather than left to silently produce an
# empty/unusable checksum column later.
# Globals:
#   None
# Arguments:
#   -l=PATH | --logfile=PATH   Logfile path.
# Outputs:
#   Logs an INFO or ERROR event via log_event.
# Returns:
#   Exits 1 directly (does not return) if neither tool is found: nothing
#   downstream can produce or verify a usable manifest without one, and
#   fixing it requires the operator to install one of these tools.
#######################################
function check_sha256_tool_installed() {
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

  if ! command_exists --command=sha256sum && ! command_exists --command=shasum; then
    log_event -e="1" -f="${logfile}" \
      -m="Neither sha256sum nor shasum found. One is required to compute or verify manifest.csv's checksum column." \
      -s="ERROR"
    exit 1
  fi
  log_event -f="${logfile}" -m="SHA-256 hashing tool found on PATH." -s="INFO"
}

#######################################
# Compute a file's SHA-256 checksum, preferring sha256sum (common on
# Linux) and falling back to shasum -a 256 (macOS default) for
# portability. Assumes check_sha256_tool_installed has already verified
# one of these is available.
# Globals:
#   None
# Arguments:
#   -f=PATH | --file=PATH   File to hash.
# Outputs:
#   Writes the lowercase hex digest to STDOUT (the function's actual
#   return value, meant to be captured via command substitution).
# Returns:
#   0 on success. Propagates a nonzero exit from sha256sum/shasum if the
#   file can't be read (e.g. removed mid-run) -- the caller decides how
#   to treat that.
#######################################
function compute_sha256() {
  local file=""
  local i

  for i in "$@"; do
    case "$i" in
      -f=* | --file=*)
        file="${i#*=}"
        shift
        ;;
    esac
  done

  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum "${file}" | awk '{print $1}'
  else
    shasum -a 256 "${file}" | awk '{print $1}'
  fi
}

#######################################
# Resolve the database password, prompting interactively if needed, and
# export it as PGPASSWORD for psql to pick up. PGPASSWORD is written here,
# never read as an input -- the only environment-variable input this
# function (or any script in this directory) accepts is DATABASE_PASSWORD.
# A caller must never be required to pre-set PGPASSWORD themselves.
# Globals:
#   DATABASE_PASSWORD (read only)
#   PGPASSWORD (set; never read)
# Arguments:
#   -a=0|1 | --ask_pass=0|1        1 forces an interactive prompt; 0 uses
#                                   DATABASE_PASSWORD/connection string if
#                                   available.
#   -c=STR | --conn_string=STR     Connection string, if one was supplied
#                                   (may be empty). Assumed to embed its
#                                   own password when DATABASE_PASSWORD
#                                   isn't set and no prompt is forced.
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
  # Use $DATABASE_PASSWORD if provided...
  if [[ -n "${DATABASE_PASSWORD:-}" ]]; then
    export PGPASSWORD="${DATABASE_PASSWORD}"
    log_event -f="${logfile}" -m="Password passed from environment." -s="INFO"
  # ... otherwise, prompt for password if requested by caller or no other
  # source (a connection string) was given -- PGPASSWORD itself is never
  # consulted as a fallback input, only ever set as this function's output.
  elif [[ "${ask_pass}" -eq 1 || -z "${conn_string}" ]]; then
    read -rsp "Password for user ${user_for_prompt:-<from connstring>}: " pgpassword_input
    echo
    export PGPASSWORD="${pgpassword_input}"
    log_event -f="${logfile}" -m="Password captured via interactive prompt." -s="INFO"
  else
    log_event -f="${logfile}" -m="Using password embedded in connection string." -s="INFO"
  fi
}

#######################################
# Resolve the psql connection target from parsed argument values: fall
# back to $DATABASE_URL when the caller supplied no connection info of
# their own, require that *some* valid connection info exists (either a
# connection string or all three of -d=/-h=/-U=), and build the
# psql_target array consumed by every psql-calling function in this
# directory. Extracted from export_db_to_csv.sh and import_db_from_csv.sh,
# which previously carried byte-for-byte duplicate copies of all three
# steps in their own main().
#
# Deliberately does NOT call a script's own usage() on validation
# failure: usage() is script-local (each script has its own flag set/help
# text), so a shared library function can't call it directly. Instead,
# this returns 1 (having already printed the same "Error: must supply
# either..." message every call site used to print itself) and leaves it
# to the caller to invoke its own usage() in response.
# Globals:
#   DATABASE_URL (read only)
# Arguments:
#   -c=NAME | --conn_string=NAME          Name of the caller's connection
#                                          string variable (bound via
#                                          nameref). Read for its current
#                                          value -- possibly empty -- and
#                                          overwritten with $DATABASE_URL
#                                          if the fallback applies.
#   -d=STR | --pgdb_arg=STR               Parsed -d= value (may be empty).
#   -h=STR | --pghost_arg=STR             Parsed -h= value (may be empty).
#   -p=STR | --pgport_arg=STR             Parsed -p= value.
#   -t=NAME | --psql_target=NAME          Name of a caller-scope array
#                                          variable (bound via nameref;
#                                          following the same --reference=
#                                          convention log_utils.sh's
#                                          create_logfile uses) that will
#                                          be set to the resolved psql
#                                          connection target array (either
#                                          the connection string alone, or
#                                          -d/-h/-p/-U).
#   -U=STR | --pguser_arg=STR             Parsed -U= value (may be empty).
#   -u=NAME | --used_database_url=NAME    Name of a caller-scope variable
#                                          (bound via nameref) that will
#                                          be set to 1 if the
#                                          $DATABASE_URL fallback was
#                                          used, left unmodified
#                                          otherwise.
# Outputs:
#   Writes "Error: must supply either -c=CONNSTR, or -d=DBNAME -h=HOST
#   -U=USER" to STDERR if validation fails.
# Returns:
#   1 if no connection info was supplied (neither -c=, nor all of
#   -d=/-h=/-U=) -- the caller must then call its own usage() and stop,
#   the same way every other invalid-argument case in that script's
#   main() does. 0 otherwise, with all requested outputs populated.
#######################################
function resolve_pg_target() {
  local -n conn_string_ref
  local pgdb_arg=""
  local pghost_arg=""
  local pgport_arg=""
  local -n psql_target_ref
  local psql_target_given=0
  local pguser_arg=""
  local -n used_database_url_ref
  local used_database_url_given=0
  local i

  for i in "$@"; do
    case "$i" in
      -c=* | --conn_string=*)
        conn_string_ref="${i#*=}"
        shift
        ;;
      -d=* | --pgdb_arg=*)
        pgdb_arg="${i#*=}"
        shift
        ;;
      -h=* | --pghost_arg=*)
        pghost_arg="${i#*=}"
        shift
        ;;
      -p=* | --pgport_arg=*)
        pgport_arg="${i#*=}"
        shift
        ;;
      -t=* | --psql_target=*)
        psql_target_ref="${i#*=}"
        psql_target_given=1
        shift
        ;;
      -U=* | --pguser_arg=*)
        pguser_arg="${i#*=}"
        shift
        ;;
      -u=* | --used_database_url=*)
        used_database_url_ref="${i#*=}"
        used_database_url_given=1
        shift
        ;;
    esac
  done

  # Fall back to $DATABASE_URL as the connection string, but only if the
  # caller didn't supply any connection info of their own -- an explicit
  # -c=, or any of -d=/-h=/-U=, always takes precedence.
  if [[ -z "${conn_string_ref}" && -z "${pghost_arg}" && -z "${pguser_arg}" \
    && -z "${pgdb_arg}" && -n "${DATABASE_URL:-}" ]]; then
    conn_string_ref="${DATABASE_URL}"
    if [[ "${used_database_url_given}" -eq 1 ]]; then
      used_database_url_ref=1
    fi
  fi

  if [[ -z "${conn_string_ref}" ]]; then
    if [[ -z "${pghost_arg}" || -z "${pguser_arg}" || -z "${pgdb_arg}" ]]; then
      echo "Error: must supply either -c=CONNSTR, or -d=DBNAME -h=HOST -U=USER" >&2
      return 1
    fi
  fi

  if [[ "${psql_target_given}" -eq 1 ]]; then
    if [[ -n "${conn_string_ref}" ]]; then
      psql_target_ref=("${conn_string_ref}")
    else
      psql_target_ref=(-d "${pgdb_arg}" -h "${pghost_arg}" -p "${pgport_arg}" -U "${pguser_arg}")
    fi
  fi

  return 0
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
# Restrict a schema name to a safe SQL identifier before it's ever
# interpolated into a SQL string (e.g. "WHERE schemaname = '...'") or a
# psql \copy command (e.g. \copy "schema"."table") -- see BASH-021.
# Extracted from export_db_to_csv.sh and import_db_from_csv.sh, which
# previously carried a byte-for-byte duplicate copy of this check.
# Globals:
#   None
# Arguments:
#   -s=NAME | --schema=NAME   Schema name to validate (e.g. from -s=).
# Outputs:
#   Writes "Error: invalid schema name '...'" to STDERR on failure.
# Returns:
#   Exits 1 directly (does not return) if the schema name doesn't match
#   ^[A-Za-z_][A-Za-z0-9_]*$: unlike resolve_pg_target's validation
#   failure, this is a hard security gate, not a "fix your invocation and
#   see usage()" misuse case -- every call site already treats it as
#   fatal, and usage() output wouldn't help diagnose it.
#######################################
function validate_schema_name() {
  local schema=""
  local i

  for i in "$@"; do
    case "$i" in
      -s=* | --schema=*)
        schema="${i#*=}"
        shift
        ;;
    esac
  done

  if [[ ! "${schema}" =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]]; then
    echo "Error: invalid schema name '${schema}'" >&2
    exit 1
  fi
}
