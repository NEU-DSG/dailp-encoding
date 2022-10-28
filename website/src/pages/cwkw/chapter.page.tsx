import React from "react"
import { Helmet } from "react-helmet"
import { Link, WordpressPage } from "src/components"
import * as Dailp from "src/graphql/dailp"
import { fullWidth, paddedCenterColumn } from "src/style/utils.css"
import { DocumentTitleHeader, TabSet } from "../documents/document.page"
import { useSubchapters } from "./chapters-context"
import CWKWLayout from "./cwkw-layout"

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

  const chapter = data?.chapter

  if (!chapter) {
    return <>Loading...</>
  }

  const { document, wordpressId } = chapter

  const subchapters = useSubchapters(props.chapterSlug)

  return (
    <CWKWLayout>
      <Helmet title={chapter.title} />
      <main className={paddedCenterColumn}>
        <article className={fullWidth}>
          <header>Title: {chapter.title}</header>

          {/* If this chapter contains or is a Wordpress page, display the WP page contents. */}
          {wordpressId && <WordpressPage slug={wordpressId.toString()} />}

          {/* If this chapter is a document, display the document contents. */}
          {document && (
            <>
              <DocumentTitleHeader doc={document} showDetails={true} />
              <TabSet doc={document} />
            </>
          )}

          <ul>
            {subchapters && (
              <>
                {subchapters.map((chapter) => (
                  <li>
                    <Link key={chapter.leaf} href={`${chapter.leaf}`}>
                      {chapter.title}
                    </Link>
                  </li>
                ))}
              </>
            )}
          </ul>
        </article>
      </main>
    </CWKWLayout>
  )
}

export default ChapterPage
