import React from "react"
import Link from "next/link"
import styled from "@emotion/styled"
import Helmet from "next/head"
import Layout from "../layout"
import theme, { fullWidth, wordpressUrl } from "../theme"
import { collectionRoute } from "../routes"
import { Carousel } from "../carousel"
import * as Dailp from "src/graphql/dailp"
import * as Wordpress from "src/graphql/wordpress"
import { getStaticQueriesNew } from "src/graphql"

/** Lists all documents in our database */
const IndexPage = () => {
  const [{ data: dailp }] = Dailp.useCollectionsListingQuery()
  const [{ data: wp }] = Wordpress.usePageQuery({ variables: { slug: "home" } })

  return (
    <Layout title="Collections">
      <DocIndex>
        <FullWidth>
          <Carousel
            images={carouselImages}
            caption="Digital Archive of American Indian Languages Preservation and Perseverance"
          />
          <div
            dangerouslySetInnerHTML={{ __html: wp?.pages.nodes[0].content }}
          />
          <h1>Cherokee Manuscript Collections</h1>
          <ul>
            {dailp?.allCollections.map((collection) => (
              <li key={collection.slug}>
                <Link href={collectionRoute(collection.slug)}>
                  {collection.name}
                </Link>
              </li>
            ))}
          </ul>
        </FullWidth>
      </DocIndex>
    </Layout>
  )
}
export default IndexPage

export const getStaticProps = getStaticQueriesNew(async (params, dailp, wp) => {
  await dailp.query(Dailp.CollectionsListingDocument).toPromise()
  await wp.query(Wordpress.MainMenuDocument).toPromise()
  await wp
    .query<any, Wordpress.PageQueryVariables>(Wordpress.PageDocument, {
      slug: "home",
    })
    .toPromise()
})

const carouselImages = [
  {
    src: "https://wp.dailp.northeastern.edu/wp-content/uploads/2020/01/Screen-Shot-2020-01-07-at-7.53.23-PM-300x253.png",
    alt: "Example of handwritten Cherokee syllabary in notebook",
  },
  {
    src: "https://wp.dailp.northeastern.edu/wp-content/uploads/2020/01/Screen-Shot-2020-01-07-at-9.30.13-PM-184x300.png",
    alt: "'Our Banner' notebook with triangle flag and decorative swirls on cover",
  },
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
