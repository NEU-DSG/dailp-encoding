#!/usr/bin/env bash
function create_file() {
    local filestub
    local directory
    local name
    for i in "$@"; do
        case $i in
            -h=*|--header=*)
                filestub="${i#*=}"
                shift
                ;;
            -d=*|--directory=*)
                directory="${i#*=}"
                shift
                ;;
            *)
                name="${i#*=}"
                ;;
        esac
    done
    # name must be provided
    if [[ -z "${name}" ]]; then
        echo "No filename provided! Exiting early."
        exit 2
    fi
    # If name already exists as a file or if directory is a file,
    # notify user and fail
    if [[ -f "${name}" || -f "${directory}" ]]; then
        echo "File already exists!"
        exit 2
    fi
    # If the user provides a directory, make sure it ends in a slash
    if [[ -n "${directory}" && "${directory}" == */ ]]; then
        directory+="/"
    fi
    # If the user provides a directory, make sure it exists.
    if [[ -n "${directory}" && ! -d "${directory}" ]]; then
        mkdir -p "$directory"
    fi
    # name must be an existing path
    # If name's directory does not exist, create it
    if [[ ! -d "$(dirname name)" ]]; then
        echo "$(dirname name)"
        mkdir -p "$name"
    fi

    local destination="${directory}${name}"
    echo "$filestub" > "${destination}"

    local filecontents="$(cat "${destination}")"
    if ! [[ -f $destination ]]; then 
        echo "Failed to create file"
        return 1
    fi
    if ! [[ $filecontents == $filestub ]]; then 
        echo "File not correctly initialized."
        return 1
    fi
    return 0
}
