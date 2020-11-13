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
        <p>
          DAILP is a community-based digital archive created to support the
          ongoing creation of indigenous peoples’ knowledge, interpretations,
          and representations of the past. DAILP will be a collaborative place
          for indigenous language learners, speakers, and scholars to translate
          documents and other media across American Indian languages.
        </p>
        <p>
          The DAILP
          team is developing a prototype of this translation space using a
          selection of handwritten documents in the Cherokee syllabary that have
          been translated using an online lexical data set drawn from the
          contributions of Cherokee linguists in our collective.
        </p>
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

export const FullWidth = styled.article`
  ${fullWidth}
  flex-grow: 1;
  padding: 0 ${theme.edgeSpacing};
`
