use crate::spreadsheets::SheetResult;
use dailp::{Database, LexicalConnection};

pub async fn migrate_connections(db: &Database) -> anyhow::Result<()> {
    use itertools::Itertools as _;

    let res = SheetResult::from_sheet("1ab9ddOiuoCbCaYWwhDOLk-Xj8OOS0dkHwmMqktZabpM", None).await?;
    // Skip header row.
    let connections = res.values.iter().skip(1).flat_map(|row| {
        // Silently ignore rows with only one value.
        // This permits section headers in the first column.
        row.iter()
            .tuple_windows()
            .filter_map(move |(from, to)| LexicalConnection::parse(from, to))
    });

    // TODO Clear all connections before starting.

    for conn in connections {
        db.update_connection(conn).await?;
    }

    Ok(())
}
