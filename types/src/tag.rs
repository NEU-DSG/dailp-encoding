use crate::{Database, MorphemeId};
use serde::{Deserialize, Serialize};

/// Represents a morphological gloss tag without committing to a single representation.
#[derive(Serialize, Deserialize, Debug)]
pub struct MorphemeTag {
    #[serde(rename = "_id")]
    pub id: String,
    pub learner: Option<String>,
    pub crg: String,
    pub name: String,
    pub morpheme_type: String,
}

#[async_graphql::Object]
impl MorphemeTag {
    /// Standard annotation tag for this morpheme, defined by DAILP.
    async fn id(&self) -> &str {
        &self.id
    }
    /// Alternate form that conveys a simple English representation.
    async fn learner(&self) -> &Option<String> {
        &self.learner
    }
    /// Alternate form of this morpheme from Cherokee Reference Grammar.
    async fn crg(&self) -> &str {
        &self.crg
    }
    /// English title
    async fn name(&self) -> &str {
        &self.name
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
            .data::<Database>()?
            .morphemes(&id, None)
            .await?
            .into_iter()
            .map(|x| x.morpheme)
            .collect())
    }
}
