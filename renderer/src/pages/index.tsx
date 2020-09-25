import React from "react"
import { graphql, Link } from "gatsby"
import { Helmet } from "react-helmet"
import { styled } from "linaria/react"
import Layout from "../layout"
import _ from "lodash"

export default ({ data }) => {
  const documents = data.dailp.allDocuments
  const docsByCategory = _.groupBy(documents, "source")
  return (
    <Layout>
      <Helmet>
        <title>DAILP Document Viewer</title>
      </Helmet>
      <DocIndex>
        <FullWidth>
          {Object.entries(docsByCategory).map(([source, documents]) => (
            <>
              <h2>{source}</h2>
              <ul>
                {documents.map((document: any) => (
                  <li key={document.id}>
                    <Link to={`/documents/${document.id.toLowerCase()}`}>
                      {document.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ))}
        </FullWidth>
      </DocIndex>
    </Layout>
  )
}

// Pull our XML from any data source.
export const query = graphql`
  query {
    dailp {
      allDocuments {
        id
        title
        source
      }
    }
  }
`

export const DocIndex = styled.main`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
`

export const FullWidth = styled.section`
  max-width: 1024px;
  flex-grow: 1;
`
