mod encode;
mod retrieve;

use anyhow::Result;

#[tokio::main]
async fn main() -> Result<()> {
    let sheet_id = "188qlHBCMLSpuo9A1J5KIiCQv3iCuKfBpt9T0XDU_PH4";
    let sheet = retrieve::SheetResult::from_sheet(sheet_id)
        .await?
        .split_into_lines();

    println!("response: {:#?}", sheet);
    encode::write_to_file("Story of Switch Striker", sheet)?;
    Ok(())
}
