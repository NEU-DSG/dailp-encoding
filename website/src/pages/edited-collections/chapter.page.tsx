import React, { useEffect } from "react"
import ReactDOM from "react-dom"
import { Helmet } from "react-helmet"
import { Breadcrumbs, Link } from "src/components"
import * as Dailp from "src/graphql/dailp"
import { usePreferences } from "src/preferences-context"
import { chapterRoute, collectionRoute } from "src/routes"
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
import { DocumentTitleHeader, TabSet } from "../documents/document.page"
import * as chapterStyle from "./chapter.css"
import { useDialog, useSubchapters } from "./edited-collection-context"

const ChapterPage = (props: {
  collectionSlug: string
  chapterSlug: string
}) => {
  const [{ data, error, fetching }] = Dailp.useCollectionChapterQuery({
    variables: {
      collectionSlug: props.collectionSlug,
      chapterSlug: props.chapterSlug,
    },
  })

  const dialog = useDialog()
  const subchapters = useSubchapters(props.chapterSlug)

  const { preferredCitationStyle } = usePreferences()
  const [citationString, setCitationString] = React.useState<string>("")

  // Generate citation and rerender on change for preferences being changed
  useEffect(() => {
    const chapter = data?.chapter
    if (!chapter || chapter.document) return

    const url = typeof window !== "undefined" ? window.location.href : ""

    buildCitationString(
      {
        title: chapter.title ?? "",
        creator: (chapter.authors ?? []) as string[],
        date: chapter.publicationDate ?? undefined,
        accessed: getDateAccessed(),
        source: url,
        containerTitle: getCollectionName(url),
        type: "webpage",
      },
      preferredCitationStyle
    ).then(setCitationString)
  }, [data, preferredCitationStyle])

  if (fetching) {
    return <>Loading...</>
  }

  if (error) {
    return <>Error: {error.message}</>
  }

  if (!data?.chapter) {
    return (
      <>
        Chapter not found for collection: {props.collectionSlug}, chapter:{" "}
        {props.chapterSlug}
      </>
    )
  }

  const chapter = data.chapter
  const { document: chapterDocument, wordpressId } = chapter

  // Build portal to place in parent by looking for footer slot
  const chapterCitationFooter = (() => {
    // Only build portal if document exists, portal exists, or citation exists
    if (chapterDocument) return null
    if (typeof document === "undefined") return null
    const slot = document.getElementById("citation-footer-slot")
    if (!slot || !citationString) return null

    return ReactDOM.createPortal(
      <div className={citationCss.citationBar}>
        <div className={citationCss.citationInner}>
          <p className={citationCss.citationText}>
            <span className={citationCss.citationLabel}>
              How to cite this chapter:{" "}
            </span>
            {citationString}
          </p>
        </div>
      </div>,
      slot
    )
  })()

  return (
    <CWKWLayout>
      <Helmet title={chapter.title} />
      <main className={util.paddedCenterColumn}>
        <article className={dialog.visible ? css.leftMargin : util.fullWidth}>
          {/* If this chapter contains or is a Wordpress page, display the WP page contents. */}
          {wordpressId && chapter.slug ? (
            <>
              <header className={chapterStyle.docHeader}>
                <Breadcrumbs aria-label="Breadcrumbs">
                  {chapter.breadcrumbs
                    .map((crumb) => (
                      <Link
                        href={`${collectionRoute(props.collectionSlug)}/${
                          crumb.slug
                        }`}
                        key={crumb.slug}
                      >
                        {crumb.name}
                      </Link>
                    ))
                    .concat(
                      <Link
                        href={`${collectionRoute}/${chapter.slug}`}
                        key={chapter.slug}
                      >
                        {chapter.title}
                      </Link>
                    )}
                </Breadcrumbs>
              </header>
              {/* dennis TODO: replace with dailp stuff after migration is done with these pages */}
              <DailpPageContents
                path={`/${props.collectionSlug}/${chapter.slug.replace(
                  /_/g,
                  "-"
                )}`}
              />
            </>
          ) : null}

          {/* If this chapter is a document, display the document contents. */}
          {chapterDocument ? (
            <>
              <DocumentTitleHeader
                breadcrumbs={chapter.breadcrumbs}
                rootPath={collectionRoute(props.collectionSlug)}
                doc={chapterDocument}
              />
              <TabSet
                doc={chapterDocument as unknown as Dailp.DocumentFieldsFragment}
              />
            </>
          ) : null}

          <ul>
            {subchapters?.map((chapter) => (
              <li key={chapter.slug}>
                <Link href={chapterRoute(props.collectionSlug!, chapter.slug)}>
                  {chapter.title}
                </Link>
              </li>
            ))}
          </ul>
        </article>
      </main>
      {chapterCitationFooter}
    </CWKWLayout>
  )
}

export const Page = ChapterPage
