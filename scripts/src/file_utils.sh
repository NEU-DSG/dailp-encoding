#!/usr/bin/env bash

#######################################
# Create a file with a given header/content, creating parent directories
# as needed.
# Globals:
#   None
# Arguments:
#   --header=STRING     Content to write as the file's contents.
#   --directory=PATH    Optional directory to prepend to the filename.
#   (positional)        The filename (or full path, if --directory is
#                        omitted) to create.
# Outputs:
#   Writes diagnostic/error messages to STDERR.
# Returns:
#   0 on success.
#   1 if the file could not be created/verified (a runtime condition the
#     caller can check and react to).
#   Exits 2 directly (does not return) if called without a filename, or if
#   the destination is already occupied. Both indicate the caller is
#   using this function incorrectly and need a code fix, not a runtime
#   retry.
#######################################
function create_file() {
  local filestub=""
  local directory=""
  local name=""
  local i

  for i in "$@"; do
    case "$i" in
      -d=* | --directory=*)
        directory="${i#*=}"
        shift
        ;;
      -h=* | --header=*)
        filestub="${i#*=}"
        shift
        ;;
      *)
        name="${i#*=}"
        ;;
    esac
  done

  # name must be provided.
  # EXIT: a missing filename means the caller's code is wrong.
  if [[ -z "${name}" ]]; then
    echo "No filename provided! Exiting early." >&2
    exit 2
  fi

  # If the user provides a directory, make sure it ends in a slash.
  if [[ -n "${directory}" && ! "${directory}" == */ ]]; then
    directory+="/"
  fi

  local destination="${directory}${name}"

  # If the final destination already exists as a file, or if the supplied
  # directory path is itself a file (not a directory), notify and fail.
  # RETURN: a naming collision is a runtime condition a caller
  # can react to (e.g. pick a different name, or decide it's fine to
  # reuse the file) so it's reported back rather than killing the
  # process outright.
  if [[ -f "${destination}" || ( -n "${directory}" && -f "${directory%/}" ) ]]; then
    echo "File already exists!" >&2
    return 1
  fi

  # If the user provides a directory, make sure it exists.
  if [[ -n "${directory}" && ! -d "${directory}" ]]; then
    mkdir -p "${directory}"
  fi

  # If destination's parent directory does not exist, create it.
  local destination_dir
  destination_dir="$(dirname "${destination}")"
  if [[ ! -d "${destination_dir}" ]]; then
    mkdir -p "${destination_dir}"
  fi

  echo "${filestub}" > "${destination}"

  local filecontents
  filecontents="$(cat "${destination}")"

  # RETURN (not exit): I/O failures here are environmental (disk full,
  # permissions, etc.) -- a caller can check the status and decide how to
  # report or retry, so this shouldn't unilaterally kill the process.
  if ! [[ -f "${destination}" ]]; then
    echo "Failed to create file" >&2
    return 1
  fi

  if ! [[ "${filecontents}" == "${filestub}" ]]; then
    echo "File not correctly initialized." >&2
    return 1
  fi

  return 0
}
