//! Renders a document's word-for-word translation, morphemic analysis, and commentary
//! into a TEI (Text Encoding Initiative) XML file, from `migration/translation.tera.xml`.
//!
//! This is the companion content the `mets` module's document METS files defer to --
//! METS carries file *references* (audio, images, and a pointer to this file), while all
//! actual word/paragraph-level content lives here. [`render_document_tei`] is called once
//! per document from [`crate::mets::generate_mets_for_collection`], and its output is
//! written alongside that document's own METS file (same `documents/` directory, same
//! filename stem -- see `CollectionDocumentEntry.file_stem` in the `mets` module).
//!
//! **Page/paragraph/word content is *not* available on the [`dailp::AnnotatedDoc`] passed
//! in.** `AnnotatedDoc.segments` looks like it should hold it (`Option<Vec<TranslatedPage>>`),
//! but the bulk `Loader<DocumentId>` impl that `mets.rs` uses to load documents
//! (`types/src/database_sql.rs`) unconditionally sets it to `None` -- that field is only
//! ever populated by a different, page-oriented code path. The real content has to be
//! fetched separately, one document at a time, via the same three loaders the GraphQL
//! API's `DocumentPage`/`DocumentParagraph` resolvers use under the hood:
//! `PagesInDocument` -> `Vec<DocumentPage>`, `ParagraphsInPage` -> `Vec<DocumentParagraph>`,
//! `WordsInParagraph` -> `Vec<AnnotatedSeg>` (the actual words/line-breaks). [`load_document_pages`]
//! calls those loaders directly (the same `Loader::load(db, keys)` pattern `mets.rs`
//! already uses for `EditedCollectionDetails`/`ChaptersInCollection`) rather than going
//! through `AnnotatedDoc.segments`, and is shared with `mets.rs` (`document_page_image_oids`,
//! `words_with_audio`) so a document's pages/paragraphs/words are only loaded once.
//!
//! **Morpheme content is *not* available on the `AnnotatedForm`s that loader chain
//! returns, either.** `AnnotatedForm.segments` looks like the right field (a structured,
//! role-tagged `Vec<WordSegment>`), but `WordsInParagraph`'s `BasicWord` conversion
//! (`types/src/database_sql.rs`) always sets it to `None` (`// TODO Fill in?` -- a
//! pre-existing gap, not one this module introduced). The only code that resolves real
//! morpheme data is `AnnotatedForm::segments(context, system)`, an async GraphQL resolver
//! requiring a `DataLoader` context this migration binary doesn't set up. [`resolve_word_segments`]
//! replicates that resolver's `PartsOfWord`/`TagId` matching algorithm directly against
//! `Database` instead, batched across every word in a document.

use std::collections::{HashMap, HashSet};

use anyhow::Result;
use dailp::async_graphql::dataloader::Loader;
use dailp::{
    AnnotatedDoc, AnnotatedForm, AnnotatedSeg, CherokeeOrthography, Database, DocumentPage,
    DocumentParagraph, PagesInDocument, ParagraphsInPage, PartsOfWord, TagId, Uuid, WordSegment,
    WordSegmentRole, WordsInParagraph,
};
use itertools::Itertools;
use serde::Serialize;

use crate::mets::{escape_xml, pretty_print_xml};

const TRANSLATION_TEMPLATE_NAME: &str = "translation.tera.xml";
const TEI_MACROS_TEMPLATE_NAME: &str = "tei_macros.tera.xml";
const TRANSLATION_TEMPLATE_SRC: &str = include_str!("../translation.tera.xml");
const TEI_MACROS_TEMPLATE_SRC: &str = include_str!("../tei_macros.tera.xml");

/// The Cherokee orthography TEI morpheme segmentation/gloss is resolved against.
/// Matches the codebase's own default elsewhere (`AnnotatedForm::root()` in
/// `types/src/form.rs`, which also resolves against `Taoc`).
const DEFAULT_ORTHOGRAPHY: CherokeeOrthography = CherokeeOrthography::Taoc;

/// One page of a document, with its paragraphs already loaded. See [`load_document_pages`].
pub(crate) struct LoadedPage {
    pub(crate) page: DocumentPage,
    pub(crate) paragraphs: Vec<LoadedParagraph>,
}

/// One paragraph of a [`LoadedPage`], with its words/line-breaks already loaded.
pub(crate) struct LoadedParagraph {
    pub(crate) paragraph: DocumentParagraph,
    pub(crate) words: Vec<AnnotatedSeg>,
}

/// Loads this document's pages, then every page's paragraphs, then every paragraph's
/// words -- see the module doc comment for why this can't just read `doc.segments`.
/// Shared by `mets.rs` (`document_page_image_oids`, `words_with_audio`) and this module's
/// own [`render_document_tei`], so a document's content is only loaded once per bundle
/// run rather than once per consumer.
///
/// Paragraphs and words are each batch-loaded in one query across the whole document
/// (rather than one query per page/paragraph) since `Loader::load` takes multiple keys
/// at once.
pub(crate) async fn load_document_pages(
    db: &Database,
    doc: &AnnotatedDoc,
) -> Result<Vec<LoadedPage>> {
    let pages_key = PagesInDocument(doc.meta.id.0);
    let pages: Vec<DocumentPage> = Loader::load(db, &[pages_key.clone()])
        .await
        .map_err(|e| anyhow::anyhow!("Failed to load pages for \"{}\": {e}", doc.meta.title))?
        .remove(&pages_key)
        .unwrap_or_default();

    let paragraph_keys: Vec<ParagraphsInPage> =
        pages.iter().map(|page| ParagraphsInPage(page.id)).collect();
    let mut paragraphs_by_page: HashMap<ParagraphsInPage, Vec<DocumentParagraph>> =
        Loader::load(db, &paragraph_keys).await.map_err(|e| {
            anyhow::anyhow!("Failed to load paragraphs for \"{}\": {e}", doc.meta.title)
        })?;

    let word_keys: Vec<WordsInParagraph> = paragraphs_by_page
        .values()
        .flatten()
        .map(|para| WordsInParagraph(para.id))
        .collect();
    let mut words_by_paragraph: HashMap<WordsInParagraph, Vec<AnnotatedSeg>> =
        Loader::load(db, &word_keys)
            .await
            .map_err(|e| anyhow::anyhow!("Failed to load words for \"{}\": {e}", doc.meta.title))?;

    Ok(pages
        .into_iter()
        .map(|page| {
            let paragraphs = paragraphs_by_page
                .remove(&ParagraphsInPage(page.id))
                .unwrap_or_default();
            LoadedPage {
                paragraphs: paragraphs
                    .into_iter()
                    .map(|paragraph| {
                        let words = words_by_paragraph
                            .remove(&WordsInParagraph(paragraph.id))
                            .unwrap_or_default();
                        LoadedParagraph { paragraph, words }
                    })
                    .collect(),
                page,
            }
        })
        .collect())
}

/// Batch-resolves concrete morpheme segments for every given word, replicating
/// `AnnotatedForm::segments(context, system)`'s GraphQL resolver algorithm
/// (`types/src/form.rs`) via direct `Loader::load` calls instead of a `DataLoader`
/// context -- see the module doc comment. Words with no database id (shouldn't happen
/// for persisted data, but `AnnotatedForm.id` is nullable) are skipped rather than
/// panicking, since this runs as offline batch automation, not a live request.
async fn resolve_word_segments(
    db: &Database,
    forms: &[&AnnotatedForm],
) -> Result<HashMap<Uuid, Vec<WordSegment>>> {
    let word_ids: Vec<Uuid> = forms.iter().filter_map(|form| form.id).collect();

    let parts_keys: Vec<PartsOfWord> = word_ids.iter().map(|id| PartsOfWord(*id)).collect();
    let mut abstract_by_word: HashMap<PartsOfWord, Vec<WordSegment>> =
        Loader::load(db, &parts_keys)
            .await
            .map_err(|e| anyhow::anyhow!("Failed to load word parts: {e}"))?;

    let tag_keys: Vec<TagId> = abstract_by_word
        .values()
        .flatten()
        .map(|seg| TagId(seg.gloss.clone(), DEFAULT_ORTHOGRAPHY))
        .collect::<HashSet<_>>()
        .into_iter()
        .collect();
    let concrete_tag_matches = Loader::load(db, &tag_keys)
        .await
        .map_err(|e| anyhow::anyhow!("Failed to load morpheme tags: {e}"))?;

    Ok(word_ids
        .into_iter()
        .map(|id| {
            let abstract_segments = abstract_by_word
                .remove(&PartsOfWord(id))
                .unwrap_or_default();
            (
                id,
                resolve_concrete_segments(&abstract_segments, &concrete_tag_matches),
            )
        })
        .collect())
}

/// The longest-match resolution step of `AnnotatedForm::segments()`
/// (`types/src/form.rs`), copied faithfully (including its behavior of dropping an
/// abstract segment entirely if it has candidate concrete tags but none of them
/// actually match -- that's the original resolver's behavior, not a bug introduced
/// here) so it can be unit-tested without a `Database`.
fn resolve_concrete_segments(
    abstract_segments: &[WordSegment],
    concrete_tag_matches: &HashMap<TagId, Vec<dailp::MorphemeTag>>,
) -> Vec<WordSegment> {
    let mut concrete_segments = Vec::new();
    let mut curr_index = 0;
    for (idx, abstract_segment) in abstract_segments.iter().enumerate() {
        if idx < curr_index {
            continue;
        }
        let key = TagId(abstract_segment.gloss.clone(), DEFAULT_ORTHOGRAPHY);
        if let Some(concrete_tags) = concrete_tag_matches.get(&key) {
            for concrete_tag in concrete_tags {
                let abstract_matches = concrete_tag
                    .internal_tags
                    .iter()
                    .zip(abstract_segments.iter().skip(curr_index));
                let is_match = abstract_matches.clone().all(|(a, b)| *a == b.gloss);
                if is_match {
                    let corresponding_segments = abstract_segments
                        .iter()
                        .skip(curr_index)
                        .take(concrete_tag.internal_tags.len());
                    concrete_segments.push(WordSegment {
                        system: Some(DEFAULT_ORTHOGRAPHY),
                        role: concrete_tag
                            .role_override
                            .or_else(|| corresponding_segments.clone().next().map(|seg| seg.role))
                            .unwrap_or(WordSegmentRole::Morpheme),
                        morpheme: corresponding_segments.map(|seg| &seg.morpheme).join(""),
                        gloss: concrete_tag.tag.clone(),
                        gloss_id: None,
                        matching_tag: Some(concrete_tag.clone()),
                    });
                    curr_index += concrete_tag.internal_tags.len();
                    break;
                }
            }
        } else {
            // This abstract segment had no candidate concrete tags at all (probably a
            // root), so use it directly.
            concrete_segments.push(WordSegment {
                system: Some(DEFAULT_ORTHOGRAPHY),
                ..abstract_segment.clone()
            });
            curr_index += 1;
        }
    }
    concrete_segments
}

/// This document's own METS filename, and its neighbors' (in collection order), so the
/// TEI file can link back out to them for navigation -- see `translation.tera.xml`'s
/// `<standOff><linkGrp type="navigation">`. All three are bare filenames (not paths):
/// every document's METS and TEI files live together in the same `documents/`
/// directory, so a neighbor's METS file is always just a sibling of this TEI file.
pub(crate) struct DocumentNavigation {
    pub(crate) mets_filename: String,
    /// `None` for the first document in the collection.
    pub(crate) prev_mets_filename: Option<String>,
    /// `None` for the last document in the collection.
    pub(crate) next_mets_filename: Option<String>,
}

/// Whether a document has any real linguistic content to put in a TEI file --
/// [`render_document_tei`] should be skipped (and no `.tei.xml` written) when this is
/// `false`. Defined as "at least one paragraph across `pages` has a non-empty
/// translation, or at least one real word (`AnnotatedSeg::Word`) in its source" --
/// bare source with no translation yet still counts, since a document can be
/// transcribed before it's translated. Documents with no pages/paragraphs loaded at all,
/// or whose only segments are line breaks with no words and no translation, count as
/// having no linguistic content.
pub(crate) fn has_linguistic_content(pages: &[LoadedPage]) -> bool {
    pages.iter().flat_map(|page| &page.paragraphs).any(|para| {
        !para.paragraph.translation.trim().is_empty()
            || para
                .words
                .iter()
                .any(|seg| matches!(seg, AnnotatedSeg::Word(_)))
    })
}

/// Renders one document's TEI file. `collection_title` should already be XML-escaped by
/// the caller (mirroring how `mets::DocumentMetsContext` is built) -- everything else is
/// escaped here. `pages` should come from [`load_document_pages`] for the same document.
/// Callers should check [`has_linguistic_content`] first and skip calling this (and
/// writing a `.tei.xml` file) when it's `false`.
///
/// `document_audio_archival_locref`/`word_audio_archival_locrefs` are the same archived
/// audio paths `mets::generate_mets_for_collection` already computed for this document's
/// METS file (`mets::CollectionDocumentEntry.archival_locref`/`mets::WordAudioEntry`,
/// keyed by word id) -- passed in rather than recomputed here, so the METS and TEI files
/// can't disagree about where a document's/word's audio lives.
pub async fn render_document_tei(
    db: &Database,
    pages: &[LoadedPage],
    doc: &AnnotatedDoc,
    collection_title: &str,
    navigation: &DocumentNavigation,
    document_audio_archival_locref: Option<&str>,
    word_audio_archival_locrefs: &HashMap<String, String>,
) -> Result<String> {
    let forms: Vec<&AnnotatedForm> = pages
        .iter()
        .flat_map(|page| &page.paragraphs)
        .flat_map(|para| &para.words)
        .filter_map(|seg| match seg {
            AnnotatedSeg::Word(form) => Some(form),
            AnnotatedSeg::LineBreak(_) => None,
        })
        .collect();
    let resolved_segments = resolve_word_segments(db, &forms).await?;

    let ctx = TeiDocumentContext {
        title: escape_xml(&doc.meta.title),
        collection: collection_title.to_owned(),
        people: doc
            .meta
            .contributors
            .iter()
            .flatten()
            .map(|contributor| TeiPersonContext {
                name: escape_xml(&contributor.name),
            })
            .collect(),
        pages: build_pages(pages, &resolved_segments, word_audio_archival_locrefs),
        mets_filename: navigation.mets_filename.clone(),
        prev_mets_filename: navigation.prev_mets_filename.clone(),
        next_mets_filename: navigation.next_mets_filename.clone(),
        document_audio_archival_locref: document_audio_archival_locref.map(str::to_owned),
    };

    render_tei(&ctx)
}

/// The actual template-rendering step, split out from [`render_document_tei`] so it can
/// be unit-tested against a hand-built [`TeiDocumentContext`] without needing a real
/// `Database` -- the same boundary `mets.rs`'s own tests draw around `render_document_mets`
/// et al.
fn render_tei(ctx: &TeiDocumentContext) -> Result<String> {
    let tera = build_tera()?;
    pretty_print_xml(&tera.render(
        TRANSLATION_TEMPLATE_NAME,
        &tera::Context::from_serialize(ctx)?,
    )?)
}

fn build_tera() -> Result<tera::Tera> {
    let mut tera = tera::Tera::default();
    // Same reasoning as `mets::build_tera`: we do our own XML escaping (see
    // `crate::mets::escape_xml`), so Tera's default HTML autoescaping (which would
    // mangle forward slashes, among other things) needs to stay off for ".xml" templates.
    tera.autoescape_on(vec![]);
    tera.add_raw_template(TEI_MACROS_TEMPLATE_NAME, TEI_MACROS_TEMPLATE_SRC)?;
    tera.add_raw_template(TRANSLATION_TEMPLATE_NAME, TRANSLATION_TEMPLATE_SRC)?;
    Ok(tera)
}

/// Context for rendering `translation.tera.xml`.
#[derive(Serialize)]
struct TeiDocumentContext {
    title: String,
    /// The collection this document belongs to, for `sourceDesc`. Already XML-escaped by
    /// the caller.
    collection: String,
    /// This document's contributors, for `teiHeader/profileDesc/particDesc`.
    people: Vec<TeiPersonContext>,
    pages: Vec<TeiPageContext>,
    /// This document's own METS filename, for `standOff/linkGrp`'s self-`ptr`. See
    /// [`DocumentNavigation`].
    mets_filename: String,
    prev_mets_filename: Option<String>,
    next_mets_filename: Option<String>,
    /// This document's archived overall audio file, relative to `documents/` (same value
    /// as `mets::CollectionDocumentEntry.archival_locref`/`mets::DocumentMetsContext.archival_locref`
    /// for this document), or `None` if it has no audio / the download failed. Rendered
    /// into `teiHeader/fileDesc/sourceDesc/recordingStmt`.
    document_audio_archival_locref: Option<String>,
}

#[derive(Serialize)]
struct TeiPersonContext {
    name: String,
}

#[derive(Serialize)]
struct TeiPageContext {
    /// 1-indexed page number within the document (`DocumentPage.page_number`), used to
    /// build each paragraph's `xml:id` (`pg{page_number}_para{n}`) and to render a
    /// `<pb n="{page_number}"/>` per page.
    page_number: String,
    paragraphs: Vec<TeiParagraphContext>,
}

#[derive(Serialize)]
struct TeiParagraphContext {
    /// `xml:id`-safe id, e.g. `pg1_para2`. The parallel translation `<ab>` uses
    /// `{id}_trans`.
    id: String,
    /// Whole-paragraph translation, if there is one. `DocumentParagraph.translation` only
    /// tracks one translation per paragraph (not per word or per block), so this is the
    /// finest granularity available. Empty strings (an unfilled translation, not a
    /// missing one -- the field itself isn't optional) are treated as absent.
    translation: Option<String>,
    /// Whether `source` has at least one real word (as opposed to only line breaks, or
    /// nothing at all). Gates whether an untranslated paragraph gets a `<gap
    /// reason="untranslated"/>` placeholder -- see `translation.tera.xml`'s translation
    /// `<text>` -- there's a meaningful absence of a translation to mark only when there
    /// was actually something to translate.
    has_source_words: bool,
    source: Vec<TeiSegmentContext>,
}

/// Mirrors [`dailp::AnnotatedSeg`], which today only has `Word` and `LineBreak` variants
/// (a former `PageBreak` variant is commented out there; page breaks are handled at the
/// page level here instead -- see `TeiPageContext`).
#[derive(Serialize)]
#[serde(tag = "type")]
enum TeiSegmentContext {
    Word(TeiWordContext),
    LineBreak(TeiLineBreakContext),
}

#[derive(Serialize)]
struct TeiLineBreakContext {
    index: i32,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct TeiWordContext {
    /// `"w" + position index`, matching the convention `mets::words_with_audio` already
    /// uses for the same word, so METS and TEI files can cross-reference the same word by
    /// id.
    id: String,
    source: String,
    normalized_source: Option<String>,
    simple_phonetics: Option<String>,
    phonemic: Option<String>,
    /// Morpheme-by-morpheme segmentation, joined with the separator each segment's own
    /// [`dailp::WordSegmentRole`] specifies (`-`/`=`/`:`) via `morpheme_layer` -- not a
    /// hardcoded `-`, so this can't drift out of sync with `morphemic_gloss` the way
    /// joining two independently-tracked flat arrays could.
    morphemic_segmentation: Option<String>,
    /// Gloss for each morpheme, aligned 1:1 with `morphemic_segmentation` since both are
    /// built from the same `Vec<WordSegment>` in one pass.
    morphemic_gloss: Option<String>,
    english_gloss: Vec<String>,
    commentary: Option<String>,
    /// This word's archived audio file, relative to `documents/` -- same value as the
    /// corresponding `mets::WordAudioEntry.archival_locref`, threaded through from
    /// `render_document_tei`'s `word_audio_archival_locrefs` map so METS and TEI can't
    /// disagree about where a word's audio lives. `None` when the word has no recorded
    /// audio, or its download failed (both look identical here). Serializes as
    /// `audioFilename` per this struct's `rename_all = "camelCase"`.
    audio_filename: Option<String>,
}

/// Builds the TEI page/paragraph/segment tree from already-loaded content (see
/// [`load_document_pages`]) and already-resolved morpheme segments (see
/// [`resolve_word_segments`]). Pure and synchronous -- no `Database` access -- so it, and
/// `render_tei`, stay unit-testable without one.
fn build_pages(
    pages: &[LoadedPage],
    resolved_segments: &HashMap<Uuid, Vec<WordSegment>>,
    word_audio: &HashMap<String, String>,
) -> Vec<TeiPageContext> {
    pages
        .iter()
        .map(|loaded_page| TeiPageContext {
            page_number: loaded_page.page.page_number.clone(),
            paragraphs: loaded_page
                .paragraphs
                .iter()
                .map(|loaded_para| TeiParagraphContext {
                    id: format!(
                        "pg{}_para{}",
                        loaded_page.page.page_number, loaded_para.paragraph.index
                    ),
                    translation: if loaded_para.paragraph.translation.trim().is_empty() {
                        None
                    } else {
                        Some(escape_xml(&loaded_para.paragraph.translation))
                    },
                    has_source_words: loaded_para
                        .words
                        .iter()
                        .any(|seg| matches!(seg, AnnotatedSeg::Word(_))),
                    source: loaded_para
                        .words
                        .iter()
                        .map(|seg| build_segment(seg, resolved_segments, word_audio))
                        .collect(),
                })
                .collect(),
        })
        .collect()
}

fn build_segment(
    seg: &AnnotatedSeg,
    resolved_segments: &HashMap<Uuid, Vec<WordSegment>>,
    word_audio: &HashMap<String, String>,
) -> TeiSegmentContext {
    match seg {
        AnnotatedSeg::Word(form) => {
            TeiSegmentContext::Word(build_word(form, resolved_segments, word_audio))
        }
        AnnotatedSeg::LineBreak(line_break) => TeiSegmentContext::LineBreak(TeiLineBreakContext {
            index: line_break.index,
        }),
    }
}

fn build_word(
    form: &AnnotatedForm,
    resolved_segments: &HashMap<Uuid, Vec<WordSegment>>,
    word_audio: &HashMap<String, String>,
) -> TeiWordContext {
    let id = format!("w{}", form.position.index);
    // `form.segments` itself is always `None` here (see the module doc comment); real
    // morpheme data comes from `resolved_segments`, keyed by this word's database id.
    let segments = form.id.and_then(|id| resolved_segments.get(&id));
    let (morphemic_segmentation, morphemic_gloss) = match segments {
        Some(segments) if !segments.is_empty() => (
            Some(escape_xml(&morpheme_layer(segments))),
            Some(escape_xml(&WordSegment::gloss_layer(segments))),
        ),
        _ => (None, None),
    };

    TeiWordContext {
        audio_filename: word_audio.get(&id).cloned(),
        id,
        source: escape_xml(&form.source),
        normalized_source: form.normalized_source.as_deref().map(escape_xml),
        simple_phonetics: form.simple_phonetics.as_deref().map(escape_xml),
        phonemic: form.phonemic.as_deref().map(escape_xml),
        morphemic_segmentation,
        morphemic_gloss,
        english_gloss: form.english_gloss.iter().map(|g| escape_xml(g)).collect(),
        commentary: form.commentary.as_deref().map(escape_xml),
    }
}

/// Joins each segment's morpheme with the separator its own role specifies before it
/// (matching `WordSegment::get_previous_separator`'s semantics), mirroring
/// `WordSegment::gloss_layer` but for morphemes instead of glosses.
fn morpheme_layer<'a>(segments: impl IntoIterator<Item = &'a WordSegment>) -> String {
    segments
        .into_iter()
        .enumerate()
        .map(|(index, segment)| {
            let separator = if index > 0 {
                segment.get_previous_separator()
            } else {
                ""
            };
            format!("{separator}{}", segment.get_morpheme())
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;
    use dailp::{DocumentId, LineBreak, PositionInDocument, WordSegmentRole};

    fn sample_word(index: i64, source: &str) -> AnnotatedForm {
        AnnotatedForm {
            id: None,
            source: source.to_owned(),
            normalized_source: None,
            simple_phonetics: Some("phonetic".to_owned()),
            phonemic: Some("phonemic".to_owned()),
            segments: None,
            english_gloss: vec!["gloss".to_owned()],
            commentary: None,
            line_break: None,
            page_break: None,
            position: PositionInDocument {
                document_id: DocumentId(Uuid::nil()),
                page_number: "1".to_owned(),
                index,
                geometry: None,
            },
            date_recorded: None,
            ingested_audio_track: None,
        }
    }

    fn no_resolved_segments() -> HashMap<Uuid, Vec<WordSegment>> {
        HashMap::new()
    }

    /// A document with one page, one paragraph, one word, and a line break -- built
    /// directly as a [`TeiDocumentContext`] (bypassing `build_pages`/`load_document_pages`
    /// and their `Database` dependency) so template rendering can be tested without a
    /// real DB connection, mirroring how `mets.rs`'s own tests hand-build a
    /// `DocumentMetsContext` rather than going through `generate_mets_for_collection`.
    fn sample_context() -> TeiDocumentContext {
        let mut resolved = HashMap::new();
        let word_id = Uuid::from_u128(1);
        let mut word = sample_word(1, "osdi");
        word.id = Some(word_id);
        resolved.insert(
            word_id,
            vec![
                WordSegment::new("o".to_owned(), "3SG".to_owned(), None),
                WordSegment::new(
                    "sdi".to_owned(),
                    "go".to_owned(),
                    Some(WordSegmentRole::Clitic),
                ),
            ],
        );
        let no_word_audio = HashMap::new();

        TeiDocumentContext {
            title: "Story of Millie Pigeon".to_owned(),
            collection: "Willie Jumper Stories".to_owned(),
            people: vec![],
            pages: vec![TeiPageContext {
                page_number: "1".to_owned(),
                paragraphs: vec![TeiParagraphContext {
                    id: "pg1_para1".to_owned(),
                    translation: Some("She went to the store.".to_owned()),
                    has_source_words: true,
                    source: vec![
                        build_segment(&AnnotatedSeg::Word(word), &resolved, &no_word_audio),
                        build_segment(
                            &AnnotatedSeg::LineBreak(LineBreak { index: 1 }),
                            &resolved,
                            &no_word_audio,
                        ),
                    ],
                }],
            }],
            mets_filename: "Story-of-Millie-Pigeon.mets.xml".to_owned(),
            prev_mets_filename: Some("Story-of-the-Old-Timer.mets.xml".to_owned()),
            next_mets_filename: None,
            document_audio_archival_locref: None,
        }
    }

    #[test]
    fn renders_well_formed_xml_with_paragraph_and_word_content() {
        let xml = render_tei(&sample_context()).expect("template should render");

        roxmltree::Document::parse(&xml).expect("output should be well-formed XML");
        assert!(xml.contains("<title>Story of Millie Pigeon</title>"));
        assert!(xml.contains("<pb n=\"1\"/>"));
        assert!(xml.contains("xml:id=\"pg1_para1\""));
        assert!(xml.contains("corresp=\"#pg1_para1_trans\""));
        assert!(xml.contains("xml:id=\"pg1_para1_trans\""));
        assert!(xml.contains("She went to the store."));
        assert!(xml.contains("xml:id=\"w1\""));
        // Morpheme/gloss joined with the second segment's own separator ("=" for
        // `Clitic`), not a hardcoded "-".
        assert!(xml.contains("<seg type=\"morphemic_segmentation\">o=sdi</seg>"));
        assert!(xml.contains("<seg type=\"morphemic_gloss\">3SG=go</seg>"));
        assert!(xml.contains("<lb n=\"1\"/>"));
        assert!(!xml.contains("schema/out/dailp_odd.rng"));
        // Self/prev links to neighboring documents' METS files, for navigation. No
        // `next` link since this sample is the last document in its collection.
        assert!(xml.contains("<ptr type=\"mets\" target=\"./Story-of-Millie-Pigeon.mets.xml\"/>"));
        assert!(xml.contains("<ptr type=\"prev\" target=\"./Story-of-the-Old-Timer.mets.xml\"/>"));
        assert!(!xml.contains("type=\"next\""));
    }

    #[test]
    fn omits_next_and_prev_ptrs_when_document_has_no_neighbor_on_that_side() {
        let mut ctx = sample_context();
        ctx.prev_mets_filename = None;
        ctx.next_mets_filename = Some("Second-Story-of-Farmer-Fox.mets.xml".to_owned());

        let xml = render_tei(&ctx).expect("template should render");
        assert!(!xml.contains("type=\"prev\""));
        assert!(
            xml.contains("<ptr type=\"next\" target=\"./Second-Story-of-Farmer-Fox.mets.xml\"/>")
        );
    }

    #[test]
    fn renders_recording_stmt_when_document_audio_present() {
        let mut ctx = sample_context();
        ctx.document_audio_archival_locref =
            Some("../audio/Story-of-Millie-Pigeon/Story-of-Millie-Pigeon_audio.mp3".to_owned());

        let xml = render_tei(&ctx).expect("template should render");
        assert!(xml.contains("<recordingStmt>"));
        assert!(xml.contains(
            "<media url=\"../audio/Story-of-Millie-Pigeon/Story-of-Millie-Pigeon_audio.mp3\"/>"
        ));
        roxmltree::Document::parse(&xml).expect("output should be well-formed XML");
    }

    #[test]
    fn omits_recording_stmt_when_document_has_no_audio() {
        // `sample_context()` already has `document_audio_archival_locref: None`.
        let xml = render_tei(&sample_context()).expect("template should render");
        assert!(!xml.contains("recordingStmt"));
    }

    #[test]
    fn renders_audio_ptr_for_word_with_audio() {
        let mut resolved = HashMap::new();
        let word_id = Uuid::from_u128(1);
        let mut word = sample_word(1, "osdi");
        word.id = Some(word_id);
        resolved.insert(word_id, vec![]);
        let mut word_audio = HashMap::new();
        word_audio.insert(
            "w1".to_owned(),
            "../audio/Story-of-Millie-Pigeon/1_phonetic_w1.mp3".to_owned(),
        );

        let mut ctx = sample_context();
        ctx.pages[0].paragraphs[0].source = vec![build_segment(
            &AnnotatedSeg::Word(word),
            &resolved,
            &word_audio,
        )];

        let xml = render_tei(&ctx).expect("template should render");
        assert!(xml.contains(
            "<ptr type=\"audio\" target=\"../audio/Story-of-Millie-Pigeon/1_phonetic_w1.mp3\"/>"
        ));
        roxmltree::Document::parse(&xml).expect("output should be well-formed XML");
    }

    #[test]
    fn omits_audio_ptr_for_word_without_audio() {
        // `sample_context()`'s word is built with an empty `word_audio` map.
        let xml = render_tei(&sample_context()).expect("template should render");
        assert!(!xml.contains("type=\"audio\""));
    }

    /// Builds a single-page, single-paragraph `Vec<LoadedPage>` for
    /// `has_linguistic_content` tests, with the given translation and words.
    fn sample_pages_with(translation: &str, words: Vec<AnnotatedSeg>) -> Vec<LoadedPage> {
        vec![LoadedPage {
            page: dailp::DocumentPage {
                id: Uuid::from_u128(1),
                page_number: "1".to_owned(),
                image: None,
            },
            paragraphs: vec![LoadedParagraph {
                paragraph: dailp::DocumentParagraph {
                    id: Uuid::from_u128(2),
                    translation: translation.to_owned(),
                    index: 1,
                },
                words,
            }],
        }]
    }

    #[test]
    fn has_linguistic_content_is_false_for_empty_and_content_free_pages() {
        assert!(!has_linguistic_content(&[]));

        // No translation, and no words at all (just a line break) -- nothing to encode.
        let content_free =
            sample_pages_with("   ", vec![AnnotatedSeg::LineBreak(LineBreak { index: 1 })]);
        assert!(!has_linguistic_content(&content_free));
    }

    #[test]
    fn has_linguistic_content_is_true_for_bare_source_with_no_translation() {
        // A transcribed-but-not-yet-translated document: real word content, empty
        // translation. Should still count as having linguistic content.
        let bare_source = sample_pages_with("", vec![AnnotatedSeg::Word(sample_word(1, "osdi"))]);
        assert!(has_linguistic_content(&bare_source));
    }

    #[test]
    fn has_linguistic_content_is_true_when_any_paragraph_has_a_translation() {
        let translated_only = sample_pages_with("She went to the store.", vec![]);
        assert!(has_linguistic_content(&translated_only));
    }

    #[test]
    fn renders_gap_marker_when_paragraph_has_source_words_but_no_translation() {
        // `sample_context()`'s one paragraph has real source words (`has_source_words:
        // true`), so an empty translation is a meaningful, known absence -- not silence.
        let mut ctx = sample_context();
        ctx.pages[0].paragraphs[0].translation = None;

        let xml = render_tei(&ctx).expect("template should render");
        assert!(xml.contains("<ab xml:id=\"pg1_para1_trans\">"));
        assert!(xml.contains("<gap reason=\"untranslated\"/>"));
        // The source `<ab>` still points at the (now `<gap>`-only) translation `<ab>`,
        // since it exists.
        assert!(xml.contains("corresp=\"#pg1_para1_trans\""));
        roxmltree::Document::parse(&xml).expect("output should be well-formed XML");
    }

    #[test]
    fn omits_translation_ab_entirely_when_paragraph_has_neither_translation_nor_source_words() {
        let mut ctx = sample_context();
        ctx.pages[0].paragraphs[0].translation = None;
        ctx.pages[0].paragraphs[0].has_source_words = false;
        ctx.pages[0].paragraphs[0].source = vec![];

        let xml = render_tei(&ctx).expect("template should render");
        // Nothing to translate and nothing translated -- no `<gap>`, no `_trans` `<ab>`,
        // and no dangling `corresp` pointing at one.
        assert!(!xml.contains("pg1_para1_trans"));
        assert!(!xml.contains("<gap"));
    }

    #[test]
    fn build_word_omits_morpheme_segs_when_word_has_no_resolved_segments() {
        let mut form = sample_word(1, "osdi");
        form.id = Some(Uuid::from_u128(99));
        let word = build_word(&form, &no_resolved_segments(), &HashMap::new());
        assert!(word.morphemic_segmentation.is_none());
        assert!(word.morphemic_gloss.is_none());
    }

    #[test]
    fn build_word_omits_morpheme_segs_when_word_has_no_id() {
        let form = sample_word(1, "osdi");
        assert_eq!(form.id, None);
        let word = build_word(&form, &no_resolved_segments(), &HashMap::new());
        assert!(word.morphemic_segmentation.is_none());
        assert!(word.morphemic_gloss.is_none());
    }

    #[test]
    fn build_word_uses_position_index_for_id() {
        let form = sample_word(7, "osdi");
        assert_eq!(
            build_word(&form, &no_resolved_segments(), &HashMap::new()).id,
            "w7"
        );
    }

    #[test]
    fn build_word_sets_audio_filename_when_present_in_map() {
        let form = sample_word(1, "osdi");
        let mut word_audio = HashMap::new();
        word_audio.insert(
            "w1".to_owned(),
            "../audio/Story-of-Millie-Pigeon/1_phonetic_w1.mp3".to_owned(),
        );
        let word = build_word(&form, &no_resolved_segments(), &word_audio);
        assert_eq!(
            word.audio_filename.as_deref(),
            Some("../audio/Story-of-Millie-Pigeon/1_phonetic_w1.mp3")
        );
    }

    #[test]
    fn build_word_omits_audio_filename_when_absent_from_map() {
        let form = sample_word(1, "osdi");
        let word = build_word(&form, &no_resolved_segments(), &HashMap::new());
        assert!(word.audio_filename.is_none());
    }

    #[test]
    fn morpheme_layer_uses_role_specific_separators() {
        let segments = vec![
            WordSegment::new("o".to_owned(), "3SG".to_owned(), None),
            WordSegment::new(
                "sdi".to_owned(),
                "go".to_owned(),
                Some(WordSegmentRole::Clitic),
            ),
            WordSegment::new(
                "hno".to_owned(),
                "then".to_owned(),
                Some(WordSegmentRole::Modifier),
            ),
        ];
        assert_eq!(morpheme_layer(&segments), "o=sdi:hno");
    }

    #[test]
    fn resolve_concrete_segments_uses_abstract_segment_directly_when_no_tags_match() {
        // No entries in `concrete_tag_matches` at all -- every abstract segment is
        // "probably a root" and passes through unchanged (just tagged with the system).
        let abstract_segments = vec![WordSegment::new("o".to_owned(), "root".to_owned(), None)];
        let result = resolve_concrete_segments(&abstract_segments, &HashMap::new());
        assert_eq!(result.len(), 1);
        assert_eq!(result[0].morpheme, "o");
        assert_eq!(result[0].gloss, "root");
        assert_eq!(result[0].system, Some(DEFAULT_ORTHOGRAPHY));
    }
}
