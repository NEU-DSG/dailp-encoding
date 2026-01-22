import React from "react"
import { Helmet } from "react-helmet"
import { Breadcrumbs, Link, WordpressPage } from "src/components"
import * as Dailp from "src/graphql/dailp"
import { useRouteParams } from "src/renderer/PageShell"
import { chapterRoute, collectionRoute } from "src/routes"
import * as util from "src/style/utils.css"
import CWKWLayout from "../cwkw/cwkw-layout"
import * as css from "../cwkw/cwkw-layout.css"
import { DailpPageContents } from "../dailp.page"
import { DocumentTitleHeader, TabSet } from "../documents/document.page"
import * as chapterStyle from "./chapter.css"
import { useDialog, useSubchapters } from "./edited-collection-context"

const ChapterPage = (props: {
  collectionSlug?: string
  chapterSlug?: string
  chapter?: Dailp.CollectionChapterQuery["chapter"]
}) => {
  const routeParams = useRouteParams()
  const collectionSlug =
    props.collectionSlug ??
    (routeParams?.["collectionSlug"] as string | undefined)
  const chapterSlug =
    props.chapterSlug ?? (routeParams?.["chapterSlug"] as string | undefined)

  // Query will use cache if data was prefetched in chapter.page.client.ts
  const [{ data, error, fetching }] = Dailp.useCollectionChapterQuery({
    variables: {
      collectionSlug: collectionSlug?.replaceAll("-", "_")!,
      chapterSlug: chapterSlug?.replaceAll("-", "_")!,
    },
    pause: !collectionSlug || !chapterSlug,
  })

  const dialog = useDialog()

  const subchapters = chapterSlug ? useSubchapters(chapterSlug) : undefined

  // Use prefetched chapter from props for immediate render, otherwise use query result
  // The query will read from cache if prefetched, avoiding duplicate network requests
  const chapter = props.chapter ?? data?.chapter

  if (!collectionSlug || !chapterSlug) {
    return <>Loading...</>
  }

  if (fetching) {
    return <>Loading...</>
  }

  if (error) {
    return (
      <CWKWLayout>
        <main className={util.paddedCenterColumn}>
          <article className={dialog.visible ? css.leftMargin : util.fullWidth}>
            <h1>Error</h1>
            <p>{error.message}</p>
          </article>
        </main>
      </CWKWLayout>
    )
  }

  if (!chapter) {
    return (
      <CWKWLayout>
        Chapter not found for collection: {collectionSlug}, chapter:{" "}
        {chapterSlug}
      </CWKWLayout>
    )
  }

  const { document, wordpressId } = chapter

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
                        href={`${collectionRoute(collectionSlug)}/${
                          crumb.slug
                        }`}
                        key={crumb.slug}
                      >
                        {crumb.name}
                      </Link>
                    ))
                    .concat(
                      <Link
                        href={`${collectionRoute(collectionSlug)}/${
                          chapter.slug
                        }`}
                        key={chapter.slug}
                      >
                        {chapter.title}
                      </Link>
                    )}
                </Breadcrumbs>
              </header>
              {/* dennis TODO: replace with dailp stuff after migration is done with these pages */}
              <DailpPageContents
                path={`/${collectionSlug}/${chapter.slug.replace(/_/g, "-")}`}
              />
            </>
          ) : null}

          {/* If this chapter is a document, display the document contents. */}
          {document ? (
            <>
              <DocumentTitleHeader
                breadcrumbs={chapter.breadcrumbs}
                rootPath={collectionRoute(collectionSlug)}
                doc={document}
              />
              <TabSet doc={document} />
            </>
          ) : null}

          <ul>
            {subchapters?.map((chapter) => (
              <li key={chapter.slug}>
                <Link href={chapterRoute(collectionSlug, chapter.slug)}>
                  {chapter.title}
                </Link>
              </li>
            ))}
          </ul>
        </article>
      </main>
    </CWKWLayout>
  )
}

export const Page = ChapterPage
