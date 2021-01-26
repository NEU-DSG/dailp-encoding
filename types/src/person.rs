use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Contributor {
    pub name: String,
    pub role: String,
}
impl Contributor {
    pub fn new_author(name: String) -> Self {
        Self {
            name,
            role: "Author".to_owned(),
        }
    }
}

#[async_graphql::Object]
impl Contributor {
    async fn name(&self) -> &str {
        &self.name
    }
    async fn role(&self) -> &str {
        &self.role
    }
    async fn details(
        &self,
        ctx: &async_graphql::Context<'_>,
    ) -> async_graphql::FieldResult<Option<ContributorDetails>> {
        use async_graphql::dataloader::*;
        Ok(ctx
            .data::<DataLoader<crate::Database>>()?
            .load_one(crate::PersonId(self.name.clone()))
            .await?)
    }
}

#[derive(async_graphql::SimpleObject, Clone, Debug, Serialize, Deserialize)]
pub struct ContributorDetails {
    /// Full name of this person, this exact string must be used to identify
    /// them elsewhere, like in the attribution for a particular document.
    #[serde(rename = "_id")]
    pub full_name: String,
    /// Alternate name of this person, may be in a different language or writing
    /// system. Used only for descriptive purposes.
    pub alternate_name: Option<String>,
    pub birth_date: Option<crate::Date>,
}

#[derive(async_graphql::SimpleObject, Clone, Debug, Serialize, Deserialize)]
pub struct SourceAttribution {
    pub name: String,
    pub link: String,
}
