# Scripts

> [!INFO] All scripts use the unix equals-separated variable convention (ie. `command -v=[value]`; not `command -v [value]`).

For now, all scripts follow the same Exit Code format:

0 = success,
1 = retryable error,
2 = fatal error.

## Executables

### pg_dump_backup.sh [--help] [-l | --log_location] [-d | --destination]

> [!WARNING] Not yet implemented.

Creates a file containing the results of pg_dump. By default, saves files to `./backups/pg_dump/`.

Depends on: File utilities, logging utilities

Arguments:
- --help: Shows command documentation
- -l, --log-location: Folder to save logs to
- -d, --destination: Folder to save dumpfile to

### csv_backup.sh [--help] [-l | --log_location] [-d | --destination]

> [!WARNING] Not yet implemented.

Creates a file containing a CSV backup of database information. By default, saves files to `./backups/csv/`

Depends on: File utilities, logging utilites

Arguments:
- --help: Shows command documentation
- -l, --log-location: Folder to save logs to
- -d, --destination: Folder to save dumpfile to

## Library
### File Utilities

#### create_file [-h | --header] [-d | --directory] name

> [!WARNING] Not yet implemented.

Creates a file with the provided name in a specified location, if provided.
Also adds header content, if provided, to the file upon its creation.

Arguments:
- --help: Shows command documentation
- -h, --header: Header content for this file, if any. Default: "".
- -d, --directory: Folder to save file to. Default: './'
- name: a filename. May or may not contain a path. Required.

Errors:
- Failed to create file
- File contents not correctly initialized

Fatal errors:
- File [name] not provided
- File [name] already exists
- [directory] already exists and is not a directory

### Logging Utilities
Depends on: File utilities

#### create_logfile [-l | --location] [-r|--reference] name

> [!WARNING] Not yet implemented.

Creates a logfile at [location | .]/[name]_YYYYMMDDTHHMMSSZ.log.
Also passes final location to [reference] if provided; this is helpful for downstream use of `log_event`.

Arguments:
- -l, --location: Folder to save log to. Defaults to `./logs/`.
- -r, --reference: a reference variable that will store the final log location once it is created. Optional.
- name: The label for this logfile. Required.

Fatal Errors: 
- [reference] already has a value
- [location] is not a directory

#### log_event [-s | --status] [-m | --message] [-e | --exit_code] [-f | --file]

> [!WARNING] Not yet implemented.

Reports an event to stdout and a logfile [file], if provided.
Events are added to stdout in the tabular format `time | status | trace | message`.
Events are added to logfiles in the json format
```json
{timestamp:"[timestamp]",task:"[trace]",status:"[status]",message:"[message]",exitCode:"[exit_code]"},
```

Arguments:
- -s, --status: A status code: "TRACE", "DEBUG", "INFO", "WARN", "ERROR"
- -m, --message: The message to print for this log line
- -e, --exit_code: The exit code for the operation described in this log line, if any
- -f, --file: The logfile to report to

Errors: 
- [status] was not provided or is not a valid status code option
- [message] was not provided
