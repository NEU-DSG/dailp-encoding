import React, { Fragment, useState } from "react"
import { CollectionSection } from "src/graphql/dailp"
import {
  Chapter,
  useChapters,
  useFunctions,
} from "src/pages/edited-collections/edited-collection-context"
import { useRouteParams } from "src/renderer/PageShell"
import { chapterRoute } from "src/routes"
import {
  NumberedChapter,
  assignNumbers,
  filterNumberedChapters,
} from "src/utils/toc"
import Link from "./link"
import * as css from "./toc.css"

type TOCProps = {
  section: CollectionSection
  chapters: Chapter[]
  isFiltering?: boolean // Prevent dups when searching similar titles to active chapter
}

// When a user is typing in a requested chapter, this takes over a section
// and genrates the list of filtered chapters
const FilteredTOC = ({ chapterTuple }: { chapterTuple: NumberedChapter[] }) => {
  const { collectionSlug } = useRouteParams()
  const { onSelect, lastSelected } = useFunctions()

  return (
    <ul className={css.filteredList}>
      {chapterTuple.map(([chapter, index]) => (
        <li key={chapter.slug} className={css.filteredListItem}>
          <Link
            href={chapterRoute(collectionSlug!, chapter.slug)}
            className={lastSelected(chapter) ? css.selectedLink : css.link}
            onClick={() => onSelect(chapter)}
          >
            {index}. {chapter.title}
          </Link>
        </li>
      ))}
    </ul>
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

  const tupleIntro = assignNumbers(introChapters, CollectionSection.Intro)
  const tupleBody = assignNumbers(bodyChapters, CollectionSection.Body)
  const tupleCredit = assignNumbers(creditChapters, CollectionSection.Credit)

  const collection = [
    {
      section: CollectionSection.Intro,
      chapters: introChapters,
      numbered: tupleIntro,
      filtered: filterNumberedChapters(tupleIntro, searchedChapter),
    },
    {
      section: CollectionSection.Body,
      chapters: bodyChapters,
      numbered: tupleBody,
      filtered: filterNumberedChapters(tupleBody, searchedChapter),
    },
    {
      section: CollectionSection.Credit,
      chapters: creditChapters,
      numbered: tupleCredit,
      filtered: filterNumberedChapters(tupleCredit, searchedChapter),
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
      {collection.map((collection, index) =>
        collection.chapters.length > 0 ? (
          <Fragment key={index}>
            {isUserFiltering ? (
              collection.filtered.length > 0 ? (
                <>
                  <h3 className={css.title}>{collection.section}</h3>
                  <FilteredTOC chapterTuple={collection.filtered} />
                </>
              ) : null
            ) : (
              <>
                <h3 className={css.title}>{collection.section}</h3>
                <TOC
                  section={collection.section}
                  chapters={collection.chapters}
                  isFiltering={false}
                />
              </>
            )}
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
