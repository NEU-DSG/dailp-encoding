#!/usr/bin/env bash

cd $PROJECT_ROOT

echo "--- DATABASE ---"
echo "Checking if SQL queries are prepared..."
if  [ ! -d "types/.sqlx" ] || [ ! -n "$(ls -A "types/.sqlx")" ]; then
    echo "Prepared queries not present. run 'dev-generate-types'." 
    exit 1
fi
echo "Checking if SQL types are up to date..."
if $(cd types && cargo sqlx prepare --check -- -p dailp &>/dev/null); then
    echo "Generating SQL types..."
    cd types
    cargo sqlx prepare -- -p dailp &>/dev/null || exit 1
    cd $PROJECT_ROOT
fi

echo "--- SERVER ---"
echo "Formatting Rust code..."
cargo fmt &>/dev/null
echo "Checking back-end for errors..."
export SQLX_OFFLINE=true
cargo check &>/dev/null ||
    (echo "Back-end build failed, run 'cargo check' for details." && exit 1)

echo "Generating GraphQL schema..."
cargo run --bin dailp-graphql-schema &>/dev/null ||
    (echo "GraphQL server build failed, run 'cargo check' for details." && exit 1)

echo "--- WEBSITE ---"
cd website
echo "Formatting TypeScript code..."
yarn prettier --write --config package.json src &>/dev/null
echo "Generating Typescript types for GraphQL queries..."
yarn generate
echo "Checking website for errors..."
yarn tsc || exit 1

echo "--- FINAL CHECKS ---"
cd $PROJECT_ROOT
echo "Checking documentation and formatting..."
./.git-hooks/pre-commit || exit 1

echo
echo "--- NEXT STEPS ---"
echo "Please stage relevant automatic changes"