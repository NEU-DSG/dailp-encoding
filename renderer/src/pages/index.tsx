import React from "react"
import { graphql, Link } from "gatsby"
import { Helmet } from "react-helmet"
import { styled } from "linaria/react"
import Layout from "../layout"
import _ from "lodash"
import slugify from "slugify"
import { IndexPageQuery } from "../../graphql-types"

/** Lists all documents in our database */
const IndexPage = (props: { data: IndexPageQuery }) => {
  const documents = props.data.dailp.allDocuments
  const docsByCategory = _.groupBy(documents, "collection")
  return (
    <Layout>
      <Helmet>
        <title>DAILP Document Viewer</title>
      </Helmet>
      <DocIndex>
        <FullWidth>
          {Object.entries(docsByCategory).map(([collection, documents]) => (
            <section key={collection}>
              <h2>{collection}</h2>
              <ul>
                {documents.map(document => {
                  const slug = slugify(document.id, { lower: true })
                  return (
                    <li key={document.id}>
                      <Link to={`/documents/${slug}`}>{document.title}</Link>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </FullWidth>
      </DocIndex>
    </Layout>
  )
}
export default IndexPage

export const query = graphql`
  query IndexPage {
    dailp {
      allDocuments {
        id
        title
        collection
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
