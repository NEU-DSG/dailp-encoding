# DAILP

![CI](https://github.com/NEU-DSG/dailp-encoding/workflows/CI/badge.svg)

This is a repository for the data structure and website code of the Digital Archive of Indigenous Language Persistence ([DAILP](https://dailp.northeastern.edu)) project at [Northeastern University](https://northeastern.edu).

Check out the [project wiki](https://github.com/NEU-DSG/dailp-encoding/wiki) for further information about the project, how it's built, and how to contribute.

## Plans

This project is a **prototype** intended to gather stakeholder feedback on the utility and usability of our interface for exploring Cherokee texts.
We are building out this web interface to drive our decisions on data structures that may outlast the current website.
This prototype is likely to change quickly in significant ways, especially as we pursue technical integration with [Digital Scholarship Group](https://dsg.northeastern.edu/) infrastructure.

Feel free to [submit an issue](https://github.com/NEU-DSG/dailp-encoding/issues/new) if you have feedback, suggestions, questions, or problems!

## Project Structure

The back-end is implemented in [Rust](https://rust-lang.org) and the front-end is written in [TypeScript](https://www.typescriptlang.org/).
Each layer of the architecture is split into its own directory, starting with the back-end.

- [`types/`](types) defines all the types that our data adheres to in the database, GraphQL, and front-end.
- [`migration/`](migration) pulls data from several Google Drive spreadsheets, conforms it to consistent types, then writes it all to a database.
- [`graphql/`](graphql) exposes a public [GraphQL](https://graphql.org/) endpoint (deployed on [AWS Lambda](https://aws.amazon.com/lambda/)) that allows one to query DAILP data from the database.
  [Play with the data here](https://dailp.northeastern.edu/graphql).
- [`website/`](website) renders a static site using our GraphQL endpoint at build time and at runtime (to handle user queries).

Read more on [the wiki](https://github.com/NEU-DSG/dailp-encoding/wiki/Technical-Design).

## Contributing

We use the [Nix package manager](https://nixos.org/) for managing dependencies, development environments, and predictable infrastructure.
Before contributing, ask a maintainer for a `.env` file which will hold secrets required to run the code.
This file must never be committed on Git.

To get started with a development environment, you only need to install Nix by following [these instructions](https://nixos.org/download.html#nix-quick-install).
After that, the `nix` command will be available in a terminal.
We use an unstable feature of `nix` called "flakes," which is enabled by default with the .envrc[feature](https://nixos.wiki/wiki/Flakes).

Then, you can start a shell which has all the tools needed to work on this project:

```sh
$ nix develop
```

Once you are in the development shell, you can manage the back-end with [Cargo](https://doc.rust-lang.org/cargo/) and the front-end with [Yarn](https://yarnpkg.com/). For example, this command runs all back-end unit tests:

```sh
$ cargo test
```

Inside the `nix develop` shell, the following commands launch various pieces of our infrastructure locally.

```sh
$ dev-database
$ dev-graphql
$ dev-website
```

If you run each of these commands in a separate shell, then you'll have a fully operational local test environment.
If it's your first time running the project locally, your database is probably empty.
With `dev-database` running, run the `dev-migrate-schema` and `dev-migrate-data` commands to structure your database and populate it with data from the DAILP spreadsheets.
## Local development with Docker Compose 

Run the entire stack 
```sh 
docker compose -f infra/local/compose.yaml up --profile frontend up --build
```
#### Manage user accounts with local cognito

```sh
# Create a local user (the script prompts for a password)
docker compose -f infra/local/compose.yaml run --rm \
  cognito-users create editor@example.test

# Add the existing user to a group
docker compose -f infra/local/compose.yaml run --rm \
  cognito-users add-group editor@example.test Editors

docker compose -f infra/local/compose.yaml run --rm \
  cognito-users create contributor@example.test Contributors

# Confirm the user created from the website 
docker compose -f infra/local/compose.yaml run --rm \
  cognito-users confirm editor@example.test
```
#### Endpoint Locations 
The endpoints are 
- Website: [http://127.0.0.1:3001](http://127.0.0.1:3001)
- GraphQL Playground: [http://127.0.0.1:8080/graphql](http://127.0.0.1:8080/graphql)

#### Signing up via website 

Signing up for an account its easier to have the compose running in a background terminal,  
and the logs will display the confirmation verification code.

Once verified, you'll still need to confirm the user via the script and add them to the proper
group.

#### Local UI test collection with Docker Compose

Start the frontend stack and wait for GraphQL to finish running the schema migrations:

```sh
docker compose -f infra/local/compose.yaml --profile frontend up -d
```
From the repo root, load the [local seed data](infra/local/seed.sql):

```sh
docker compose -f infra/local/compose.yaml exec -T postgres \
  psql -X -U dailp -d dailp -v ON_ERROR_STOP=1 --single-transaction -f - \
  < infra/local/seed.sql
```
This will create a smoke test collection that you can then use to test the UI with new chapters  
and content. 

This is a temporary measure until we unlock a better collection creation flow.

### Cleaning Up

`nix` caches build results to make future builds quicker.
However, this can take up a lot of disk space if you're making lots of code changes.
To clean up the nix cache, simply run:

```sh
$ nix-collect-garbage
```
