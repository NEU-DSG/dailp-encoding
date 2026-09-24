//! Reconstructs a document's page/paragraph/word content
//! (`Vec<dailp::TranslatedPage>`) from its `.tei.xml` file -- the inverse of
//! `crate::tei::render_document_tei`. Rendered by `migration/translation.tera.xml`;
//! see that template and `migration/tei_macros.tera.xml` for the exact element/attribute
//! shapes this module parses.
//!
//! Not everything a document originally had round-trips through this file -- see
//! `migration/import-from-xml.md` for the full list. In short: morpheme segments come
//! back as concrete, resolved `WordSegment`s (never the original abstract tag
//! structure); contributor roles are lost (only names are ever rendered); and the real
//! external audio `resource_url` for a document or word isn't recoverable from the TEI
//! file at all -- it only ever stores the local archival path, so
//! [`ParsedTeiDocument::document_audio_archival_locref`]/[`ParsedTeiDocument::word_audio_archival_locrefs`]
//! exist for cross-referencing against the sibling METS file's `original`-fileGrp
//! entries (see `crate::mets_import`), not for building an `AudioSlice` directly.

use std::collections::HashMap;

use anyhow::{Context, Result};
use dailp::{
    AnnotatedForm, AnnotatedSeg, DocumentId, LineBreak, PositionInDocument, TranslatedPage,
    TranslatedSection, WordSegment,
};
use log::warn;
use roxmltree::{Document, Node};

use crate::xml_util::{children_named, descendant, descendants_named, text_content, XML_NAMESPACE};

/// Everything this module can recover from one document's TEI file. See the module doc
/// comment for what's known-lossy.
pub struct ParsedTeiDocument {
    pub title: String,
    /// The collection name rendered into `sourceDesc/p` -- informational only; a
    /// document's real collection membership is read from its METS file instead (see
    /// `crate::mets_import`), since a document's TEI file only ever names its single
    /// "home" collection (`crate::tei::render_document_tei`'s `collection` parameter).
    pub collection: String,
    pub contributor_names: Vec<String>,
    pub pages: Vec<TranslatedPage>,
    /// This document's own archived overall audio path, if it has one, from
    /// `teiHeader/fileDesc/sourceDesc/recordingStmt/recording/media/@url`. This is a
    /// path relative to `documents/`, not a real external URL -- see the module doc
    /// comment.
    pub document_audio_archival_locref: Option<String>,
    /// Word id (`"w{index}"`) -> archived audio path, for every word with a `<ptr
    /// type="audio">`. Same caveat as above.
    pub word_audio_archival_locrefs: HashMap<String, String>,
}

/// Parses `xml` (one document's `.tei.xml` file contents) into a [`ParsedTeiDocument`].
/// `document_id` is threaded into every reconstructed word's
/// [`dailp::PositionInDocument`] -- it isn't recoverable from the TEI file itself, since
/// this document's real database id was never rendered into it (every id in the bundle
/// derives from the document's *title*, not its own database identity).
pub fn parse_tei_document(xml: &str, document_id: DocumentId) -> Result<ParsedTeiDocument> {
    let doc = Document::parse(xml).context("Failed to parse TEI XML")?;
    let root = doc.root_element();

    let title = descendant(root, "title")
        .map(text_content)
        .unwrap_or_default();
    let collection = descendant(root, "sourceDesc")
        .and_then(|d| descendant(d, "p"))
        .map(text_content)
        .unwrap_or_default();
    let document_audio_archival_locref = descendant(root, "recordingStmt")
        .and_then(|d| descendant(d, "media"))
        .and_then(|m| m.attribute("url"))
        .map(str::to_owned);
    let contributor_names = descendants_named(root, "person")
        .filter_map(|p| descendant(p, "persName"))
        .map(text_content)
        .collect();

    // Indexed by target word id up front, so building the word tree below doesn't need
    // a second pass over `standOff`.
    let mut commentary_by_word_id: HashMap<String, String> = HashMap::new();
    if let Some(note_block) = descendant(root, "noteBlock") {
        for note in children_named(note_block, "note") {
            if let Some(target) = note.attribute("target").and_then(|t| t.strip_prefix('#')) {
                commentary_by_word_id.insert(target.to_owned(), text_content(note));
            }
        }
    }

    let source_text = descendants_named(root, "text")
        .find(|n| n.attribute("type") == Some("source"))
        .context("TEI file has no <text type=\"source\">")?;
    let translation_by_paragraph_id: HashMap<String, Option<String>> =
        descendants_named(root, "text")
            .find(|n| n.attribute("type") == Some("translation"))
            .into_iter()
            .flat_map(|t| descendants_named(t, "ab"))
            .filter_map(|ab| {
                let id = ab.attribute((XML_NAMESPACE, "id"))?;
                let paragraph_id = id.strip_suffix("_trans")?.to_owned();
                // A `<seg>` child means a real translation; a `<gap>` (or, in principle,
                // neither) means "known to have no translation yet" -- either way there
                // was a `<ab>` for this paragraph, so `has_source_words` was true when
                // this was exported. Either case maps to `None` here; the distinction
                // only mattered for deciding whether to render this `<ab>` at all, not
                // for what a `TranslatedSection.translation` should hold.
                Some((paragraph_id, descendant(ab, "seg").map(text_content)))
            })
            .collect();

    let mut word_audio_archival_locrefs = HashMap::new();
    let source_body = descendant(source_text, "body").context("TEI source text has no <body>")?;

    let mut pages: Vec<TranslatedPage> = Vec::new();
    let mut current_paragraphs: Vec<TranslatedSection> = Vec::new();
    let mut current_page_number = String::new();
    let mut started = false;

    for child in source_body.children().filter(Node::is_element) {
        match child.tag_name().name() {
            "pb" => {
                if started {
                    pages.push(TranslatedPage {
                        paragraphs: std::mem::take(&mut current_paragraphs),
                    });
                }
                started = true;
                current_page_number = child.attribute("n").unwrap_or_default().to_owned();
            }
            "ab" => {
                let id = child
                    .attribute((XML_NAMESPACE, "id"))
                    .context("<ab> missing xml:id")?
                    .to_owned();
                let source = parse_source_ab(
                    child,
                    document_id,
                    &current_page_number,
                    &commentary_by_word_id,
                    &mut word_audio_archival_locrefs,
                )?;
                let translation = translation_by_paragraph_id.get(&id).cloned().flatten();
                current_paragraphs.push(TranslatedSection {
                    translation,
                    source,
                });
            }
            _ => {}
        }
    }
    if started {
        pages.push(TranslatedPage {
            paragraphs: current_paragraphs,
        });
    }

    Ok(ParsedTeiDocument {
        title,
        collection,
        contributor_names,
        pages,
        document_audio_archival_locref,
        word_audio_archival_locrefs,
    })
}

/// Parses one paragraph's source `<ab>` into its flat sequence of line-breaks/words --
/// the inverse of `tei_macros.tera.xml`'s `any_segment` macro.
fn parse_source_ab(
    ab: Node,
    document_id: DocumentId,
    page_number: &str,
    commentary_by_word_id: &HashMap<String, String>,
    word_audio_archival_locrefs: &mut HashMap<String, String>,
) -> Result<Vec<AnnotatedSeg>> {
    ab.children()
        .filter(Node::is_element)
        .map(|child| match child.tag_name().name() {
            "lb" => {
                let index = child
                    .attribute("n")
                    .and_then(|n| n.parse().ok())
                    .unwrap_or(0);
                Ok(AnnotatedSeg::LineBreak(LineBreak { index }))
            }
            "w" => Ok(AnnotatedSeg::Word(parse_word(
                child,
                document_id,
                page_number,
                commentary_by_word_id,
                word_audio_archival_locrefs,
            )?)),
            other => anyhow::bail!("Unexpected element <{other}> inside <ab>"),
        })
        .collect()
}

/// Parses one `<w>` element -- the inverse of `tei_macros.tera.xml`'s `word` macro.
fn parse_word(
    w: Node,
    document_id: DocumentId,
    page_number: &str,
    commentary_by_word_id: &HashMap<String, String>,
    word_audio_archival_locrefs: &mut HashMap<String, String>,
) -> Result<AnnotatedForm> {
    let id = w
        .attribute((XML_NAMESPACE, "id"))
        .context("<w> missing xml:id")?
        .to_owned();
    let index: i64 = id
        .strip_prefix('w')
        .and_then(|s| s.parse().ok())
        .with_context(|| format!("Unrecognized word xml:id {id:?} (expected \"w<index>\")"))?;

    if let Some(target) = children_named(w, "ptr")
        .find(|p| p.attribute("type") == Some("audio"))
        .and_then(|p| p.attribute("target"))
    {
        word_audio_archival_locrefs.insert(id.clone(), target.to_owned());
    }

    let (
        source,
        normalized_source,
        simple_phonetics,
        phonemic,
        morphemic_segmentation,
        morphemic_gloss,
        english_gloss,
    ) = if let Some(choice) = children_named(w, "choice").next() {
        let seg_text = |ty: &str| {
            children_named(choice, "seg")
                .find(|s| s.attribute("type") == Some(ty))
                .map(text_content)
        };
        (
            descendant(choice, "orig")
                .map(text_content)
                .unwrap_or_default(),
            seg_text("normalized_source"),
            seg_text("simple_phonetics"),
            seg_text("phonemic_form"),
            seg_text("morphemic_segmentation"),
            seg_text("morphemic_gloss"),
            seg_text("gloss")
                .map(|g| g.split(", ").map(str::to_owned).collect())
                .unwrap_or_default(),
        )
    } else {
        // Bare source text -- see `tei_macros.tera.xml`'s `word` macro: everything else
        // (`normalized_source` included) is only ever rendered inside a `<choice>`
        // block, so a bare `<w>` genuinely carries nothing but its source text (and,
        // possibly, a preceding `<ptr>`, already handled above).
        (text_content(w), None, None, None, None, None, Vec::new())
    };

    // See `migration/import-from-xml.md` -- `types/src/gloss.rs`'s reverse-parser
    // doesn't recognize `:` (the `Modifier`-role separator the export side actually
    // emits), so a `Modifier` segment won't round-trip correctly today. Reused as-is
    // rather than patched locally; a parse failure here just means no segments, not a
    // hard error, mirroring how the export side already tolerates unresolved segments.
    let segments = match (&morphemic_segmentation, &morphemic_gloss) {
        (Some(seg), Some(gloss)) => WordSegment::parse_many(seg, gloss).or_else(|| {
            warn!(
                "Failed to parse morpheme segmentation for word {id:?} (\"{seg}\" / \"{gloss}\")"
            );
            None
        }),
        _ => None,
    };

    Ok(AnnotatedForm {
        id: None,
        source,
        normalized_source,
        simple_phonetics,
        phonemic,
        segments,
        english_gloss,
        commentary: commentary_by_word_id.get(&id).cloned(),
        line_break: None,
        page_break: None,
        position: PositionInDocument::new(document_id, page_number.to_owned(), index),
        date_recorded: None,
        // Filled in by the caller (`crate::mets_import`), which cross-references this
        // word's real external `resource_url` from the sibling METS file -- see the
        // module doc comment.
        ingested_audio_track: None,
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use dailp::Uuid;

    /// A minimal but representative TEI file, hand-written to match every element/
    /// attribute shape `migration/translation.tera.xml`/`migration/tei_macros.tera.xml`
    /// actually render -- see those templates and `migration/src/tei.rs`'s own
    /// `sample_context()` test fixture, which this mirrors.
    const SAMPLE_TEI: &str = r##"<?xml version="1.0" encoding="UTF-8"?>
<TEI xmlns="http://www.tei-c.org/ns/1.0" xmlns:d="https://dsg.northeastern.edu/dailp/ns/1.0">
  <teiHeader>
    <fileDesc>
      <titleStmt><title>Story of Millie Pigeon</title></titleStmt>
      <sourceDesc>
        <p>Willie Jumper Stories</p>
        <recordingStmt>
          <recording type="audio">
            <media url="../audio/Story-of-Millie-Pigeon/Story-of-Millie-Pigeon_audio.mp3"/>
          </recording>
        </recordingStmt>
      </sourceDesc>
    </fileDesc>
    <profileDesc>
      <particDesc>
        <person xml:id="jane-doe"><persName>Jane Doe</persName></person>
      </particDesc>
    </profileDesc>
  </teiHeader>
  <text>
    <group>
      <text type="source" xml:lang="chr">
        <body>
          <pb n="1"/>
          <ab xml:id="pg1_para1" corresp="#pg1_para1_trans">
            <w xml:id="w1">
              <ptr type="audio" target="../audio/Story-of-Millie-Pigeon/1_o-sdi_w1.mp3"/>
              <choice>
                <orig>osdi</orig>
                <seg type="simple_phonetics">o:sdi</seg>
                <seg type="morphemic_segmentation">o-sdi</seg>
                <seg type="morphemic_gloss">3SG-go</seg>
                <seg type="gloss">she went</seg>
              </choice>
            </w>
            <lb n="1"/>
            <w xml:id="w2">gvhnage</w>
          </ab>
          <ab xml:id="pg1_para2">
            <w xml:id="w3">osdi</w>
          </ab>
        </body>
      </text>
      <text type="translation" xml:lang="en">
        <body>
          <ab xml:id="pg1_para1_trans"><seg>She went to the store.</seg></ab>
          <ab xml:id="pg1_para2_trans"><gap reason="untranslated"/></ab>
        </body>
      </text>
    </group>
  </text>
  <standOff>
    <linkGrp type="navigation">
      <ptr type="mets" target="./Story-of-Millie-Pigeon.mets.xml"/>
    </linkGrp>
    <d:noteBlock>
      <note target="#w1">uncertain gloss</note>
    </d:noteBlock>
  </standOff>
</TEI>
"##;

    fn doc_id() -> DocumentId {
        DocumentId(Uuid::from_u128(42))
    }

    #[test]
    fn parses_title_collection_and_contributors() {
        let parsed = parse_tei_document(SAMPLE_TEI, doc_id()).expect("should parse");
        assert_eq!(parsed.title, "Story of Millie Pigeon");
        assert_eq!(parsed.collection, "Willie Jumper Stories");
        assert_eq!(parsed.contributor_names, vec!["Jane Doe".to_string()]);
    }

    #[test]
    fn parses_document_level_audio_archival_locref() {
        let parsed = parse_tei_document(SAMPLE_TEI, doc_id()).expect("should parse");
        assert_eq!(
            parsed.document_audio_archival_locref.as_deref(),
            Some("../audio/Story-of-Millie-Pigeon/Story-of-Millie-Pigeon_audio.mp3")
        );
    }

    #[test]
    fn groups_paragraphs_into_pages_by_pb() {
        let parsed = parse_tei_document(SAMPLE_TEI, doc_id()).expect("should parse");
        assert_eq!(parsed.pages.len(), 1);
        assert_eq!(parsed.pages[0].paragraphs.len(), 2);
    }

    #[test]
    fn parses_bare_and_choice_words_with_position_index_from_xml_id() {
        let parsed = parse_tei_document(SAMPLE_TEI, doc_id()).expect("should parse");
        let para = &parsed.pages[0].paragraphs[0];
        let AnnotatedSeg::Word(w1) = &para.source[0] else {
            panic!("expected a word");
        };
        assert_eq!(w1.source, "osdi");
        assert_eq!(w1.simple_phonetics.as_deref(), Some("o:sdi"));
        assert_eq!(w1.position.index, 1);
        assert_eq!(w1.position.document_id, doc_id());

        assert!(matches!(
            para.source[1],
            AnnotatedSeg::LineBreak(LineBreak { index: 1 })
        ));

        let AnnotatedSeg::Word(w2) = &para.source[2] else {
            panic!("expected a word");
        };
        assert_eq!(w2.source, "gvhnage");
        assert_eq!(w2.simple_phonetics, None);
        assert_eq!(w2.position.index, 2);
    }

    #[test]
    fn reverse_parses_morpheme_segments() {
        let parsed = parse_tei_document(SAMPLE_TEI, doc_id()).expect("should parse");
        let AnnotatedSeg::Word(w1) = &parsed.pages[0].paragraphs[0].source[0] else {
            panic!("expected a word");
        };
        let segments = w1.segments.as_ref().expect("should have segments");
        assert_eq!(segments.len(), 2);
        assert_eq!(segments[0].morpheme, "o");
        assert_eq!(segments[0].gloss, "3SG");
        assert_eq!(segments[1].morpheme, "sdi");
        assert_eq!(segments[1].gloss, "go");
    }

    #[test]
    fn parses_real_translation_and_gap_as_no_translation() {
        let parsed = parse_tei_document(SAMPLE_TEI, doc_id()).expect("should parse");
        assert_eq!(
            parsed.pages[0].paragraphs[0].translation.as_deref(),
            Some("She went to the store.")
        );
        assert_eq!(parsed.pages[0].paragraphs[1].translation, None);
    }

    #[test]
    fn parses_word_audio_archival_locref_and_commentary() {
        let parsed = parse_tei_document(SAMPLE_TEI, doc_id()).expect("should parse");
        assert_eq!(
            parsed
                .word_audio_archival_locrefs
                .get("w1")
                .map(String::as_str),
            Some("../audio/Story-of-Millie-Pigeon/1_o-sdi_w1.mp3")
        );
        let AnnotatedSeg::Word(w1) = &parsed.pages[0].paragraphs[0].source[0] else {
            panic!("expected a word");
        };
        assert_eq!(w1.commentary.as_deref(), Some("uncertain gloss"));
    }

    #[test]
    fn word_with_no_audio_ptr_has_no_archival_locref_entry() {
        let parsed = parse_tei_document(SAMPLE_TEI, doc_id()).expect("should parse");
        assert!(!parsed.word_audio_archival_locrefs.contains_key("w2"));
    }
}
