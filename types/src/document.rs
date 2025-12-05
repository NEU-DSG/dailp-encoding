use crate::doc_metadata::{
    ApprovalStatus, Format, FormatUpdate, Keyword, KeywordUpdate, Language, LanguageUpdate,
    SpatialCoverage, SpatialCoverageUpdate, SubjectHeading, SubjectHeadingUpdate,
};
use crate::person::{Contributor, ContributorRole, Creator, CreatorUpdate, SourceAttribution};
use crate::{
    auth::UserInfo, comment::Comment, date::DateInput, slugify, AnnotatedForm, AudioSlice,
    Database, Date, Translation, TranslationBlock,
};

use async_graphql::{dataloader::DataLoader, Context, FieldResult, MaybeUndefined};
use itertools::Itertools;
use serde::{Deserialize, Serialize};
use sqlx::{query_file, query_file_as, PgPool, Row};

use futures::TryStreamExt;
use tokio::fs::read_to_string;
use uuid::Uuid;

/// A document with associated metadata and content broken down into pages and further into
/// paragraphs with an English translation. Also supports each word being broken down into
/// component parts and having associated notes.
#[derive(Serialize, Deserialize, Clone)]
pub struct AnnotatedDoc {
    /// All non-content metadata about this document
    #[serde(flatten)]
    pub meta: DocumentMetadata,
    /// The meat of the document, all the pages which contain its contents.
    pub segments: Option<Vec<TranslatedPage>>,
}

impl AnnotatedDoc {
    /// Build a document from its metadata and raw contents.
    pub fn new(meta: DocumentMetadata, segments: Vec<Vec<Vec<AnnotatedSeg>>>) -> Self {
        // Skip the first block of the translation, since this usually contains
        // the header and information for translators and editors.
        println!(
            "Translation {}present",
            if meta.translation.is_some() {
                ""
            } else {
                "not "
            }
        );
        let blocks = if meta.translation.is_some() {
            &meta.translation.as_ref().unwrap().paragraphs
        } else {
            &Vec::<TranslationBlock>::new()
        };

        let mut pages = Vec::new();
        let mut paragraph_index = 0;
        for page in segments {
            let mut paragraphs = Vec::new();
            for paragraph in page {
                if blocks.is_empty() {
                    paragraphs.push(TranslatedSection {
                        translation: None,
                        source: paragraph,
                    });
                } else if paragraph_index > 0 {
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
    async fn id(&self) -> DocumentId {
        self.meta.id
    }

    /// Full title of the document
    async fn title(&self) -> &str {
        &self.meta.title
    }

    /// Date and time this document was written or created
    async fn date(&self) -> &Option<Date> {
        &self.meta.date
    }

    /// When the document was bookmarked by the current user, if it was.
    async fn bookmarked_on(
        &self,
        context: &async_graphql::Context<'_>,
    ) -> FieldResult<Option<Date>> {
        if let Some(user) = context.data_opt::<UserInfo>() {
            Ok(context
                .data::<DataLoader<Database>>()?
                .loader()
                .get_document_bookmarked_on(&self.meta.id.0, &user.id)
                .await?)
        } else {
            Ok(None)
        }
    }

    /// The original source(s) of this document, the most important first.
    async fn sources(&self) -> &[SourceAttribution] {
        &self.meta.sources
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
    async fn contributors(
        &self,
        context: &async_graphql::Context<'_>,
    ) -> FieldResult<Vec<Contributor>> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .load_one(crate::ContributorsForDocument(self.meta.id.0))
            .await?
            .unwrap_or_default())
    }

    /// Is this document a reference source (unstructured list of words)?
    /// Otherwise, it is considered a structured document with a translation.
    async fn is_reference(&self) -> bool {
        self.meta.is_reference
    }

    /// Arbitrary number used for manually ordering documents in a collection.
    /// For collections without manual ordering, use zero here.
    async fn order_index(&self) -> i64 {
        self.meta.order_index
    }

    /// URL-ready slug for this document, generated from the title
    async fn slug(&self) -> String {
        slug::slugify(&self.meta.short_name)
    }

    /// Segments of the document paired with their respective rough translations
    async fn translated_pages(
        &self,
        context: &async_graphql::Context<'_>,
    ) -> FieldResult<Option<Vec<DocumentPage>>> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .load_one(PagesInDocument(self.meta.id.0))
            .await?)
    }

    /// All the words contained in this document, dropping structural formatting
    /// like line and page breaks.
    async fn forms(
        &self,
        context: &async_graphql::Context<'_>,
        start: Option<i64>,
        end: Option<i64>,
    ) -> FieldResult<Vec<AnnotatedForm>> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .loader()
            .words_in_document(self.meta.id, start, end)
            .await?
            .collect())
    }

    async fn form_count(&self, context: &async_graphql::Context<'_>) -> FieldResult<i64> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .loader()
            .count_words_in_document(self.meta.id)
            .await?)
    }

    /// All words in the document that have unanalyzed or unfamiliar parts.
    /// These words need to be corrected or reviewed further.
    async fn unresolved_forms(
        &self,
        context: &async_graphql::Context<'_>,
    ) -> FieldResult<Vec<AnnotatedForm>> {
        let forms = context
            .data::<DataLoader<Database>>()?
            .loader()
            .words_in_document(self.meta.id, None, None)
            .await?;
        Ok(forms.filter(AnnotatedForm::is_unresolved).collect())
    }

    /// Collection chapters that contain this document.
    async fn chapters(
        &self,
        context: &async_graphql::Context<'_>,
    ) -> FieldResult<Option<Vec<crate::CollectionChapter>>> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .loader()
            .chapters_by_document(self.meta.short_name.clone())
            .await?)
    }

    /// The format of the original artifact
    async fn format(&self, context: &async_graphql::Context<'_>) -> FieldResult<Format> {
        let db = context.data::<Database>()?;
        let format = db.format_for_document(self.meta.id.0).await?;
        Ok(format)
    }

    /// Key terms associated with a document
    async fn keywords(&self, context: &async_graphql::Context<'_>) -> FieldResult<Vec<Keyword>> {
        let db = context.data::<Database>()?;
        let headings = db.keywords_for_document(self.meta.id.0).await?;
        Ok(headings)
    }
    /// The languages present in this document
    async fn languages(&self, context: &async_graphql::Context<'_>) -> FieldResult<Vec<Language>> {
        let db = context.data::<Database>()?;
        let languages = db.languages_for_document(self.meta.id.0).await?;
        Ok(languages)
    }
    /// Terms that that reflects Indigenous knowledge practices associated with a document
    async fn subject_headings(
        &self,
        context: &async_graphql::Context<'_>,
    ) -> FieldResult<Vec<SubjectHeading>> {
        let db = context.data::<Database>()?;
        let headings = db.subject_headings_for_document(self.meta.id.0).await?;
        Ok(headings)
    }

    /// The locations associated with this document
    async fn spatial_coverage(
        &self,
        context: &async_graphql::Context<'_>,
    ) -> FieldResult<Vec<SpatialCoverage>> {
        let db = context.data::<Database>()?;
        let coverages = db.spatial_coverage_for_document(self.meta.id.0).await?;
        Ok(coverages)
    }

    /// Creators of this document
    async fn creators(&self, context: &async_graphql::Context<'_>) -> FieldResult<Vec<Creator>> {
        let db = context.data::<Database>()?;
        let creators = db.creators_for_document(self.meta.id.0).await?;
        Ok(creators)
    }
    /// The audio for this document that was ingested from GoogleSheets, if there is any.
    async fn ingested_audio_track(&self) -> FieldResult<Option<AudioSlice>> {
        Ok(self.meta.audio_recording.to_owned())
    }

    /// A slices of audio associated with this word in the context of a document.
    /// This audio has been selected by an editor from contributions, or is the
    /// same as the ingested audio track, if one is available.
    async fn edited_audio(
        &self,
        context: &async_graphql::Context<'_>,
    ) -> FieldResult<Vec<AudioSlice>> {
        let mut all_audio = self.user_contributed_audio(context).await?;
        // add ingested audio track as first element if it should be shown
        if let Some(ingested_audio_track) = self.meta.audio_recording.to_owned() {
            all_audio.insert(0, ingested_audio_track);
        }
        return Ok(all_audio
            .into_iter()
            .filter(|audio| audio.include_in_edited_collection)
            .collect_vec());
    }

    /// Audio for this word that has been recorded by community members. Will be
    /// empty if user does not have access to uncurated contributions.
    /// TODO! User guard for contributors only
    async fn user_contributed_audio(
        &self,
        context: &async_graphql::Context<'_>,
    ) -> FieldResult<Vec<AudioSlice>> {
        let db = context.data::<DataLoader<Database>>()?.loader();
        Ok(db.document_contributor_audio(&self.meta.id.0).await?)
    }
}

/// Key to retrieve the pages of a document given a document ID
#[derive(Clone, Debug, PartialEq, Eq, Hash)]
pub struct PagesInDocument(pub Uuid);

/// One page of an [`AnnotatedDoc`]
#[derive(Clone)]
pub struct DocumentPage {
    /// Database ID
    pub id: Uuid,
    /// One-indexed page number
    pub page_number: String,
    /// Resource of the image of this page
    pub image: Option<PageImage>,
}

#[async_graphql::Object]
impl DocumentPage {
    /// One-indexed page number
    async fn page_number(&self) -> &str {
        &self.page_number
    }

    /// Scan of this page as a IIIF resource, if there is one
    async fn image(&self) -> &Option<PageImage> {
        &self.image
    }

    /// Contents of this page as a list of paragraphs
    async fn paragraphs(
        &self,
        context: &async_graphql::Context<'_>,
    ) -> FieldResult<Vec<DocumentParagraph>> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .load_one(ParagraphsInPage(self.id))
            .await?
            .unwrap_or_default())
    }
}

/// Page ID meant for retrieving all paragraphs within.
#[derive(Clone, Debug, PartialEq, Eq, Hash)]
pub struct ParagraphsInPage(pub Uuid);

/// One paragraph within a [`DocumentPage`]
#[derive(async_graphql::SimpleObject, Clone)]
#[graphql(complex)]
pub struct DocumentParagraph {
    /// Unique identifier for this paragraph
    pub id: Uuid,
    /// English translation of the whole paragraph
    pub translation: String,
    /// 1-indexed position of this paragraph in a document
    pub index: i64,
}

/// A paragraph in an annotated document that can be edited.
#[derive(async_graphql::InputObject)]
pub struct ParagraphUpdate {
    /// Unique identifier of the form
    pub id: Uuid,
    /// English translation of the paragraph
    pub translation: MaybeUndefined<String>,
}

/// Update the contributor attribution for a document
#[derive(async_graphql::InputObject)]
pub struct UpdateContributorAttribution {
    /// The document to perfom this operation on
    pub document_id: Uuid,
    /// The UUID associated with the contributor being added or changed
    pub contributor_id: Uuid,
    /// A description of what the contributor did, like "translation" or "voice"
    pub contribution_role: String,
}

/// Delete a contributor attribution for a document based on the two ids
#[derive(async_graphql::InputObject)]
pub struct DeleteContributorAttribution {
    /// The document to perform this operation on
    pub document_id: Uuid,
    /// The UUID of the contributor to remove from this document's attributions
    pub contributor_id: Uuid,
}

/// Used for updating document metadata.
/// All fields except id are optional.
#[derive(async_graphql::InputObject)]
pub struct DocumentMetadataUpdate {
    /// The ID of the document to update
    pub id: Uuid,
    /// An updated title for this document, or nothing (if title is unchanged)
    pub title: MaybeUndefined<String>,
    /// The date this document was written, or nothing (if unchanged or not applicable)
    pub written_at: MaybeUndefined<DateInput>,
    /// The key terms associated with the document
    pub keywords: MaybeUndefined<Vec<KeywordUpdate>>,
    /// The languages present in the document
    pub languages: MaybeUndefined<Vec<LanguageUpdate>>,
    /// Terms that reflect Indigenous knowledge practices associated with the document
    pub subject_headings: MaybeUndefined<Vec<SubjectHeadingUpdate>>,
    /// The editors, translators, etc. of the document
    pub contributors: MaybeUndefined<Vec<Uuid>>,
    /// The physical locations associated with a document (e.g. where it was written, found)
    pub spatial_coverage: MaybeUndefined<Vec<SpatialCoverageUpdate>>,
    /// The creator(s) of the document
    pub creators: MaybeUndefined<Vec<CreatorUpdate>>,
    /// The format of the original artifact
    pub format: MaybeUndefined<FormatUpdate>,
}

#[async_graphql::ComplexObject]
impl DocumentParagraph {
    /// Source text of the paragraph broken down into words
    async fn source(&self, context: &async_graphql::Context<'_>) -> FieldResult<Vec<AnnotatedSeg>> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .load_one(WordsInParagraph(self.id))
            .await?
            .unwrap_or_default())
    }

    /// Get comments on this paragraph
    async fn comments(&self, context: &async_graphql::Context<'_>) -> FieldResult<Vec<Comment>> {
        let db = context.data::<DataLoader<Database>>()?.loader();
        Ok(db
            .comments_by_parent(&self.id, &crate::comment::CommentParentType::Paragraph)
            .await?)
    }
}

/// Key to query the words within a paragraph given its database ID
#[derive(Clone, Debug, PartialEq, Eq, Hash)]
pub struct WordsInParagraph(pub Uuid);

/// The kind of a document in terms of what body it lives within. A reference
/// document is a dictionary or grammar for example, while a corpus document
/// might be a letter, journal, or notice.
#[derive(async_graphql::Enum, Clone, Copy, PartialEq, Eq)]
pub enum DocumentType {
    /// Reference document, like a dictionary or grammar
    Reference,
    /// Corpus text: a letter, journal, book, story, meeting minutes, etc.
    Corpus,
}

/// One page of a document containing one or more paragraphs
#[derive(async_graphql::SimpleObject, Serialize, Deserialize, Clone)]
pub struct TranslatedPage {
    /// The paragraphs of content that make up this single page
    pub paragraphs: Vec<TranslatedSection>,
}

/// A single document image from a IIIF source
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct PageImage {
    /// Database ID of the image source
    pub source_id: ImageSourceId,
    /// Remote IIIF OID of the image
    pub oid: String,
}

#[async_graphql::Object]
impl PageImage {
    /// The IIIF source this page image comes from
    pub async fn source(
        &self,
        context: &async_graphql::Context<'_>,
    ) -> async_graphql::FieldResult<ImageSource> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .load_one(self.source_id.clone())
            .await?
            .ok_or_else(|| anyhow::format_err!("Image source not found"))?)
    }

    /// The full IIIF url for this image resource
    pub async fn url(
        &self,
        context: &async_graphql::Context<'_>,
    ) -> async_graphql::FieldResult<String> {
        let source = self.source(context).await?;
        Ok(format!("{}/{}", source.url, self.oid))
    }
}

/// One paragraph within a document with source text and overall English translation.
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

/// Element within a spreadsheet before being transformed into a full document.
#[derive(Debug, async_graphql::Union, Serialize, Deserialize, Clone)]
#[serde(tag = "type")]
pub enum AnnotatedSeg {
    /// A single annotated word
    Word(AnnotatedForm),
    /// The beginning of a new line
    LineBreak(LineBreak),
    // PageBreak(PageBreak),
}
impl AnnotatedSeg {
    /// If this segment is a word, return the inner [`AnnotatedForm`] otherwise `None`.
    pub fn form(&self) -> Option<&AnnotatedForm> {
        use AnnotatedSeg::*;
        match self {
            Word(w) => Some(w),
            LineBreak(_) => None,
            // PageBreak(_) => None,
        }
    }
}

/// Start of a new line
#[derive(Debug, async_graphql::SimpleObject, Serialize, Deserialize, Clone)]
pub struct LineBreak {
    /// Index of this line break within the document. i.e. Indicates the start
    /// of line X.
    pub index: i32,
}

/// Start of a new page
#[derive(Debug, async_graphql::SimpleObject, Serialize, Deserialize, Clone)]
pub struct PageBreak {
    /// Index of this page break within the document. i.e. Indicates the start
    /// of page X.
    pub index: i32,
}

/// All the metadata associated with one particular document.
/// TODO Make more of these fields on-demand.
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct DocumentMetadata {
    /// Database ID
    pub id: DocumentId,
    /// Official short identifier.
    pub short_name: String,
    /// Full title of the document.
    pub title: String,
    /// Further details about this particular document.
    // pub details: String,
    #[serde(default)]
    /// The original source(s) of this document, the most important first.
    pub sources: Vec<SourceAttribution>,
    /// Where the source document came from, maybe the name of a collection.
    pub collection: Option<String>,
    /// The genre this document is. TODO Evaluate whether we need this.
    pub genre: Option<String>,
    /// Term that allows us to trace what the original artifact was
    pub format_id: Option<Uuid>,
    #[serde(default)]
    /// Terms that reflect Indigenous knowledge practices associated with the document
    pub subject_headings_ids: Option<Vec<Uuid>>,
    /// The languages present in the document
    pub languages_ids: Option<Vec<Uuid>>,
    /// The key terms associated with the document
    pub keywords_ids: Option<Vec<Uuid>>,
    /// The creator(s) of the document
    pub creators_ids: Option<Vec<Uuid>>,
    /// The people involved in collecting, translating, annotating.
    pub contributors: Option<Vec<Contributor>>,
    /// The physical locations associated with a document (e.g. where it was written, found)
    pub spatial_coverage_ids: Option<Vec<Uuid>>,
    /// Rough translation of the document, broken down by paragraph.
    #[serde(skip)]
    pub translation: Option<Translation>,
    /// URL for an image of the original physical document.
    #[serde(default)]
    pub page_images: Option<IiifImages>,
    /// The date this document was produced (or `None` if unknown)
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

#[async_graphql::Object]
impl DocumentMetadata {
    /// Fetch all keywords linked to this document
    async fn keywords<'a>(
        &'a self,
        ctx: &Context<'a>,
    ) -> Result<Vec<Keyword>, async_graphql::Error> {
        let pool = ctx.data::<PgPool>()?;
        let rows = query_file_as!(
            Keyword,
            "queries/get_keywords_by_document_id.sql",
            self.id.0
        )
        .fetch_all(pool)
        .await?;

        Ok(rows
            .into_iter()
            .map(|row| Keyword {
                id: row.id,
                name: row.name,
                status: row.status,
            })
            .collect())
    }
    /// Fetch all languages linked to this document
    async fn languages<'a>(
        &'a self,
        ctx: &Context<'a>,
    ) -> Result<Vec<Language>, async_graphql::Error> {
        let pool = ctx.data::<PgPool>()?;
        let rows = query_file_as!(
            Language,
            "queries/get_languages_by_document_id.sql",
            self.id.0
        )
        .fetch_all(pool)
        .await?;

        Ok(rows
            .into_iter()
            .map(|row| Language {
                id: row.id,
                name: row.name,
                status: row.status,
            })
            .collect())
    }
    /// Fetch all subject headings linked to this document
    async fn subject_headings<'a>(
        &'a self,
        ctx: &Context<'a>,
    ) -> Result<Vec<SubjectHeading>, async_graphql::Error> {
        let pool = ctx.data::<PgPool>()?;
        let rows = query_file_as!(
            SubjectHeading,
            "queries/get_subject_headings_by_document_id.sql",
            self.id.0
        )
        .fetch_all(pool)
        .await?;

        Ok(rows
            .into_iter()
            .map(|row| SubjectHeading {
                id: row.id,
                name: row.name,
                status: row.status,
            })
            .collect())
    }

    async fn contributors<'a>(
        &'a self,
        ctx: &Context<'a>,
    ) -> Result<Vec<Contributor>, async_graphql::Error> {
        let pool = ctx.data::<PgPool>()?;

        // Load SQL from file
        let sql = read_to_string("queries/get_contributors_by_document_id.sql")
            .await
            .map_err(|e| async_graphql::Error::new(e.to_string()))?;

        let mut rows = sqlx::query(&sql).bind(self.id.0).fetch(pool);

        let mut contributors = Vec::new();

        while let Some(row) = rows
            .try_next()
            .await
            .map_err(|e| async_graphql::Error::new(e.to_string()))?
        {
            let id: uuid::Uuid = row
                .try_get("id")
                .map_err(|e| async_graphql::Error::new(e.to_string()))?;
            let name: String = row
                .try_get("name")
                .map_err(|e| async_graphql::Error::new(e.to_string()))?;
            let role_str: Option<String> = row
                .try_get("role")
                .map_err(|e| async_graphql::Error::new(e.to_string()))?;

            let role = role_str.and_then(|s| Some(ContributorRole::from(s)));

            contributors.push(Contributor { id, name, role });
        }

        Ok(contributors)
    }

    /// Fetch all spatial coverages linked to this document
    async fn spatial_coverage<'a>(
        &'a self,
        ctx: &Context<'a>,
    ) -> Result<Vec<SpatialCoverage>, async_graphql::Error> {
        let pool = ctx.data::<PgPool>()?;
        let rows = query_file_as!(
            SpatialCoverage,
            "queries/get_spatial_coverage_by_document_id.sql",
            self.id.0
        )
        .fetch_all(pool)
        .await?;

        Ok(rows
            .into_iter()
            .map(|row| SpatialCoverage {
                id: row.id,
                name: row.name,
                status: row.status,
            })
            .collect())
    }
    /// Fetch all creators linked to this document
    async fn creators<'a>(
        &'a self,
        ctx: &Context<'a>,
    ) -> Result<Vec<Creator>, async_graphql::Error> {
        let pool = ctx.data::<PgPool>()?;
        let rows = query_file_as!(
            Creator,
            "queries/get_creators_by_document_id.sql",
            self.id.0
        )
        .fetch_all(pool)
        .await?;

        Ok(rows
            .into_iter()
            .map(|row| Creator {
                id: row.id,
                name: row.name,
            })
            .collect())
    }
    async fn format(&self, ctx: &Context<'_>) -> Result<Option<Format>, async_graphql::Error> {
        let format_id = match self.format_id {
            Some(id) => id,
            None => return Ok(None),
        };
        let pool = ctx.data::<PgPool>()?;
        let row = query_file_as!(Format, "queries/get_format_by_document_id.sql", format_id)
            .fetch_optional(pool)
            .await?;
        Ok(row)
    }
}

/// Database ID for one document
#[derive(
    Clone, Copy, Eq, PartialEq, Hash, Serialize, Deserialize, Debug, async_graphql::NewType, Default,
)]
pub struct DocumentId(pub Uuid);

/// Database ID for an image source
#[derive(Clone, Debug, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct ImageSourceId(pub Uuid);

/// A IIIF server we use as an image source
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ImageSource {
    /// Database ID for this source
    pub id: ImageSourceId,
    /// Base URL for the IIIF server
    pub url: String,
}

#[async_graphql::Object]
impl ImageSource {
    /// Base URL for the IIIF server
    async fn url(&self) -> &str {
        &self.url
    }
}

/// Collection of images coming from a IIIF source. Generally used to represent
/// the scans of multi-page manuscripts sourced from libraries/archives.
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct IiifImages {
    /// Database ID for the image source
    pub source: ImageSourceId,
    /// Remote IIIF OIDs for the images
    pub ids: Vec<String>,
}
impl IiifImages {
    /// Number of images in this collection
    pub fn count(&self) -> usize {
        self.ids.len()
    }
}
#[async_graphql::Object]
impl IiifImages {
    /// Information about the data source for this set of images
    pub async fn source(
        &self,
        context: &async_graphql::Context<'_>,
    ) -> async_graphql::FieldResult<ImageSource> {
        Ok(context
            .data::<DataLoader<Database>>()?
            .load_one(self.source.clone())
            .await?
            .ok_or_else(|| anyhow::format_err!("Image source not found"))?)
    }

    /// List of urls for all the images in this collection
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

/// Reference to a document collection
#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct DocumentCollection {
    /// General title of the collection
    pub title: String,
    /// Unique slug used to generate URL paths
    pub slug: String,
    /// Optional database ID for the collection
    pub id: Option<Uuid>,
}

impl DocumentCollection {
    /// Create a collection reference using the given title and generating a
    /// slug from it.
    pub fn from_name(name: String) -> Self {
        Self {
            slug: slug::slugify(&name),
            title: name,
            id: None,
        }
    }
}
#[async_graphql::Object]
impl DocumentCollection {
    /// Full name of this collection
    async fn name(&self) -> &str {
        &self.title
    }

    /// Database ID for this collection
    async fn id(&self) -> Option<Uuid> {
        self.id
    }

    /// URL-ready slug for this collection, generated from the name
    async fn slug(&self) -> String {
        slugify(&self.slug)
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
            .data::<DataLoader<Database>>()?
            .loader()
            .documents_in_collection("", &self.slug)
            .await?)
    }
}

/// Reference to a document with a limited subset of fields, namely no contents
/// of the document.
#[derive(Clone, async_graphql::SimpleObject)]
#[graphql(complex)]
pub struct DocumentReference {
    /// Database ID for the document
    pub id: Uuid,
    /// Unique short name
    pub short_name: String,
    /// Long title of the document
    pub title: String,
    /// Date the document was produced (or `None` if unknown)
    pub date: Option<Date>,
    /// Index of the document within its group, used purely for ordering
    pub order_index: i64,
}

#[async_graphql::ComplexObject]
impl DocumentReference {
    /// URL slug for this document
    pub async fn slug(&self) -> String {
        slug::slugify(&self.short_name)
    }
}
