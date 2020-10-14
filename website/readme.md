# DAILP Renderer

This package renders a static website using React and Gatsby that includes all annotated documents produced by the DAILP project.
These documents are connected to a Cherokee lexical database using our GraphQL endpoint.
The latest commit to the `master` branch is automatically deployed to [`dailp-encoding.surge.sh`](https://dailp-encoding.surge.sh).

<!-- markdown-toc start - Don't edit this section. Run M-x markdown-toc-refresh-toc -->

**Table of Contents**

- [DAILP Renderer](#dailp-renderer)
  - [Navigating the Code](#navigating-the-code)
  - [Type-checking](#type-checking)
  - [Features of this approach](#features-of-this-approach)
  - [Stakeholder Testing](#stakeholder-testing)

<!-- markdown-toc end -->

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

## Stakeholder Testing

The following is a sketch of how we have thought about approaching stakeholder testing and collaboration.

1. Create multiple interface prototypes for different use cases. (see [Dow et al, 2010](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&ved=2ahUKEwi94P3PppHsAhWlUt8KHXkUA7oQFjABegQIBBAB&url=http%3A%2F%2Fspdow.ucsd.edu%2Ffiles%2FPrototypingParallel-TOCHI10.pdf&usg=AOvVaw3Y9g1TBANvYS0fiy9-50dH) for the value of parallel prototyping)
2. Present all prototypes together to stakeholders in each interest group: learners, experienced speakers, annotators, linguists, etc.
3. Let them play around themselves in the interface. Show and tell can only go so far, and letting stakeholders interact directly with our work will give us much more valuable discussion and feedback.
4. Ask them each questions about their experience, here are some examples:
   - "Would you use this?"
   - "Did one of these interfaces feel more intuitive or useful to you?"
   - "How could each interface be better?"
   - "Does this serve your needs as an X?"
   - "Does this respect your community and position in that community?"
5. Not only on their experience, but solicit feedback on how they themselves and tech-literate members of their community would feel most comfortable contributing to and participating in further development.
   Then we can change our process to facilitate that kind of involvement.
6. Iterate on all of the prototypes separately based on the feedback received.
7. Involve some of the same people and some new people in testing out these refined prototypes, to recognize where we've improved (or not) and where we stand in fresh eyes.
8. Consolidate these prototypes where possible while providing these same stakeholders with a link to our active working primary interface, and to our GitHub repository.
9. Solicit feedback on a single refined prototype that will become the production release candidate.
