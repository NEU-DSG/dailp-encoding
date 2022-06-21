import React from "react"
import { Helmet } from "react-helmet"
import Link from "src/components/link"
import { fullWidth, paddedCenterColumn } from "src/style/utils.css"
import WordpressPage from "src/wordpress-page"
import { Carousel } from "../carousel"
import * as Dailp from "../graphql/dailp"
import Layout from "../layout"
import { collectionRoute } from "../routes"

/** Lists all documents in our database */
const IndexPage = () => {
  const [{ data: dailp }] = Dailp.useCollectionsListingQuery()
  return (
    <Layout>
      <Helmet title="Collections" />
      <main className={paddedCenterColumn}>
        <article className={fullWidth}>
          <Carousel
            images={carouselImages}
            caption="Digital Archive of Indigenous Language Persistence"
          />
          <WordpressPage slug="/" />

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
        </article>
      </main>
    </Layout>
  )
}
export default IndexPage

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
