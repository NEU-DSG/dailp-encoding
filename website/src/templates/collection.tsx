import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../layout"
import { DocIndex, FullWidth } from "../pages/index"
import { documentRoute } from "../routes"
import { Breadcrumbs } from "../breadcrumbs"

// This collator allows us to sort strings for a particular locale.
const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
})

const CollectionPage = (p: {
  data: GatsbyTypes.CollectionQuery
  pageContext: { name: string }
}) => {
  const documents = [...p.data.dailp.allDocuments]
  // Sort documents into natural order by their ID.
  // This means that "10" comes after "9" instead of after "1".
  documents
    .sort((a, b) => collator.compare(a.id, b.id))
    .sort((a, b) =>
      collator.compare(a.orderIndex.toString(), b.orderIndex.toString())
    )

  return (
    <Layout title={p.pageContext.name}>
      <DocIndex>
        <FullWidth>
          <header>
            <Breadcrumbs aria-label="Breadcrumbs">
              <li>
                <Link to="/">Collections</Link>
              </li>
            </Breadcrumbs>
            <h1>{p.pageContext.name}</h1>
          </header>

          {p.data.wpPage ? (
            <div dangerouslySetInnerHTML={{ __html: p.data.wpPage.content }} />
          ) : null}

          <ul>
            {documents.map((document) => (
              <li key={document.slug}>
                <Link to={documentRoute(document.slug)}>{document.title}</Link>
                {document.date && ` (${document.date.year})`}
              </li>
            ))}
          </ul>
        </FullWidth>
      </DocIndex>
    </Layout>
  )
}
export default CollectionPage

export const query = graphql`
  query Collection($name: String!, $slug: String!) {
    dailp {
      allDocuments(collection: $name) {
        id
        slug
        title
        date {
          year
        }
        orderIndex
      }
    }
    wpPage(slug: { eq: $slug }) {
      content
    }
  }
`
