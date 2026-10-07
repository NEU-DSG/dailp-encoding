//! Individual image/audio attachments that couldn't be included in a backup bundle, and
//! the machine-readable sidecar report the backup workflow reads to build its
//! "Attachments backup: failure" summary table.
//!
//! Every failure recorded here is *also* logged as its own `warn!` where it happens, and
//! summarized once more at the end of the run (see `mets::generate_mets_bundle`). This
//! module exists because neither of those is parseable: the workflow needs the parent
//! document and the failing attachment as separate fields, not as prose inside a log line.
//!
//! The report is written next to the exporter's logfile rather than inside the run
//! directory, so it never becomes part of the bundle the workflow zips and uploads --
//! it describes the bundle, it isn't content.

use std::path::{Path, PathBuf};

use anyhow::{Context, Result};
use serde::Serialize;

/// Which kind of attachment failed. Serialized (and rendered into the summary table's
/// "type" column) as the bare lowercase words the workflow expects, rather than as Rust
/// variant names.
#[derive(Serialize, Clone, Copy, PartialEq, Eq, Debug)]
#[serde(rename_all = "lowercase")]
pub(crate) enum AttachmentKind {
    Image,
    Audio,
}

/// One attachment that a run failed to download, after every retry, and therefore left
/// out of the bundle.
///
/// A failure here is never fatal on its own: the referencing document is still exported,
/// with this attachment omitted from all three of its fileGrps (see `audio_backup`'s
/// module doc comment for why a failed download collapses the "original" and "cloud
/// backup" entries too, not just "archival").
#[derive(Serialize, Clone, Debug)]
pub(crate) struct AttachmentFailure {
    /// The attachment itself: the filename it would have been saved as for an image,
    /// or the word/document it belongs to for audio.
    pub(crate) title: String,
    pub(crate) kind: AttachmentKind,
    /// Title of the XML file that references this attachment -- i.e. the document whose
    /// METS/TEI pair would have pointed at it.
    pub(crate) parent: String,
    /// The full error chain (`{e:#}`), matching what the `warn!` for this same failure
    /// puts in the logfile.
    pub(crate) message: String,
}

impl AttachmentFailure {
    /// Renders this failure the way the end-of-run `warn!` summary lists it -- one line,
    /// parent first, so a reader scanning the log sees which document is affected before
    /// the error text.
    pub(crate) fn summary_line(&self) -> String {
        format!("{} \"{}\": {}", self.parent, self.title, self.message)
    }
}

/// Name of the sidecar report for a run, tied to the same timestamp as the run directory
/// it describes. `logs/` spans runs (it sits alongside the `dailp-<timestamp>`
/// directories, not inside any one of them -- see `mets::logs_dir`), so an unversioned
/// name here would have each run silently overwrite the last one's report.
fn report_filename(file_timestamp: &str) -> String {
    format!("attachment-failures_{file_timestamp}.json")
}

/// Writes `failures` to `logs_dir` as JSON and returns the path written.
///
/// Written unconditionally, including as an empty array: the workflow step that reads
/// this runs on both success and failure, and "the file is missing" and "the file says
/// nothing failed" are worth telling apart -- the first means the export died before it
/// got here.
pub(crate) fn write_report(
    failures: &[AttachmentFailure],
    logs_dir: &Path,
    file_timestamp: &str,
) -> Result<PathBuf> {
    std::fs::create_dir_all(logs_dir)
        .with_context(|| format!("Failed to create log directory {}", logs_dir.display()))?;

    let path = logs_dir.join(report_filename(file_timestamp));
    let json = serde_json::to_string_pretty(failures)
        .context("Failed to serialize the attachment failure report")?;
    std::fs::write(&path, json).with_context(|| format!("Failed to write {}", path.display()))?;

    Ok(path)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn failure(title: &str, kind: AttachmentKind, parent: &str) -> AttachmentFailure {
        AttachmentFailure {
            title: title.to_owned(),
            kind,
            parent: parent.to_owned(),
            message: "connection closed before message completed".to_owned(),
        }
    }

    #[test]
    fn report_is_named_for_its_run() {
        assert_eq!(
            report_filename("20260909T120000"),
            "attachment-failures_20260909T120000.json"
        );
    }

    #[test]
    fn writes_an_empty_array_when_nothing_failed() {
        let dir = std::env::temp_dir().join(format!(
            "dailp-attachment-failures-empty-{}",
            std::process::id()
        ));
        let path = write_report(&[], &dir, "20260909T120000").unwrap();

        assert_eq!(std::fs::read_to_string(&path).unwrap().trim(), "[]");

        std::fs::remove_dir_all(&dir).ok();
    }

    #[test]
    fn serializes_kind_as_the_bare_lowercase_word() {
        let dir = std::env::temp_dir().join(format!(
            "dailp-attachment-failures-kind-{}",
            std::process::id()
        ));
        let failures = vec![
            failure("millie_page1_15532353.jpg", AttachmentKind::Image, "Millie"),
            failure("word 42", AttachmentKind::Audio, "Millie"),
        ];
        let path = write_report(&failures, &dir, "20260909T120000").unwrap();
        let written = std::fs::read_to_string(&path).unwrap();

        assert!(written.contains("\"kind\": \"image\""));
        assert!(written.contains("\"kind\": \"audio\""));
        assert!(written.contains("\"parent\": \"Millie\""));

        std::fs::remove_dir_all(&dir).ok();
    }

    #[test]
    fn summary_line_leads_with_the_parent_document() {
        assert_eq!(
            failure("word 42", AttachmentKind::Audio, "Millie").summary_line(),
            "Millie \"word 42\": connection closed before message completed"
        );
    }
}
