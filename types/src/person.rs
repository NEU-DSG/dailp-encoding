use serde::{Deserialize, Serialize};

#[derive(async_graphql::SimpleObject, Clone, Debug, Serialize, Deserialize)]
pub struct Contributor {
    pub name: String,
    pub role: String,
}

#[derive(async_graphql::SimpleObject, Clone, Debug, Serialize, Deserialize)]
pub struct SourceAttribution {
    pub name: String,
    pub link: String,
}
