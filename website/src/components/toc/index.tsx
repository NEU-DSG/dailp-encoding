import React, { Fragment } from "react"
import { CollectionSection } from "src/graphql/dailp"
import {
  Chapter,
  useChapters,
  useFunctions,
} from "src/pages/edited-collections/edited-collection-context"
import { useRouteParams } from "src/renderer/PageShell"
import { chapterRoute } from "src/routes"
import Link from "../link"
import * as css from "./toc.css"

type TOCProps = {
  section: CollectionSection
  chapters: Chapter[]
}

const CollectionTOC = () => {
  const chapters = useChapters()
  const { collectionSlug } = useRouteParams()

  if (!chapters || !collectionSlug) {
    return null
  }

  const introChapters: Chapter[] = []
  const bodyChapters: Chapter[] = []
  const creditChapters: Chapter[] = []

  // Filter the chapters by their section.
  chapters.reduce(
    function (result, curr, i) {
      if (curr.section === CollectionSection.Intro) {
        // i != 0 makes sure the landing page (first chapter) does not get added to the table of contents
        result[0]?.push(curr)
      } else if (curr.section === CollectionSection.Body) {
        result[1]?.push(curr)
      } else {
        result[2]?.push(curr)
      }

      return result
    },
    [introChapters, bodyChapters, creditChapters]
  )

  const collection = [
    { section: CollectionSection.Intro, chapters: introChapters },
    { section: CollectionSection.Body, chapters: bodyChapters },
    { section: CollectionSection.Credit, chapters: creditChapters },
  ]

  return (
    <>
      {collection.map((coll, idx) =>
        coll.chapters.length > 0 ? (
          <Fragment key={idx}>
            <h3 className={css.title}>{coll.section}</h3>
            <TOC section={coll.section} chapters={coll.chapters} />
          </Fragment>
        ) : null
      )}
    </>
  )
}

const TOC = ({ section, chapters }: TOCProps) => {
  const { collectionSlug } = useRouteParams()
  const { onSelect, isSelected, lastSelected } = useFunctions()

  const listStyle =
    section === CollectionSection.Body
      ? css.orderedList
      : css.numberedOrderedList

  const listItemStyle =
    section === CollectionSection.Body ? css.listItem : css.numberedListItem

  return (
    <>
      <ol className={listStyle}>
        {chapters.map((item) => (
          <li key={item.slug} className={listItemStyle}>
            <Link
              href={chapterRoute(collectionSlug!, item.slug)}
              className={lastSelected(item) ? css.selectedLink : css.link}
              onClick={() => onSelect(item)}
            >
              {item.title}
            </Link>

            {isSelected(item) && item.children ? (
              <TOC section={section} chapters={item.children} />
            ) : null}
          </li>
        ))}
      </ol>
    </>
  )
}

export default CollectionTOC
