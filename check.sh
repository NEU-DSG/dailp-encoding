#!/usr/bin/env bash

git-staged() {
    ! git diff --no-patch --staged --exit-code "$PROJECT_ROOT/$1"
}

cd $PROJECT_ROOT

if git-staged "types/queries/**.sql"; then
    echo "Generating SQL types..."
    dev-generate-types || exit 1
fi

echo "Checking back-end for errors..."
cargo check &> /dev/null || (printf "\nBack-end is broken, run 'cargo check' to see the errors.\n" && exit 1)

echo "Generating GraphQL schema..."
cargo run --bin dailp-graphql-schema &> /dev/null || (echo "Failed, run 'cargo check' to see the errors." && exit 1)
echo "Generating Typescript types for GraphQL queries..."
yarn --cwd website generate || exit 1

./.git-hooks/pre-commit

exit $HOOKS_FAILED
