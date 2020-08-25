import React from "react"
import { graphql, Link } from "gatsby"
import { Helmet } from "react-helmet"
import Layout from "../layout"

export default ({ data }) => {
  const documents = data.dailp.documents
  return (
    <Layout>
      <Helmet>
        <title>DAILP Document Viewer</title>
      </Helmet>
      <main>
        <ul>
          {documents.map((document: any) => (
            <li key={document.id}>
              <Link to={`/documents/${document.id.toLowerCase()}`}>
                {document.title}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </Layout>
  )
}

// Pull our XML from any data source.
export const query = graphql`
  query {
    dailp {
      documents {
        id
        title
        source
      }
    }
  }
`
