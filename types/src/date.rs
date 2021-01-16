use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialOrd, Ord, PartialEq, Eq)]
pub struct Date(pub chrono::NaiveDate);

impl Date {
    pub fn new(internal: chrono::NaiveDate) -> Self {
        Self(internal)
    }
}

#[async_graphql::Object]
impl Date {
    async fn year(&self) -> i32 {
        use chrono::Datelike as _;
        self.0.year()
    }

    /// Formatted version of the date for humans to read
    async fn formatted_date(&self) -> String {
        self.0.format("%B %e, %Y").to_string()
    }
}
