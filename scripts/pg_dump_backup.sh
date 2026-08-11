#!/usr/bin/env bash

function main() {
    local log_location="$(pwd)/logs/"
    local destination="$(pwd)/backups/pg_dump/"
    # Parse inputs
    for i in "$@"; do
        case $i in
            --help)
                info
                shift
                ;;
            -l=* | --log-location=*)
                log_location="${i#*=}"
                shift
                ;;
            -d=* | --destination=*)
                destination="${i#*=}"
                shift
                ;;
        esac
    done
    if [[ "${directory}" == */ ]]; then
        directory+="/"
    fi
    # log_location must be a directory
    if [[ ! -d "${log_location}" ]]; then
        mkdir -p "${log_location}"
    fi
    # destination must be a directory
    if [[ ! -d "${destination}" ]]; then
        mkdir -p "${destination}"
    fi

    . $(dirname "$0")/log_utils.sh

    local logfile
    create_logfile \
        --reference=logfile \
        --location=${log_location} \
        "dailp_pg-dump"
    log_event \
        --file="${logfile}" \
        --message="Hooking up logfile: ${logfile}" \
        --status="INFO"
    create_backup \
        -l="${logfile}" \
        -d="${destination}"
    
    local status=$?

    log_event \
        --file="${logfile}" \
        --message="Exiting successfully." \
        --status="INFO"
    exit 0
}

function create_backup() {
    local logfile
    local db_endpoint=$DATABASE_URL
    local db_password=$DATABASE_PASSWORD
    local current_time="$(date -Iseconds)"
    local here=$(dirname "$0")
    local destination="./backups/pg_dump/"
    . $here/file_utils.sh
    . $here/log_utils.sh
    for i in "$@"; do
        case $i in
            -p=* | --password=*)
                shift
                ;;
            -l=* | --log=*)
                logfile="${i#*=}"
                shift
                ;;
            -d=* | --destination=*)
                destination="${i#*=}"
                shift
                ;;
            *)
                db_endpoint="${i#*=}"
                shift
                ;;
        esac
    done
    local dumpfile="${destination}dailp_${current_time}.dump"
    # db_endpoint must exist
    if [[ -z "${db_endpoint}" ]]; then
        log_event \
        --file="${logfile}" \
        --message="Database endpoint not provided. Cannot connect to database.\
            Please use \$DATABASE_URL or \`create_backup [endpoint]\`" \
        --status="ERROR"
        exit 2
    fi

    # db_password must exist
    if [[ -z "${db_password}" ]]; then
        log_event \
        --file="${logfile}" \
        --message="Database password not provided. Cannot connect to database.\
            Please use \$DATABASE_PASSWORD or \`create_backup --password=[endpoint]\`" \
        --status="ERROR"
        exit 2
    fi

    log_event \
        --file="${logfile}" \
        --message="Creating pg_dump backup..." \
        --status="INFO"
    # Create file
    create_file "${dumpfile}"
    if [[ $? -ne 0 ]]; then 
        log_event \
        --file="${logfile}" \
        --message="Failed to create file ${dumpfile}" \
        --status="ERROR"
        exit 2
    fi
    log_event \
        -f="${logfile}" \
        -m="...running pg_dump utility..." \
        -s="INFO"
    # Run pg_dump
    pg_dump -Fc --file=$dumpfile $db_endpoint

    local status=$?
    if [[ $status -ne 0 ]]; then 
        log_event \
            -f="${logfile}" \
            -m="pg_dump failed." \
            -s="ERROR"
        exit 2
    fi
    echo $dumpfile
    # dumpfile must contain data
    if [[ ! -s "${dumpfile}" ]]; then
        log_event \
            -f="${logfile}" \
            -m="pg_dump produced empty file." \
            -s="ERROR" \
            -e="2"
        exit 2
    fi
    return 0
}

function info() {
    echo "Creates an export of database data using the pg_dump utility."
    echo
    echo "Syntax: pg_dump_backup [--help]"
    echo
    echo "Exit Status"
    echo "0 = Success"
    echo "1 = Retryable Failure"
    echo "2 = Non-retryable failure"
    exit 0
}

main "$@"
# The system shall execute pg_dump against the target RDS PostgreSQL instance from the EC2 host.
# The script shall produce a single output file per run, named per the shared naming convention.
# The script shall write output to the agreed local staging directory.
# The script shall verify the dump file was created and is non-empty before signaling success.
# The script shall exit with a distinct, documented exit code for: success, connection failure, pg_dump command failure, and disk-space/write failure.
# The script shall not expose database credentials in logs, process listings (ps), or error output.

