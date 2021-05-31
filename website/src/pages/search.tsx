import React, { useEffect } from "react"
import { Link } from "gatsby"
import { useLocation } from "@gatsbyjs/reach-router"
import { useQuery, gql } from "@apollo/client"
import { css, cx } from "linaria"
import { Input } from "reakit/Input"
import { useDebounce } from "@react-hook/debounce"
import { wordRow, bolden } from "./timeline"
import { fullWidth, typography } from "../theme"
import Layout from "../layout"
import { AnchorLink } from "gatsby-plugin-anchor-links"
import { sourceCitationRoute } from "../routes"
import queryString from "query-string"

export default (p: { location: any }) => {
  const location = p.location
  const defaultParams = queryString.parse(location.search)
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
        <p className={wide}>
          Type a search query in Cherokee syllabary, simple phonetics, English
          translation, or romanized source. All words from{" "}
          <Link to="/sources">dictionaries and grammars</Link> that contain your
          query will be shown below. These results do not include our collection
          of manuscripts yet.
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

const Timeline = (p: { gloss: string }) => {
  const timeline = useQuery(query, {
    variables: { query: p.gloss },
    skip: !p.gloss,
  })

  if (!p.gloss) {
    return null
  } else if (timeline.loading) {
    return <>Loading...</>
  } else if (timeline.error) {
    console.error(timeline.error)
    return <>Error!</>
  } else if (!timeline.data || !timeline.data.wordSearch.length) {
    return <>No results found.</>
  } else {
    return (
      <div className={wide}>
        <div className={cx(wordRow, bolden)}>
          <div>Document ID</div>
          <div>Transcription</div>
          <div>Normalization</div>
          <div>Simple Phonetics</div>
          <div>Translation</div>
        </div>
        {timeline.data.wordSearch.map(
          (form: GatsbyTypes.Dailp_AnnotatedForm, i: number) => (
            <div key={i} className={wordRow}>
              <AnchorLink to={sourceCitationRoute(form.documentId)}>
                {form.documentId}
              </AnchorLink>
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

const query = gql`
  query StringSearch($query: String!) {
    wordSearch(
      queries: [
        { source: $query }
        { normalizedSource: $query }
        { simplePhonetics: $query }
        { englishGloss: $query }
      ]
    ) {
      source
      normalizedSource
      simplePhonetics
      documentId
      englishGloss
    }
  }
`
