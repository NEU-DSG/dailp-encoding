use crate::{AnnotatedForm, Database, MorphemeSegment, Translation, TranslationBlock};
use anyhow::Result;
use async_graphql::{self, *};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs::File;
use std::io::Write;
use tera::{self, Tera};

#[derive(Serialize, Deserialize)]
pub struct AnnotatedDoc {
    #[serde(rename = "_id")]
    pub id: String,
    pub title: String,
    pub publication: Option<String>,
    pub collection: Option<String>,
    /// The people involved in collecting, translating, annotating.
    #[serde(default)]
    pub people: Vec<String>,
    pub segments: Option<Vec<TranslatedSection>>,
    pub image_url: Option<String>,
}
impl AnnotatedDoc {
    pub fn new(meta: DocumentMetadata, segments: Vec<AnnotatedSeg>) -> Self {
        Self {
            id: meta.id,
            title: meta.title,
            publication: meta.publication,
            collection: meta.source,
            people: meta.people,
            segments: Some(
                segments
                    .into_iter()
                    .zip(meta.translation.blocks)
                    .map(|(seg, trans)| TranslatedSection {
                        translation: trans,
                        source: seg,
                    })
                    .collect(),
            ),
            image_url: None,
        }
    }
}

#[Object]
impl AnnotatedDoc {
    /// Official short identifier for this document.
    async fn id(&self) -> &str {
        &self.id
    }

    /// Full title of the document.
    async fn title(&self) -> &str {
        &self.title
    }

    /// The publication that included this document.
    async fn publication(&self) -> &Option<String> {
        &self.publication
    }

    /// Where the source document came from, maybe the name of a collection.
    async fn collection(&self) -> &Option<String> {
        &self.collection
    }

    /// Segments of the document paired with their respective rough translations.
    async fn translated_segments(&self, context: &Context<'_>) -> Option<Vec<TranslatedSection>> {
        // We may not have complete data.
        if self.segments.is_some() {
            self.segments.clone()
        } else {
            let db_doc = context.data::<Database>().unwrap().document(&self.id).await;
            db_doc.and_then(|d| d.segments)
        }
    }

    /// All the words contained in this document, dropping structural formatting
    /// like line and page breaks.
    async fn words(&self) -> Option<Vec<AnnotatedForm>> {
        self.segments
            .as_ref()
            .map(|segments| segments.iter().flat_map(|s| s.source.words()).collect())
    }
}

#[async_graphql::Enum]
pub enum DocumentType {
    Reference,
    Corpus,
}

#[SimpleObject]
#[derive(Serialize, Deserialize, Clone)]
pub struct TranslatedSection {
    /// Translation of this portion of the source text.
    translation: TranslationBlock,
    /// Source text from the original document.
    source: AnnotatedSeg,
}

// Ideal structure:
// documents: [{ meta, pages: [{ lines: [{ index, words }] }] }]
// Basic to start: [{meta, lines: [{ index, words }]}]

#[Union]
#[derive(Serialize, Deserialize, Clone)]
#[serde(tag = "type")]
pub enum AnnotatedSeg {
    Block(AnnotatedPhrase),
    Word(AnnotatedForm),
    LineBreak(LineBreak),
    PageBreak(PageBreak),
}
impl AnnotatedSeg {
    pub fn words(&self) -> Vec<AnnotatedForm> {
        use AnnotatedSeg::*;
        match self {
            Block(block) => block.parts.iter().flat_map(|s| s.words()).collect(),
            Word(w) => vec![w.clone()],
            LineBreak(_) => Vec::new(),
            PageBreak(_) => Vec::new(),
        }
    }
}

#[Enum]
#[derive(Serialize, Deserialize)]
pub enum BlockType {
    Block,
    Phrase,
}

#[SimpleObject]
#[derive(Serialize, Deserialize, Clone)]
pub struct LineBreak {
    pub index: i32,
}
#[SimpleObject]
#[derive(Serialize, Deserialize, Clone)]
pub struct PageBreak {
    pub index: i32,
}

#[SimpleObject]
#[derive(Serialize, Deserialize, Clone)]
pub struct AnnotatedPhrase {
    pub ty: BlockType,
    pub index: i32,
    pub parts: Vec<AnnotatedSeg>,
}

/// All the metadata associated with one particular document.
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct DocumentMetadata {
    /// Official short identifier.
    pub id: String,
    /// Full title of the document.
    pub title: String,
    /// The publication that included this document.
    pub publication: Option<String>,
    /// Where the source document came from, maybe the name of a collection.
    pub source: Option<String>,
    /// The people involved in collecting, translating, annotating.
    pub people: Vec<String>,
    /// Rough translation of the document, broken down by paragraph.
    pub translation: Translation,
    /// URL for an image of the original physical document.
    pub image_url: Option<String>,
}
