use dailp::{Translation, TranslationBlock};
use itertools::Itertools;

/// Represents a parsed, validated Translation Doc
#[derive(Debug, Clone)]
pub struct TranslationDoc {
    pub doc_id: String,
    pub translation: Translation,
}

/// Represents the operations performed on the TranslationDoc from a doc result
impl TranslationDoc {
    /// Parses the raw doc result into a validated `TranslationDoc`
    pub fn from_doc_result(
        doc_id: impl Into<String>,
        doc: crate::translations::DocResult,
    ) -> Result<Self, anyhow::Error> {
        let doc_id = doc_id.into();
        let translation = doc
            .into_translation()
            .map_err(|e| anyhow::anyhow!("Translation doc '{}': {}", doc_id, e))?;
        Ok(TranslationDoc { doc_id, translation })
    }
}

/// Parses the raw document body into a validated `Translation`
pub fn parse_body(body: &str) -> Result<Translation, anyhow::Error> {
    if body.trim().is_empty() {
        return Err(anyhow::anyhow!(
            "Cannot create translation from empty document body"
        ));
    }

    let ends_with_footnote = regex::Regex::new(r"\[\d+\]")
        .map_err(|e| anyhow::anyhow!("Failed to compile footnote regex: {}", e))?;

    let text_runs = body
        .lines() // Split the translation text by lines
        .map(|s| s.trim()) 
        .group_by(|s| s.is_empty()); // Group consecutive non-empty lines together

    let blocks = text_runs
        .into_iter()
        .filter_map(|(empty, lines)| {
            if !empty {
                let collected_lines: Vec<&str> = lines.collect();
                if !collected_lines.is_empty() {
                    Some(collected_lines)
                } else {
                    None
                }
            } else {
                None
            }
        })
        .take_while(|text| match text.first() { // Ignore text past the first horizontal line
            Some(first_line) => !first_line.starts_with("________"),
            None => false,
        })
        .map(|text| { // Split sentences into separate segments
            text.into_iter()
                // Remove footnotes
                .map(|text| ends_with_footnote.replace_all(text, "").into_owned())
        })
        .enumerate() // Include the block index
        .map(|(index, content)| {
            let segments: Vec<String> = content
                .into_iter()
                .filter(|s| !s.trim().is_empty())
                .collect();

            TranslationBlock {
                index: index as i32 + 1,
                segments,
            }
        });

    let paragraphs: Vec<TranslationBlock> = blocks.collect();

    if paragraphs.is_empty() {
        return Err(anyhow::anyhow!(
            "No translation content found in document. Document may be empty or contain only horizontal lines."
        ));
    }

    let total_segments: usize = paragraphs.iter().map(|p| p.segments.len()).sum();
    if total_segments == 0 {
        return Err(anyhow::anyhow!(
            "Translation contains no text segments after processing"
        ));
    }

    Ok(Translation { paragraphs })
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Mock translation parsed with no issues
    #[test]
    fn parses_multiple_paragraph_blocks_separated_by_blank_lines() {
        let body = "First paragraph.\n\nSecond paragraph.\n\nThird paragraph.";
        let translation = parse_body(body).expect("should parse");
        assert_eq!(translation.paragraphs.len(), 3);
        assert_eq!(translation.paragraphs[0].index, 1);
        assert_eq!(translation.paragraphs[0].segments, vec!["First paragraph."]);
        assert_eq!(translation.paragraphs[2].segments, vec!["Third paragraph."]);
    }

    /// Mock translation parsed groups consecutive lines into one block
    #[test]
    fn consecutive_non_blank_lines_form_one_block() {
        let body = "Title line one\nTitle line two\n\nBody paragraph.";
        let translation = parse_body(body).expect("should parse");
        assert_eq!(translation.paragraphs.len(), 2);
        assert_eq!(
            translation.paragraphs[0].segments,
            vec!["Title line one", "Title line two"]
        );
    }

    /// Mock translation parsed removes footnote markers
    #[test]
    fn strips_footnote_markers() {
        let body = "Some text[3] with a footnote.";
        let translation = parse_body(body).expect("should parse");
        assert_eq!(translation.paragraphs[0].segments, vec!["Some text with a footnote."]);
    }

    /// Mock translation parsed skips text after a horizontal rule
    #[test]
    fn stops_at_a_horizontal_rule() {
        let body = "Kept paragraph.\n\n________\n\nDropped paragraph.";
        let translation = parse_body(body).expect("should parse");
        assert_eq!(translation.paragraphs.len(), 1);
        assert_eq!(translation.paragraphs[0].segments, vec!["Kept paragraph."]);
    }

    /// Mock translation parsed fails on empty body
    #[test]
    fn parsing_an_empty_body_fails() {
        assert!(parse_body("").is_err());
        assert!(parse_body("   \n   ").is_err());
    }

    /// Mock translation parsed fails on body with only a horizontal rule
    #[test]
    fn parsing_a_body_of_only_a_horizontal_rule_fails() {
        assert!(parse_body("________").is_err());
    }

    /// Mock translation parsed fails on block with only footnote markers
    #[test]
    fn parsing_a_block_of_only_footnote_markers_fails() {
        assert!(parse_body("[5]").is_err());
    }
}