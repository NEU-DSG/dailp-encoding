import React, { Fragment, useState } from "react"
import { CollectionSection } from "src/graphql/dailp"
import {
  Chapter,
  useChapters,
  useFunctions,
} from "src/pages/edited-collections/edited-collection-context"
import { useRouteParams } from "src/renderer/PageShell"
import { chapterRoute } from "src/routes"
import { DropdownToggle } from "./dropdown-toggle"
import Link from "./link"
import * as css from "./toc.css"

type TOCProps = {
  section: CollectionSection
  chapters: Chapter[]
  prefix?: number[]
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

const TOC = ({ section, chapters, prefix = [] }: TOCProps) => {
  const { collectionSlug } = useRouteParams()
  const { onSelect, isSelected, lastSelected } = useFunctions()

  // Control if chapter dropdown is open or not
  const [openChapters, setOpenChapters] = useState<Set<string>>(new Set())

  const toggleChapter = (slug: string) => {
    setOpenChapters((prev) => {
      const next = new Set(prev)

      if (next.has(slug)) {
        next.delete(slug)
      } else {
        next.add(slug)
      }

      return next
    })
  }

  const listStyle =
    section === CollectionSection.Body
      ? css.orderedList
      : css.numberedOrderedList

  const listItemStyle =
    section === CollectionSection.Body ? css.listItem : css.numberedListItem

  return (
    <>
      {/* <ol className={listStyle}> */}
      <ol className={prefix.length === 0 ? css.orderedList : css.nestedList}>
        {chapters.map((item, i) => {
          const number = [...prefix, i + 1].join(".")

          return (
            <li key={item.slug} className={css.listItem}>
              <div className={css.row}>
                <span className={css.number}>{number}</span>

                <Link
                  href={chapterRoute(collectionSlug!, item.slug)}
                  className={lastSelected(item) ? css.selectedLink : css.link}
                  onClick={() => onSelect(item)}
                >
                  {item.title}
                </Link>

                {item.children?.length ? (
                  <DropdownToggle
                    label=""
                    isOpen={openChapters.has(item.slug)}
                    onToggle={() => toggleChapter(item.slug)}
                  />
                ) : (
                  <span className={css.toggleSpacer} />
                )}
              </div>

              {openChapters.has(item.slug) && item.children ? (
                <TOC
                  section={section}
                  chapters={item.children}
                  prefix={[...prefix, i + 1]}
                />
              ) : null}
            </li>
          )
        })}
      </ol>
    </>
  )
}

export default CollectionTOC
