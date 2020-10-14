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
