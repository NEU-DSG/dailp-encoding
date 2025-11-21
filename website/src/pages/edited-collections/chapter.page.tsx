import React from "react"
import { Helmet } from "react-helmet"
import { Breadcrumbs, Link, WordpressPage } from "src/components"
import * as Dailp from "src/graphql/dailp"
import { chapterRoute, collectionRoute } from "src/routes"
import * as util from "src/style/utils.css"
import CWKWLayout from "../cwkw/cwkw-layout"
import * as css from "../cwkw/cwkw-layout.css"
import { DocumentTitleHeader, TabSet } from "../documents/document.page"
import * as chapterStyle from "./chapter.css"
import { useDialog, useSubchapters } from "./edited-collection-context"

const ChapterPage = (props: {
  collectionSlug: string
  chapterSlug: string
}) => {
  const [{ data }] = Dailp.useCollectionChapterQuery({
    variables: {
      collectionSlug: props.collectionSlug,
      chapterSlug: props.chapterSlug,
    },
  })

  const dialog = useDialog()

  const subchapters = useSubchapters(props.chapterSlug)

  const chapter = data?.chapter

  if (!chapter) {
    return <>Loading...</>
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
              <WordpressPage slug={`/${chapter.slug.replace(/_/g, "-")}`} />
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
                <Link href={chapterRoute(props.collectionSlug!, chapter.slug)}>
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
