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
        Self::new(
            chrono::NaiveDate::from_ymd_opt(year, month, day).expect("Provided date is invalid."),
        )
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
/// GraphQL input type for dates
#[derive(async_graphql::InputObject)]
pub struct DateInput {
    day: u32,
    month: u32,
    year: i32,
}

impl From<&DateInput> for Date {
    fn from(val: &DateInput) -> Self {
        Date::from_ymd(val.year, val.month, val.day)
    }
}

impl From<NaiveDate> for Date {
    fn from(nd: NaiveDate) -> Self {
        Date::new(nd)
    }
}

use chrono::{Datelike, NaiveDate};
impl DateInput {
    /// Creates a new DateInput from a day, month, and year.
    pub fn new(day: u32, month: u32, year: i32) -> Self {
        Self { day, month, year }
    }

    /// Creates a new DateInput from a Date object.
    pub fn parse_date_object(d: Date) -> Self {
        let nd = d.0;
        Self::new(nd.day(), nd.month(), nd.year())
    }
}

/// Internal DateTime type which wraps a reliable date library.
/// Adds SQL and GraphQL support to the type.
#[derive(sqlx::Type, Serialize, Deserialize, Clone, Debug, PartialOrd, Ord, PartialEq, Eq)]
#[sqlx(transparent)]
pub struct DateTime(pub chrono::NaiveDateTime);

impl DateTime {
    /// Make a new date from an underlying date object.
    pub fn new(internal: chrono::NaiveDateTime) -> Self {
        Self(internal)
    }
}

#[async_graphql::Object]
impl DateTime {
    /// UNIX timestamp of the datetime, useful for sorting
    pub async fn timestamp(&self) -> i64 {
        self.0.and_utc().timestamp()
    }
    /// Just the Date component of this DateTime, useful for user-facing display
    pub async fn date(&self) -> Date {
        Date::new(self.0.date())
    }
}
