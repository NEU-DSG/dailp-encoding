# DAILP Renderer

This package renders a static website using React and Gatsby that includes all annotated documents produced by the DAILP project.
These documents are connected to a Cherokee lexical database using our GraphQL endpoint.
The latest commit to the `master` branch is automatically deployed to [`dailp-encoding.surge.sh`](https://dailp-encoding.surge.sh).

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
The front-end build process ingests the GraphQL schema on demand to produce [data types](graphql-types.ts) compatible with Typescript/Javascript.
Thus, we define our types once in [the back-end](../encoder) and those definitions propagate all the way here.

## Features of this approach

- Built with [`gatsby`](https://www.gatsbyjs.com/) as a static site to minimize load times and remove the need for a web server. [Comparison to Wordpress](https://www.gatsbyjs.com/features/cms/gatsby-vs-wordpress/)
- Pre-caching and offline access using a web manifest and [`gatsby-plugin-offline`](https://www.gatsbyjs.com/plugins/gatsby-plugin-offline)
- Deployed on [Netlify](https://www.netlify.com/), which provides a top-class CDN and branch deploys: a unique deployment URL for each branch in git, making parallel prototyping and code review a breeze.
- Uses [`typescript`](https://www.typescriptlang.org/) to provide compile-time type safety and validation to Javascript.
- Uses [`linaria`](https://github.com/callstack/linaria) for styling so that we can write scoped styles that live directly on React components without managing CSS classes.
  Incurs zero runtime overhead as styles are extracted into CSS files at build time.
