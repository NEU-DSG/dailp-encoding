import React from "react"
import ReactDOM from "react-dom"
import { Helmet } from "react-helmet"
import { navigate } from "vite-plugin-ssr/client/router"
import { UserRole, useUserRole } from "src/auth"
import { Link } from "src/components"
import * as Dailp from "src/graphql/dailp"
import { useRouteParams } from "src/renderer/PageShell"
import { chapterRoute } from "src/routes"
import * as util from "src/style/utils.css"
import * as citationCss from "../cwkw/citationFooter.css"
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

  // Build APA citation for this collection page
  const collectionCitationBar = (() => {
    // Don't show on doc
    if (typeof document === "undefined") return null

    // Grab slot specifically for citation so long as it exists on page
    const slot = document.getElementById("citation-footer-slot")
    if (!slot) return null

    // Generate collection citation
    const authors = [
      "Ellen Cushman",
      "Ben Frey",
      "Rachel Jackson",
      "Ernestine Berry",
      "Clara Proctor",
      "Naomi Trevino",
      "Jeffrey Bourns",
      "Oleta Pritchett",
      "Tyler Hodges",
      "John Chewey",
      "Shelby Snead",
      "Chan Mi Oh",
      "Kush Patel",
      "Shashwat Patel",
      "Nop Lertsumitkul",
      "Henry Volchonok",
      "Hazelyn Aroian",
      "Victor Mendevil",
    ]

    const authorPart =
      authors.slice(0, -1).join(", ") +
      ", & " +
      authors[authors.length - 1] +
      ". "

    const accessed = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    const url = typeof window !== "undefined" ? window.location.href : ""

    const collectionTitle = collection?.title ?? collectionSlug ?? "Collection"

    const citation =
      authorPart +
      "(2026). " +
      collectionTitle +
      ". CWKW. " +
      url +
      " Retrieved " +
      accessed

    // Place citation bar at given slot
    return ReactDOM.createPortal(
      <div className={citationCss.citationBar}>
        <div className={citationCss.citationInner}>
          <p className={citationCss.citationText}>
            <span className={citationCss.citationLabel}>
              How to cite this collection:{" "}
            </span>
            {citation}
          </p>
        </div>
      </div>,
      slot
    )
  })()

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
            A digital collection presented by <Link href="/">DAILP</Link>
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
      {collectionCitationBar}
    </CWKWLayout>
  )
}
export const Page = EditedCollectionPage
