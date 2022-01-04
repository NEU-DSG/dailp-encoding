import { useDebounce } from "@react-hook/debounce"
import cx from "classnames"
import QueryString from "query-string"
import React, { useEffect } from "react"
import { Input } from "reakit/Input"
import * as Dailp from "src/graphql/dailp"
import Link from "src/link"
import { usePageContext } from "src/renderer/PageShell"
import { closeBlock, fullWidth } from "src/sprinkles.css"
import Layout from "../layout"
import { sourceCitationRoute } from "../routes"
import { boldWordRow, wordRow } from "./timeline.css"

const SearchPage = () => {
  const router = usePageContext()
  const defaultParams = router.urlParsed!.search
  const [morphemeId, setMorpheme] = useDebounce(
    defaultParams.query as string,
    200
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
    <Layout title="Search">
      <main>
        <p className={fullWidth}>
          Type a search query in Cherokee syllabary, simple phonetics, English
          translation, or romanized source. All words from{" "}
          <Link href="/sources">dictionaries and grammars</Link> that contain
          your query will be shown below. These results do not include our
          collection of manuscripts yet.
        </p>
        <Input
          className={searchBox}
          defaultValue={morphemeId}
          placeholder="Search query"
          onChange={(e) => {
            setMorpheme(e.target.value.length > 0 ? e.target.value : null)
          }}
        />

        <Timeline gloss={morphemeId} />
      </main>
    </Layout>
  )
}
export default SearchPage

const Timeline = (p: { gloss: string }) => {
  const [timeline] = Dailp.useWordSearchQuery({
    variables: { query: p.gloss },
    pause: !p.gloss,
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
          <div>Normalization</div>
          <div>Simple Phonetics</div>
          <div>Translation</div>
        </div>
        {timeline.data.wordSearch.map(
          (form: Dailp.AnnotatedForm, i: number) => (
            <div key={i} className={wordRow}>
              <Link href={sourceCitationRoute(form.documentId)}>
                {form.documentId}
              </Link>
              <div>{form.source}</div>
              <div>{form.normalizedSource}</div>
              <div>{form.simplePhonetics}</div>
              <div>{form.englishGloss.join(", ")}</div>
            </div>
          )
        )}
      </div>
    )
  }
}

const searchBox = cx(fullWidth, closeBlock)
