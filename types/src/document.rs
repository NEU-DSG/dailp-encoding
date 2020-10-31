use crate::{AnnotatedForm, Database, DateTime, PersonAssociation, Translation, TranslationBlock};
use async_graphql::FieldResult;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct AnnotatedDoc {
    #[serde(flatten)]
    pub meta: DocumentMetadata,
    pub segments: Option<Vec<TranslatedSection>>,
}
impl AnnotatedDoc {
    pub fn new(meta: DocumentMetadata, segments: Vec<AnnotatedSeg>) -> Self {
        Self {
            segments: Some(
                segments
                    .into_iter()
                    .zip(&meta.translation.blocks)
                    .map(|(seg, trans)| TranslatedSection {
                        translation: trans.clone(),
                        source: seg,
                    })
                    .collect(),
            ),
            meta,
        }
    }
}

#[async_graphql::Object]
impl AnnotatedDoc {
    /// Official short identifier for this document
    async fn id(&self) -> &str {
        &self.meta.id
    }

    /// Full title of the document
    async fn title(&self) -> &str {
        &self.meta.title
    }

    /// Date and time this document was written or created
    async fn date(&self) -> &Option<DateTime> {
        &self.meta.date
    }

    /// The publication that included this document
    async fn publication(&self) -> &Option<String> {
        &self.meta.publication
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
    async fn page_images(&self) -> &Vec<String> {
        &self.meta.page_images
    }

    /// The people involved in producing this document, including the original
    /// author, translators, and annotators
    async fn people(&self) -> &Vec<PersonAssociation> {
        &self.meta.people
    }

    /// URL-ready slug for this document, generated from the title
    async fn slug(&self) -> String {
        slug::slugify(&self.meta.id)
    }

    /// Segments of the document paired with their respective rough translations
    async fn translated_segments(
        &self,
        context: &async_graphql::Context<'_>,
    ) -> FieldResult<Option<Vec<TranslatedSection>>> {
        // We may not have complete data.
        if self.segments.is_some() {
            Ok(self.segments.clone())
        } else {
            let db_doc = context.data::<Database>()?.document(&self.meta.id).await?;
            Ok(db_doc.and_then(|d| d.segments))
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
    #[serde(rename = "_id")]
    pub id: String,
    /// Full title of the document.
    pub title: String,
    /// The publication that included this document.
    pub publication: Option<String>,
    /// Where the source document came from, maybe the name of a collection.
    pub collection: Option<String>,
    pub genre: Option<String>,
    /// The people involved in collecting, translating, annotating.
    #[serde(default)]
    pub people: Vec<PersonAssociation>,
    /// Rough translation of the document, broken down by paragraph.
    #[serde(skip)]
    pub translation: Translation,
    /// URL for an image of the original physical document.
    #[serde(default)]
    pub page_images: Vec<String>,
    pub date: Option<DateTime>,
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
            .all_documents(Some(self.name.clone()))
            .await?)
    }
}
