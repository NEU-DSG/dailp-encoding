import React from "react"
import { graphql, Link } from "gatsby"
import { styled } from "linaria/react"
import { css, cx } from "linaria"
import { Helmet } from "react-helmet"
import "@fortawesome/fontawesome-free/css/fontawesome.css"
import "@fortawesome/fontawesome-free/css/solid.css"
import Layout from "../layout"
import theme, { fullWidth, wordpressUrl } from "../theme"
import { collectionRoute } from "../routes"
import { Carousel } from "../carousel"

/** Lists all documents in our database */
const IndexPage = (props: { data: GatsbyTypes.IndexPageQuery }) => (
  <Layout title="Collections">
    <Helmet>
      <link
        type="text/css"
        rel="stylesheet"
        href={`${wordpressUrl}/wp-content/themes/quest-child/style.css?ver=4.9.16`}
      />
    </Helmet>
    <DocIndex>
      <FullWidth>
        <Carousel
          images={carouselImages}
          caption="Digital Archive of American Indian Languages Preservation and Perseverance"
        />
        <div
          dangerouslySetInnerHTML={{ __html: props.data.aboutPage?.content }}
        />
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
    aboutPage: wpPage(slug: { eq: "home" }) {
      title
      content
    }
  }
`

const carouselImages = [
  "https://wp.dailp.northeastern.edu/wp-content/uploads/2020/01/Screen-Shot-2020-01-07-at-7.53.23-PM-300x253.png",
  "https://wp.dailp.northeastern.edu/wp-content/uploads/2020/01/Screen-Shot-2020-01-07-at-9.30.13-PM-184x300.png",
]

export const DocIndex = styled.main`
  padding-left: ${theme.edgeSpacing};
  padding-right: ${theme.edgeSpacing};
  display: flex;
  flex-flow: column wrap;
  align-items: center;
`

export const FullWidth = styled.article`
  ${fullWidth};
  flex-grow: 1;
`
