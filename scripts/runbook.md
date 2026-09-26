# Runbook: Routine Backup Errors

Companion to [`SOPs.md`](./SOPs.md), which documents the routine backup procedure itself (what to
run, when, and how to tell it worked). This runbook covers what to do when a step in that
procedure fails: what you'll actually see, why, and how to resolve it.

## Preface: How to Read a Log Line

Both scripts report every step via `log_utils.sh`'s `log_event`, which writes to **stderr** as:

```
<timestamp> | <STATUS> | <trace> | <message>
```

...and, if a logfile was set up in time, appends a matching structured line to it:

```json
{timestamp:"...",task:"...",status:"...",message:"...",exitCode:...}
```

When troubleshooting, find the run's logfile first (`./backups/pg_dump/logs/` or
`./backups/csv/<export>/logs/`) and scan it for `WARN`/`ERROR` entries -- the messages below are
quoted verbatim from the scripts so you can match them directly.

---

## Section 1: Dumpfile Backup (`pg_dump_backup.sh`) Errors

| Symptom | Likely Cause | Resolution |
|---|---|---|
| `DATABASE_URL not set. Cannot connect to database.` (exit 1) | `DATABASE_URL` isn't set in the environment. | Confirm you're in the `nix develop` shell (it sources `.env` automatically) or, outside local dev, that the environment's secrets store actually exports `DATABASE_URL`. |
| `DATABASE_PASSWORD not set. Cannot connect to database.` (exit 1) | Same as above, for `DATABASE_PASSWORD`. | Same fix -- confirm the shell/secrets source actually set it. |
| `Failed to create file <dumpfile>` (exit 1) | The destination isn't writable, the disk is full, or (rare) a same-second re-run collided with an existing file at that exact timestamped path. | Check `-d`/`--destination`'s permissions and free disk space; re-run. |
| `pg_dump failed.` (exit 1) | Generic -- the real error isn't captured. Covers: connection refused/timed out, authentication failure, a malformed `DATABASE_URL`, or `pg_dump` not being installed/on `PATH` at all. | Re-run the same command by hand to see the actual error: `pg_dump -Fc --file=/tmp/test.dump "$DATABASE_URL"`. Also try `psql "$DATABASE_URL" -c 'select 1;'` to isolate connectivity/auth from a `pg_dump`-specific problem, and `command -v pg_dump` to rule out a missing install. |
| `pg_dump produced empty file.` (exit 1) | The dump ran but wrote nothing -- typically disk space exhausted mid-write, or `DATABASE_URL` pointing at a database that's unexpectedly empty. | Check free disk space; confirm you're pointed at the right database/host. |
| Script exits with a raw `mkdir: ... Permission denied` message instead of a structured log line, no logfile created at all | The `--destination`/`--log-location` folders are created *before* logging is set up, so a permission failure there happens too early to be logged. | Check permissions on the parent of your `-d=`/`-l=` path directly; this isn't a script bug, just an ordering quirk. |
| `Error: unknown option '...'` + usage text (exit 1) | A flag was misspelled, or passed in the wrong form (must be `-d=value`, not `-d value`). | Check the flag against `-d=DESTINATION` / `-l=LOG_LOCATION` in `--help` or `README.md`. |

## Section 2: CSV Export (`pg_export_to_csv.sh`) Errors

| Symptom | Likely Cause | Resolution |
|---|---|---|
| `psql not found. Please install the PostgreSQL client tools.` (exit 1) | Not running inside `nix develop` (or `psql` is otherwise missing from `PATH`). | Run from a `nix develop` shell, or install the PostgreSQL client tools. |
| `Error: invalid schema name '...'` (exit 1, before any logfile exists) | The `-s=` value doesn't match `^[A-Za-z_][A-Za-z0-9_]*$` -- usually a typo, stray quote, or SQL-injection-style input being (correctly) rejected. | Fix the schema name; it must be a plain SQL identifier. |
| `Could not connect to the database. Check host/port/user/db/password.` (exit 1) | Bad `-h=`/`-p=`/`-U=`/`-d=` (or `-c=`), network/firewall blocking the host, or wrong credentials. | Verify each connection argument individually; try `psql` with the same arguments directly. |
| Script hangs indefinitely, or aborts with no log entry, when run non-interactively (cron, CI, background) | Neither `DATABASE_PASSWORD`/`PGPASSWORD` nor `-c=` was given, so the script falls back to an interactive `read -rsp` password prompt that a non-interactive shell can't answer. | Always set `DATABASE_PASSWORD` (or `PGPASSWORD`) in the environment before running this script anywhere non-interactive. |
| `Failed to fetch table list for schema '<schema>'.` (exit 1) | The connection dropped mid-run, or the connected role lacks privileges to read `pg_tables` for that schema. | Confirm the role has at least read access to the schema's catalog info; check for a dropped connection in the DB server's own logs. |
| One or more `Failed to export <schema>.<table> -> <outfile>` lines, final summary reports `N failed`, exit 1 | The underlying `psql`/`\copy` error is discarded (redirected to `/dev/null`) -- the log only tells you *that* a table failed, not why. | Re-run that table's export by hand without the redirect to see the real error, e.g.: `psql <same connection args> -Atqc "\copy \"<schema>\".\"<table>\" TO '/tmp/out.csv' WITH (FORMAT csv, HEADER true)"`. Common causes: permissions/disk space on `--outdir`, or a column type `\copy` can't serialize as CSV. |
| `Error: unknown option '...'` / `Error: invalid argument '...'` + usage text (exit 1) | Flag typo, or an argument not in `-flag=value` form. | Check against `--help` or `README.md`'s argument list. |

## Section 3: Restore-Test Errors

Errors you may hit while following `SOPs.md`'s periodic `pg_restore` sanity check:

| Symptom | Likely Cause | Resolution |
|---|---|---|
| `createdb: error: database creation failed: ERROR: database "..." already exists` | A scratch database from a previous test-restore was never dropped. | `dropdb dailp_restore_test` first, then re-run `createdb`. |
| `role "<user>" does not exist` | Running as a different local Postgres role than the one the dump was taken under. | Pass `-U`/set `PGUSER` to a role that exists on the target instance, or create one. |
| `pg_restore` prints warnings about missing extensions, roles, or ownership during the restore | Expected noise for a sanity-check restore into a fresh scratch database that doesn't have every extension/role the source database has. | Safe to ignore for this purpose -- the check is "did the data restore," not a full environment parity check. Treat it as a real problem only if the restore also reports failed rows/tables, not just ownership/extension warnings. |

## Section 4: Nothing Above Matches

If you're seeing exit code `2` instead of `1`, or an error not listed here, that's a signal
something deeper than an environment/input problem is wrong (per `bash_standards.md`'s exit-code
convention, `2` means the code itself needs to change, not just the input/environment). Capture
the full logfile and escalate to assistant program manager rather than continuing to retry.
