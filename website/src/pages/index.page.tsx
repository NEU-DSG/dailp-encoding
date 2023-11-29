import React from "react"
import { Helmet } from "react-helmet"
import cwkwLogo from "src/assets/cwkw-logo.png"
import { Card, Carousel, WordpressPage } from "src/components"
import { fullWidth, paddedCenterColumn } from "src/style/utils.css"
import * as Dailp from "../graphql/dailp"
import Layout from "../layout"
import { collectionRoute } from "../routes"

/** Lists all documents in our database */
const IndexPage = () => {
  const [{ data: dailp }] = Dailp.useEditedCollectionsQuery()
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

          <h1>Digital Edited Collections</h1>
          <ul>
            {dailp?.allEditedCollections.map((collection) => (
              <Card
                thumbnail={cwkwLogo}
                header={{
                  text: collection.title,
                  link: collectionRoute(collection.slug),
                }}
                description={
                  "A collection of eighty-seven Cherokee syllabary documents translated by Cherokee speakers and annotated by teams of students, linguists, and Cherokee community members. Audio files for each translation coming soon."
                }
              />
            ))}
          </ul>
        </article>
      </main>
    </Layout>
  )
}
export const Page = IndexPage

const carouselImages = [
  {
    src:
      "https://wp.dailp.northeastern.edu/wp-content/uploads/2020/01/Screen-Shot-2020-01-07-at-7.53.23-PM-300x253.png",
    alt: "Example of handwritten Cherokee syllabary in notebook",
  },
  {
    src:
      "https://wp.dailp.northeastern.edu/wp-content/uploads/2020/01/Screen-Shot-2020-01-07-at-9.30.13-PM-184x300.png",
    alt:
      "'Our Banner' notebook with triangle flag and decorative swirls on cover",
  },
]
