use crate::*;
use async_graphql::FieldResult;
use serde::{Deserialize, Serialize};
use std::borrow::Cow;

/// A single unit of meaning and its corresponding English gloss.
#[derive(Serialize, Clone, Deserialize, Debug)]
pub struct MorphemeSegment {
    pub morpheme: String,
    pub gloss: String,
    pub followed_by: Option<SegmentType>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub enum SegmentType {
    /// -
    Morpheme,
    /// =
    Clitic,
}

impl MorphemeSegment {
    pub fn new(morpheme: String, gloss: String, followed_by: Option<SegmentType>) -> Self {
        Self {
            morpheme,
            gloss,
            followed_by,
        }
    }

    pub fn parse_many(morpheme_layer: &str, gloss_layer: &str) -> Option<Vec<Self>> {
        let (_, result) = parse_gloss_layers(morpheme_layer, gloss_layer).ok()?;
        Some(result)
    }

    pub fn get_next_separator(&self) -> Option<&'static str> {
        use SegmentType::*;
        self.followed_by.as_ref().map(|ty| match ty {
            Morpheme => "-",
            Clitic => "=",
        })
    }

    pub fn gloss_layer<'a>(segments: impl IntoIterator<Item = &'a MorphemeSegment>) -> String {
        use itertools::Itertools;
        segments
            .into_iter()
            .flat_map(|s| vec![&*s.gloss, s.get_next_separator().unwrap_or("")])
            .join("")
    }

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

    async fn next_separator(&self) -> Option<&str> {
        self.get_next_separator()
    }

    /// If this morpheme represents a functional tag that we have further
    /// information on, this is the corresponding database entry.
    async fn matching_tag(
        &self,
        context: &async_graphql::Context<'_>,
    ) -> FieldResult<Option<MorphemeTag>> {
        use crate::database::TagId;
        use async_graphql::dataloader::*;
        Ok(context
            .data::<DataLoader<Database>>()?
            .load_one(TagId(self.gloss.clone()))
            .await
            .ok()
            .flatten())
    }

    /// All lexical entries that share the same gloss text as this morpheme.
    /// This generally works for root morphemes.
    async fn lexical_entry(
        &self,
        context: &async_graphql::Context<'_>,
    ) -> FieldResult<Option<AnnotatedForm>> {
        Ok(context
            .data::<Database>()?
            .lexical_entry(&self.gloss)
            .await?)
    }
}

#[derive(async_graphql::Enum, Clone, Copy, Eq, PartialEq)]
pub enum CherokeeOrthography {
    /// The d/t system for transcribing the Cherokee syllabary.
    /// This orthography is favored by native speakers.
    /// TODO Option for /ts/ instead of /j/
    /// TODO Option for /qu/ instead of /gw/ or /kw/
    Taoc,
    /// The t/th system for transcribing the Cherokee syllabary.
    /// This orthography is favored by linguists as it is segmentally more accurate.
    Crg,
    Learner,
}
impl CherokeeOrthography {
    pub fn convert(&self, input: &str) -> String {
        use CherokeeOrthography::*;
        let ast = PhonemicString::parse_dailp(input);
        match self {
            Taoc => ast.into_dailp(),
            Crg => ast.into_crg(),
            Learner => ast.into_learner(),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn orthography_conversion() {
        // This value came straight from the DD1 spreadsheet.
        let orig = "ùùnatoótákwààskvv̋ʔi";
        // Test the learner orthography.
        assert_eq!(
            CherokeeOrthography::Learner.convert(orig),
            "unadodagwasgv'i"
        );
        // Test the CRG orthography.
        assert_eq!(
            CherokeeOrthography::Crg.convert(orig),
            "uùnadoódágwaàsgv́v́ʔi"
        );
    }

    #[test]
    fn orthography_edge_cases() {
        assert_eq!(
            CherokeeOrthography::Learner.convert("Ø-ali-sul(v)-hvsk-vv̋ʔi=hnoo"),
            "Ø-ali-sul(v)-hvsg-v'i=hno"
        );

        assert_eq!(
            CherokeeOrthography::Learner.convert("t-uu-alihthat-:iinvvʔs-ééʔi"),
            "d-u-alihtad-inv's-e'i"
        );

        assert_eq!(
            CherokeeOrthography::Learner.convert("Ø-ataweelakʔ-?-i"),
            "Ø-adawelag'-?-i"
        );

        assert_eq!(CherokeeOrthography::Learner.convert(""), "");
        assert_eq!(CherokeeOrthography::Learner.convert("n"), "n");
        assert_eq!(CherokeeOrthography::Learner.convert("uu"), "u");
        assert_eq!(
            CherokeeOrthography::Learner.convert("(a)listaʔyvv"),
            "(a)lisda'yv"
        );
    }

    #[test]
    fn orthography_colons() {
        assert_eq!(
            CherokeeOrthography::Crg.convert("uwa–:ciískáhlvv̋ʔi"),
            "uwa–xxjiísgáhlv́v́ʔi"
        )
    }
}
