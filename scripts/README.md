# Scripts

> [!INFO] All scripts use the unix equals-separated variable convention (ie. `command -v=[value]`; not `command -v [value]`). Named arguments always precede positional/unnamed arguments at a call site.

See [`bash_standards.md`](./bash_standards.md) for the full set of conventions these scripts follow (naming, `set -u` safety, exit-code policy, alphabetized named arguments, and more), with citations.

For now, all scripts follow the same Exit Code format:
0 = success,
1 = retryable error (fix the environment/input and re-run the same command),
2 = fatal error (the code itself needs to change before re-running would help).

## Requirements

- `bash` (all scripts use bash-specific features -- namerefs, `[[ ]]`, `set -u` -- and are not intended to run under `sh`/`dash`).
- `psql`, the PostgreSQL command-line client, on `PATH` -- required by `pg_export_to_csv.sh` only.

## Environment Variables

- `PGPASSWORD` -- read by `pg_export_to_csv.sh`. If set, its value is used to connect without an interactive prompt (unless `-w` forces one anyway). If unset and no connection string (`-c=`) is given, the script prompts for a password interactively.
- `DATABASE_URL` -- read by `pg_dump_backup.sh`. Required: the connection endpoint passed directly to `pg_dump`.
- `DATABASE_PASSWORD` -- read by `pg_dump_backup.sh`. Required: exported as `PGPASSWORD` for `pg_dump` to pick up (rather than passed as a command-line flag, so it never appears in `ps` output).

## Status at a Glance

| Name | Type | Implemented? | Depends on |
|---|---|---|---|
| `pg_export_to_csv.sh` | Executable | Yes | File utilities, logging utilities |
| `pg_dump_backup.sh` | Executable | Yes | File utilities, logging utilities |
| `create_file` | Library (File utilities) | Yes | -- |
| `create_logfile` | Library (Logging utilities) | Yes | File utilities |
| `log_event` | Library (Logging utilities) | Yes | -- |

## Executables

### pg_export_to_csv.sh [--help] [-c | --conn_string] [-d | --dbname] [-h | --host] [-o | --outdir] [-p | --port] [-s | --schema] [-U | --user] [-w]

Connects to a PostgreSQL database and exports every table in a schema to its own CSV file. By default, saves files to `./<dbname>_csv_export_<timestamp>/`, alongside a `logs/` subfolder containing the run's logfile.

Depends on: File utilities, logging utilities

Quick start:
```sh
./pg_export_to_csv.sh -d=mydb -h=localhost -U=admin
```

Arguments:
- --help: Shows command documentation
- -c, --conn_string: Full connection string/URI. Alternative to providing -d/-h/-p/-U individually.
- -d, --dbname: Database name. Required unless -c is given.
- -h, --host: Database host (endpoint). Required unless -c is given.
- -o, --outdir: Folder to save CSVs to. Default: `./<dbname>_csv_export_<timestamp>/`
- -p, --port: Database port. Default: `5432`
- -s, --schema: Schema to export. Default: `public`. Validated against `^[A-Za-z_][A-Za-z0-9_]*$` before use; invalid values are rejected before any query runs.
- -U, --user: Database user. Required unless -c is given.
- -w: Force an interactive password prompt, ignoring the `PGPASSWORD` environment variable.

> [!NOTE] If `PGPASSWORD` is unset and `-w` is not passed, the script prompts interactively for a password.

Errors (exit code 1 -- retryable once the underlying issue is fixed):
- `psql` client not found on PATH
- Could not connect to the database
- Failed to fetch the table list for the schema
- Invalid schema name
- Missing required arguments, or unrecognized flags
- One or more tables failed to export (reported once, after every table has been attempted -- other tables still get exported; see the run's logfile for which table(s) failed and why)

### pg_dump_backup.sh [--help] [-d | --destination] [-l | --log-location]

Creates a file containing the results of pg_dump, in the custom (`-Fc`) archive format. By default, saves files to `./backups/pg_dump/`, alongside a `logs/` subfolder containing the run's logfile.

Depends on: File utilities, logging utilities

Requires `$DATABASE_URL` and `$DATABASE_PASSWORD` to be set in the environment (see "Environment Variables" above).

Quick start:
```sh
DATABASE_URL=postgres://localhost:5432/dailp DATABASE_PASSWORD=secret ./pg_dump_backup.sh
```

Arguments:
- --help: Shows command documentation
- -d, --destination: Folder to save the dump file to. Default: `./backups/pg_dump/`
- -l, --log-location: Folder to save logs to. Default: `./backups/pg_dump/logs/`

Errors (exit code 1 -- retryable once the underlying issue is fixed):
- `DATABASE_URL` or `DATABASE_PASSWORD` not set
- Failed to create the dump file (e.g. destination not writable)
- `pg_dump` itself failed (e.g. connection refused, authentication failure)
- `pg_dump` produced an empty file
- Missing required arguments, or unrecognized flags

## Library

### File Utilities
#### create_file [-h | --header] [-d | --directory] name

Creates a file with the provided name in a specified location, if provided.
Also adds header content, if provided, to the file upon its creation.

Quick start:
```sh
create_file --header="hello" --directory="./out" "greeting.txt"
```

Arguments:
- -h, --header: Header content for this file, if any. Default: `""`.
- -d, --directory: Folder to save the file to, if any. Default: none -- the name is used as-is, relative to the current working directory.
- name: a filename. May or may not contain a path. Required.

Errors (exit code 1 -- returned to the caller, who can check the status and decide how to react):
- File already exists (this also covers the case where the given `--directory` names an existing file rather than a directory)
- Failed to create file
- File not correctly initialized

Fatal errors (exit code 2):
- Filename not provided

### Logging Utilities
Depends on: File utilities

#### create_logfile [-l | --location] [-r | --reference] name

Creates a logfile at `[location | ./logs/]/[name]_<timestamp>.log`, where `<timestamp>` is an ISO-8601 timestamp with a UTC offset (e.g. `2026-08-11T18:04:17+00:00`), not the compact `YYYYMMDDTHHMMSSZ` form. See "Suggested Enhancements" below.

Also passes the final location to `[reference]`, if provided; this is helpful for downstream use of `log_event`.

Quick start:
```sh
logfile=""
create_logfile --location="./logs" --reference=logfile "my_task"
log_event --file="${logfile}" --status="INFO" --message="Started"
```

Arguments:
- -l, --location: Folder to save the log to. Defaults to `./logs/`.
- -r, --reference: a reference variable that will store the final log location once it is created. Optional.
- name: The label for this logfile. Required.

Fatal Errors (exit code 2):
- `name` was not provided
- `[reference]` already has a value
- `[location]` is not a directory
- The logfile could not be initialized (the underlying `create_file` call failed)

#### log_event [-s | --status] [-m | --message] [-e | --exit_code] [-f | --file]

Reports an event to **stderr** and a logfile `[file]`, if provided.

Events are written to stderr in the tabular format `time | status | trace | message`.
Events are added to logfiles in the format:
```json
{timestamp:"[timestamp]",task:"[trace]",status:"[status]",message:"[message]",exitCode:[exit_code]},
```
> [!NOTE] `exitCode` is written unquoted (it's either a bare number or the literal `null`), unlike the other fields.

Quick start:
```sh
log_event --status="INFO" --message="Job started"
log_event --exit_code="1" --file="./run.log" --message="Job failed" --status="ERROR"
```

Arguments:
- -s, --status: A status code: `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR` (case-insensitive)
- -m, --message: The message to print for this log line
- -e, --exit_code: The exit code for the operation described in this log line, if any. Default: none -- renders as `null` in the logfile.
- -f, --file: The logfile to report to. Default: none -- the event is still written to stderr, just not to any file.

Fatal Errors (exit code 2):
- `[status]` was not provided or is not a valid status code option
- `[message]` was not provided

> [!NOTE] These are fatal, not retryable: every call site in this codebase passes `--status`/`--message` as hardcoded literals, so a failure here always means the *calling code* needs to be fixed, not the runtime environment or inputs.

## Suggested Enhancements

- **Consider a compact, colon-free timestamp for logfile names.** `create_logfile` currently uses `date -Iseconds` (e.g. `2026-08-11T18:04:17+00:00`), which is precise but includes colons and a `+`/`-` offset -- both of which are fine on Linux/macOS but can be awkward on other filesystems/tools. A format like `date +%Y%m%dT%H%M%SZ` (UTC, no colons) would be more portable and matches what this README originally specified. **Deferred for now** -- not yet implemented, kept here as a reminder.
- **Implement automated linting with `shellcheck`.**