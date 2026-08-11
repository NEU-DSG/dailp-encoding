#!/usr/bin/env bash
# --location allows the user to choose a folder to save the log in
# --reference expects a variable name that is used to provide the log file location to consuming programs
# 
function create_logfile() {
    local location="$(pwd)/logs/"
    local -n reference
    local logname
    local log_start_time="$(date -Iseconds)"
    for i in "$@"; do
        case $i in
            -l=* | --location=*)
                location="${i#*=}"
                shift
                ;;
            -r=* | --reference=*)
                reference="${i#*=}"
                shift
                ;;
            * )
                logname="${i#*=}"
        esac
    done
    # Import create_file
    . $(dirname "$0")/file_utils.sh

   # Check that reference does not point to a value
    if [[ -n "${reference}" ]]; then
        log_event \
         -s="ERROR" \
         -e="2" \
         -m="Provided reference location already has a value!"
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
    # Location must be a directory
    if [[ ! -d "${location}" ]]; then
        log_event \
         -s="ERROR" \
         -e="2" \
         -m="Log location must be a directory."
        exit 2
    fi

    # file must follow format [path]/[name]_[timestamp].log
    local file="${location}${logname}_${log_start_time}.log"

    # logfiles must be in the JSON format {timestamp,task,status,message,exit_code}
    create_file \
        --header="{timestamp,task,status,message,exit_code}" \
        "${file}"
    # Fill reference with filename for downstream use
    reference="${file}"

    log_event \
         -f="${file}" \
         -s="INFO" \
         -m="Created logfile at ${file}"
    return 0
}

# --logfile is an existing logfile
function log_event() {
    local timestamp="$(date -Iseconds)"
    local trace
    local status
    local message
    local exit_code
    local file
    for i in "$@"; do
        case $i in
            -s=* | --status=*)
                status="${i#*=}"
                shift
                ;;
            -m=* | --message=*)
                message="${i#*=}"
                shift
                ;;
            -e=* | --exit_code)
                exit_code="${i#*=}"
                shift
                ;;
            -f=* | --file=*)
                file="${i#*=}"
                shift
                ;;
            *)
                echo "Ignoring unsupported argument ${i#*=}"
                shift
                ;;
        esac
    done

    # Collect callstack in format CALLER:LINE>CALLER:LINE
    for (( i=${#FUNCNAME[@]}-1; i; i-- )); do
        trace+="${FUNCNAME[i]}:${BASH_LINENO[i-1]}"
        if [[ i -gt 1 ]]; then 
            trace+=">"
        fi
    done

    local valid_statuses=("TRACE" "DEBUG" "INFO" "WARN" "ERROR")
    # Ensure a status is provided
    if [[ -z "${status}" ]]; then
        echo "please provide a log status. Options:"
        echo "${valid_statuses[@]}"
        return 1
    fi
    # Ensure status is a valid status level
    if [[ ! " ${valid_statuses[*]} " =~ " ${status^^} " ]]; then
        echo "Invalid status ${status}"
        echo "expected one of: ${valid_statuses[@]}."
        return 1
    fi
    # Ensure a message is provided
    if [[ -z "${message}" ]]; then
        echo "Please provide a message"
        return 1
    fi

    # Check if a logfile is provided
    # If so, send it structured logs
    if [[ -n "${file}" ]]; then
        local logline="{timestamp:\"${timestamp}\",task:\"${trace}\",status:\"${status^^}\",message:\"${message}\",exitCode:${exit_code}},"
        echo "${logline}" >> "${file}"
    fi

    echo -e "${timestamp} | ${status^^} | ${trace} | ${message}"
}

# Script should record dump start time, end time, and duration for future timeout tuning (feeds back into Task 1's timeout config).
