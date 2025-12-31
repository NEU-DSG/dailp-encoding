import React from "react"
import { Helmet } from "react-helmet"
import { navigate } from "vite-plugin-ssr/client/router"
import cwkwLogo from "src/assets/cwkw-logo.png"
import { UserRole, useUserRole } from "src/auth"
import { Card, Carousel, WordpressPage } from "src/components"
import { fullWidth, paddedCenterColumn, storyCardGroup } from "src/style/utils.css"
import * as Dailp from "../graphql/dailp"
import Layout from "../layout"
import { collectionRoute } from "../routes"
import HomepageHeader from "src/components/homepage-header"
import StoryCard from "src/components/story-card"

/** Lists all documents in our database */
const IndexPage = () => {
  const [{ data: dailp }] = Dailp.useEditedCollectionsQuery()
  const userRole = useUserRole()

  // Show loading state while determining user role
  if (userRole === undefined) {
    return (
      <Layout>
        <Helmet title="Collections" />
        <main className={paddedCenterColumn}>
          <article className={fullWidth}>
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <p>Loading...</p>
            </div>
          </article>
        </main>
      </Layout>
    )
  }

  return (
    <Layout>
      <Helmet title="Collections" />
      <main className={paddedCenterColumn}>
        <article className={fullWidth}>
          <HomepageHeader
            button_left={{
              text: "Our Team",
              link: "/home/credits/"
            }}
            button_right={{
              text: "Our Collections",
              link: "#collection-section"
            }}
          />
          <WordpressPage slug="/" />

          <h1>Latest Stories</h1>
          <div className={storyCardGroup}>
            <StoryCard
              thumbnail="https://wp.dailp.northeastern.edu/wp-content/uploads/2022/06/20181124-IMG-1118-PS-bw-WKG1-1.jpeg"
              header={{
                text: "Dollie Duncan Letter Inspires Opera",
                link: "https://dev.dailp.northeastern.edu/dollie-duncan-letter-inspires-opera"
              }}
              subheading="Victor Mendevil"
            />

            <StoryCard
              header={{
                text: "About the Editors of CWKW",
                link: "https://dev.dailp.northeastern.edu/editors"
              }}
              subheading="Megan Cassidy"
            />

            <StoryCard
              header={{
                text: "The Importance of Language Persistence",
                link: "https://dev.dailp.northeastern.edu/dailp-language-preservation-narrative"
              }}
              subheading="Megan Cassidy"
            />
          </div>

          <h1 id="collection-section">Digital Edited Collections</h1>
          {userRole === UserRole.Editor && (
            <div style={{ marginBottom: "20px" }}>
              <button
                onClick={() => navigate("/collections/new")}
                style={{
                  padding: "10px 20px",
                  fontSize: "16px",
                  cursor: "pointer",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>+</span>
                Create New Collection
              </button>
            </div>
          )}
          <ul>
            {dailp?.allEditedCollections.map((collection) => (
              <Card
                thumbnail={collection.thumbnailUrl ?? cwkwLogo}
                header={{
                  text: collection.title,
                  link: collectionRoute(collection.slug),
                }}
                description={
                  collection.description
                    ? collection.description
                    : "A collection of eighty-seven Cherokee syllabary documents translated by Cherokee speakers and annotated by teams of students, linguists, and Cherokee community members. Audio files for each translation coming soon."
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
    src: "https://wp.dailp.northeastern.edu/wp-content/uploads/2020/01/Screen-Shot-2020-01-07-at-7.53.23-PM-300x253.png",
    alt: "Example of handwritten Cherokee syllabary in notebook",
  },
  {
    src: "https://wp.dailp.northeastern.edu/wp-content/uploads/2020/01/Screen-Shot-2020-01-07-at-9.30.13-PM-184x300.png",
    alt: "'Our Banner' notebook with triangle flag and decorative swirls on cover",
  },
]
