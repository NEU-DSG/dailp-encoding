//! Restores a `migrate-to-xml`-produced backup bundle back into a database -- the
//! inverse of the `migrate-to-xml` binary. See `migration/import-from-xml.md` for the
//! full design, processing order, and known limitations.

mod backup_paths;
mod checksum;
mod editorial_import;
mod mets_import;
mod tei_import;
mod xml_util;

use std::path::PathBuf;

use anyhow::Result;
use clap::Parser;
use dailp::Database;
use mets_import::{find_latest_bundle, import_bundle, ImportOptions};

/// Restores a DAILP XML backup bundle (as produced by `migrate-to-xml`) into a database.
#[derive(Parser)]
struct Args {
    /// Path to a `dailp-<timestamp>` run directory. Defaults to the most recently
    /// generated run under ./backups/xml/dailp/.
    bundle: Option<PathBuf>,

    /// Parse and checksum-verify the bundle only; never connects to a database.
    #[arg(long)]
    verify_only: bool,

    /// Connect (read-only) and report what would be imported; issues no writes.
    #[arg(long)]
    dry_run: bool,

    /// Without this flag, the run aborts before any writes if a collection slug or
    /// synthesized document short_name already exists in the target database. With it,
    /// existing rows are overwritten.
    #[arg(long)]
    truncate: bool,

    /// Abort on the first document/collection/editorial-page import failure, instead of
    /// logging it, recording it, and continuing with the rest of the bundle. Structural/
    /// checksum/collision problems found before any writes always abort immediately
    /// regardless of this flag.
    #[arg(long)]
    fail_fast: bool,

    /// Restrict the import to these collection slugs (comma-separated). Defaults to
    /// every collection in the bundle's manifest.
    #[arg(long, value_delimiter = ',')]
    collections: Option<Vec<String>>,
}

#[tokio::main]
async fn main() -> Result<()> {
    dotenv::dotenv().ok();
    pretty_env_logger::init();

    let args = Args::parse();

    let bundle = match args.bundle {
        Some(path) => path,
        // Resolved against the current directory, matching where `migrate-to-xml` writes
        // by default -- see `backup_paths` for why this can't be a compile-time path.
        None => find_latest_bundle(&backup_paths::backup_root(None)?)?,
    };

    let opts = ImportOptions {
        verify_only: args.verify_only,
        dry_run: args.dry_run,
        truncate: args.truncate,
        fail_fast: args.fail_fast,
        collections_filter: args.collections,
    };

    let db = if opts.verify_only {
        None
    } else {
        Some(Database::connect(Some(1))?)
    };

    let summary = import_bundle(&bundle, &opts, db.as_ref()).await?;

    log::info!(
        "Import summary: {} document(s), {} collection(s), {} editorial page(s) imported",
        summary.documents_imported,
        summary.collections_imported,
        summary.editorial_pages_imported
    );

    // `import_bundle` returns `Ok` for a best-effort run that completed with some
    // failures recorded (see `ImportOptions::fail_fast`) rather than aborting -- the
    // process's exit status still needs to reflect that, so callers/CI can tell.
    if summary.has_failures() {
        log::error!(
            "{} document(s), {} collection(s), {} editorial page(s) FAILED to import (see \
             warnings above for detail)",
            summary.failed_documents.len(),
            summary.failed_collections.len(),
            summary.failed_editorial_pages.len()
        );
        anyhow::bail!(
            "Import completed with {} failure(s)",
            summary.failed_documents.len()
                + summary.failed_collections.len()
                + summary.failed_editorial_pages.len()
        );
    }

    Ok(())
}
