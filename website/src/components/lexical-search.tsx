import { useDebounce } from "@react-hook/debounce"
import cx from "classnames"
import QueryString from "query-string"
import React, { useEffect } from "react"
import { Helmet } from "react-helmet"
import { Input } from "reakit"
import * as Dailp from "src/graphql/dailp"
import { useLocation } from "src/renderer/PageShell"
import { closeBlock, fullWidth } from "src/style/utils.css"
import Link from "src/ui/atoms/link/link"
import { boldWordRow, wordRow } from "../pages/timeline.css"
import { documentWordPath } from "../routes"

export const LexicalSearch = () => {
  const location = useLocation()
  const [morphemeId, setMorpheme] = useDebounce(
    (location.search && location.search["query"]) || null,
    300
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
        <Input
          className={searchBox}
          defaultValue={morphemeId ?? ""}
          placeholder="Search query"
          onChange={(e) => {
            setMorpheme(e.target.value || null)
          }}
        />

        {!!morphemeId && <Timeline gloss={morphemeId} />}
      </main>
    </>
  )
}

const Timeline = (p: { gloss: string }) => {
  const [timeline] = Dailp.useWordSearchQuery({
    variables: { query: p.gloss },
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
    return (
      <div className={fullWidth}>
        <div className={boldWordRow}>
          <div>Document ID</div>
          <div>Transcription</div>
          <div>Simple Phonetics</div>
          <div>Translation</div>
        </div>
        {timeline.data.wordSearch.map((form, i) => (
          <div key={i} className={wordRow}>
            {!!form.document ? (
              <Link href={documentWordPath(form.document.slug, form.index)}>
                {form.document.slug.toUpperCase()}
              </Link>
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
