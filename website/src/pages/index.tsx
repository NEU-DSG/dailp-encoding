import React from "react"
import { graphql, Link } from "gatsby"
import { styled } from "linaria/react"
import Layout from "../layout"
import theme, { fullWidth } from "../theme"
import { collectionRoute } from "../routes"

/** Lists all documents in our database */
const IndexPage = (props: { data: GatsbyTypes.IndexPageQuery }) => (
  <Layout title="Collections">
    <DocIndex>
      <FullWidth>
        <h1>Cherokee Manuscript Collections</h1>
        <ul>
          {props.data.dailp.allCollections.map((collection) => (
            <li key={collection.slug}>
              <Link to={collectionRoute(collection.slug)}>
                {collection.name}
              </Link>
            </li>
          ))}
        </ul>
      </FullWidth>
    </DocIndex>
  </Layout>
)
export default IndexPage

export const query = graphql`
  query IndexPage {
    dailp {
      allCollections {
        name
        slug
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
  padding: 0 ${theme.edgeSpacing};
`
