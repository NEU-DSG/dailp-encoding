import React, { useEffect } from "react"
import ReactDOM from "react-dom"
import { Helmet } from "react-helmet"
import { useUserRole } from "src/auth"
import { Link } from "src/components"
import * as Dailp from "src/graphql/dailp"
import { usePreferences } from "src/preferences-context"
import { useRouteParams } from "src/renderer/PageShell"
import { chapterRoute } from "src/routes"
import * as util from "src/style/utils.css"
import {
  buildCitationString,
  getCollectionName,
  getDateAccessed,
} from "src/utils/document-metadata"
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

  const { preferredCitationStyle } = usePreferences()
  const [citationString, setCitationString] = React.useState<string>("")

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

  const collectionTitle = collection?.title ?? collectionSlug ?? "Collection"

  // Build citation for this collection page and rerender when preferneces changed
  useEffect(() => {
    if (!collection) return
    const url = typeof window !== "undefined" ? window.location.href : ""

    buildCitationString(
      {
        title: collectionTitle,
        creator: (collection.editors ?? []) as string[],
        date: collection.publicationDate ?? undefined,
        accessed: getDateAccessed(),
        source: url,
        containerTitle: getCollectionName(url),
        type: "webpage",
      },
      preferredCitationStyle
    ).then(setCitationString)
  }, [collectionTitle, preferredCitationStyle])

  // Build portal to place in parent by looking for footer slot
  const collectionCitationBar = (() => {
    // Only build portal if document exists, portal exists, or citation exists
    if (typeof document === "undefined") return null
    const slot = document.getElementById("citation-footer-slot")
    if (!slot || !citationString) return null

    return ReactDOM.createPortal(
      <div className={citationCss.citationBar}>
        <div className={citationCss.citationInner}>
          <p className={citationCss.citationText}>
            <span className={citationCss.citationLabel}>
              How to cite this collection:{" "}
            </span>
            {citationString}
          </p>
        </div>
      </div>,
      slot
    )
  })()

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
