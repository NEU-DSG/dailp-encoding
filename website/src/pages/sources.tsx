import React from "react"
import { graphql } from "gatsby"
import { css } from "linaria"
import _ from "lodash"
import Layout from "../layout"
import { fullWidth, std, typography } from "../theme"
import { sourceCitationId } from "../routes"

export default (p: { data: GatsbyTypes.AllSourcesQuery }) => {
  return (
    <Layout title="Sources Index">
      <main>
        <h1 className={wide}>Sources of Cherokee Language Data</h1>
        <ul className={wide}>
          {_.sortBy(
            p.data.dailp.allDocuments.filter((d) => d.isReference),
            (doc) => -doc.date?.year
          ).map((doc) => (
            // Cite each source in APA format.
            <DocumentCitation key={doc.id} document={doc} />
          ))}
        </ul>
      </main>
    </Layout>
  )
}

type LocalDocument = GatsbyTypes.AllSourcesQuery["dailp"]["allDocuments"][0]

const DocumentCitation = (p: { document: LocalDocument }) => {
  const doc = p.document
  const year = doc.date?.year
  const authors = _.join(
    doc.contributors.map((author) => author.name),
    ", "
  )
  return (
    <li id={sourceCitationId(doc.id)} className={apaCitation}>
      <span className={std.smallCaps}>{doc.id}</span>, {doc.formCount} forms:{" "}
      {authors} {year && `(${year})`}. <i>{doc.title}</i>.
    </li>
  )
}

const apaCitation = css`
  padding-left: 4ch;
  text-indent: -4ch;
  margin-bottom: ${typography.rhythm(1)};
`

const wide = css`
  ${fullWidth}
  list-style: none;
  margin-left: 0;
`

export const query = graphql`
  query AllSources {
    dailp {
      allDocuments {
        isReference
        id
        title
        date {
          year
        }
        contributors {
          name
        }
        formCount
      }
    }
  }
`
