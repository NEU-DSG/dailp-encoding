use crate::{AnnotatedDoc, Database, DateTime, MorphemeSegment, PositionInDocument};
use async_graphql::FieldResult;
use serde::{Deserialize, Serialize};

/// A single word in an annotated document.
/// One word contains several layers of interpretation, including the original
/// source text, multiple layers of linguistic annotation, and annotator notes.
#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct AnnotatedForm {
    pub source: String,
    /// A normalized version of the word.
    pub normalized_source: Option<String>,
    pub simple_phonetics: Option<String>,
    pub phonemic: Option<String>,
    pub segments: Option<Vec<MorphemeSegment>>,
    #[serde(default)]
    pub english_gloss: Vec<String>,
    pub commentary: Option<String>,
    /// The character index of a mid-word line break, if there is one.
    pub line_break: Option<i32>,
    /// The character index of a mid-word page break, if there is one.
    pub page_break: Option<i32>,
    pub position: Option<PositionInDocument>,
    pub date_recorded: Option<DateTime>,
}

#[async_graphql::SimpleObject]
#[derive(Serialize, Deserialize)]
pub struct UniqueAnnotatedForm {
    #[serde(rename = "_id")]
    pub id: String,
    #[serde(flatten)]
    pub form: AnnotatedForm,
}

impl AnnotatedForm {
    pub fn find_root(&self) -> Option<&MorphemeSegment> {
        self.segments.as_ref().and_then(|segments| {
            segments
                .iter()
                .find(|seg| seg.gloss.contains(|c: char| c.is_lowercase()))
        })
    }
}

#[async_graphql::Object]
impl AnnotatedForm {
    /// The root morpheme of the word.
    /// For example, a verb form glossed as "he catches" might have a root morpheme
    /// corresponding to "catch."
    async fn root(&self) -> Option<&MorphemeSegment> {
        self.find_root()
    }

    /// All other observed words with the same root morpheme as this word.
    async fn similar_forms(
        &self,
        context: &async_graphql::Context<'_>,
    ) -> FieldResult<Vec<AnnotatedForm>> {
        if let Some(root) = self.find_root() {
            let db = context.data::<Database>()?;
            // Find the forms with the exact same root.
            let similar_roots = db.morphemes(&root.gloss);
            // Find forms with directly linked roots.
            let connected = db.connected_forms(&root.gloss);
            let (connected, similar_roots) = futures::join!(connected, similar_roots);
            Ok(similar_roots?
                .into_iter()
                .flat_map(|r| r.forms)
                .chain(connected?)
                // Only return other similar words.
                .filter(|word| {
                    if let (Some(a), Some(b)) = (&word.position, &self.position) {
                        a != b || word.source != self.source
                    } else {
                        true
                    }
                })
                .collect())
        } else {
            Ok(Vec::new())
        }
    }

    /// The document that contains this word.
    async fn document(
        &self,
        context: &async_graphql::Context<'_>,
    ) -> FieldResult<Option<AnnotatedDoc>> {
        Ok(if let Some(pos) = self.position.as_ref() {
            context
                .data::<Database>()?
                .document(&pos.document_id)
                .await?
        } else {
            None
        })
    }

    /// Position of this word in its containing document.
    async fn index(&self) -> i32 {
        self.position.as_ref().map(|p| p.index).unwrap_or(0)
    }
    /// The unique identifier of the containing document.
    async fn document_id(&self) -> Option<&str> {
        self.position.as_ref().map(|p| &*p.document_id)
    }

    async fn position(&self) -> &Option<PositionInDocument> {
        &self.position
    }

    /// Original source text.
    async fn source(&self) -> &str {
        &self.source
    }
    /// Normalized source text
    async fn normalized_source(&self) -> &Option<String> {
        &self.normalized_source
    }
    /// Romanized version of the word for simple phonetic pronunciation.
    async fn simple_phonetics(&self) -> &Option<String> {
        &self.simple_phonetics
    }
    /// Underlying phonemic representation of this word.
    async fn phonemic(&self) -> &Option<String> {
        &self.phonemic
    }
    /// Morphemic segmentation of the form that includes a phonemic
    /// representation and gloss for each.
    async fn segments(&self) -> &Option<Vec<MorphemeSegment>> {
        &self.segments
    }
    /// English gloss for the whole word.
    async fn english_gloss(&self) -> &Vec<String> {
        &self.english_gloss
    }
    /// Further details about the annotation layers, including uncertainty.
    async fn commentary(&self) -> &Option<String> {
        &self.commentary
    }
    /// The date and time this form was recorded
    async fn date_recorded(&self) -> &Option<DateTime> {
        &self.date_recorded
    }
}
