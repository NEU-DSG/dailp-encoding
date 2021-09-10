use crate::{AnnotatedDoc, AudioSlice, Database, Date, MorphemeId, MorphemeSegment, PositionInDocument};
use async_graphql::{dataloader::DataLoader, FieldResult};
use serde::{Deserialize, Serialize};

#[derive(Clone, Eq, PartialEq, Hash, Serialize, Deserialize, Debug, async_graphql::NewType)]
pub struct FormId(pub String);

/// A single word in an annotated document.
/// One word contains several layers of interpretation, including the original
/// source text, multiple layers of linguistic annotation, and annotator notes.
#[derive(Clone, Serialize, Deserialize, Debug, async_graphql::SimpleObject)]
#[serde(rename_all = "camelCase")]
#[graphql(complex)]
pub struct AnnotatedForm {
    #[serde(rename = "_id")]
    /// Unique identifier of this form
    pub id: String,
    /// Original source text
    pub source: String,
    /// A normalized version of the word
    pub normalized_source: Option<String>,
    /// Romanized version of the word for simple phonetic pronunciation
    pub simple_phonetics: Option<String>,
    /// Underlying phonemic representation of this word
    pub phonemic: Option<String>,
    /// Morphemic segmentation of the form that includes a phonemic
    /// representation and gloss for each
    pub segments: Option<Vec<MorphemeSegment>>,
    #[serde(default)]
    /// English gloss for the whole word
    pub english_gloss: Vec<String>,
    /// Further details about the annotation layers, including uncertainty
    pub commentary: Option<String>,
    /// The character index of a mid-word line break, if there is one
    pub line_break: Option<i32>,
    /// The character index of a mid-word page break, if there is one
    pub page_break: Option<i32>,
    /// Position of the form within the context of its parent document
    pub position: PositionInDocument,
    /// The date and time this form was recorded
    pub date_recorded: Option<Date>,
    /// A slice of audio associated with this word in the context of a document
    pub audio_track: Option<AudioSlice>
}

#[async_graphql::ComplexObject]
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
                document_id: Some(self.position.document_id.clone()),
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

    /// Number of words preceding this one in the containing document
    async fn index(&self) -> i32 {
        self.position.index
    }

    /// Unique identifier of the containing document
    async fn document_id(&self) -> &str {
        &self.position.document_id.0
    }
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

pub fn is_root_morpheme(s: &str) -> bool {
    s.contains(|c: char| c.is_lowercase())
}
