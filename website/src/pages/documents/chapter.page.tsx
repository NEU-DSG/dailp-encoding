import React from "react"
import { Helmet } from "react-helmet"
import { WordpressPage } from "src/components"
import * as Dailp from "src/graphql/dailp"
import { usePreferences } from "src/preferences-context"
import { fullWidth, paddedCenterColumn } from "src/style/utils.css"
import CWKWLayout from "../cwkw/cwkw-layout"

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
      <Helmet title={chapter.chapterName} />
      <main className={paddedCenterColumn}>
        <article className={fullWidth}>
          <header>Chapter Name: {chapter.chapterName}</header>
          {doc && <TabSet doc={doc} />}
        </article>
      </main>
    </CWKWLayout>
  )
}

export default ChapterPage
