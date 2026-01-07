use crate::{
    comment::Comment, AnnotatedDoc, AudioSlice, CherokeeOrthography, Database, Date, DocumentId,
    MorphemeSegmentUpdate, Orthography, OrthographySystem, PartsOfWord, PositionInDocument, TagId,
    WordSegment, WordSegmentRole,
};
use async_graphql::{dataloader::DataLoader, FieldResult, MaybeUndefined};
use itertools::Itertools;
use serde::{Deserialize, Serialize};
use sqlx::types::Uuid;
use std::borrow::Cow;

/// Mostly unused type
#[derive(Clone, Eq, PartialEq, Hash, Serialize, Deserialize, Debug, async_graphql::NewType)]
pub struct FormId(pub String);

/// A single word in an annotated document.
/// One word contains several layers of interpretation, including the original
/// source text, multiple layers of linguistic annotation, and annotator notes.
/// TODO Split into two types, one for migration and one for SQL + GraphQL
#[derive(Clone, Serialize, Deserialize, Debug, async_graphql::SimpleObject)]
#[serde(rename_all = "camelCase")]
#[graphql(complex)]
pub struct AnnotatedForm {
    /// Unique identifier of this form
    #[serde(skip)]
    #[graphql(skip)]
    pub id: Option<Uuid>,
    /// Original source text
    pub source: String,
    /// A normalized version of the word
    pub normalized_source: Option<String>,
    #[graphql(skip)]
    /// Romanized version of the word for simple phonetic pronunciation
    pub simple_phonetics: Option<String>,
    /// Underlying phonemic representation of this word
    pub phonemic: Option<String>,
    /// Morphemic segmentation of the form that includes a phonemic
    /// representation and gloss for each
    #[graphql(skip)]
    pub segments: Option<Vec<WordSegment>>,
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
    /// The audio for this word that was ingested from GoogleSheets, if there is any.
    // TODO: #[graphql(guard = "GroupGuard::new(UserGroup::Editors)")]
    pub ingested_audio_track: Option<AudioSlice>,
}

#[async_graphql::ComplexObject]
impl AnnotatedForm {
    /// The root morpheme of the word.
    /// For example, a verb form glossed as "he catches" might have a root morpheme
    /// corresponding to "catch."
    async fn root(&self, context: &async_graphql::Context<'_>) -> FieldResult<Option<WordSegment>> {
        let segments = self.segments(context, CherokeeOrthography::Taoc).await?;
        for seg in segments {
            if is_root_morpheme(&seg.gloss) {
                return Ok(Some(seg));
            }
        }
        Ok(None)
    }

    async fn romanized_source(&self, system: CherokeeOrthography) -> Option<Cow<'_, str>> {
        self.simple_phonetics
            .as_ref()
            .map(|phonetic| Cow::Owned(system.romanize(phonetic)))
    }

    // Old method for backwards compatibility
    // New langauges add their own segments_languageXYZ methods
    async fn segments(
        &self,
        context: &async_graphql::Context<'_>,
        system: CherokeeOrthography,
    ) -> FieldResult<Vec<WordSegment>> {
        self.segments_generic(context, OrthographySystem::Cherokee(system))
            .await
    }

    // graphql skip due to not exposing in schema
    #[graphql(skip)]
    async fn segments_generic(
        &self,
        context: &async_graphql::Context<'_>,
        system: OrthographySystem,
    ) -> FieldResult<Vec<WordSegment>> {
        let db = context.data::<DataLoader<Database>>()?;
        // 1. To convert to a concrete analysis, start with a list of abstract tags.
        let abstract_segments = db
            .load_one(PartsOfWord(*self.id.as_ref().unwrap()))
            .await?
            .unwrap_or_default();

        // 2. Request all concrete tags that start with each abstract tag.
        let concrete_tag_matches = db
            .load_many(
                abstract_segments
                    .iter()
                    .map(|seg| TagId(seg.gloss.clone(), system)),
            )
            .await?;

        // 3. Pick the longest match for each abstract segment.
        let mut concrete_segments = Vec::new();
        let mut curr_index = 0;
        for (idx, abstract_segment) in abstract_segments.iter().enumerate() {
            // If this segment has already been filled by a previous match, skip it.
            if idx < curr_index {
                continue;
            }

            let concrete_tags =
                concrete_tag_matches.get(&TagId(abstract_segment.gloss.clone(), system));
            if let Some(concrete_tags) = concrete_tags {
                for concrete_tag in concrete_tags {
                    // Check whether the whole sequence of abstract tags is the current
                    // start of the abstract segment list.
                    let abstract_matches = concrete_tag
                        .internal_tags
                        .iter()
                        .zip(abstract_segments.iter().skip(curr_index));
                    let is_match = abstract_matches.clone().all(|(a, b)| *a == b.gloss);
                    if is_match {
                        let corresponding_segments = abstract_segments
                            .iter()
                            .skip(curr_index)
                            .take(concrete_tag.internal_tags.len());
                        concrete_segments.push(WordSegment {
                            system: Some(system),
                            // Use the segment type of the first abstract one
                            // unless the concrete segment overrides the segment type.
                            role: concrete_tag
                                .role_override
                                .or_else(|| {
                                    corresponding_segments.clone().next().map(|seg| seg.role)
                                })
                                .unwrap_or(WordSegmentRole::Morpheme),
                            morpheme: corresponding_segments.map(|seg| &seg.morpheme).join(""),
                            gloss: concrete_tag.tag.clone(),
                            gloss_id: None,
                            matching_tag: Some(concrete_tag.clone()),
                        });
                        curr_index += concrete_tag.internal_tags.len();
                        break;
                    }
                }
            } else {
                // If this abstract segment was unmatched (probably a root),
                // then just use it directly.
                concrete_segments.push(WordSegment {
                    system: Some(system),
                    ..abstract_segment.clone()
                });
                curr_index += 1;
            }
            // if !success {
            //     anyhow::bail!("Failed to generate all morpheme tags");
            // }
        }
        Ok(concrete_segments)
    }

    /// All other observed words with the same root morpheme as this word.
    async fn similar_forms(
        &self,
        context: &async_graphql::Context<'_>,
    ) -> FieldResult<Vec<AnnotatedForm>> {
        if let Some(root) = self.root(context).await? {
            let db = context.data::<DataLoader<Database>>()?.loader();
            // Find the forms with the exact same root.
            // let similar_roots = db.morphemes(id.clone());
            // Find forms with directly linked roots.
            let connected = db
                .connected_forms(Some(self.position.document_id), &root.gloss)
                .await?;
            // let (connected, similar_roots) = futures::join!(connected, similar_roots);
            Ok(connected
                .into_iter()
                // Only return other similar words.
                .filter(|word| word.id != self.id)
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
            .load_one(self.position.document_id)
            .await?)
    }

    /// Number of words preceding this one in the containing document
    async fn index(&self) -> i64 {
        self.position.index
    }

    /// Unique identifier of the containing document
    async fn document_id(&self) -> DocumentId {
        self.position.document_id
    }

    /// Unique identifier of this form
    async fn id(&self) -> anyhow::Result<Uuid> {
        self.id
            .ok_or_else(|| anyhow::format_err!("No AnnotatedForm ID"))
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
        if let Some(ingested_audio_track) = self.ingested_audio_track.to_owned() {
            all_audio.insert(0, ingested_audio_track);
        }
        Ok(all_audio
            .into_iter()
            .filter(|audio| audio.include_in_edited_collection)
            .collect_vec())
    }

    /// Audio for this word that has been recorded by community members. Will be
    /// empty if user does not have access to uncurated contributions.
    /// TODO! User guard for contributors only
    async fn user_contributed_audio(
        &self,
        context: &async_graphql::Context<'_>,
    ) -> FieldResult<Vec<AudioSlice>> {
        let db = context.data::<DataLoader<Database>>()?.loader();
        Ok(db.word_contributor_audio(self.id.as_ref().unwrap()).await?)
    }

    /// Get comments on this word
    async fn comments(&self, context: &async_graphql::Context<'_>) -> FieldResult<Vec<Comment>> {
        let db = context.data::<DataLoader<Database>>()?.loader();
        Ok(db
            .comments_by_parent(
                self.id.as_ref().unwrap(),
                &crate::comment::CommentParentType::Word,
            )
            .await?)
    }
}

impl AnnotatedForm {
    /// Look for a root morpheme in the word using crude case checks.
    pub fn find_root(&self) -> Option<&WordSegment> {
        self.segments
            .as_ref()
            .and_then(|segments| segments.iter().find(|seg| is_root_morpheme(&seg.gloss)))
    }

    /// Find a morpheme within this word with the given exact gloss.
    pub fn find_morpheme(&self, gloss: &str) -> Option<&WordSegment> {
        self.segments
            .as_ref()
            .and_then(|segments| segments.iter().find(|seg| seg.gloss == gloss))
    }

    /// Are there any unidentified segments within this word? Just checks if
    /// there are morphemes or glosses consisting of a question mark "?"
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

/// Is the given gloss for a root morpheme? This is a crude calculation that just
/// checks if there are any lowercase characters. Convention says that typically
/// functional morpheme tags are all uppercase (plus numbers and punctuation),
/// so having lowercase characters indicates a lexical morpheme gloss.
pub fn is_root_morpheme(s: &str) -> bool {
    s.contains(|c: char| c.is_lowercase())
}

/// A single word in an annotated document that can be edited.
/// All fields except id are optional.
#[derive(async_graphql::InputObject)]
pub struct AnnotatedFormUpdate {
    /// Unique identifier of the form
    pub id: Uuid,
    /// Possible update to source content
    pub source: MaybeUndefined<String>,
    /// Possible update to normalized source content
    pub romanized_source: MaybeUndefined<String>,
    /// Possible update to commentary
    pub commentary: MaybeUndefined<String>,
    /// Updated segments
    pub segments: MaybeUndefined<Vec<MorphemeSegmentUpdate>>,
    /// Possible updated english gloss
    pub english_gloss: MaybeUndefined<String>,
}

/// Trait that defines function which takes in a possibly undefined value.
pub trait MaybeUndefinedExt<T> {
    /// If the given value is undefined, convert into a vector of option. Otherwise, return an empty vector.
    fn into_vec(self) -> Vec<Option<T>>;
}

impl<T> MaybeUndefinedExt<T> for MaybeUndefined<T> {
    fn into_vec(self) -> Vec<Option<T>> {
        if self.is_undefined() {
            Vec::new()
        } else {
            return vec![self.take()];
        }
    }
}
