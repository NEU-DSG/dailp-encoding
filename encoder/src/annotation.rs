use crate::encode::AnnotatedDoc;
use crate::encode::WordType;
use crate::structured::Database;
use async_graphql::*;
use itertools::zip;
use serde::{Deserialize, Serialize};

#[derive(Clone, Serialize, Deserialize)]
pub struct AnnotatedWord {
    pub ty: Option<WordType>,
    pub index: i32,
    pub source: String,
    pub normalized_source: String,
    pub simple_phonetics: Option<String>,
    pub phonemic: Option<String>,
    pub morphemic_segmentation: Option<Vec<String>>,
    pub morpheme_gloss: Option<Vec<String>>,
    pub english_gloss: Option<String>,
    pub commentary: Option<String>,
    /// The character index of a mid-word line break, if there is one here.
    pub line_break: Option<i32>,
    pub page_break: Option<i32>,
    pub document_id: Option<String>,
}

#[Object]
impl AnnotatedWord {
    async fn root(&self) -> Option<MorphemeSegment> {
        if let (Some(morphemes), Some(glosses)) = (
            self.morphemic_segmentation.as_ref(),
            self.morpheme_gloss.as_ref(),
        ) {
            zip(morphemes.iter(), glosses.iter())
                .find(|(_, gloss)| gloss.starts_with(|c: char| c.is_lowercase()))
                .map(|(m, g)| MorphemeSegment {
                    morpheme: m.clone(),
                    gloss: g.clone(),
                })
        } else {
            None
        }
    }

    async fn similar_words(&self, context: &Context<'_>) -> FieldResult<Vec<AnnotatedWord>> {
        if let Some(root) = self.root(context).await? {
            let similar_roots = context.data::<Database>()?.morphemes(root.gloss).await;
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

    async fn document(&self, context: &Context<'_>) -> FieldResult<Option<AnnotatedDoc>> {
        Ok(context
            .data::<Database>()?
            .document(self.document_id.as_ref().unwrap())
            .await)
    }
    async fn source(&self) -> &str {
        &self.source
    }
    async fn simple_phonetics(&self) -> &Option<String> {
        &self.simple_phonetics
    }
    async fn phonemic(&self) -> &Option<String> {
        &self.phonemic
    }
    async fn morphemic_segmentation(&self) -> &Option<Vec<String>> {
        &self.morphemic_segmentation
    }
    async fn morpheme_gloss(&self) -> &Option<Vec<String>> {
        &self.morpheme_gloss
    }
    async fn english_gloss(&self) -> &Option<String> {
        &self.english_gloss
    }
}

#[SimpleObject]
#[derive(Serialize)]
struct MorphemeSegment {
    morpheme: String,
    gloss: String,
}
