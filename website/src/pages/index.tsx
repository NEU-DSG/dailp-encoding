import React from "react"
import { graphql, Link } from "gatsby"
import { styled } from "linaria/react"
import { css, cx } from "linaria"
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from "pure-react-carousel"
import "pure-react-carousel/dist/react-carousel.es.css"
import { BiRightArrow, BiLeftArrow } from "react-icons/bi"

import Layout from "../layout"
import theme, { fullWidth } from "../theme"
import { collectionRoute } from "../routes"

const images = [
  "https://dailp.northeastern.edu/wp-content/uploads/2020/01/Screen-Shot-2020-01-07-at-7.53.23-PM-300x253.png",
  "https://dailp.northeastern.edu/wp-content/uploads/2020/01/Screen-Shot-2020-01-07-at-9.30.13-PM-184x300.png",
]

/** Lists all documents in our database */
const IndexPage = (props: { data: GatsbyTypes.IndexPageQuery }) => (
  <Layout title="Collections">
    <DocIndex>
      <FullWidth>
        <div dangerouslySetInnerHTML={{ __html: props.data.aboutPage?.content }}/>
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

const carousel = css`
  position: relative;
  margin-top: 1rem;
`

const carouselButton = css`
  position: absolute;
  top: 0;
  height: 100%;
  outline: none;
  border: none;
  background: none;
  width: 4rem;
`

const onLeft = css`
  left: 0;
`

const onRight = css`
  right: 0;
`

const centerAlign = css`
  text-align: center;
`
