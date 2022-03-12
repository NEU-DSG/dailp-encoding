use crate::{
    database_sql, AnnotatedForm, AudioSlice, Contributor, Database, Date, SourceAttribution,
    Translation, TranslationBlock,
};
use async_graphql::{dataloader::DataLoader, FieldResult};
use itertools::Itertools;
use serde::{Deserialize, Serialize};
use std::borrow::Cow;
use uuid::Uuid;

#[derive(Serialize, Deserialize, Clone)]
pub struct AnnotatedDoc {
    #[serde(flatten)]
    pub meta: DocumentMetadata,
    pub segments: Option<Vec<TranslatedPage>>,
}
impl AnnotatedDoc {
    pub fn new(meta: DocumentMetadata, segments: Vec<Vec<Vec<AnnotatedSeg>>>) -> Self {
        // Skip the first block of the translation, since this usually contains
        // the header and information for translators and editors.
        let blocks = &meta
            .translation
            .as_ref()
            .expect(&format!("Missing translation for {}", meta.id.0))
            .paragraphs;

        let mut pages = Vec::new();
        let mut paragraph_index = 0;
        for page in segments {
            let mut paragraphs = Vec::new();
            for paragraph in page {
                if paragraph_index > 0 {
                    let trans = blocks.get(paragraph_index);
                    paragraphs.push(TranslatedSection {
                        translation: trans.map(TranslationBlock::get_text),
                        source: paragraph,
                    });
                }
                paragraph_index += 1;
            }
            pages.push(TranslatedPage { paragraphs });
        }

        Self {
            segments: Some(pages),
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
    async fn sources(&self) -> &[SourceAttribution] {
        &self.meta.sources
    }

    async fn breadcrumbs(
        &self,
        context: &async_graphql::Context<'_>,
        super_collection: String,
    ) -> FieldResult<Vec<DocumentCollection>> {
        Ok(context
            .data::<database_sql::Database>()?
            .document_breadcrumbs(&self.meta.id.0, &super_collection)
            .await?)
    }

    /// Where the source document came from, maybe the name of a collection
    async fn collection(&self) -> Option<DocumentCollection> {
        self.meta
            .collection
            .as_ref()
            .map(|name| DocumentCollection::from_name(name.to_owned()))
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
    async fn translated_pages(
        &self,
        context: &async_graphql::Context<'_>,
    ) -> FieldResult<Option<Vec<DocumentPage>>> {
        Ok(context
            .data::<DataLoader<database_sql::Database>>()?
            .load_one(PagesInDocument(self.meta.id.clone()))
            .await?)
    }

    /// All the words contained in this document, dropping structural formatting
    /// like line and page breaks.
    async fn forms(&self, context: &async_graphql::Context<'_>) -> FieldResult<Vec<AnnotatedForm>> {
        Ok(context
            .data::<database_sql::Database>()?
            .words_in_document(&self.meta.id)
            .await?
            .collect())
    }

    async fn form_count(&self, context: &async_graphql::Context<'_>) -> FieldResult<i64> {
        Ok(context
            .data::<database_sql::Database>()?
            .count_words_in_document(&self.meta.id)
            .await?)
    }

    /// All words in the document that have unanalyzed or unfamiliar parts.
    /// These words need to be corrected or reviewed further.
    async fn unresolved_forms(
        &self,
        context: &async_graphql::Context<'_>,
    ) -> FieldResult<Vec<AnnotatedForm>> {
        let forms = context
            .data::<database_sql::Database>()?
            .words_in_document(&self.meta.id)
            .await?;
        Ok(forms.filter(AnnotatedForm::is_unresolved).collect())
    }
}

#[derive(Clone, Debug, PartialEq, Eq, Hash)]
pub struct PagesInDocument(pub DocumentId);

#[derive(Clone)]
pub struct DocumentPage {
    pub id: Uuid,
    pub page_number: String,
}

#[async_graphql::Object]
impl DocumentPage {
    async fn page_number(&self) -> &str {
        &self.page_number
    }

    async fn paragraphs(
        &self,
        context: &async_graphql::Context<'_>,
    ) -> FieldResult<Vec<DocumentParagraph>> {
        Ok(context
            .data::<DataLoader<database_sql::Database>>()?
            .load_one(ParagraphsInPage(self.id))
            .await?
            .unwrap_or_default())
    }
}

/// Page ID meant for retrieving all paragraphs within.
#[derive(Clone, Debug, PartialEq, Eq, Hash)]
pub struct ParagraphsInPage(pub Uuid);

#[derive(Clone)]
pub struct DocumentParagraph {
    pub id: Uuid,
    pub translation: String,
}

#[async_graphql::Object]
impl DocumentParagraph {
    pub async fn source(
        &self,
        context: &async_graphql::Context<'_>,
    ) -> FieldResult<Vec<AnnotatedSeg>> {
        Ok(context
            .data::<DataLoader<database_sql::Database>>()?
            .load_one(WordsInParagraph(self.id.clone()))
            .await?
            .unwrap_or_default())
    }

    pub async fn translation(&self) -> &str {
        &self.translation
    }
}

#[derive(Clone, Debug, PartialEq, Eq, Hash)]
pub struct WordsInParagraph(pub Uuid);

#[derive(async_graphql::Enum, Clone, Copy, PartialEq, Eq)]
pub enum DocumentType {
    Reference,
    Corpus,
}

#[derive(async_graphql::SimpleObject, Serialize, Deserialize, Clone)]
pub struct TranslatedPage {
    pub paragraphs: Vec<TranslatedSection>,
}

#[derive(async_graphql::SimpleObject, Serialize, Deserialize, Clone)]
pub struct TranslatedSection {
    /// Translation of this portion of the source text.
    pub translation: Option<String>,
    /// Source text from the original document.
    pub source: Vec<AnnotatedSeg>,
}

// Ideal structure:
// documents: [{ meta, pages: [{ lines: [{ index, words }] }] }]
// Basic to start: [{meta, lines: [{ index, words }]}]

#[derive(Debug, async_graphql::Union, Serialize, Deserialize, Clone)]
#[serde(tag = "type")]
pub enum AnnotatedSeg {
    Word(AnnotatedForm),
    LineBreak(LineBreak),
    // PageBreak(PageBreak),
}
impl AnnotatedSeg {
    pub fn form(&self) -> Option<&AnnotatedForm> {
        use AnnotatedSeg::*;
        match self {
            Word(w) => Some(w),
            LineBreak(_) => None,
            // PageBreak(_) => None,
        }
    }
}

#[derive(Debug, async_graphql::SimpleObject, Serialize, Deserialize, Clone)]
pub struct LineBreak {
    pub index: i32,
}

#[derive(Debug, async_graphql::SimpleObject, Serialize, Deserialize, Clone)]
pub struct PageBreak {
    pub index: i32,
}

/// All the metadata associated with one particular document.
/// TODO Make more of these fields on-demand.
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct DocumentMetadata {
    /// Official short identifier.
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

#[derive(
    Clone, Eq, PartialEq, Hash, Serialize, Deserialize, Debug, async_graphql::NewType, sqlx::Type,
)]
#[sqlx(transparent)]
pub struct DocumentId(pub String);

impl DocumentId {
    /// Page slug based on this identifier
    pub fn slug(&self) -> String {
        slug::slugify(&self.0)
    }
}

#[derive(Clone, Debug, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct ImageSourceId(pub Uuid);

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ImageSource {
    pub id: ImageSourceId,
    pub url: String,
}
#[async_graphql::Object]
impl ImageSource {
    // async fn id(&self) -> &str {
    //     &self.id.0
    // }
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
            .data::<DataLoader<database_sql::Database>>()?
            .load_one(self.source.clone())
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
    pub title: String,
    pub slug: String,
}
impl DocumentCollection {
    pub fn from_name(name: String) -> Self {
        Self {
            slug: slug::slugify(&name),
            title: name,
        }
    }
}
#[async_graphql::Object]
impl DocumentCollection {
    /// Full name of this collection
    async fn name(&self) -> &str {
        &self.title
    }

    /// URL-ready slug for this collection, generated from the name
    async fn slug(&self) -> &str {
        &self.slug
    }

    /// All documents that are part of this collection
    /// TODO Try to unify this return type into AnnotatedDoc
    /// This probably requires adding a document_ids field so that we can just
    /// pass that to the dataloader below.
    async fn documents(
        &self,
        context: &async_graphql::Context<'_>,
    ) -> async_graphql::FieldResult<Vec<DocumentReference>> {
        Ok(context
            .data::<crate::database_sql::Database>()?
            .documents_in_collection("", &self.slug)
            .await?)
    }
}

#[derive(Clone, async_graphql::SimpleObject)]
#[graphql(complex)]
pub struct DocumentReference {
    pub id: String,
    pub title: String,
    pub date: Option<Date>,
    pub order_index: i64,
}

#[async_graphql::ComplexObject]
impl DocumentReference {
    pub async fn slug(&self) -> String {
        slug::slugify(&self.id)
    }
}
