import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../layout"
import { Helmet } from "react-helmet"
import { DocHeader } from "./annotated-document"
import { styled } from "linaria/react"
import { fullWidth } from "../theme"
import { documentRoute, collectionRoute } from "../routes"

const DocumentDetails = (p: { data: GatsbyTypes.DocumentDetailsQuery }) => {
  const doc = p.data.dailp.document!
  return (
    <Layout>
      <main>
        <Helmet>
          <title>{doc.title} - Details</title>
        </Helmet>
        <DocHeader>
          <h2>
            <Link to={documentRoute(doc.id)}>{doc.title}</Link>{" "}
            {doc.date && `(${doc.date.year})`}
          </h2>
          <Link to={collectionRoute(doc.collection!)}>
            <h3>{doc.collection}</h3>
          </Link>
        </DocHeader>
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
        title
        collection
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
