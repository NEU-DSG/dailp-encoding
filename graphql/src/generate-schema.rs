mod query;
mod email;

use dailp::async_graphql::{EmptySubscription, Schema};
use std::fs::File;
use std::io::prelude::*;

fn main() -> anyhow::Result<()> {
    let schema = Schema::build(query::Query, query::Mutation, EmptySubscription).finish();
    let mut schema_file = File::create("graphql/schema.graphql")?;
    schema_file.write_all(schema.sdl().as_bytes())?;
    Ok(())
}
