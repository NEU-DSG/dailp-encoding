use crate::{AnnotatedForm, Database, DateTime, PersonAssociation, Translation, TranslationBlock};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct AnnotatedDoc {
    #[serde(rename = "_id")]
    pub id: String,
    pub title: String,
    pub date: Option<DateTime>,
    pub publication: Option<String>,
    pub collection: Option<String>,
    pub genre: Option<String>,
    /// The people involved in collecting, translating, annotating.
    #[serde(default)]
    pub people: Vec<PersonAssociation>,
    #[serde(default)]
    pub page_images: Vec<String>,
    pub segments: Option<Vec<TranslatedSection>>,
}
impl AnnotatedDoc {
    pub fn new(meta: DocumentMetadata, segments: Vec<AnnotatedSeg>) -> Self {
        Self {
            id: meta.id,
            title: meta.title,
            date: meta.date.map(|d| DateTime::new(d)),
            publication: meta.publication,
            collection: meta.source,
            genre: meta.genre,
            people: meta.people,
            page_images: meta.page_images,
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
        }
    }
}

#[async_graphql::Object]
impl AnnotatedDoc {
    /// Official short identifier for this document
    async fn id(&self) -> &str {
        &self.id
    }

    /// Full title of the document
    async fn title(&self) -> &str {
        &self.title
    }

    /// Date and time this document was written or created
    async fn date(&self) -> &Option<DateTime> {
        &self.date
    }

    /// The publication that included this document
    async fn publication(&self) -> &Option<String> {
        &self.publication
    }

    /// Where the source document came from, maybe the name of a collection
    async fn collection(&self) -> &Option<String> {
        &self.collection
    }

    /// The genre of the document, used to group similar ones
    async fn genre(&self) -> &Option<String> {
        &self.genre
    }

    /// Images of each source document page, in order
    async fn page_images(&self) -> &Vec<String> {
        &self.page_images
    }

    /// The people involved in producing this document, including the original
    /// author, translators, and annotators
    async fn people(&self) -> &Vec<PersonAssociation> {
        &self.people
    }

    /// Segments of the document paired with their respective rough translations
    async fn translated_segments(
        &self,
        context: &async_graphql::Context<'_>,
    ) -> Option<Vec<TranslatedSection>> {
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
    async fn words(&self) -> Option<Vec<&AnnotatedForm>> {
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

#[async_graphql::SimpleObject]
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

#[async_graphql::Union]
#[derive(Serialize, Deserialize, Clone)]
#[serde(tag = "type")]
pub enum AnnotatedSeg {
    Block(AnnotatedPhrase),
    Word(AnnotatedForm),
    LineBreak(LineBreak),
    PageBreak(PageBreak),
}
impl AnnotatedSeg {
    pub fn words(&self) -> Vec<&AnnotatedForm> {
        use AnnotatedSeg::*;
        match self {
            Block(block) => block.parts.iter().flat_map(|s| s.words()).collect(),
            Word(w) => vec![w],
            LineBreak(_) => Vec::new(),
            PageBreak(_) => Vec::new(),
        }
    }
}

#[async_graphql::Enum]
#[derive(Serialize, Deserialize)]
pub enum BlockType {
    Block,
    Phrase,
}

#[async_graphql::SimpleObject]
#[derive(Serialize, Deserialize, Clone)]
pub struct LineBreak {
    pub index: i32,
}

#[async_graphql::SimpleObject]
#[derive(Serialize, Deserialize, Clone)]
pub struct PageBreak {
    pub index: i32,
}

#[async_graphql::SimpleObject]
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
    pub genre: Option<String>,
    /// The people involved in collecting, translating, annotating.
    pub people: Vec<PersonAssociation>,
    /// Rough translation of the document, broken down by paragraph.
    pub translation: Translation,
    /// URL for an image of the original physical document.
    pub page_images: Vec<String>,
    pub date: Option<chrono::DateTime<chrono::Utc>>,
}
