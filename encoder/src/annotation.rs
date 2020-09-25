use crate::encode::AnnotatedDoc;
use crate::structured::Database;
use async_graphql::*;
use itertools::zip;
use serde::{Deserialize, Serialize};

/// A single word in an annotated document.
/// One word contains several layers of interpretation, including the original
/// source text, multiple layers of linguistic annotation, and annotator notes.
#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct AnnotatedWord {
    pub index: i32,
    pub source: String,
    /// A normalized version of the word.
    pub normalized_source: String,
    pub simple_phonetics: Option<String>,
    pub phonemic: Option<String>,
    #[serde(default)]
    pub segmentation: Vec<MorphemeSegment>,
    #[serde(default)]
    pub english_gloss: Vec<String>,
    /// Further details about the annotation layers.
    pub commentary: Option<String>,
    /// The character index of a mid-word line break, if there is one.
    pub line_break: Option<i32>,
    /// The character index of a mid-word page break, if there is one.
    pub page_break: Option<i32>,
    pub document_id: Option<String>,
}

#[Object]
impl AnnotatedWord {
    /// The root morpheme of the word.
    /// For example, a verb form glossed as "he catches" has the root morpheme
    /// corresponding to "catch."
    async fn root(&self) -> Option<&MorphemeSegment> {
        self.segmentation
            .iter()
            .find(|seg| seg.gloss.starts_with(|c: char| c.is_lowercase()))
    }

    /// All other observed words with the same root morpheme as this word.
    async fn similar_words(&self, context: &Context<'_>) -> FieldResult<Vec<AnnotatedWord>> {
        if let Some(root) = self.root(context).await? {
            let similar_roots = context
                .data::<Database>()?
                .morphemes(root.gloss.clone())
                .await?;
            Ok(similar_roots
                .into_iter()
                .flat_map(|r| r.words)
                // Only return other similar words.
                .filter(|word| word.index != self.index || word.document_id != self.document_id)
                .collect())
        } else {
            Ok(Vec::new())
        }
    }

    /// The document that contains this word.
    async fn document(&self, context: &Context<'_>) -> FieldResult<Option<AnnotatedDoc>> {
        Ok(if let Some(id) = self.document_id.as_ref() {
            context.data::<Database>()?.document(id).await
        } else {
            None
        })
    }

    /// Position of this word in its containing document.
    async fn index(&self) -> i32 {
        self.index
    }
    /// The unique identifier of the containing document.
    async fn document_id(&self) -> &Option<String> {
        &self.document_id
    }
    /// Original source text.
    async fn source(&self) -> &str {
        &self.source
    }
    /// Romanized version of the word for simple phonetic pronunciation.
    async fn simple_phonetics(&self) -> &Option<String> {
        &self.simple_phonetics
    }
    /// Underlying phonemic representation of this word.
    async fn phonemic(&self) -> &Option<String> {
        &self.phonemic
    }
    /// Morphemic segmentation of the word that includes a phonemic
    /// representation and gloss for each.
    async fn segmentation(&self) -> &Vec<MorphemeSegment> {
        &self.segmentation
    }
    /// English gloss for the whole word.
    async fn english_gloss(&self) -> &Vec<String> {
        &self.english_gloss
    }
}

/// A single unit of meaning and its corresponding English gloss.
#[SimpleObject]
#[derive(Serialize, Clone, Deserialize, Debug)]
pub struct MorphemeSegment {
    pub morpheme: String,
    pub gloss: String,
}
impl MorphemeSegment {
    pub fn new(morpheme: String, gloss: String) -> Self {
        Self { morpheme, gloss }
    }
}
