# DAILP

This is a repository for the data structure and website code of the Digital Archive of American Indian Languages Preservation and Perseverance project.
Explore Cherokee manuscripts and language data at our website [dailp.netlify.app](https://dailp.netlify.app).

![CI](https://github.com/NEU-DSG/dailp-encoding/workflows/CI/badge.svg)

To trigger a new deploy of our data, go [here](https://github.com/NEU-DSG/dailp-encoding/actions?query=workflow%3ACI) and click `Run workflow`.
This process pulls in all our annotated spreadsheets, puts them into our database and converts them to TEI.
The job also runs automatically every time a commit is pushed to the `main` branch, and deploys the [`website`](website) on [Netlify](https://www.netlify.com/).

## Project Structure

The back-end is implemented in [Rust](https://rust-lang.org) and the front-end is written in [TypeScript](https://www.typescriptlang.org/).
Each layer of the architecture is split into its own directory, starting with the back-end.
Each directory has its own `README` with further information.

- [`types/`](types) defines all the types that our data adheres to in the database, GraphQL, and front-end.
- [`migration/`](migration) pulls data from several Google Drive spreadsheets, conforms it to consistent types, then writes it all to a MongoDB instance.
- [`graphql/`](graphql) exposes a public [GraphQL](https://graphql.org/) endpoint (deployed on [AWS Lambda](https://aws.amazon.com/lambda/)) that allows one to query DAILP data from the database.
- [`website/`](website) renders a static site with [Gatsby](https://gatsbyjs.org/) using our GraphQL endpoint at build time and at runtime (to handle user queries).
- [`xml/`](xml) contains templates and a schema for defining TEI XML documents using DAILP data.
