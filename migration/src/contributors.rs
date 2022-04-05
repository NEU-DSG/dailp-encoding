use crate::spreadsheets::SheetResult;
use anyhow::Result;
use dailp::{ContributorDetails, Database};

pub async fn migrate_all(db: &Database) -> Result<()> {
    let sheet =
        SheetResult::from_sheet("1ATTekY411Jz63k6VMDn3ISFu8_f75LYFErCGY-pxVkQ", None).await?;
    let contributors = sheet.values.into_iter().skip(1).filter_map(|row| {
        let mut row = row.into_iter();
        let full_name = row.next()?;
        let alternate_name = row.next();
        let birth_date = row.next();
        Some(ContributorDetails {
            full_name,
            alternate_name,
            birth_date: birth_date.and_then(|d| dailp::Date::parse(&d).ok()),
        })
    });

    for person in contributors {
        db.update_person(person).await?;
    }
    Ok(())
}
