# DAILP Website

This package renders a static website using React and Gatsby that includes all annotated documents produced by the DAILP project.
These documents are connected to a Cherokee lexical database using our GraphQL endpoint.
The latest commit to the `main` branch is automatically deployed to [`dailp.northeastern.edu`](https://dailp.northeastern.edu).

<!-- markdown-toc start - Don't edit this section. Run M-x markdown-toc-refresh-toc -->

**Table of Contents**

- [DAILP Website](#dailp-website)
  - [Run locally](#run-locally)
  - [Navigating the Code](#navigating-the-code)
  - [Type-checking](#type-checking)
  - [Features of this approach](#features-of-this-approach)

<!-- markdown-toc end -->

## Run locally

To build and preview the website locally, you need to make a `.env` file in the root project directory with the following contents:

```
DAILP_GRAPHQL_URL=https://e3j0jht905.execute-api.us-east-1.amazonaws.com/prod/graphql
```

Feel free to change the actual URL if you are running a local version of the GraphQL server or otherwise.

After that, you can run the following in a terminal to initially install the dependencies of the project and start a development process:

```
yarn install
yarn start
```

## Navigating the Code

Several folders have documentation to guide you in understanding the code.
There are a few different entry points into the build process of the site.
The best place to start is [`src/pages`](src/pages), where each file represents one page on the site.
On the other hand, each file in [`src/templates`](src/templates) represents a type of page, of which there may be many instances.
Other components in the [`src`](src) folder are general components to be used in specific pages or templates.

## Type-checking

Our whole stack is type-checked.
When data from spreadsheets and other sources are pulled into our database, its format is verified and data types are enforced.
The GraphQL layer mediating access to this data uses the exact same data types, automatically providing access to them in the GraphQL schema.
The front-end build process ingests the GraphQL schema on demand to produce [TypeScript types](src/__generated__/gatsby-types.d.ts).
Thus, we define our types once in the [back-end](../types) and those definitions propagate all the way here.

## Features of this approach

- Built with [`gatsby`](https://www.gatsbyjs.com/) as a static site to minimize load times and remove the need for a web server. [Comparison to Wordpress](https://www.gatsbyjs.com/features/cms/gatsby-vs-wordpress/) and [explanation for content creators](https://www.gatsbyjs.com/docs/winning-over-content-creators/)
- Pre-caching and offline access using a web manifest and [`gatsby-plugin-offline`](https://www.gatsbyjs.com/plugins/gatsby-plugin-offline)
- Uses [`typescript`](https://www.typescriptlang.org/) to provide compile-time type safety and validation to Javascript.
- Uses [`linaria`](https://github.com/callstack/linaria) for styling so that we can write scoped styles that live directly on React components without managing CSS classes.
  Incurs zero runtime overhead as styles are extracted into CSS files at build time.
