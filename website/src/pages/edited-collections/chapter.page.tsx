import React from "react"
import { Helmet } from "react-helmet"
import { Breadcrumbs, Link } from "src/components"
import { CollectionAuthGuard } from "src/components/collection-auth-guard"
import { useMediaQuery } from "src/custom-hooks"
import * as Dailp from "src/graphql/dailp"
import { useRouteParams } from "src/renderer/PageShell"
import { chapterRoute, collectionRoute } from "src/routes"
import { mediaQueries } from "src/style/constants"
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

  const isDesktop = useMediaQuery(mediaQueries.medium)

  if (!props.collectionSlug) {
    return <>Loading...</>
  }

  const [{ data: collectionData, fetching: collectionFetching }] =
    Dailp.useEditedCollectionQuery({
      variables: { slug: props.collectionSlug },
    })

  const dialog = useDialog()

  const subchapters = chapterSlug ? useSubchapters(chapterSlug) : undefined

  // Use prefetched chapter from props for immediate render, otherwise use query result
  // The query will read from cache if prefetched, avoiding duplicate network requests
  const chapter = props.chapter ?? data?.chapter

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

  const collection = collectionData?.editedCollection
  if (!collection) {
    return <>Collection not found: {props.collectionSlug}</>
  }

  const { document, wordpressId } = chapter

  const wpPath = `/${props.collectionSlug}/${chapter.slug.replace(/_/g, "-")}`

  return (
    <CollectionAuthGuard isHidden={collection.isHidden}>
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
                          href={
                            props.collectionSlug
                              ? `${collectionRoute(props.collectionSlug)}/${
                                  crumb.slug
                                }`
                              : ``
                          }
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
                {isDesktop ? (
                  <DailpPageContents path={wpPath} />
                ) : (
                  <div className={chapterStyle.wordpressContentFix}>
                    <DailpPageContents path={wpPath} />
                  </div>
                )}
              </>
            ) : null}

            {/* If this chapter is a document, display the document contents. */}
            {document ? (
              <>
                <DocumentTitleHeader
                  breadcrumbs={chapter.breadcrumbs}
                  rootPath={collectionRoute(props.collectionSlug)}
                  doc={document}
                />
                <TabSet doc={document} />
              </>
            ) : null}

            <ul>
              {subchapters?.map((chapter) => (
                <li key={chapter.slug}>
                  <Link
                    href={chapterRoute(props.collectionSlug!, chapter.slug)}
                  >
                    {chapter.title}
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        </main>
      </CWKWLayout>
    </CollectionAuthGuard>
  )
}

export const Page = ChapterPage
