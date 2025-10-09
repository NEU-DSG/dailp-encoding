import React, { useEffect } from "react"
import { Helmet } from "react-helmet"
import { navigate } from "vite-plugin-ssr/client/router"
import { UserRole, useUserRole } from "src/components/auth"
import { Link, WordpressPage } from "src/components"
import * as Dailp from "src/graphql/dailp"
import { useRouteParams } from "src/renderer/PageShell"
import { chapterRoute } from "src/routes"
import * as util from "src/style/utils.css"
import CWKWLayout from "../cwkw/cwkw-layout"
import * as css from "../cwkw/cwkw-layout.css"
import { useChapters, useDialog } from "./edited-collection-context"

// Renders an edited collection page based on the route parameters.
const EditedCollectionPage = () => {
  const { collectionSlug } = useRouteParams()
  const dialog = useDialog()
  const userRole = useUserRole()

  const chapters = useChapters()
  const firstChapter = chapters ? chapters[0] : null

  const [{ data: dailp }] = Dailp.useEditedCollectionsQuery()
  let collection = dailp?.allEditedCollections.find(
    ({ slug }) => slug === collectionSlug
  )

  if (!collection) {
    return null
  }

  // Show loading state while determining user role
  if (userRole === undefined) {
    return (
      <CWKWLayout>
        <Helmet>
          <meta name="robots" content="noindex,nofollow" />
        </Helmet>
        <main className={util.paddedCenterColumn}>
          <article className={dialog.visible ? css.leftMargin : util.fullWidth}>
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <p>Loading...</p>
            </div>
          </article>
        </main>
      </CWKWLayout>
    )
  }

  return (
    <CWKWLayout>
      <Helmet>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <main className={util.paddedCenterColumn}>
        <article className={dialog.visible ? css.leftMargin : util.fullWidth}>
          <header>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h1>{collection.title}</h1>
            </div>
          </header>

          <h3>
            A digital collection presented by{" "}
            <Link href="https://dailp.northeastern.edu/">DAILP</Link>
          </h3>

          <WordpressPage slug={`/${collectionSlug}`} />

          <h3>
            {firstChapter ? (
              <Link href={chapterRoute(collectionSlug!, firstChapter.slug)}>
                Begin reading
              </Link>
            ) : null}
          </h3>
        </article>
      </main>
    </CWKWLayout>
  )
}
export const Page = EditedCollectionPage
