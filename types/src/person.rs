use serde::{Deserialize, Serialize};

#[derive(async_graphql::SimpleObject, Clone, Debug, Serialize, Deserialize)]
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

#[derive(async_graphql::SimpleObject, Clone, Debug, Serialize, Deserialize)]
pub struct SourceAttribution {
    pub name: String,
    pub link: String,
}
