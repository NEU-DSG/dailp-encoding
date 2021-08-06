# DAILP

![CI](https://github.com/NEU-DSG/dailp-encoding/workflows/CI/badge.svg)

This is a repository for the data structure and website code of the Digital Archive of American Indian Languages Preservation and Perseverance ([DAILP](https://dailp.northeastern.edu)) project at [Northeastern University](https://northeastern.edu).

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
- [`migration/`](migration) pulls data from several Google Drive spreadsheets, conforms it to consistent types, then writes it all to a MongoDB instance.
- [`graphql/`](graphql) exposes a public [GraphQL](https://graphql.org/) endpoint (deployed on [AWS Lambda](https://aws.amazon.com/lambda/)) that allows one to query DAILP data from the database.
  [Play with the data here](https://dailp.northeastern.edu/graphql).
- [`website/`](website) renders a static site with [Gatsby](https://gatsbyjs.org/) using our GraphQL endpoint at build time and at runtime (to handle user queries).
- [`xml/`](xml) contains templates and a schema for defining TEI XML documents using DAILP data.

Read more on [the wiki](https://github.com/NEU-DSG/dailp-encoding/wiki/Technical-Design).

## Contributing

We use the [Nix package manager](https://nixos.org/) for managing dependencies, development environments, and predictable infrastructure.
Before contributing, ask a maintainer for a `.env` file which will hold secrets required to run the code.
This file must never be committed on Git.

To get started with a development environment, you only need to install Nix by following [these instructions](https://nixos.org/download.html#nix-quick-install).
After that, the `nix` command will be available in a terminal. Then, you can start a shell which has all the tools needed to work on this project:

```sh
$ nix develop
```

Once you are in the devshell, you can manage the back-end with [Cargo](https://doc.rust-lang.org/cargo/) and the front-end with [Yarn](https://yarnpkg.com/). For example, this command runs all back-end unit tests:

```sh
$ cargo test
```

The next commands start a local version of the front-end.

```sh
$ cd website
$ yarn install
$ yarn start
```
