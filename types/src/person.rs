use serde::{Deserialize, Serialize};

#[derive(async_graphql::SimpleObject, Clone, Debug, Serialize, Deserialize)]
pub struct PersonAssociation {
    pub name: String,
    pub role: String,
}
