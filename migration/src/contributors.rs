use anyhow::Result;
use dailp::{ContributorDetails, Database, SheetResult};

pub async fn migrate_all(db: &Database) -> Result<()> {
    let sheet =
        SheetResult::from_sheet("1ATTekY411Jz63k6VMDn3ISFu8_f75LYFErCGY-pxVkQ", None).await?;
    let contributors: Vec<ContributorDetails> = sheet
        .values
        .into_iter()
        .skip(1)
        .filter_map(|row| {
            let mut row = row.into_iter();
            let full_name = row.next()?;
            let alternate_name = row.next();
            let birth_date = row.next();
            Some(ContributorDetails {
                full_name,
                alternate_name,
                birth_date: birth_date.and_then(|d| dailp::Date::parse(&d).ok()),
                is_visible: false,
            })
        })
        .collect();

    for (index, person) in contributors.into_iter().enumerate() {
        if let Err(e) = db.upsert_contributor(person.clone()).await {
            let enhanced_error = anyhow::anyhow!(
                "Failed to upsert contributor '{}' (row {}, index {}): {}",
                person.full_name,
                index + 2, // +2 for header skip and 1-indexing
                index + 1,
                e
            );

            eprintln!("DATABASE ERROR: {}", enhanced_error);
            eprintln!("Contributor details: {:?}", person);
            return Err(enhanced_error);
        }
    }
    Ok(())
}
