#!/usr/bin/env bash

#######################################
# Create a timestamped logfile and hand its path back to the caller.
# Globals:
#   None
# Arguments:
#   --location=PATH     Directory the logfile should be created in
#                        (default: "$(pwd)/logs/").
#   --reference=VARNAME  Name of a caller-scope variable (must currently be
#                        unset/empty) that will be set to the created
#                        logfile's path.
#   (positional)         Base name used to build the logfile's filename:
#                        "[location]/[name]_[timestamp].log". Required.
# Outputs:
#   Writes diagnostic/error messages to STDERR via log_event.
# Returns:
#   0 on success.
#   Exits 2 directly (does not return) on any failure here -- a missing
#   name, a bad --reference, an unusable --location, or an underlying
#   create_file failure all mean logging can't proceed at all, which
#   nothing downstream can meaningfully recover from.
#######################################
function create_logfile() {
  local location
  location="$(pwd)/logs/"
  local -n reference
  # NOTE: needed for nounset (set -u) safety -- if --reference was never
  # passed, the nameref above is never bound, and dereferencing an unbound
  # nameref is itself an "unbound variable" error under -u, before we even
  # get to check whether it points at something. This flag lets the check
  # below short-circuit past dereferencing "reference" entirely when it
  # was never given.
  local reference_given=0
  local logname=""
  local log_start_time
  log_start_time="$(date +%Y%m%d_%H%M%S%z)"
  local i

  for i in "$@"; do
    case "$i" in
      -l=* | --location=*)
        location="${i#*=}"
        shift
        ;;
      -r=* | --reference=*)
        reference="${i#*=}"
        reference_given=1
        shift
        ;;
      * )
        logname="${i#*=}"
    esac
  done

  # Import create_file. BASH_SOURCE (not $0) is used so this resolves
  # correctly even if create_logfile's caller was itself sourced or
  # invoked in an unusual way; see https://mywiki.wooledge.org/BashFAQ/028.
  source "$(dirname "${BASH_SOURCE[0]}")/file_utils.sh"

  # name must be provided.
  # EXIT (not return): a missing name means the caller's code is wrong --
  # there's nothing a caller could "handle" at runtime, this always needs
  # a code fix. Matches create_file's equivalent check for its own
  # required "name" argument.
  if [[ -z "${logname}" ]]; then
    log_event \
      -e="2" \
      -m="No logfile name provided!" \
      -s="ERROR"
    exit 2
  fi

  # Check that reference does not point to a value.
  # EXIT (not return): a --reference pointing at an already-set variable
  # means the caller's code is wrong (it's about to clobber existing
  # data) -- that's a code fix, not something to retry at runtime.
  if [[ "${reference_given}" -eq 1 && -n "${reference}" ]]; then
    log_event \
      -e="2" \
      -m="Provided reference location already has a value!" \
      -s="ERROR"
    exit 2
  fi

  # location must be a valid directory path
  if [[ ! "${location}" == */ ]]; then
    location+="/"
  fi

  # location must exist
  if [[ ! -e "${location}" ]]; then
    mkdir -p "${location}"
  fi

  # Location must be a directory.
  # EXIT: without a usable log directory nothing else in this script can
  # proceed -- this needs the caller (or its configuration) fixed, not a
  # runtime retry.
  if [[ ! -d "${location}" ]]; then
    log_event \
      -e="2" \
      -m="Log location must be a directory." \
      -s="ERROR"
    exit 2
  fi

  # file must follow format [path]/[name]_[timestamp].log
  local file="${location}${logname}_${log_start_time}.log"

  # logfiles must be in the JSON format {timestamp,task,status,message,exit_code}
  # EXIT: if create_file reports a failure, there is no usable logfile for
  # the rest of the run to write to -- this is unrecoverable here, so it's
  # treated the same as the other create_logfile setup failures above.
  if ! create_file \
    --header="{timestamp,task,status,message,exit_code}" \
    "${file}"; then
    log_event \
      -e="2" \
      -m="Failed to initialize logfile at ${file}" \
      -s="ERROR"
    exit 2
  fi

  # Fill reference with filename for downstream use, but only if the
  # caller actually asked for one via --reference. Without this guard,
  # this assignment would be the *first* write to an unbound nameref,
  # which binds it to the target *named by the assigned value* -- i.e. it
  # would try to treat the logfile path itself as a variable name to bind
  # to, and fail with "not a valid identifier". 
  if [[ "${reference_given}" -eq 1 ]]; then
    reference="${file}"
  fi

  log_event \
    -f="${file}" \
    -m="Created logfile at ${file}" \
    -s="INFO"

  return 0
}

#######################################
# Log a single event: always to STDERR as a human-readable line, and
# additionally to a structured logfile if one is given.
# Globals:
#   FUNCNAME, BASH_LINENO (read, to build a call-stack trace)
# Arguments:
#   --exit_code=N        Optional exit code associated with the event.
#                        Defaults to "null" if omitted.
#   --file=PATH          Optional logfile to append a structured JSON-ish
#                        line to, in addition to the STDERR line.
#   --message=STRING     Required. The human-readable message to log.
#   --status=LEVEL       Required. One of TRACE, DEBUG, INFO, WARN, ERROR
#                        (case-insensitive).
# Outputs:
#   Writes "<timestamp> | <STATUS> | <trace> | <message>" to STDERR.
#   Appends a structured line to --file, if given.
# Returns:
#   Does not return on bad input -- see below.
#   Exits 1 directly if --status or --message is missing, or --status is
#   not one of the valid levels: every call site in this project passes
#   these as hardcoded literals, so a failure here always means the
#   *calling code* needs to be fixed, not something a caller can react to
#   at runtime.
#######################################
function log_event() {
  local timestamp
  timestamp="$(date +%Y%m%d_%H%M%S%z)"
  # NOTE: trace/status/message/file are all explicitly initialized to ""
  # (rather than left bare "local x") for nounset (set -u) safety. Each is
  # only ever *populated* by the argument-parsing loop below, so without
  # an explicit default, a caller omitting a flag (e.g. --file, which most
  # callers before a logfile exists legitimately omit) would make the
  # later "${file}" reference an unbound-variable error under -u, instead
  # of the intended empty-string check.
  local trace=""
  local status=""
  local message=""
  # Default to "null" so the JSON line always has a value after
  # "exitCode:" even when no exit code is supplied (the common case for
  # INFO/WARN events), instead of rendering as "exitCode:" with nothing.
  local exit_code="null"
  local file=""
  local i
  local frame_idx

  for i in "$@"; do
    case "$i" in
      -e=* | --exit_code=*)
        exit_code="${i#*=}"
        shift
        ;;
      -f=* | --file=*)
        file="${i#*=}"
        shift
        ;;
      -m=* | --message=*)
        message="${i#*=}"
        shift
        ;;
      -s=* | --status=*)
        status="${i#*=}"
        shift
        ;;
      *)
        echo "Ignoring unsupported argument ${i#*=}" >&2
        shift
        ;;
    esac
  done

  # Collect callstack in format CALLER:LINE>CALLER:LINE
  for (( frame_idx=${#FUNCNAME[@]}-1; frame_idx; frame_idx-- )); do
    trace+="${FUNCNAME[frame_idx]}:${BASH_LINENO[frame_idx-1]}"
    if (( frame_idx > 1 )); then
      trace+=">"
    fi
  done

  local valid_statuses=("TRACE" "DEBUG" "INFO" "WARN" "ERROR")

  # Ensure a status is provided.
  # EXIT (not return): every log_event call site in this project passes a
  # hardcoded --status, so a missing one is always a bug in the calling
  # code, not a runtime condition to recover from. Exit code 2 (not 1):
  # per this project's global exit-code convention (0=success,
  # 1=retryable, 2=fatal -- see README.md), a bug in the calling code
  # isn't retryable by re-running the same command, so it's fatal.
  if [[ -z "${status}" ]]; then
    echo "please provide a log status. Options:" >&2
    echo "${valid_statuses[@]}" >&2
    exit 2
  fi

  # Ensure status is a valid status level. EXIT: same rationale as above.
  if [[ ! " ${valid_statuses[*]} " =~ " ${status^^} " ]]; then
    echo "Invalid status ${status}" >&2
    echo "expected one of: ${valid_statuses[@]}." >&2
    exit 2
  fi

  # Ensure a message is provided. EXIT: same rationale as above.
  if [[ -z "${message}" ]]; then
    echo "Please provide a message" >&2
    exit 2
  fi

  # Check if a logfile is provided
  # If so, send it structured logs
  if [[ -n "${file}" ]]; then
    local logline="{timestamp:\"${timestamp}\",task:\"${trace}\",status:\"${status^^}\",message:\"${message}\",exitCode:${exit_code}},"
    echo "${logline}" >> "${file}"
  fi

  echo -e "${timestamp} | ${status^^} | ${trace} | ${message}" >&2
}
