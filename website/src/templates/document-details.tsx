import React from "react"
import { graphql } from "gatsby"
import Layout from "../layout"
import { Helmet } from "react-helmet"
import { DocumentTitleHeader } from "./annotated-document"
import { styled } from "linaria/react"
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
        <WideSection>
          <h3>People Involved</h3>
          <ul>
            {doc.people.map((person) => (
              <li key={person.name}>
                {person.name}: {person.role}
              </li>
            ))}
          </ul>
        </WideSection>
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
        people {
          name
          role
        }
      }
    }
  }
`

const WideSection = styled.section`
  ${fullWidth}
`
