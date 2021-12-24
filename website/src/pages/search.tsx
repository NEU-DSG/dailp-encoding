import React, { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { css } from "@emotion/react"
import { Input } from "reakit/Input"
import { useDebounce } from "@react-hook/debounce"
import { wordRow, bolden } from "./timeline"
import { fullWidth, typography } from "../theme"
import Layout from "../layout"
import { sourceCitationRoute } from "../routes"
import queryString from "query-string"
import * as Dailp from "src/graphql/dailp"

const SearchPage = () => {
  const router = useRouter()
  const defaultParams = router.query
  const [morphemeId, setMorpheme] = useDebounce(
    defaultParams.query as string,
    200
  )

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.replaceState(
        null,
        "",
        queryString.stringifyUrl({
          url: window.location.pathname,
          query: { query: morphemeId },
        })
      )
    }
  }, [morphemeId])

  return (
    <Layout title="Search">
      <main>
        <p css={wide}>
          Type a search query in Cherokee syllabary, simple phonetics, English
          translation, or romanized source. All words from{" "}
          <Link href="/sources">dictionaries and grammars</Link> that contain
          your query will be shown below. These results do not include our
          collection of manuscripts yet.
        </p>
        <Input
          css={searchBox}
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
      <div css={wide}>
        <div css={[wordRow, bolden]}>
          <div>Document ID</div>
          <div>Transcription</div>
          <div>Normalization</div>
          <div>Simple Phonetics</div>
          <div>Translation</div>
        </div>
        {timeline.data.wordSearch.map(
          (form: Dailp.AnnotatedForm, i: number) => (
            <div key={i} css={wordRow}>
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

const wide = css`
  ${fullWidth};
`

const searchBox = css`
  ${fullWidth};
  margin-bottom: ${typography.rhythm(0.5)};
`
