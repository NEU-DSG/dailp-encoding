# Standard Operating Procedures

## Routine Database Backups

### Purpose

Backups exist to provide redundant copies of the DAILP database: on a recurring, daily basis, and
immediately before any major system change (schema migration, deployment, infrastructure change)
that could put existing data at risk. If something goes wrong, these backups are how the database
gets recovered.

### Prerequisites

- A running PostgreSQL instance, reachable from the machine running the backup. A non-local
  database is not reachable directly -- see [`../terraform/sop.md`](../terraform/sop.md) for how to
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

**1. Dumpfile backup ([`pg_dump_backup.sh`](./pg_dump_backup.sh))**

```sh
./pg_dump_backup.sh
```

- Produces a single custom-format (`-Fc`) dump file at `./backups/pg_dump/dailp_<timestamp>.dump`.
- Logs to `./backups/pg_dump/logs/dailp_pg-dump_<timestamp>.log`.
- Override the output locations with `-d=DESTINATION` / `-l=LOG_LOCATION` if needed.

**2. CSV export ([`pg_export_to_csv.sh`](./pg_export_to_csv.sh))**

```sh
./pg_export_to_csv.sh -d=dailp -h=localhost -U=<user>
```

- Produces one CSV file per table at `./backups/csv/dailp_csv_export_<timestamp>/`.
- Logs to that same folder's `logs/` subfolder.
- Substitute `-h=`/`-U=`/`-p=` (or pass a full connection string via `-c=`) for the target
  environment. Add `-s=SCHEMA` to export a schema other than `public`.

See [`README.md`](./README.md) for the full argument reference for both scripts.

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

### Known Limitations

- Neither script prunes old backups -- storage and retention cleanup is a manual, separate
  responsibility for now.
- Neither script is wired into a scheduler yet. Until cron/CI automation exists, running them is a
  manual step on the cadence described above. (Future enhancement: automate the daily recurring
  backup.)

### Reference

- [`README.md`](./README.md) -- full command/argument documentation for every script in this
  folder.
- [`bash_standards.md`](./bash_standards.md) -- the coding standards these scripts follow.
- [`runbook.md`](./runbook.md) -- what to do when a step in this procedure fails.
