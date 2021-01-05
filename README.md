# DAILP

![CI](https://github.com/NEU-DSG/dailp-encoding/workflows/CI/badge.svg)

This is a repository for the data structure and website code of the Digital Archive of American Indian Languages Preservation and Perseverance ([DAILP](https://dailp.northeastern.edu)) project at [Northeastern University](https://northeastern.edu).
Explore Cherokee manuscripts and language data at our website [dailp.netlify.app](https://dailp.netlify.app).

## Plans

This project is a **prototype** intended to gather stakeholder feedback on the utility and usability of our interface for exploring Cherokee texts.
We are building out this web interface to drive our decisions on data structures that may outlast the current website.
This prototype is likely to change quickly in significant ways, especially as we pursue technical integration with greater [Digital Scholarship Group](https://dsg.northeastern.edu/) infrastructure near the end of 2020 and early 2021.

In the meantime, feel free to make an issue if you have feedback, suggestions, questions, or problems!

## Project Structure

The back-end is implemented in [Rust](https://rust-lang.org) and the front-end is written in [TypeScript](https://www.typescriptlang.org/).
Each layer of the architecture is split into its own directory, starting with the back-end.
Each directory has its own `README` with further information.

- [`types/`](types) defines all the types that our data adheres to in the database, GraphQL, and front-end.
- [`migration/`](migration) pulls data from several Google Drive spreadsheets, conforms it to consistent types, then writes it all to a MongoDB instance.
- [`graphql/`](graphql) exposes a public [GraphQL](https://graphql.org/) endpoint (deployed on [AWS Lambda](https://aws.amazon.com/lambda/)) that allows one to query DAILP data from the database. [Play with the data here](https://e3j0jht905.execute-api.us-east-1.amazonaws.com/prod/graphql).
- [`website/`](website) renders a static site with [Gatsby](https://gatsbyjs.org/) using our GraphQL endpoint at build time and at runtime (to handle user queries).
- [`xml/`](xml) contains templates and a schema for defining TEI XML documents using DAILP data.

## Development

### You Updated an Annotated Manuscript

Maintainers can trigger a new deploy of our data [here](https://github.com/NEU-DSG/dailp-encoding/actions?query=workflow%3ACI) and click `Run workflow`.
This process pulls in all of our annotated spreadsheets, puts them into our database and converts them to TEI.
Then, the new data is published on the website.
This process also happens automatically every time a code change is made on the `main` branch.

### Data Exploration

If you just want to explore our data without navigating the DAILP website, we host a [GraphQL Playground](https://e3j0jht905.execute-api.us-east-1.amazonaws.com/prod/graphql) that allows you to query the DAILP database.

### Further Documentation

Look no further than the [`doc/`](doc) directory for further notes about project development, testing, and contribution.

- [`doc/user-testing`](doc/user-testing.md) details how we conduct user testing and gather feedback.
