use crate::spreadsheets::SheetResult;
use dailp::LexicalConnection;

pub async fn migrate_connections() -> anyhow::Result<()> {
    use itertools::Itertools as _;

    let res = SheetResult::from_sheet("1ab9ddOiuoCbCaYWwhDOLk-Xj8OOS0dkHwmMqktZabpM", None).await?;
    // Skip header row.
    let connections: Vec<_> = res
        .values
        .iter()
        .skip(1)
        .flat_map(|row| {
            // Silently ignore rows with only one value.
            // This permits section headers in the first column.
            row.iter()
                .tuple_windows()
                .filter_map(move |(from, to)| LexicalConnection::parse(from, to))
        })
        .collect();

    // TODO Clear all connections before starting.

    crate::update_connection(&connections).await?;

    Ok(())
}
