#!/usr/bin/env bash

git-staged() {
    ! git diff --no-patch --staged --exit-code "$PROJECT_ROOT/$1"
}

cd $PROJECT_ROOT

echo "--- DATABASE ---"
if git-staged "types/queries/**.sql"; then
    echo "Generating SQL types..."
    dev-generate-types || exit 1
fi

echo "--- SERVER ---"
echo "Checking back-end for errors..."
cargo check &> /dev/null \
    || (echo "Back-end build failed, run 'cargo check' for details." && exit 1)

echo "Generating GraphQL schema..."
cargo run --bin dailp-graphql-schema &> /dev/null \
    || (echo "GraphQL server build failed, run 'cargo check' for details." && exit 1)

echo "--- WEBSITE ---"
cd website
echo "Generating Typescript types for GraphQL queries..."
yarn generate
echo "Checking website for errors..."
yarn tsc || exit 1

echo "--- FINAL CHECKS ---"
cd $PROJECT_ROOT
./.git-hooks/pre-commit || exit 1
