import React from "react"
import { graphql, Link } from "gatsby"
import { styled } from "linaria/react"
import { css, cx } from "linaria"
import { Helmet } from "react-helmet"
import Layout from "../layout"
import theme, { fullWidth } from "../theme"
import { collectionRoute } from "../routes"
import "@fortawesome/fontawesome-free/css/fontawesome.css"

const images = [
  "https://dailp.northeastern.edu/wp-content/uploads/2020/01/Screen-Shot-2020-01-07-at-7.53.23-PM-300x253.png",
  "https://dailp.northeastern.edu/wp-content/uploads/2020/01/Screen-Shot-2020-01-07-at-9.30.13-PM-184x300.png",
]

/** Lists all documents in our database */
const IndexPage = (props: { data: GatsbyTypes.IndexPageQuery }) => (
  <Layout title="Collections">
    <Helmet>
      <link
        type="text/css"
        rel="stylesheet"
        href="https://dailp.northeastern.edu/wp-content/themes/quest-child/style.css?ver=4.9.16"
      />
      <script
        type="text/javascript"
        src="https://dailp.northeastern.edu/wp-includes/js/jquery/jquery.js?ver=1.12.4"
      />
      <script
        type="text/javascript"
        src="https://dailp.northeastern.edu/wp-content/themes/quest/assets/js/quest-and-plugins.js?ver=4.9.16"
      ></script>
      <script
        type="text/javascript"
        src="https://dailp.northeastern.edu/wp-content/plugins/drs-tk/assets/js/gallery.js?ver=4.9.16"
      ></script>
      <script
        type="text/javascript"
        src="https://dailp.northeastern.edu/wp-includes/js/imagesloaded.min.js?ver=3.2.0"
      ></script>
    </Helmet>
    <DocIndex>
      <FullWidth>
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


export const DocIndex = styled.main`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  padding-top: 1.5rem;

  .carousel {
    position: relative;
    .carousel-inner {
      position: relative;
      overflow: hidden;
    }
    .carousel-control {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 15%;
      font-size: 20px;
      color: ${theme.colors.text};
      text-align: center;
      & > * {
        position: absolute;
        top: 50%;
      }
      &.right {
        right: 0;
        left: auto;
      }
    }
    .item {
      position: relative;
      transition: transform 0.6s ease-in-out;
      backface-visibility: hidden;
      display: none;
      left: 0;

      &.active {
        display: block;
        position: relative;
      }
      &.next,
      &.prev {
        display: block;
        position: absolute;
        top: 0;
        width: 100%;
      }
      &.next.left,
      &.prev.right,
      &.active {
        transform: translate3d(0, 0, 0);
      }
      &.next,
      &.active.right {
        transform: translate3d(100%, 0, 0);
      }
      &.prev,
      &.active.left {
        transform: translate3d(-100%, 0, 0);
      }
    }
  }
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
