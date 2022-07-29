use crate::*;
use async_graphql::FieldResult;
use serde::{Deserialize, Serialize};
use sqlx::postgres::{PgHasArrayType, PgTypeInfo};
use std::borrow::Cow;

/// A single unit of meaning and its corresponding English gloss.
#[derive(Serialize, Clone, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct MorphemeSegment {
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
    /// the next one when reconstituting the full segmentation string.
    pub followed_by: Option<SegmentType>,
}

/// The kind of segment that a particular sequence of characters in a morphemic
/// segmentations represent.
#[derive(Clone, Debug, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "segment_type")]
pub enum SegmentType {
    /// Separated by a hyphen '-'
    Morpheme,
    /// Separated by an equals sign '='
    Clitic,
}

impl PgHasArrayType for SegmentType {
    fn array_type_info() -> PgTypeInfo {
        <&str as PgHasArrayType>::array_type_info()
    }

    fn array_compatible(ty: &PgTypeInfo) -> bool {
        <&str as PgHasArrayType>::array_compatible(ty)
    }
}

impl MorphemeSegment {
    /// Make a new morpheme segment
    pub fn new(morpheme: String, gloss: String, followed_by: Option<SegmentType>) -> Self {
        Self {
            morpheme,
            gloss,
            // FIXME Shortcut to keep this function the same while allowing
            // migration code to create this data structure.
            gloss_id: None,
            followed_by,
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
    pub fn get_next_separator(&self) -> Option<&'static str> {
        use SegmentType::*;
        self.followed_by.as_ref().map(|ty| match ty {
            Morpheme => "-",
            Clitic => "=",
        })
    }

    /// Build a string of the morpheme gloss line, used in interlinear gloss
    /// text (IGT).
    pub fn gloss_layer<'a>(segments: impl IntoIterator<Item = &'a MorphemeSegment>) -> String {
        use itertools::Itertools;
        segments
            .into_iter()
            .flat_map(|s| vec![&*s.gloss, s.get_next_separator().unwrap_or("")])
            .join("")
    }

    /// Convert the source representation of this segment into the given
    /// phonemic writing system.
    pub fn get_morpheme(&self, system: Option<CherokeeOrthography>) -> Cow<'_, str> {
        match system {
            Some(orthography) => Cow::Owned(orthography.convert(&self.morpheme)),
            _ => Cow::Borrowed(&*self.morpheme),
        }
    }
}

#[async_graphql::Object]
impl MorphemeSegment {
    /// Phonemic representation of the morpheme
    async fn morpheme(&self, system: Option<CherokeeOrthography>) -> Cow<'_, str> {
        self.get_morpheme(system)
    }

    /// English gloss in standard DAILP format that refers to a lexical item
    async fn gloss(&self) -> &str {
        &self.gloss
    }

    /// What kind of thing is the next segment?
    ///
    /// This field determines what character should separate this segment from
    /// the next one when reconstituting the full segmentation string.
    async fn next_separator(&self) -> Option<&str> {
        self.get_next_separator()
    }

    /// If this morpheme represents a functional tag that we have further
    /// information on, this is the corresponding database entry.
    async fn matching_tag(
        &self,
        context: &async_graphql::Context<'_>,
        // TODO make this non-optional
        system: Option<CherokeeOrthography>,
    ) -> FieldResult<Option<TagForm>> {
        use async_graphql::dataloader::*;
        if let Some(gloss_id) = self.gloss_id {
            Ok(context
                .data::<DataLoader<Database>>()?
                .load_one(TagForMorpheme(
                    gloss_id,
                    system.unwrap_or(CherokeeOrthography::Taoc),
                ))
                .await?)
        } else {
            Ok(None)
        }
    }
}
