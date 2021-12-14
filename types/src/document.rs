use crate::{
    AnnotatedForm, AudioSlice, Contributor, Database, Date, SourceAttribution, Translation,
    TranslationBlock,
};
use async_graphql::{dataloader::DataLoader, FieldResult};
use serde::{Deserialize, Serialize};
use std::borrow::Cow;

#[derive(Serialize, Deserialize, Clone)]
pub struct AnnotatedDoc {
    #[serde(flatten)]
    pub meta: DocumentMetadata,
    pub segments: Option<Vec<TranslatedSection>>,
}
impl AnnotatedDoc {
    pub fn new(meta: DocumentMetadata, segments: Vec<AnnotatedSeg>) -> Self {
        let mut merged_segments = Vec::new();
        // Skip the first block of the translation, since this usually contains
        // the header and information for translators and editors.
        let mut block_index = 1;
        let blocks = &meta
            .translation
            .as_ref()
            .expect(&format!("Missing translation for {}", meta.id.0))
            .blocks;
        for seg in segments {
            // Only blocks have an associated translation.
            let trans = if let AnnotatedSeg::Block(_) = &seg {
                let t = blocks.get(block_index);
                block_index += 1;
                t.cloned()
            } else {
                None
            };
            merged_segments.push(TranslatedSection {
                translation: trans,
                source: seg,
            });
        }

        Self {
            segments: Some(merged_segments),
            meta,
        }
    }
}

#[async_graphql::Object]
impl AnnotatedDoc {
    /// Official short identifier for this document
    async fn id(&self) -> &DocumentId {
        &self.meta.id
    }

    /// Full title of the document
    async fn title(&self) -> &str {
        &self.meta.title
    }

    /// Date and time this document was written or created
    async fn date(&self) -> &Option<Date> {
        &self.meta.date
    }

    /// The original source(s) of this document, the most important first.
    async fn sources(&self) -> &Vec<SourceAttribution> {
        &self.meta.sources
    }

    /// Where the source document came from, maybe the name of a collection
    async fn collection(&self) -> Option<DocumentCollection> {
        self.meta
            .collection
            .as_ref()
            .map(|name| DocumentCollection {
                name: name.to_owned(),
            })
    }

    /// The genre of the document, used to group similar ones
    async fn genre(&self) -> &Option<String> {
        &self.meta.genre
    }

    /// Images of each source document page, in order
    async fn page_images(&self) -> &Option<IiifImages> {
        &self.meta.page_images
    }

    /// The people involved in producing this document, including the original
    /// author, translators, and annotators
    async fn contributors(&self) -> &Vec<Contributor> {
        &self.meta.contributors
    }

    /// Is this document a reference source (unstructured list of words)?
    /// Otherwise, it is considered a structured document with a translation.
    async fn is_reference(&self) -> bool {
        self.meta.is_reference
    }

    /// The audio recording resource for this entire document
    async fn audio_recording(&self) -> &Option<AudioSlice> {
        // TODO: Allow for multiple audio sources
        &self.meta.audio_recording
    }
    /// Arbitrary number used for manually ordering documents in a collection.
    /// For collections without manual ordering, use zero here.
    async fn order_index(&self) -> i64 {
        self.meta.order_index
    }

    /// URL-ready slug for this document, generated from the title
    async fn slug(&self) -> String {
        self.meta.id.slug()
    }

    /// Segments of the document paired with their respective rough translations
    async fn translated_segments(
        &self,
        context: &async_graphql::Context<'_>,
    ) -> FieldResult<Option<Cow<'_, Vec<TranslatedSection>>>> {
        // We may not have complete data.
        if self.segments.is_some() {
            Ok(self.segments.as_ref().map(|s| Cow::Borrowed(s)))
        } else {
            let db_doc = context
                .data::<DataLoader<Database>>()?
                .load_one(self.meta.id.clone())
                .await?;
            Ok(db_doc.and_then(|d| d.segments).map(Cow::Owned))
        }
    }

    /// All the words contained in this document, dropping structural formatting
    /// like line and page breaks.
    async fn forms(
        &self,
        context: &async_graphql::Context<'_>,
    ) -> FieldResult<Vec<Cow<'_, AnnotatedForm>>> {
        if let Some(segs) = &self.segments {
            Ok(segs
                .iter()
                .flat_map(|s| s.source.forms())
                .map(Cow::Borrowed)
                .collect())
        } else {
            Ok(context
                .data::<Database>()?
                .words_in_document(&self.meta.id)
                .await?
                .into_iter()
                .map(Cow::Owned)
                .collect())
        }
    }

    async fn form_count(&self, context: &async_graphql::Context<'_>) -> FieldResult<i64> {
        Ok(context
            .data::<Database>()?
            .count_words_in_document(&self.meta.id)
            .await? as i64)
    }

    /// All words in the document that have unanalyzed or unfamiliar parts.
    /// These words need to be corrected or reviewed further.
    async fn unresolved_forms(
        &self,
        context: &async_graphql::Context<'_>,
    ) -> FieldResult<Vec<Cow<'_, AnnotatedForm>>> {
        let forms = self.forms(context).await?;
        Ok(forms
            .into_iter()
            .filter(|form| form.is_unresolved())
            .collect())
    }
}

#[derive(async_graphql::Enum, Clone, Copy, PartialEq, Eq)]
pub enum DocumentType {
    Reference,
    Corpus,
}

#[derive(async_graphql::SimpleObject, Serialize, Deserialize, Clone)]
pub struct TranslatedSection {
    /// Translation of this portion of the source text.
    translation: Option<TranslationBlock>,
    /// Source text from the original document.
    source: AnnotatedSeg,
}

// Ideal structure:
// documents: [{ meta, pages: [{ lines: [{ index, words }] }] }]
// Basic to start: [{meta, lines: [{ index, words }]}]

#[derive(Debug, async_graphql::Union, Serialize, Deserialize, Clone)]
#[serde(tag = "type")]
pub enum AnnotatedSeg {
    Block(AnnotatedPhrase),
    Word(AnnotatedForm),
    LineBreak(LineBreak),
    PageBreak(PageBreak),
}
impl AnnotatedSeg {
    pub fn forms(&self) -> Vec<&AnnotatedForm> {
        use AnnotatedSeg::*;
        match self {
            Block(block) => block.parts.iter().flat_map(|s| s.forms()).collect(),
            Word(w) => vec![w],
            LineBreak(_) => Vec::new(),
            PageBreak(_) => Vec::new(),
        }
    }
}

#[derive(Debug, async_graphql::Enum, Clone, Copy, Eq, PartialEq, Serialize, Deserialize)]
pub enum BlockType {
    Block,
    Phrase,
}

#[derive(Debug, async_graphql::SimpleObject, Serialize, Deserialize, Clone)]
pub struct LineBreak {
    pub index: i32,
}

#[derive(Debug, async_graphql::SimpleObject, Serialize, Deserialize, Clone)]
pub struct PageBreak {
    pub index: i32,
}

#[derive(async_graphql::SimpleObject, Debug, Serialize, Deserialize, Clone)]
pub struct AnnotatedPhrase {
    pub ty: BlockType,
    pub index: i32,
    pub parts: Vec<AnnotatedSeg>,
}

/// All the metadata associated with one particular document.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DocumentMetadata {
    /// Official short identifier.
    #[serde(rename = "_id")]
    pub id: DocumentId,
    /// Full title of the document.
    pub title: String,
    /// Further details about this particular document.
    // pub details: String,
    #[serde(default)]
    /// The original source(s) of this document, the most important first.
    pub sources: Vec<SourceAttribution>,
    /// Where the source document came from, maybe the name of a collection.
    pub collection: Option<String>,
    pub genre: Option<String>,
    #[serde(default)]
    /// The people involved in collecting, translating, annotating.
    pub contributors: Vec<Contributor>,
    /// Rough translation of the document, broken down by paragraph.
    #[serde(skip)]
    pub translation: Option<Translation>,
    /// URL for an image of the original physical document.
    #[serde(default)]
    pub page_images: Option<IiifImages>,
    pub date: Option<Date>,
    /// Whether this document is a reference, therefore just a list of forms.
    pub is_reference: bool,
    /// Audio recording of this document, if one exists
    #[serde(default)]
    pub audio_recording: Option<AudioSlice>,
    #[serde(default)]
    /// Arbitrary number used for manually ordering documents in a collection.
    /// For collections without manual ordering, use zero here.
    pub order_index: i64,
}

#[derive(Clone, Eq, PartialEq, Hash, Serialize, Deserialize, Debug, async_graphql::NewType)]
pub struct DocumentId(pub String);

impl DocumentId {
    /// Page slug based on this identifier
    pub fn slug(&self) -> String {
        slug::slugify(&self.0)
    }
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ImageSourceId(pub String);

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ImageSource {
    #[serde(rename = "_id")]
    pub id: ImageSourceId,
    pub url: String,
}
#[async_graphql::Object]
impl ImageSource {
    async fn id(&self) -> &str {
        &self.id.0
    }
    async fn url(&self) -> &str {
        &self.url
    }
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct IiifImages {
    pub source: ImageSourceId,
    pub ids: Vec<String>,
}
impl IiifImages {
    pub fn count(&self) -> usize {
        self.ids.len()
    }
}
#[async_graphql::Object]
impl IiifImages {
    pub async fn source(
        &self,
        context: &async_graphql::Context<'_>,
    ) -> async_graphql::FieldResult<ImageSource> {
        Ok(context
            .data::<Database>()?
            .image_source(&self.source)
            .await?
            .ok_or_else(|| anyhow::format_err!("Image source not found"))?)
    }

    async fn urls(
        &self,
        context: &async_graphql::Context<'_>,
    ) -> async_graphql::FieldResult<Vec<String>> {
        let source = self.source(context).await?;
        Ok(self
            .ids
            .iter()
            .map(|id| format!("{}/{}", source.url, id))
            .collect())
    }
}

#[derive(Clone, Serialize, Deserialize)]
pub struct DocumentCollection {
    pub name: String,
}
#[async_graphql::Object]
impl DocumentCollection {
    /// Full name of this collection
    async fn name(&self) -> &str {
        &self.name
    }

    /// URL-ready slug for this collection, generated from the name
    async fn slug(&self) -> String {
        slug::slugify(&self.name)
    }

    /// All documents that are part of this collection
    async fn documents(
        &self,
        context: &async_graphql::Context<'_>,
    ) -> async_graphql::FieldResult<Vec<AnnotatedDoc>> {
        Ok(context
            .data::<Database>()?
            .all_documents(Some(&*self.name))
            .await?)
    }
}
