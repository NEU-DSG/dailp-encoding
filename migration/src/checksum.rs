//! Fixity checksums attached to every file this pipeline writes/downloads, so the METS
//! files describing DAILP's backup bundle can carry a `CHECKSUM`/`CHECKSUMTYPE` on every
//! `<mets:file>`/`<mets:mdRef>` that references one -- see `mets.rs`, `audio_backup.rs`,
//! `images.rs`, and `editorial.rs`, all of which already hold each file's bytes/content in
//! memory right before writing it to disk, and hash it there.

/// Hex-encoded SHA-256 digest of `bytes`, for a `CHECKSUM` attribute paired with the
/// literal `CHECKSUMTYPE="SHA-256"` -- the single checksum algorithm used across the whole
/// bundle, hardcoded directly in the Tera templates (`mets_macros.tera.xml`'s
/// `file_entry`/`md_ref` macros) rather than threaded through as a value, since it never
/// varies. Matches one of METS's suggested `CHECKSUMTYPE` attribute values
/// (https://github.com/mets/METS-schema/wiki/METS2-Suggested-Attribute-Values#checksumtype-file-mdref-mdwrap).
pub(crate) fn sha256_hex(bytes: &[u8]) -> String {
    use sha2::{Digest, Sha256};
    hex::encode(Sha256::digest(bytes))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn sha256_hex_matches_known_test_vector() {
        // NIST's canonical empty-input SHA-256 test vector.
        assert_eq!(
            sha256_hex(b""),
            "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
        );
    }

    #[test]
    fn sha256_hex_of_abc() {
        // NIST's canonical "abc" SHA-256 test vector.
        assert_eq!(
            sha256_hex(b"abc"),
            "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
        );
    }
}
