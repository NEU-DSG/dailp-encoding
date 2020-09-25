# DAILP Renderer

This package renders a static website using React and Gatsby that includes all annotated documents produced by the DAILP project.
These documents are connected to a Cherokee lexical database using our GraphQL endpoint.
The latest commit to the `master` branch is automatically deployed to [`dailp-encoding.surge.sh`](https://dailp-encoding.surge.sh).

## Features of this approach

- Built with [`gatsby`](https://www.gatsbyjs.com/) as a static site to minimize load times and remove the need for a web server. [Comparison to Wordpress](https://www.gatsbyjs.com/features/cms/gatsby-vs-wordpress/)
- Pre-caching and offline access using a web manifest and [`gatsby-plugin-offline`](https://www.gatsbyjs.com/plugins/gatsby-plugin-offline)
- Deployed on [Netlify](https://www.netlify.com/), which provides a top-class CDN and branch deploys: a unique deployment URL for each branch in git, making parallel prototyping and code review a breeze.
- Uses [`typescript`](https://www.typescriptlang.org/) to provide compile-time type safety and validation to Javascript.
- Uses [`linaria`](https://github.com/callstack/linaria) for styling so that we can write scoped styles that live directly on React components without managing CSS classes.
