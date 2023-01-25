pub use slug::slugify;

/// Turns a string into an ltree-friendly slug with underscores.
pub fn slugify_ltree(s: impl AsRef<str>) -> String {
    slug::slugify(s).replace("-", "_")
}
