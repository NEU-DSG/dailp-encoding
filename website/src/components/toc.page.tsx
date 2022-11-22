import { useState } from "react"
import Link from "src/components/link"
import { CollectionSection } from "src/graphql/dailp"
import {
  Chapter,
  useChapters,
} from "src/pages/edited-collections/edited-collection-context"
import { useRouteParams } from "src/renderer/PageShell"
import * as css from "./toc.css"

type TOCData = {
  title: string
  path: string
  children?: TOCData[]
}

type TOCProps = {
  section: CollectionSection
  chapters: Chapter[]
  handleSelect: (item: Chapter) => void
  selected: Chapter | null
  getLink: (item: string) => string
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

  const [selected, setSelected] = useState<Chapter | null>(null)

  function handleSelect(item: Chapter) {
    if (selected === item) {
      setSelected(null)
    } else {
      setSelected(item)
    }
  }

  function getLink(leaf: string) {
    return `${collectionSlug}/chapters/${leaf}`
  }

  return (
    <>
      {collection.map((coll) =>
        coll.chapters.length > 0 ? (
          <>
            <h3 className={css.title}>{coll.section}</h3>
            <TOC
              section={coll.section}
              chapters={coll.chapters}
              handleSelect={handleSelect}
              selected={selected}
              getLink={getLink}
            />
          </>
        ) : null
      )}
    </>
  )
}

const TOC = ({
  section,
  chapters,
  handleSelect,
  selected,
  getLink,
}: TOCProps) => {
  const listStyle =
    section === CollectionSection.Body
      ? css.orderedList
      : css.numberedOrderedList

  const listItemStyle =
    section === CollectionSection.Body ? css.listItem : css.numberedListItem

  return (
    <ol className={listStyle}>
      {chapters.map((item) => (
        <>
          <li key={item.leaf} className={listItemStyle}>
            <Link
              href={getLink(item.leaf)}
              className={css.link}
              onClick={() => handleSelect(item)}
            >
              {item.title}
            </Link>

            {/* If this item is selected, show its child chapters if there are any. */}
            {item === selected && item.children ? (
              <TOC
                section={section}
                chapters={item.children}
                handleSelect={handleSelect}
                selected={selected}
                getLink={getLink}
              />
            ) : null}
          </li>
          <hr className={css.divider} />
        </>
      ))}
    </ol>
  )
}

export default CollectionTOC
