import React from "react"
import ReactDOM from "react-dom"
import { Helmet } from "react-helmet"
import { Breadcrumbs, Link } from "src/components"
import * as Dailp from "src/graphql/dailp"
import { chapterRoute, collectionRoute } from "src/routes"
import * as util from "src/style/utils.css"
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
  const chapter = data?.chapter

  if (fetching) {
    return <>Loading...</>
  }

  if (error) {
    return <>Error: {error.message}</>
  }

  if (!chapter) {
    return (
      <>
        Chapter not found for collection: {props.collectionSlug}, chapter:{" "}
        {props.chapterSlug}
      </>
    )
  }

  const { document: chapterDocument, wordpressId } = chapter

  // Build APA citation for this chapter page
  const chapterCitationFooter = (() => {
    // Checks for ensuring not in doc and grabbing citatition footer position
    if (chapterDocument) return null
    if (typeof window === "undefined") return null
    const slot = window.document.getElementById("citation-footer-slot")
    if (!slot) return null

    let authorNames: string[] = []
    let chapterTitle: string = chapter.title ?? ""
    let isoDate: string | undefined

    if (chapterDocument) {
      // Pull chapter's author and title from document
      const authorContribs = (
        (chapterDocument as any).contributors ?? []
      ).filter((c: any) => c.role?.toLowerCase() === "author")
      authorNames =
        authorContribs.length > 0
          ? authorContribs.map((c: any) => c.name)
          : ((chapterDocument as any).creators ?? []).map((c: any) => c.name)

      chapterTitle = (chapterDocument as any).title ?? chapter.title ?? ""

      const d = (chapterDocument as any).date
      if (d) {
        isoDate = [
          d.year,
          String(d.month ?? 1).padStart(2, "0"),
          String(d.day ?? 1).padStart(2, "0"),
        ].join("-")
      }
    } else if (wordpressId) {
      // When on word press, grabbing authors and title from DOM elements
      const authorEl = window.document.querySelector(
        ".wp-author, .entry-author, [rel='author'], .author-name"
      )

      if (authorEl?.textContent) {
        authorNames = authorEl.textContent
          .split(/\s+and\s+|,\s*/)
          .map((s) => s.trim())
          .filter(Boolean)
      }

      // Manually grab h2 or h3 which are what renders authors after h1
      if (authorNames.length === 0) {
        const titleEl = window.document.querySelector("article h1")
        const nextEl = titleEl?.nextElementSibling
        if (nextEl?.matches("h2, h3") && nextEl.textContent) {
          authorNames = nextEl.textContent
            .split(/\s+and\s+|,\s*/)
            .map((s) => s.trim())
            .filter(Boolean)
        }
      }

      // Manually grab h2 or h3 anywhere
      if (authorNames.length === 0) {
        const headingEl = window.document.querySelector(
          "article h2, article h3"
        )
        if (headingEl?.textContent) {
          authorNames = headingEl.textContent
            .split(/\s+and\s+|,\s*/)
            .map((s) => s.trim())
            .filter(Boolean)
        }
      }
    }

    // Build the citation
    const authorPart =
      authorNames.length > 0 ? authorNames.join(", & ") + ". " : ""

    const accessed = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    const url = window.location.href

    const citation =
      authorPart.replace("Written by ", "").replace("and ", "") +
      "(2026). " +
      chapterTitle +
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
              How to cite this chapter:{" "}
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
