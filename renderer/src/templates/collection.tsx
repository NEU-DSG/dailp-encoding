import React from "react"
import { graphql, Link } from "gatsby"
import { Helmet } from "react-helmet"
import Layout from "../layout"
import { DocIndex, FullWidth } from "../pages/index"

export default ({ data }) => {
  const documents = data.dailp.allDocuments
  return (
    <Layout>
      <Helmet>
        <title>DAILP Document Viewer</title>
      </Helmet>
      <DocIndex>
        <FullWidth>
          <h2>Collection Name</h2>
          <ul>
            {documents.map((document: any) => (
              <li key={document.id}>
                <Link to={`/documents/${document.id.toLowerCase()}`}>
                  {document.title}
                </Link>
              </li>
            ))}
          </ul>
        </FullWidth>
      </DocIndex>
    </Layout>
  )
}

export const query = graphql`
  query Collection($name: String!) {
    dailp {
      allDocuments(source: $name) {
        id
        title
      }
    }
  }
`
