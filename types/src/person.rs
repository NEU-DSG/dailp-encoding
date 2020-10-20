use serde::{Deserialize, Serialize};

#[async_graphql::SimpleObject]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct PersonAssociation {
    pub name: String,
    pub role: String,
}
