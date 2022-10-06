import React from "react"
import { Helmet } from "react-helmet"
import { WordpressPage } from "src/components"
import * as Dailp from "src/graphql/dailp"
import { usePreferences } from "src/preferences-context"
import { fullWidth, paddedCenterColumn } from "src/style/utils.css"
import CWKWLayout from "../cwkw/cwkw-layout"
import * as css from "./document.css"
import { DocumentTitleHeader, TabSet } from "./document.page"

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

  const doc = chapter.document

  return (
    <CWKWLayout>
      <Helmet title={chapter.title} />
      <main className={paddedCenterColumn}>
        <article className={fullWidth}>
          <header>Title: {chapter.title}</header>
          {doc && (
            <main className={css.annotatedDocument}>
              <DocumentTitleHeader doc={doc} showDetails={true} />
              <TabSet doc={doc} />
            </main>
          )}
        </article>
      </main>
    </CWKWLayout>
  )
}

export default ChapterPage
