use crate::{Database, MorphemeId};
use serde::{Deserialize, Serialize};

/// Represents a morphological gloss tag without committing to a single representation.
#[derive(Serialize, Deserialize, Debug)]
pub struct MorphemeTag {
    #[serde(rename = "_id")]
    pub id: String,
    pub learner: Option<TagForm>,
    pub taoc: Option<TagForm>,
    pub crg: Option<TagForm>,
    pub morpheme_type: String,
}

#[async_graphql::Object]
impl MorphemeTag {
    /// Standard annotation tag for this morpheme, defined by DAILP.
    async fn id(&self) -> &str {
        &self.id
    }
    /// Alternate form that conveys a simple English representation.
    async fn learner(&self) -> &Option<TagForm> {
        &self.learner
    }
    /// Alternate form of this morpheme from Cherokee Reference Grammar.
    async fn crg(&self) -> &Option<TagForm> {
        &self.crg
    }
    /// Representation of this morpheme from TAOC.
    async fn taoc(&self) -> &Option<TagForm> {
        &self.taoc
    }
    /// The kind of morpheme, whether prefix or suffix.
    async fn morpheme_type(&self) -> &str {
        &self.morpheme_type
    }

    async fn attested_allomorphs(
        &self,
        context: &async_graphql::Context<'_>,
    ) -> async_graphql::FieldResult<Vec<String>> {
        let id = MorphemeId::new(None, None, self.id.clone());
        Ok(context
            .data::<&Database>()?
            .morphemes(&id, None)
            .await?
            .into_iter()
            .map(|x| x.morpheme)
            .collect())
    }
}

#[derive(async_graphql::SimpleObject, Serialize, Deserialize, Debug)]
pub struct TagForm {
    /// How this morpheme is represented in a gloss
    pub tag: String,
    /// Plain English title of the morpheme tag
    pub title: String,
    /// How this morpheme looks in original language data
    pub shape: Option<String>,
    pub definition: String,
}
