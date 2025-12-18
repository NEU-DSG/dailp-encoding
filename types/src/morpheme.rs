use crate::*;
use async_graphql::FieldResult;
use serde::{Deserialize, Serialize};
use sqlx::postgres::{PgHasArrayType, PgTypeInfo};
use std::borrow::Cow;

/// A single unit of meaning and its corresponding English gloss.
#[derive(Serialize, Clone, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct WordSegment {
    /// Which Cherokee representation system is this segment written with?
    #[serde(skip)]
    pub system: Option<OrthographySystem>,
    /// Source language representation of this segment.
    pub morpheme: String,
    /// Target language representation of this segment.
    pub gloss: String,
    /// Database ID for the associated gloss, which may be shared by several
    /// morphemes in the same document.
    #[serde(skip)]
    pub gloss_id: Option<Uuid>,
    /// What kind of thing is the next segment?
    ///
    /// This field determines what character should separate this segment from
    /// the next one when reconstituting a full segmentation string.
    pub role: WordSegmentRole,
    /// Optional glossary entry for this segment which gives further information,
    /// like a definition and example usages.
    pub matching_tag: Option<MorphemeTag>,
}

/// The kind of segment that a particular sequence of characters in a morphemic
/// segmentations represent.
#[derive(
    Clone, Copy, Debug, Serialize, Deserialize, sqlx::Type, async_graphql::Enum, PartialEq, Eq,
)]
#[sqlx(type_name = "word_segment_role")]
pub enum WordSegmentRole {
    /// Separated by a hyphen '-'
    Morpheme,
    /// Separated by an equals sign '='
    Clitic,
    /// Separated by a colon ':'
    Modifier,
}

impl PgHasArrayType for WordSegmentRole {
    fn array_type_info() -> PgTypeInfo {
        <&str as PgHasArrayType>::array_type_info()
    }

    fn array_compatible(ty: &PgTypeInfo) -> bool {
        <&str as PgHasArrayType>::array_compatible(ty)
    }
}

impl WordSegment {
    /// Make a new morpheme segment
    pub fn new(morpheme: String, gloss: String, role: Option<WordSegmentRole>) -> Self {
        Self {
            system: None,
            morpheme,
            gloss,
            // FIXME Shortcut to keep this function the same while allowing
            // migration code to create this data structure.
            gloss_id: None,
            role: role.unwrap_or(WordSegmentRole::Morpheme),
            matching_tag: None,
        }
    }

    /// Parse all segments from a raw interlinear morphemic segmentation.
    /// The first argument is the segmented source, while the second argument is
    /// the target language gloss of each segment.
    pub fn parse_many(morpheme_layer: &str, gloss_layer: &str) -> Option<Vec<Self>> {
        let (_, result) = parse_gloss_layers(morpheme_layer, gloss_layer).ok()?;
        Some(result)
    }

    /// The separator that should follow this segment, based on the type of the
    /// next segment.
    pub fn get_previous_separator(&self) -> &str {
        use WordSegmentRole::*;
        match self.role {
            Morpheme => "-",
            Clitic => "=",
            Modifier => ":",
        }
    }

    /// Build a string of the morpheme gloss line, used in interlinear gloss
    /// text (IGT).
    pub fn gloss_layer<'a>(segments: impl IntoIterator<Item = &'a WordSegment>) -> String {
        use itertools::Itertools;
        segments
            .into_iter()
            .enumerate()
            .flat_map(|(index, s)| {
                vec![
                    if index > 0 {
                        s.get_previous_separator()
                    } else {
                        ""
                    },
                    &*s.gloss,
                ]
            })
            .join("")
    }

    /// Convert the source representation of this segment into the given
    /// phonemic writing system.
    pub fn get_morpheme(&self) -> Cow<'_, str> {
        match self.system {
            Some(orthography) => Cow::Owned(orthography.convert(&self.morpheme)),
            _ => Cow::Borrowed(&*self.morpheme),
        }
    }
}

#[async_graphql::Object]
impl WordSegment {
    /// Phonemic representation of the morpheme
    async fn morpheme(&self) -> Cow<'_, str> {
        self.get_morpheme()
    }

    /// English gloss in standard DAILP format that refers to a lexical item
    async fn gloss(&self) -> &str {
        &self.gloss
    }

    /// What kind of thing is this segment?
    async fn role(&self) -> WordSegmentRole {
        self.role
    }

    /// This field determines what character should separate this segment from
    /// the previous one when reconstituting the full segmentation string.
    async fn previous_separator(&self) -> &str {
        self.get_previous_separator()
    }

    /// If this morpheme represents a functional tag that we have further
    /// information on, this is the corresponding database entry.
    async fn matching_tag(
        &self,
        context: &async_graphql::Context<'_>,
    ) -> FieldResult<Option<MorphemeTag>> {
        use async_graphql::dataloader::*;
        if let Some(matching_tag) = &self.matching_tag {
            Ok(Some(matching_tag.clone()))
        } else if let Some(gloss_id) = self.gloss_id {
            Ok(context
                .data::<DataLoader<Database>>()?
                .load_one(TagForMorpheme(
                    gloss_id,
                    self.system
                        .unwrap_or(OrthographySystem::Cherokee(CherokeeOrthography::Taoc)),
                ))
                .await?)
        } else {
            Ok(None)
        }
    }
}

/// A single unit of meaning and its gloss which can be edited.
#[derive(async_graphql::InputObject)]
pub struct MorphemeSegmentUpdate {
    /// Which Cherokee representation system is this segment written with?
    pub system: Option<CherokeeOrthography>,
    /// Source language representation of this segment.
    pub morpheme: String,
    /// Target language representation of this segment.
    pub gloss: String,
    /// This field determines what character should separate this segment from
    /// the next one when reconstituting the full segmentation string.
    pub role: WordSegmentRole,
}
