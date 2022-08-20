#!/usr/bin/env bash

git-staged() {
    ! git diff --no-patch --staged --exit-code "$PROJECT_ROOT/$1"
}

cd $PROJECT_ROOT

echo "--- DATABASE ---"
if git-staged "types/queries/**.sql"; then
    echo "Generating SQL types..."
    dev-generate-types || exit 1
    git add sqlx-data.json
fi

echo "--- SERVER ---"
echo "Formatting Rust code..."
cargo fmt &> /dev/null
echo "Checking back-end for errors..."
export SQLX_OFFLINE=true
cargo check &> /dev/null \
    || (echo "Back-end build failed, run 'cargo check' for details." && exit 1)

echo "Generating GraphQL schema..."
cargo run --bin dailp-graphql-schema &> /dev/null \
    || (echo "GraphQL server build failed, run 'cargo check' for details." && exit 1)
git add graphql/schema.graphql

echo "--- WEBSITE ---"
cd website
echo "Formatting TypeScript code..."
yarn prettier --write src &> /dev/null
echo "Generating Typescript types for GraphQL queries..."
yarn generate
git add src/graphql/*/index.ts
echo "Checking website for errors..."
yarn tsc || exit 1

echo "--- FINAL CHECKS ---"
cd $PROJECT_ROOT
./.git-hooks/pre-commit || exit 1

echo "TODO: Please stage relevant formatting changes"
