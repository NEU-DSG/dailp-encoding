# Standard Operating Procedures

## Routine Database Backups

### Purpose

Backups exist to provide redundant copies of the DAILP database: on a recurring, daily basis, and
immediately before any major system change (schema migration, deployment, infrastructure change)
that could put existing data at risk. If something goes wrong, these backups are how the database
gets recovered.

### Prerequisites

- A running PostgreSQL instance, reachable from the machine running the backup. A non-local
  database is not reachable directly -- see [`../terraform/docs/sops.md`](../terraform/docs/sops.md) for how to
  open the SSM tunnel that puts it on `localhost:5432`.
- Write permissions on the local filesystem destination (defaults to `./backups/`).
- `bash`, `pg_dump`, and `psql` on `PATH` -- all provided automatically inside the project's `nix
  develop` shell.
- `DATABASE_URL` and `DATABASE_PASSWORD` set in the environment. Local dev values live in the
  repo's `.env` (loaded automatically by the `nix develop` shell hook). For any non-local
  environment, these must come from that environment's secrets store.

### Procedure

A complete backup is **both** of the following, run one after another. Commands below assume
you're in the `scripts/` directory; adjust paths otherwise.

**1. Dumpfile backup ([`pg_dump_backup.sh`](./src/pg_dump_backup.sh))**

```sh
./src/pg_dump_backup.sh
```

- Produces a single custom-format (`-Fc`) dump file at `./backups/pg_dump/dailp_<timestamp>.dump`.
- Logs to `./backups/pg_dump/logs/dailp_pg-dump_<timestamp>.log`.
- Override the output locations with `-d=DESTINATION` / `-l=LOG_LOCATION` if needed.

**2. CSV export ([`export_db_to_csv.sh`](./src/export_db_to_csv.sh))**

```sh
./src/export_db_to_csv.sh
```

- Reads `DATABASE_URL`/`DATABASE_PASSWORD` from the environment, same as step 1 -- which is what
  the `dev-csv-dump` dev-shell wrapper does. Pass `-d=`/`-h=`/`-U=`/`-p=` (or a full connection
  string via `-c=`) to target something other than `$DATABASE_URL`. Add `-s=SCHEMA` to export a
  schema other than `public`.
- Produces one CSV file per table at `./backups/pg_export/dailp_csv_export_<timestamp>/`, plus the
  `manifest.csv` (`table,csv_filename,row_count,sha256`) that
  [`import_db_from_csv.sh`](./src/import_db_from_csv.sh) verifies against. Override with `-o=`.
- Logs to `./backups/pg_export/logs/`. Note this is *not* nested inside the timestamped export
  folder; override with `-l=`.

See [`README.md`](./README.md) for the full argument reference for both scripts. Be aware that
`README.md` and [`runbook.md`](./runbook.md) still refer to this second script by an older name,
`pg_export_to_csv.sh`; `export_db_to_csv.sh` is the one the tooling actually calls.

### When to Run

- **Recurring:** once daily, as a standing operational duty.
- **Before major changes:** immediately before any schema migration, deployment, or other change
  that could affect existing data. Run both steps above first, and confirm both succeeded before
  proceeding with the change.

### Verifying Success

- Both scripts exit `0` on success and print a summary of what they did.
- If either exits non-zero, `1` means retryable -- fix the underlying issue (credentials,
  connectivity, disk space, arguments) and re-run the same command.
- Confirm the dump file exists and is non-empty.
- Confirm the CSV export folder contains one file per table, and check its printed
  succeeded/failed counts.
- Check the run's logfile for any `WARN` or `ERROR` entries.

### Periodically Verify Backups Are Restorable

Creating backups isn't useful if they can't be restored. On a periodic basis (e.g. monthly), test-restore a recent dumpfile to a scratch database:

```sh
createdb -T template0 dailp_restore_test
pg_restore -d dailp_restore_test ./backups/pg_dump/dailp_<timestamp>.dump
dropdb dailp_restore_test
```

This is a lightweight sanity check that the dumpfile is usable, not a full disaster-recovery
drill.

### Automated Alternative

Both steps above are automated by the **Data Backup** workflow
([`.github/workflows/data-backup.yml`](../.github/workflows/data-backup.yml)), dispatched manually
from `main`. It runs them on the dev bastion, which reaches RDS directly rather than through a
tunnel, and uploads the results to
`s3://dailp-dev-media-storage/db-backups/<run-timestamp>/`:

| artifact | object |
|---|---|
| `pg_dump_backup.sh` output | `dailp_<timestamp>.dump` |
| `export_db_to_csv.sh` output | `dailp_<timestamp>_csv.tar.gz` (the export folder, `manifest.csv` included) |

The final status and both object locations are reported in the run summary. The workflow removes
its working directory from the bastion only after confirming both objects are in S3, so a failed
run leaves the artifacts on the instance for recovery by hand.

Prefer the workflow for the recurring daily backup. Use the manual procedure above when you need a
backup of a stage the workflow does not cover, or when you need one immediately before a change
and don't want to wait on a full workflow run.

### Known Limitations

- Neither script prunes old backups -- storage and retention cleanup is a manual, separate
  responsibility for now. This applies to S3 too: nothing expires objects under `db-backups/`,
  and the bucket is versioned.
- The workflow above is dispatch-only; nothing schedules it yet, so the daily cadence described
  above is still something a person has to initiate. (Future enhancement: put it on a schedule.)
- The workflow covers `dev` only -- its `TF_STAGE` is hardcoded.

### Reference

- [`README.md`](./README.md) -- full command/argument documentation for every script in this
  folder.
- [`bash_standards.md`](./bash_standards.md) -- the coding standards these scripts follow.
- [`runbook.md`](./runbook.md) -- what to do when a step in this procedure fails.
