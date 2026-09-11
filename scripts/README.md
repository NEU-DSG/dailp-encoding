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
- `pandoc` on `PATH` -- required by `md_to_docx.sh` only. It ships with this repo's nix devShell, so `nix develop` is enough; nothing to install by hand.
- `curl` on `PATH` -- required by `download_from_s3.sh` for its CloudFront and `-B/--backup` paths.
- `aws`, the AWS CLI, on `PATH` -- required by `upload_to_s3.sh`, and by `download_from_s3.sh` for its `-b/--bucket`, `-r/--recursive` and `-B/--backup` paths. Note `-B/--backup` needs the binary but no credentials: the only call it makes is the unsigned Cognito `InitiateAuth`.
- `jq` on `PATH` -- required by `download_from_s3.sh`'s `-B/--backup` path, which builds and parses JSON.

## Environment Variables

- `PGPASSWORD` -- read by `pg_export_to_csv.sh`. If set, its value is used to connect without an interactive prompt (unless `-w` forces one anyway). If unset and no connection string (`-c=`) is given, the script prompts for a password interactively.
- `DATABASE_URL` -- read by `pg_dump_backup.sh`. Required: the connection endpoint passed directly to `pg_dump`.
- `DATABASE_PASSWORD` -- read by `pg_dump_backup.sh`. Required: exported as `PGPASSWORD` for `pg_dump` to pick up (rather than passed as a command-line flag, so it never appears in `ps` output).
- `CF_URL` -- read by `upload_to_s3.sh` and `download_from_s3.sh`. The CloudFront distribution domain, with or without a scheme. Used for media objects only; it is deliberately ignored for backups, which no distribution fronts.
- `TF_STAGE` -- read by both s3 scripts to derive a default bucket name (`dailp-${TF_STAGE}-media-storage` or `dailp-${TF_STAGE}-backups`). Optional, default `dev`.
- `DAILP_API_URL` -- read by `download_from_s3.sh -B/--backup`. Required there: the API Gateway stage URL, from `nix run --impure .#tf-output functions_url`.
- `DAILP_USER_POOL_CLIENT_ID` -- read by `download_from_s3.sh -B/--backup`. Required there: the CLI app client, from `nix run --impure .#tf-output cli_user_pool_client_id`. This is *not* the web app client, which cannot do password auth.
- `DAILP_USER_EMAIL`, `DAILP_USER_PASSWORD` -- read by `download_from_s3.sh -B/--backup`. Optional; prompted for interactively (the password without echo) when unset. Prefer the prompt: an exported password is readable by anything sharing the environment and tends to end up in shell history.

## Status at a Glance

| Name | Type | Implemented? | Depends on |
|---|---|---|---|
| `pg_export_to_csv.sh` | Executable | Yes | File utilities, logging utilities |
| `pg_dump_backup.sh` | Executable | Yes | File utilities, logging utilities |
| `md_to_docx.sh` | Executable | Yes | Logging utilities, defensive utilities |
| `upload_to_s3.sh` | Executable | Yes | Logging utilities, s3 utilities, defensive utilities |
| `download_from_s3.sh` | Executable | Yes | Logging utilities, s3 utilities, defensive utilities |
| `create_file` | Library (File utilities) | Yes | -- |
| `create_logfile` | Library (Logging utilities) | Yes | File utilities |
| `log_event` | Library (Logging utilities) | Yes | -- |
| `default_media_bucket` | Library (s3 utilities) | Yes | -- |
| `default_backup_bucket` | Library (s3 utilities) | Yes | -- |
| `normalize_cf_url` | Library (s3 utilities) | Yes | -- |
| `url_encode_key` | Library (s3 utilities) | Yes | -- |
| `object_location` | Library (s3 utilities) | Yes | s3 utilities |

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

### md_to_docx.sh [--help] [-f | --force] [-l | --log-location] [-o | --outdir] [-r | --reference-doc] path...

Converts markdown documentation into Word (`.docx`) files via `pandoc`, one `.docx` per source file, so docs written in markdown can be handed to reviewers who work in Word. Each `path` is either a markdown file (`.md`/`.markdown`) or a directory to search recursively; a mix of both is fine. Directory subtrees are mirrored under the output folder, so `doc/database/words.md` lands at `<outdir>/database/words.docx`. By default, saves files to `./backups/md_to_docx/`, alongside a `logs/` subfolder containing the run's logfile.

Depends on: logging utilities, defensive utilities

Requires `pandoc` on `PATH` (see "Requirements" above). Inside the dev shell, `dev-md-to-docx` runs this script with the same arguments.

Quick start:
```sh
./md_to_docx.sh -o=./out scripts/SOPs.md terraform/docs/
```

Arguments:
- --help: Shows command documentation
- -f, --force: Overwrite existing `.docx` files. Default: leave them alone and report them as skipped, so a re-run never silently clobbers a document someone is already marking up.
- -l, --log-location: Folder to save logs to. Default: `./backups/md_to_docx/logs/`
- -o, --outdir: Folder to save `.docx` files to. Default: `./backups/md_to_docx/`
- -r, --reference-doc: A `.docx` whose styles `pandoc` should reuse for the output. Default: pandoc's own styles.
- path...: Markdown files and/or directories to convert. At least one required. `node_modules`, `.git`, `target`, and `result` are skipped when walking a directory.

Errors (exit code 1 -- retryable once the underlying issue is fixed):
- `pandoc` not found on PATH
- A given path is neither an existing file nor a directory
- A given file is not markdown (`.md`/`.markdown`)
- `--reference-doc` names a file that doesn't exist
- No input path given, or unrecognized flags
- One or more files failed to convert (reported once, after every file has been attempted -- the other files still get converted; see the run's logfile for which file(s) failed and why)

> [!NOTE] Markdown is read as GitHub-Flavored Markdown, so pipe tables, task lists, and strikethrough all convert. GitHub's alert blockquotes (`> [!NOTE]`) have no `.docx` equivalent and render as an ordinary blockquote whose first line is the literal `[!NOTE]`.

### upload_to_s3.sh [--help] [-b | --bucket] [-l | --log-location] [-p | --prefix] path...

Uploads one or more local files to an S3 bucket via `aws s3 cp`, logging each object's reportable location. Used by the Data Backup workflow for both halves of a run: the XML bundle from the GitHub runner, and the database dump and CSV tarball from the bastion.

Depends on: logging utilities, s3 utilities, defensive utilities

Quick start:
```sh
./upload_to_s3.sh -b=dailp-dev-backups -K=backup -p=db-backups/2026-09-11T12:00:00Z ./dailp.dump
```

Arguments:
- --help: Shows command documentation
- -b, --bucket: Destination bucket. Default: `dailp-${TF_STAGE}-media-storage`.
- -K, --kind: How to report each object's location -- `media` (default) or `backup`. **Pass `backup` when uploading to the backup bucket.** With the default and `$CF_URL` set, as it is throughout the backup workflow, every logged location would be a CloudFront URL, and for the backup bucket that names a location which cannot resolve. This only affects reporting; the upload target is the `s3://` URI either way.
- -l, --log-location: Folder to save logs to
- -p, --prefix: Key prefix to upload under. Default: none.
- -r, --recursive: Upload every regular file under a single DIRECTORY argument, preserving paths relative to it under the prefix.
- path...: Local files to upload. At least one required (exactly one directory with `-r`).

Errors (exit code 1 -- retryable once the underlying issue is fixed):
- `aws` not found on PATH
- A given path does not exist or is not readable
- `AccessDenied` from S3. Worth reading as a *policy* statement rather than a transient fault: the two identities that upload have deliberately narrow, non-overlapping grants (the runner may write `xml-backups/` only; the bastion may write `db-backups/` only). Writing outside them is denied by design and wants a new statement in `terraform/backup-storage.nix`, not a retry.

### download_from_s3.sh [--help] [-B | --backup] [-b | --bucket] [-l | --log-location] [-o | --outdir] [-p | --prefix] [-r | --recursive] KEY...

Downloads objects from S3 to local files. There are three transports, and **which one you want is a security decision, not a preference**:

| Flag | Who it's for | Authentication |
|---|---|---|
| `-B`, `--backup` | A **human** retrieving a backup | DAILP login; must be in the `Administrators` group. No AWS credentials at all. |
| `-b=BUCKET` | **Automation** | The caller's existing IAM role. No tokens, no Cognito. |
| *(default)* | Media objects | None -- unauthenticated CloudFront. Cannot reach backups. |

`-B/--backup` authenticates against Cognito with the CLI app client, asks the GraphQL API for a short-lived presigned URL (default 15 minutes), and fetches that. The presigning happens in the lambda under *its* IAM role, which is why this path needs no AWS credentials of its own.

`-b=BUCKET` is the path restore automation should use. A restore job on the bastion runs `-b=dailp-${TF_STAGE}-backups` under the instance profile and needs no human credential. **Do not wire automation through `-B/--backup`.**

Depends on: logging utilities, s3 utilities, defensive utilities

Quick start:
```sh
# A human retrieving one backup (prompts for DAILP email and password):
export DAILP_API_URL=$(nix run --impure .#tf-output functions_url)
export DAILP_USER_POOL_CLIENT_ID=$(nix run --impure .#tf-output cli_user_pool_client_id)
./download_from_s3.sh -B -o=./out/ db-backups/2026-09-11T12:00:00Z/dailp.dump

# Restore automation, on the bastion, under the instance role:
./download_from_s3.sh -b=dailp-dev-backups -o=./out/ db-backups/2026-09-11T12:00:00Z/dailp.dump
```

Arguments:
- --help: Shows command documentation
- -B, --backup: Download a backup as a human, via a presigned URL. Mutually exclusive with `-b/--bucket`.
- -b, --bucket: Download directly with `aws s3 cp` from this bucket, using ambient AWS credentials.
- -l, --log-location: Folder to save logs to. Default: `./logs/download_from_s3/`
- -o, --outdir: Folder to save files to. Default: `.` -- pass a trailing slash (`-o=./out/`), since the path is concatenated rather than joined.
- -p, --prefix: Key prefix. With `-r`, the directory to download; without it, each `KEY` is fetched from under this prefix. **Required** with `-r -B`, because the backup bucket policy's `s3:prefix` condition denies an unprefixed listing.
- -r, --recursive: Download everything under `-p/--prefix` instead of named keys. Preserves the key structure below the prefix as nested folders under `-o`.
- KEY...: Object keys to download. At least one, unless `-r`.

Errors (exit code 1 -- retryable once the underlying issue is fixed):
- `curl`, `aws` or `jq` not found on PATH (which are needed depends on the transport; see "Requirements")
- `-B/--backup` given together with `-b/--bucket`, or without `DAILP_API_URL` / `DAILP_USER_POOL_CLIENT_ID`
- `Forbidden, user not in group 'Administrators'` -- a valid login that is not in the group. The fix is `aws cognito-idp admin-add-user-to-group`, not a change to the script.
- `NotAuthorizedException` from Cognito (wrong email or password), or a challenge such as `NEW_PASSWORD_REQUIRED` for an account that has never set a permanent password
- A listing truncated at 1000 keys. Reported as an error rather than silently returning a partial list, since for a restore a partial list is a correctness bug. Narrow the prefix.
- A destination file already exists -- never overwritten, reported as a per-key failure
- One or more keys failed (reported once, after every key has been attempted; see the run's logfile for which and why)

> [!NOTE] A presigned URL is a bearer credential for that object until it expires, so the logs record the key and never the URL. Fetch it with a single `curl` and do not resume a failed transfer with `--continue-at`: S3 checks expiry when it authorizes a request, so one long transfer is fine however large the dump, but a resumed one issues a second request that may land after the URL has died. Re-run to mint a fresh URL instead.

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

### S3 Utilities

Shared by `upload_to_s3.sh` and `download_from_s3.sh`. None of these calls `aws` or `log_event`, so `utils/s3_utils.sh` can be sourced on its own.

#### default_media_bucket / default_backup_bucket

Derive a bucket name from `$TF_STAGE` (default `dev`): `dailp-${TF_STAGE}-media-storage` and `dailp-${TF_STAGE}-backups` respectively.

These are two different buckets on purpose. Backups used to live under `db-backups/` and `xml-backups/` *inside* the media bucket, which an unauthenticated CloudFront distribution fronts with `s3:GetObject` on the whole bucket -- so every dump was readable by anyone who knew or guessed the key, and the key is only a UTC timestamp. The backup bucket has a full public access block and no distribution.

#### normalize_cf_url [-u | --url]

Strips one trailing slash and prepends `https://` if the value has no scheme. Media only.

#### url_encode_key [-k | --key]

Percent-encodes an S3 key for use as a URL path, leaving RFC 3986's unreserved set (`A-Za-z0-9-._~`) alone and deliberately *not* encoding `/`, which is the key's path separator.

This exists because `pg_dump_backup.sh` names its output with `date +...%z`, so every dump filename contains a literal `+`. A `+` in a URL path is not the character `+`, so the raw key requested an object that does not exist -- and because the media bucket grants `s3:ListBucket` to nobody, S3 reported that miss as `AccessDenied` and CloudFront surfaced it as `403 Forbidden` rather than `404`: a lookup failure wearing a permissions failure's clothes. The loop runs under `LC_ALL=C` so it walks *bytes*, which is what percent-encoding is defined over; document names here carry Cherokee syllabary, so multi-byte input is a live concern.

> [!NOTE] Do not apply this to a presigned URL. Those arrive already encoded, and their signature covers exactly those bytes, so encoding again turns every `%` into `%25` and S3 rejects the request as `SignatureDoesNotMatch`.

#### object_location [-b | --bucket] [-k | --key] [-K | --kind]

Renders the location of an object for reporting -- a log line, a workflow run summary.

With `--kind=media` (the default) it returns the CloudFront URL when `$CF_URL` is set, falling back to `s3://bucket/key`. With `--kind=backup` it **always** returns `s3://bucket/key` and ignores `$CF_URL` entirely, even when set -- which it normally is during a backup run, since the XML bundler still needs it for media links.

That second case breaks an invariant this function used to hold: that no location this project reports is ever a bare `s3://` URI, since such a URI is not fetchable without credentials and not clickable in the Actions log viewer. For backups that is no longer a defect but the whole point. There is no URL that would be both correct and openable, and reporting a CloudFront one would name a location that cannot work while implying the object is web-reachable. Retrieval instead goes through `download_from_s3.sh` -- `-b=BUCKET` for automation, `-B/--backup` for a human.

## Suggested Enhancements

- **Consider a compact, colon-free timestamp for logfile names.** `create_logfile` currently uses `date -Iseconds` (e.g. `2026-08-11T18:04:17+00:00`), which is precise but includes colons and a `+`/`-` offset -- both of which are fine on Linux/macOS but can be awkward on other filesystems/tools. A format like `date +%Y%m%dT%H%M%SZ` (UTC, no colons) would be more portable and matches what this README originally specified. **Deferred for now** -- not yet implemented, kept here as a reminder.
- **Implement automated linting with `shellcheck`.**