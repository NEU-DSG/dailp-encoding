use serde::{Deserialize, Serialize};

/// Internal Date type which wraps a reliable date library.
/// Adds SQL and GraphQL support to the type.
#[derive(sqlx::Type, Serialize, Deserialize, Clone, Debug, PartialOrd, Ord, PartialEq, Eq)]
#[sqlx(transparent)]
pub struct Date(pub chrono::NaiveDate);

impl Date {
    /// Make a new date from an underlying date object.
    pub fn new(internal: chrono::NaiveDate) -> Self {
        Self(internal)
    }
    /// Make a new date from year, month, and day integers.
    pub fn from_ymd(year: i32, month: u32, day: u32) -> Self {
        Self::new(chrono::NaiveDate::from_ymd(year, month, day))
    }
    /// Parse a date from a string like "1999-12-31"
    pub fn parse(s: &str) -> Result<Self, chrono::ParseError> {
        chrono::NaiveDate::parse_from_str(s, "%Y-%m-%d").map(Self)
    }
}

#[async_graphql::Object]
impl Date {
    /// The year of this date
    pub async fn year(&self) -> i32 {
        use chrono::Datelike as _;
        self.0.year()
    }

    /// The month of this date
    pub async fn month(&self) -> u32 {
        use chrono::Datelike as _;
        self.0.month()
    }

    /// The day of this date
    pub async fn day(&self) -> u32 {
        use chrono::Datelike as _;
        self.0.day()
    }

    /// Formatted version of the date for humans to read
    pub async fn formatted_date(&self) -> String {
        self.0.format("%B %e, %Y").to_string()
    }
}

#[derive(async_graphql::InputObject)]
pub struct DateInput {
    day: u32,
    month: u32,
    year: i32,
}

impl Into<Date> for &DateInput {
    fn into(self) -> Date {
        Date::from_ymd(self.year, self.month, self.day)
    }
}

use chrono::Datelike;
impl DateInput {
    // Creates a new DateInput from a day, month, and year.
    pub fn new(day: u32, month: u32, year: i32) -> Self {
        Self { day, month, year }
    }

    //Creates a new DateInput from a Date object.
    pub fn parse_date_object(d: Date) -> Self {
        let nd = d.0;
        Self::new(nd.day(), nd.month(), nd.year())
    }
}
