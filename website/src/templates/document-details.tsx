import React from "react"
import { graphql } from "gatsby"
import Layout from "../layout"
import { Helmet } from "react-helmet"
import { DocumentTitleHeader } from "./annotated-document"
import { css } from "linaria"
import { fullWidth } from "../theme"

const DocumentDetails = (p: { data: GatsbyTypes.DocumentDetailsQuery }) => {
  const doc = p.data.dailp.document!
  return (
    <Layout>
      <main>
        <Helmet>
          <title>{doc.title} - Details</title>
        </Helmet>
        <DocumentTitleHeader doc={doc} showDetails={false} />
        <section className={wideSection}>
          <h3>Contributors</h3>
          <ul>
            {doc.contributors.map((person) => (
              <li key={person.name}>
                {person.name}: {person.role}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </Layout>
  )
}
export default DocumentDetails

export const query = graphql`
  query DocumentDetails($id: String!) {
    dailp {
      document(id: $id) {
        id
        slug
        title
        collection {
          name
          slug
        }
        date {
          year
        }
        contributors {
          name
          role
        }
        sources {
          name
          link
        }
      }
    }
  }
`

const wideSection = css`
  ${fullWidth}
`
