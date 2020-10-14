import React from "react"
import { graphql, Link } from "gatsby"
import { Helmet } from "react-helmet"
import Layout from "../layout"
import { DocIndex, FullWidth } from "../pages/index"
import slugify from "slugify"

export default (p: {
  data: GatsbyTypes.CollectionQuery
  pageContext: { name: string }
}) => {
  const documents = p.data.dailp.allDocuments
  return (
    <Layout>
      <Helmet>
        <title>DAILP Document Viewer</title>
      </Helmet>
      <DocIndex>
        <FullWidth>
          <h2>{p.pageContext.name}</h2>
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
        </FullWidth>
      </DocIndex>
    </Layout>
  )
}

export const query = graphql`
  query Collection($name: String!) {
    dailp {
      allDocuments(collection: $name) {
        id
        title
      }
    }
  }
`
