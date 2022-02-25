use serde::{Deserialize, Serialize};

#[derive(sqlx::Type, Serialize, Deserialize, Clone, Debug, PartialOrd, Ord, PartialEq, Eq)]
#[sqlx(transparent)]
pub struct Date(pub chrono::NaiveDate);

impl Date {
    pub fn new(internal: chrono::NaiveDate) -> Self {
        Self(internal)
    }
    pub fn from_ymd(year: i32, month: u32, day: u32) -> Self {
        Self::new(chrono::NaiveDate::from_ymd(year, month, day))
    }
    pub fn parse(s: &str) -> Result<Self, chrono::ParseError> {
        chrono::NaiveDate::parse_from_str(s, "%Y-%m-%d").map(Self)
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
