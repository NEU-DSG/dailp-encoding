import React, { Fragment } from "react"
import * as css from "../toc.css"

type PreviewChapter = {
  id?: string
  clientId?: string
  title: string
  children?: PreviewChapter[]
}

type PreviewTocProps = {
  chaptersBySection: {
    intro: PreviewChapter[]
    body: PreviewChapter[]
    credit: PreviewChapter[]
  }
}

const sectionLabels = {
  intro: "Introduction",
  body: "Body",
  credit: "Credit",
} as const

const PreviewTocList = ({ chapters }: { chapters: PreviewChapter[] }) => {
  if (!chapters.length) return null
  // Like the TOC, maps out list of chapters and its children if they exist
  return (
    <ol className={css.orderedList}>
      {chapters.map((chapter) => (
        <li key={chapter.id ?? chapter.clientId} className={css.listItem}>
          {chapter.title || <em>Untitled chapter</em>}
          {!!chapter.children?.length && (
            <PreviewTocList chapters={chapter.children} />
          )}
        </li>
      ))}
    </ol>
  )
}

export default function PreviewToc({ chaptersBySection }: PreviewTocProps) {
  // Renders the provided information (intial intent is to render previews of editing tocs)
  return (
    <>
      {(["intro", "body", "credit"] as const).map((key) =>
        chaptersBySection[key].length > 0 ? (
          <Fragment key={key}>
            <h3 className={css.title}>{sectionLabels[key]}</h3>
            <PreviewTocList chapters={chaptersBySection[key]} />
          </Fragment>
        ) : null
      )}
    </>
  )
}
