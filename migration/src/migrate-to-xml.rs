//! Generates METS XML backup manifests for DAILP's edited collections and their member
//! documents. See the `mets` module for the actual template rendering and file writing,
//! and the `tei` module for each document's companion TEI file.

mod audio_backup;
mod checksum;
mod editorial;
mod images;
mod mets;
mod tei;

use std::fs::File;
use std::io::Write;
use std::path::PathBuf;
use std::sync::Mutex;

use anyhow::{Context, Result};
use dailp::Database;
use log::{LevelFilter, Log, Metadata, Record};

/// Generates METS backup files for DAILP's edited collections.
#[tokio::main]
async fn main() -> Result<()> {
    dotenv::dotenv().ok();
    let log_path = init_logging()?;
    println!("Logging to {}", log_path.display());

    let db = Database::connect(Some(1))?;

    // TODO
    // Goal: Expand mets generation to export all collections
    // Deferred because: testing convenience
    log::info!("Generating METS backup files...");
    mets::generate_mets_for_collection(&db, "willie_jumper_stories").await?;

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

/// Sets up logging to both the terminal and a timestamped file under
/// `backups/xml/dailp/logs/`, honoring `RUST_LOG` the same way `pretty_env_logger::init()`
/// would. Returns the path of the logfile that was created.
fn init_logging() -> Result<PathBuf> {
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

    let logs_dir = mets::logs_dir();
    std::fs::create_dir_all(&logs_dir)
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
