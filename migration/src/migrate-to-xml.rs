//! Generates METS XML backup manifests for DAILP's edited collections and their member
//! documents. See the `mets` module for the actual template rendering and file writing,
//! and the `tei` module for each document's companion TEI file.

mod audio_backup;
mod backup_paths;
mod checksum;
mod editorial;
mod images;
mod mets;
mod tei;

use std::fs::File;
use std::io::Write;
use std::path::{Path, PathBuf};
use std::sync::Mutex;

use anyhow::{Context, Result};
use clap::Parser;
use dailp::Database;
use log::{LevelFilter, Log, Metadata, Record};

/// Generates a METS/TEI backup bundle for DAILP's edited collections.
///
/// Flag names and defaults follow the backup scripts in `scripts/src/`.
#[derive(Parser)]
struct Args {
    /// Folder to write the `dailp-<timestamp>` bundle to
    /// (default: ./backups/xml/dailp/).
    #[arg(short = 'o', long = "outdir", value_name = "OUTDIR")]
    outdir: Option<PathBuf>,

    /// Folder to save logs to (default: <OUTDIR>/logs/).
    #[arg(short = 'l', long = "log-location", value_name = "LOG_LOCATION")]
    log_location: Option<PathBuf>,
}

#[tokio::main]
async fn main() -> Result<()> {
    dotenv::dotenv().ok();
    let args = Args::parse();

    // Both paths are resolved up front, before any work: `init_logging` is the first thing
    // that touches the disk, and a bad `-o=`/`-l=` should fail here rather than after a
    // full export has already run.
    let output_root = backup_paths::backup_root(args.outdir)?;
    let log_dir = mets::logs_dir(args.log_location, &output_root);

    let log_path = init_logging(&log_dir)?;
    println!("Logging to {}", log_path.display());

    let db = Database::connect(Some(1))?;

    log::info!("Generating METS backup files...");
    let mut collections = db
        .all_edited_collections()
        .await
        .context("Failed to load edited collections")?;
    // `edited_collections.sql` has no ORDER BY, so sort here to keep manifest ordering
    // (and the "home collection" tie-break for documents shared by more than one
    // collection -- see `mets::generate_mets_bundle`) stable from run to run.
    collections.sort_by(|a, b| a.slug.cmp(&b.slug));
    mets::generate_mets_bundle(&db, &collections, &output_root).await?;

    Ok(())
}

/// Fans every log record out to both a `pretty_env_logger`-formatted console logger and a
/// plain-text logfile.
///
/// This wraps a `pretty_env_logger` console logger (for
/// colored, timed output) together with a small file writer,
/// using the `log`/`pretty_env_logger` dependencies already in this crate.
struct FanOutLogger {
    console: pretty_env_logger::env_logger::Logger,
    file: Mutex<File>,
    level: LevelFilter,
}

impl Log for FanOutLogger {
    fn enabled(&self, metadata: &Metadata) -> bool {
        metadata.level() <= self.level
    }

    fn log(&self, record: &Record) {
        self.console.log(record);

        if self.enabled(record.metadata()) {
            let line = format!(
                "{} {:>5} {}: {}\n",
                dailp::chrono::Local::now().format("%Y-%m-%d %H:%M:%S%.3f"),
                record.level(),
                record.target(),
                record.args()
            );
            if let Ok(mut file) = self.file.lock() {
                let _ = file.write_all(line.as_bytes());
            }
        }
    }

    fn flush(&self) {
        self.console.flush();
        if let Ok(mut file) = self.file.lock() {
            let _ = file.flush();
        }
    }
}

/// Sets up logging to both the terminal and a timestamped file under `logs_dir`, honoring
/// `RUST_LOG` the same way `pretty_env_logger::init()` would. Returns the path of the
/// logfile that was created.
fn init_logging(logs_dir: &Path) -> Result<PathBuf> {
    let mut builder = pretty_env_logger::formatted_timed_builder();
    match std::env::var("RUST_LOG") {
        Ok(filters) => {
            builder.parse_filters(&filters);
        }
        Err(_) => {
            builder.filter_level(LevelFilter::Info);
        }
    }
    let console = builder.build();
    let level = console.filter();

    std::fs::create_dir_all(logs_dir)
        .with_context(|| format!("Failed to create log directory {}", logs_dir.display()))?;

    let log_path = logs_dir.join(format!(
        "migrate-to-xml_{}.log",
        dailp::chrono::Utc::now().format("%Y%m%dT%H%M%S")
    ));
    let file = File::create(&log_path)
        .with_context(|| format!("Failed to create log file {}", log_path.display()))?;

    log::set_boxed_logger(Box::new(FanOutLogger {
        console,
        file: Mutex::new(file),
        level,
    }))
    .map_err(|e| anyhow::anyhow!("Failed to initialize logger: {e}"))?;
    log::set_max_level(level);

    Ok(log_path)
}
