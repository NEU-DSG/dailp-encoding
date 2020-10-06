use crate::{dictionary::LexicalEntry, structured::Database};
use crate::{encode::AnnotatedDoc, tag::MorphemeTag};
use async_graphql::*;
use serde::{Deserialize, Serialize};

/// A single word in an annotated document.
/// One word contains several layers of interpretation, including the original
/// source text, multiple layers of linguistic annotation, and annotator notes.
#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct AnnotatedForm {
    pub index: i32,
    pub source: String,
    /// A normalized version of the word.
    pub normalized_source: String,
    pub simple_phonetics: Option<String>,
    pub phonemic: Option<String>,
    #[serde(default)]
    pub segments: Vec<MorphemeSegment>,
    #[serde(default)]
    pub english_gloss: Vec<String>,
    pub commentary: Option<String>,
    /// The character index of a mid-word line break, if there is one.
    pub line_break: Option<i32>,
    /// The character index of a mid-word page break, if there is one.
    pub page_break: Option<i32>,
    pub document_id: Option<String>,
}

#[Object]
impl AnnotatedForm {
    /// The root morpheme of the word.
    /// For example, a verb form glossed as "he catches" has the root morpheme
    /// corresponding to "catch."
    async fn root(&self) -> Option<&MorphemeSegment> {
        self.segments
            .iter()
            .find(|seg| seg.gloss.starts_with(|c: char| c.is_lowercase()))
    }

    /// All other observed words with the same root morpheme as this word.
    async fn similar_words(&self, context: &Context<'_>) -> FieldResult<Vec<AnnotatedForm>> {
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
    /// Morphemic segmentation of the form that includes a phonemic
    /// representation and gloss for each.
    async fn segments(&self) -> &Vec<MorphemeSegment> {
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
}

/// A single unit of meaning and its corresponding English gloss.
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

#[Object]
impl MorphemeSegment {
    /// Phonemic representation of the morpheme
    async fn morpheme(&self) -> &str {
        &self.morpheme
    }

    /// English gloss in standard DAILP format
    async fn gloss(&self) -> &str {
        &self.gloss
    }

    /// If this morpheme represents a functional tag that we have further
    /// information on, this is the corresponding database entry.
    async fn matching_tag(&self, context: &Context<'_>) -> FieldResult<Option<MorphemeTag>> {
        Ok(context
            .data::<Database>()?
            .morpheme_tag(&self.gloss)
            .await
            .ok()
            .flatten())
    }

    /// All lexical entries that share the same gloss text as this morpheme.
    /// This generally works for root morphemes.
    async fn lexical_entries(&self, context: &Context<'_>) -> FieldResult<Vec<LexicalEntry>> {
        Ok(context
            .data::<Database>()?
            .lexical_entries(&self.gloss)
            .await?)
    }
}
