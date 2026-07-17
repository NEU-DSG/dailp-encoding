import React, { Fragment, useState } from "react"
import { CollectionSection } from "src/graphql/dailp"
import {
  Chapter,
  useChapters,
  useFunctions,
} from "src/pages/edited-collections/edited-collection-context"
import { useRouteParams } from "src/renderer/PageShell"
import { chapterRoute } from "src/routes"
import Link from "./link"
import * as css from "./toc.css"

type TOCProps = {
  section: CollectionSection
  chapters: Chapter[]
  isFiltering?: boolean // Prevent dups when searching similar titles to active chapter
}

// Filters through chapters including subchapters
const filterChapters = (chapters: Chapter[], input: string): Chapter[] => {
  const trimmedInput = input.toLowerCase().trim()
  const filteredChapters: Chapter[] = []

  // Add all chapters and children so they are filtered too
  for (const chapter of chapters) {
    filteredChapters.push(chapter)
    if (chapter.children) filteredChapters.push(...chapter.children)
  }

  return filteredChapters.filter((ch) =>
    ch.title.toLowerCase().includes(trimmedInput)
  )
}

const CollectionTOC = () => {
  const chapters = useChapters()
  const { collectionSlug } = useRouteParams()

  const [searchedChapter, setSearchedChapter] = useState("")

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

  const isUserFiltering = searchedChapter.trim().length > 0

  const collection = [
    {
      section: CollectionSection.Intro,
      chapters: isUserFiltering
        ? filterChapters(introChapters, searchedChapter)
        : introChapters,
    },
    {
      section: CollectionSection.Body,
      chapters: isUserFiltering
        ? filterChapters(bodyChapters, searchedChapter)
        : bodyChapters,
    },
    {
      section: CollectionSection.Credit,
      chapters: isUserFiltering
        ? filterChapters(creditChapters, searchedChapter)
        : creditChapters,
    },
  ]

  return (
    <>
      <input
        className={css.searchBar}
        type="text"
        placeholder="Search by Title..."
        value={searchedChapter}
        onChange={(e) => setSearchedChapter(e.target.value)}
      />
      {collection.map((coll, idx) =>
        coll.chapters.length > 0 ? (
          <Fragment key={idx}>
            <h3 className={css.title}>{coll.section}</h3>
            <TOC
              section={coll.section}
              chapters={coll.chapters}
              isFiltering={isUserFiltering}
            />
          </Fragment>
        ) : null
      )}
      {isUserFiltering &&
        collection.every((collection) => collection.chapters.length === 0) && (
          <div className={css.noMatchTextContainer}>
            <p className={css.noMatchText}>No matching chapters found</p>
          </div>
        )}
    </>
  )
}

const TOC = ({ section, chapters, isFiltering = false }: TOCProps) => {
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

            {!isFiltering && isSelected(item) && item.children ? (
              <TOC
                section={section}
                chapters={item.children}
                isFiltering={isFiltering}
              />
            ) : null}
          </li>
        ))}
      </ol>
    </>
  )
}

export default CollectionTOC
