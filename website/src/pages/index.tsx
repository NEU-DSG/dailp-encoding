import React from "react"
import { graphql, Link } from "gatsby"
import { Helmet } from "react-helmet"
import { styled } from "linaria/react"
import _ from "lodash"
import slugify from "slugify"
import Layout from "../layout"
import theme, { fullWidth } from "../theme"

/** Lists all documents in our database */
const IndexPage = (props: { data: GatsbyTypes.IndexPageQuery }) => {
  const documents = props.data.dailp.allDocuments
  const docsByCategory = _.groupBy(documents, "collection")
  return (
    <Layout>
      <Helmet>
        <title>DAILP Document Viewer</title>
      </Helmet>
      <DocIndex>
        {Object.entries(docsByCategory).map(([collection, documents]) => (
          <FullWidth key={collection}>
            <h2>{collection}</h2>
            <ul>
              {documents.map((document) => {
                const slug = slugify(document.id, { lower: true })
                return (
                  <li key={document.id}>
                    <Link to={`/documents/${slug}`}>{document.title}</Link>{" "}
                    {document.date && `(${document.date.year})`}
                  </li>
                )
              })}
            </ul>
          </FullWidth>
        ))}
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
        genre
        date {
          year
        }
      }
    }
  }
`

export const DocIndex = styled.main`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
`

export const FullWidth = styled.section`
  ${fullWidth}
  flex-grow: 1;
`
