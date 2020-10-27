import React from "react"
import { graphql, Link } from "gatsby"
import { Helmet } from "react-helmet"
import { styled } from "linaria/react"
import _ from "lodash"
import Layout from "../layout"
import theme, { fullWidth } from "../theme"
import { collectionRoute } from "../routes"

/** Lists all documents in our database */
const IndexPage = (props: { data: GatsbyTypes.IndexPageQuery }) => {
  const collections = props.data.dailp.allCollections

  return (
    <Layout title="Collections">
      <DocIndex>
        <FullWidth>
          {collections.map((collection) => (
            <Link key={collection.slug} to={collectionRoute(collection.slug)}>
              <h2>{collection.name}</h2>
            </Link>
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
