import React from "react"
import { Helmet } from "react-helmet"
import { navigate } from "vite-plugin-ssr/client/router"
import { UserRole, useUserRole } from "src/auth"
import { Link } from "src/components"
import * as Dailp from "src/graphql/dailp"
import { useRouteParams } from "src/renderer/PageShell"
import { chapterRoute } from "src/routes"
import * as util from "src/style/utils.css"
import CWKWLayout from "../cwkw/cwkw-layout"
import * as css from "../cwkw/cwkw-layout.css"
import { DailpPageContents } from "../dailp.page"
import { useChapters, useDialog } from "./edited-collection-context"

// Renders an edited collection page based on the route parameters.
const EditedCollectionPage = () => {
  const { collectionSlug } = useRouteParams()
  const dialog = useDialog()
  const userRole = useUserRole()

  const chapters = useChapters()
  const [{ data: dailp }] = Dailp.useEditedCollectionsQuery()

  let collection = dailp?.allEditedCollections.find(
    ({ slug }) => slug === collectionSlug
  )

  // Backup: Try to find collection with underscore/hyphen conversion
  if (!collection && dailp?.allEditedCollections) {
    const alternativeSlug =
      collectionSlug?.replace("-", "_") || collectionSlug?.replace("_", "-")
    collection = dailp.allEditedCollections.find(
      ({ slug }) => slug === alternativeSlug
    )
  }

  // Use fallback chapters from EditedCollectionsQuery if EditedCollectionQuery fails
  const fallbackChapters = collection?.chapters
  const effectiveChapters =
    chapters && chapters.length > 0 ? chapters : fallbackChapters

  // Generate slug for fallback chapters that don't have it
  const firstChapter =
    effectiveChapters && effectiveChapters.length > 0
      ? effectiveChapters[0]
      : null
  const firstChapterSlug = firstChapter
    ? "slug" in firstChapter
      ? firstChapter.slug
      : firstChapter.path[firstChapter.path.length - 1]
    : null

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

          <DailpPageContents path={`/${collectionSlug}`} />

          <h3>
            {firstChapterSlug ? (
              <Link href={chapterRoute(collectionSlug!, firstChapterSlug)}>
                Begin reading
              </Link>
            ) : firstChapter ? (
              <span>First chapter found but missing slug</span>
            ) : (
              <span>No chapters found</span>
            )}
          </h3>
        </article>
      </main>
    </CWKWLayout>
  )
}
export const Page = EditedCollectionPage
