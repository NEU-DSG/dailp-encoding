//! Resolves the directories that the XML backup tools (`migrate-to-xml` and
//! `import-from-xml`) read and write.
//!
//! Every path here is resolved at **run** time, from the directory the tool was invoked
//! from. That is deliberate and load-bearing: an earlier version derived the backup root
//! from `env!("CARGO_MANIFEST_DIR")`, which `rustc` expands while compiling. Under a nix
//! build the source tree is unpacked into the build sandbox, so that baked the sandbox
//! path (`/build/source/backups/xml/dailp`) into the shipped binary and every run failed
//! with a permission error on a directory that only ever existed at build time.
//!
//! The flags and defaults mirror the shell tools in `scripts/src/` -- `-o=OUTDIR` /
//! `-l=LOG_LOCATION`, defaulting under `$(pwd)/backups/` -- so the whole backup toolchain
//! behaves the same way regardless of which piece you're invoking.
//!
//! Declared as a `mod` in both bin files, the same way `checksum` is. Only what *both*
//! bins use belongs here: the `-l=` default lives in `crate::mets::logs_dir`, since
//! `import-from-xml` writes no logfiles and would see it as dead code.

use std::path::{Path, PathBuf};

use anyhow::{Context, Result};

/// Where the backup tree lives relative to the invocation directory, matching the
/// `$(pwd)/backups/<tool>/` convention of `scripts/src/pg_dump_backup.sh` and friends.
pub const DEFAULT_BACKUP_SUBDIR: &str = "backups/xml/dailp";

/// Resolves the backup root: `outdir` verbatim when given, otherwise the default
/// subdirectory under `cwd`. Pure, so callers can test the precedence without touching
/// process-global state; see [`backup_root`] for the version that reads the real cwd.
pub fn resolve_backup_root(outdir: Option<PathBuf>, cwd: &Path) -> PathBuf {
    outdir.unwrap_or_else(|| cwd.join(DEFAULT_BACKUP_SUBDIR))
}

/// [`resolve_backup_root`] against the current working directory.
pub fn backup_root(outdir: Option<PathBuf>) -> Result<PathBuf> {
    let cwd = std::env::current_dir().context(
        "Failed to determine the current directory, needed to locate the default backup \
         directory. Pass an absolute path instead.",
    )?;
    Ok(resolve_backup_root(outdir, &cwd))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn backup_root_defaults_under_the_invocation_directory() {
        assert_eq!(
            resolve_backup_root(None, Path::new("/home/dev/dailp-encoding")),
            PathBuf::from("/home/dev/dailp-encoding/backups/xml/dailp")
        );
    }

    #[test]
    fn explicit_outdir_is_used_verbatim() {
        // Notably *not* joined with DEFAULT_BACKUP_SUBDIR -- `-o=` names the backup root
        // itself, matching `-o=OUTDIR` in `scripts/src/export_db_to_csv.sh`.
        assert_eq!(
            resolve_backup_root(
                Some(PathBuf::from("/mnt/backups")),
                Path::new("/home/dev/dailp-encoding")
            ),
            PathBuf::from("/mnt/backups")
        );
    }

    #[test]
    fn the_nix_sandbox_path_is_not_baked_in() {
        // The regression this module exists for: the root follows the invocation
        // directory, so a binary built in nix's `/build/source` sandbox writes to
        // wherever it is actually run, not to the (nonexistent, unwritable) build dir.
        assert_eq!(
            resolve_backup_root(None, Path::new("/github/workspace")),
            PathBuf::from("/github/workspace/backups/xml/dailp")
        );
    }
}
