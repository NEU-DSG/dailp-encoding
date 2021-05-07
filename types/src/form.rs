use crate::{AnnotatedDoc, Database, Date, MorphemeId, MorphemeSegment, PositionInDocument};
use async_graphql::{dataloader::DataLoader, FieldResult};
use serde::{Deserialize, Serialize};

/// A single word in an annotated document.
/// One word contains several layers of interpretation, including the original
/// source text, multiple layers of linguistic annotation, and annotator notes.
#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct AnnotatedForm {
    #[serde(rename = "_id")]
    pub id: String,
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
    pub position: PositionInDocument,
    pub date_recorded: Option<Date>,
}

impl AnnotatedForm {
    pub fn find_root(&self) -> Option<&MorphemeSegment> {
        self.segments
            .as_ref()
            .and_then(|segments| segments.iter().find(|seg| is_root_morpheme(&seg.gloss)))
    }

    pub fn find_morpheme(&self, gloss: &str) -> Option<&MorphemeSegment> {
        self.segments
            .as_ref()
            .and_then(|segments| segments.iter().find(|seg| seg.gloss == gloss))
    }

    pub fn is_unresolved(&self) -> bool {
        if let Some(segments) = &self.segments {
            segments
                .iter()
                .any(|segment| segment.morpheme.contains('?') || segment.gloss.contains('?'))
        } else {
            self.source.contains('?')
        }
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
            let id = MorphemeId {
                document_id: Some(self.position.document_id.0.clone()),
                gloss: root.gloss.clone(),
                index: None,
            };
            let similar_roots = db.morphemes(&id, None);
            // Find forms with directly linked roots.
            let connected = db.connected_forms(&id);
            let (connected, similar_roots) = futures::join!(connected, similar_roots);
            Ok(similar_roots?
                .into_iter()
                .flat_map(|r| r.forms)
                .chain(connected?)
                // Only return other similar words.
                .filter(|word| word.position != self.position || word.source != self.source)
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
        Ok(context
            .data::<DataLoader<Database>>()?
            .load_one(self.position.document_id.clone())
            .await?)
    }

    /// Unique identifier for this form.
    async fn id(&self) -> &str {
        &self.id
    }

    /// Position of this word in its containing document.
    async fn index(&self) -> i32 {
        self.position.index
    }
    /// The unique identifier of the containing document.
    async fn document_id(&self) -> &str {
        &self.position.document_id.0
    }

    async fn position(&self) -> &PositionInDocument {
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
    async fn date_recorded(&self) -> &Option<Date> {
        &self.date_recorded
    }
}

pub fn is_root_morpheme(s: &str) -> bool {
    s.contains(|c: char| c.is_lowercase())
}
