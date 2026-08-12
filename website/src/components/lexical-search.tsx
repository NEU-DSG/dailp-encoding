import { useDebounce } from "@react-hook/debounce"
import cx from "classnames"
import QueryString from "query-string"
import React, { useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import { Input } from "reakit"
import { UserRole, useUserRole } from "src/auth"
import * as Dailp from "src/graphql/dailp"
import { useLocation } from "src/renderer/PageShell"
import { closeBlock, fullWidth } from "src/style/utils.css"
import { boldWordRow, wordRow } from "../pages/timeline.css"
import { documentWordPath } from "../routes"
import * as css from "./lexical-search.css"
import Link from "./link"

export const LexicalSearch = () => {
  const location = useLocation()
  const [morphemeId, setMorpheme] = useDebounce(
    (location.search && location.search["query"]) || null,
    300
  )
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedCollections, setSelectedCollections] = useState<Set<string>>(
    new Set()
  )
  const [showDictionaries, setShowDictionaries] = useState(false)

  const userRole = useUserRole()
  const isReader = userRole === UserRole.Reader

  const [{ data: collectionsData }] = Dailp.useEditedCollectionsQuery()

  // Fillter out hidden collection if reader
  const visibleCollections = collectionsData?.allEditedCollections.filter(
    (c) => !(isReader && c.isHidden)
  )

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.replaceState(
        null,
        "",
        QueryString.stringifyUrl({
          url: "",
          query: { query: morphemeId },
        })
      )
    }
  }, [morphemeId])

  // Toggle a given collection from the selected filter list
  const toggleCollection = (title: string) => {
    setSelectedCollections((prev) => {
      const next = new Set(prev)
      if (next.has(title)) {
        next.delete(title)
      } else {
        next.add(title)
      }
      return next
    })
  }

  // Resets selected collection filters
  const resetFilters = () => {
    setSelectedCollections(new Set())
    setShowDictionaries(false)
  }

  return (
    <>
      <Helmet title="Search" />
      <main>
        <p className={fullWidth}>
          Type a search query in Cherokee syllabary, simple phonetics, English
          translation, or romanized source. All words are from our collection of{" "}
          <Link href="/sources">dictionaries and grammars</Link> and{" "}
          <Link href="/cwkw">edited collection of documents</Link>.
        </p>

        <div className={css.searchRow}>
          <Input
            className={cx(searchBox, css.searchInput)}
            defaultValue={morphemeId ?? ""}
            placeholder="Search query"
            onChange={(e) => {
              setMorpheme(e.target.value || null)
            }}
          />

          <div className={css.filterWrapper}>
            <button
              type="button"
              className={css.filterButton}
              onClick={() => setFilterOpen((open) => !open)}
            >
              Filter {filterOpen ? "▲" : "▼"}
            </button>

            {filterOpen && (
              <div className={css.filterDropdown}>
                <div className={css.filterHeader}>
                  <span>Filters</span>
                  <button
                    type="button"
                    className={css.resetLink}
                    onClick={resetFilters}
                  >
                    Reset
                  </button>
                </div>

                <hr className={css.filterDivider} />

                <div className={css.filterSectionLabel}>Collections</div>
                {!visibleCollections || visibleCollections.length === 0 ? (
                  <p>No collections available.</p>
                ) : (
                  visibleCollections.map((collection) => (
                    <label key={collection.slug} className={css.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={selectedCollections.has(collection.title)}
                        onChange={() => toggleCollection(collection.title)}
                      />
                      {collection.title}
                    </label>
                  ))
                )}

                <hr className={css.filterDivider} />

                <div className={css.filterSectionLabel}>Other sources</div>
                <label className={css.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={showDictionaries}
                    onChange={() => setShowDictionaries((prev) => !prev)}
                  />
                  Dictionaries
                </label>
              </div>
            )}
          </div>
        </div>

        {!!morphemeId && (
          <Timeline
            gloss={morphemeId}
            isReader={isReader}
            selectedCollections={selectedCollections}
            showDictionaries={showDictionaries}
          />
        )}
      </main>
    </>
  )
}

const Timeline = (p: {
  gloss: string
  isReader: boolean
  selectedCollections: Set<string>
  showDictionaries: boolean
}) => {
  const [timeline] = Dailp.useWordSearchQuery({
    variables: { query: p.gloss },
    requestPolicy: "network-only",
  })

  if (!p.gloss) {
    return null
  } else if (timeline.fetching) {
    return <>Loading...</>
  } else if (timeline.error) {
    console.error(timeline.error)
    return <>Error!</>
  } else if (!timeline.data || !timeline.data.wordSearch.length) {
    return <>No results found.</>
  } else {
    const noFiltersActive =
      p.selectedCollections.size === 0 && !p.showDictionaries

    // Filters
    const visibleEntries = timeline.data.wordSearch.filter((form) => {
      const collectionTitle = form.document?.editedCollection?.title

      // Hide hidden collections if reader
      if (p.isReader && form.document?.editedCollection?.isHidden) return false
      if (noFiltersActive) return true

      // Dictionaries have no collection, show if none
      if (!form.document?.editedCollection) return p.showDictionaries

      return !!collectionTitle && p.selectedCollections.has(collectionTitle)
    })

    if (!visibleEntries.length) return <>No results found.</>

    return (
      <div className={fullWidth}>
        <div className={boldWordRow}>
          <div style={{ width: "250px" }}>Document Title</div>
          <div>Transcription</div>
          <div>Simple Phonetics</div>
          <div>Translation</div>
        </div>
        {visibleEntries.map((form, i) => (
          <div key={i} className={wordRow}>
            {!!form.document ? (
              <div className={css.documentCell}>
                <Link href={documentWordPath(form.document.slug, form.index)}>
                  {form.document.title.length >= 50
                    ? `${form.document.title.slice(0, 50)}...`
                    : form.document.title}
                </Link>
                {form.document.editedCollection && (
                  <div className={css.collectionSubtitle}>
                    {form.document.editedCollection.title}
                  </div>
                )}
              </div>
            ) : null}
            <div>{form.source}</div>
            <div>{form.romanizedSource}</div>
            <div>{form.englishGloss.join(", ")}</div>
          </div>
        ))}
      </div>
    )
  }
}

const searchBox = cx(fullWidth, closeBlock)
