import React, { useEffect } from "react"
import { useLocation } from "@reach/router"
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

export default () => {
  const location = useLocation()
  const defaultParams = queryString.parse(location.search)
  const [morphemeId, setMorpheme] = useDebounce(
    defaultParams.query as string,
    200
  )

  useEffect(() => {
    if (typeof location !== "undefined") {
      location.search = queryString.stringifyUrl({
        url: location.pathname,
        query: { query: morphemeId },
      })
    }
  }, [morphemeId])

  return (
    <Layout title="Search">
      <main>
        <p className={wide}>
          Type your search query in simple phonetics, English translation,
          Cherokee syllabary, or romanized source. All matching words will be
          shown below.
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
    variables: { gloss: p.gloss },
    skip: !p.gloss,
  })

  if (!p.gloss) {
    return null
  } else if (timeline.loading && !timeline.data) {
    return <>Loading...</>
  } else if (timeline.error) {
    return <>Error!</>
  } else if (!timeline.data || !timeline.data.wordSearch.length) {
    return <>No results found.</>
  } else {
    return (
      <div className={wide}>
        <div className={cx(wordRow, bolden)}>
          <div>Document ID</div>
          <div>Original</div>
          <div>Normalized</div>
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
  ${fullWidth}
`

const searchBox = css`
  ${fullWidth}
  margin-bottom: ${typography.rhythm(0.5)};
`

const query = gql`
  query StringSearch($gloss: String!) {
    wordSearch(query: $gloss) {
      source
      normalizedSource
      simplePhonetics
      documentId
      englishGloss
    }
  }
`
