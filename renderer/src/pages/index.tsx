import React from "react"
import { graphql, Link } from "gatsby"
import { Helmet } from "react-helmet"
import { styled } from "linaria/react"
import Layout from "../layout"

export default ({ data }) => {
  const documents = data.dailp.documents
  const docsByCategory = groupBy(documents, "source")
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
      documents {
        id
        title
        source
      }
    }
  }
`

const DocIndex = styled.main`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
`

const FullWidth = styled.section`
  max-width: 1024px;
`

const groupBy = (xs, key) =>
  xs.reduce((rv, x) => {
    const entry = (rv[x[key]] = rv[x[key]] || [])
    entry.push(x)
    return rv
  }, {})
