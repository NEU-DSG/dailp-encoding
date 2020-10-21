use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct DateTime(chrono::DateTime<chrono::Utc>);

impl DateTime {
    pub fn new(internal: chrono::DateTime<chrono::Utc>) -> Self {
        Self(internal)
    }
}

#[async_graphql::Object]
impl DateTime {
    async fn year(&self) -> i32 {
        use chrono::Datelike as _;
        self.0.year()
    }

    /// Formatted version of the date for humans to read
    async fn formatted_date(&self) -> String {
        self.0.format("%B %e, %Y").to_string()
    }
}
