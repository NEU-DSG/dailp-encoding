import React, { useState, useRef } from "react"
import { useQuery, gql } from "@apollo/client"
import { css, cx } from "linaria"
import { Input } from "reakit/Input"
import { Button } from "reakit/Button"
import { fullWidth, typography } from "../theme"
import _ from "lodash"
import Layout from "../layout"

export default () => {
  const staticMorphemeId = useRef("")
  const [morphemeId, setMorpheme] = useState(null)

  return (
    <Layout title="Timeline">
      <main>
        <Input
          placeholder="Morpheme ID"
          onChange={(e) => (staticMorphemeId.current = e.target.value)}
        />
        <Button onClick={() => setMorpheme(staticMorphemeId.current)}>
          Search
        </Button>
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
  if (timeline.loading || !timeline.data) {
    return <>Loading...</>
  }
  if (timeline.error) {
    return <>Error!</>
  }
  return (
    <div className={wide}>
      <div className={cx(wordRow, bolden)}>
        <div>Document ID</div>
        <div>Original</div>
        <div>Normalized</div>
        <div>Simple Phonetics</div>
        <div>Translation</div>
      </div>

      {timeline.data.morphemeTimeClusters.map((cluster: any) => {
        let timeRange = "Unknown"
        if (cluster.start) {
          const start = Math.floor(cluster.start.year / 50) * 50
          const end = Math.ceil(cluster.end.year / 50) * 50
          timeRange = `${start} – ${end}`
        }
        const deduplicatedForms = _.groupBy(
          cluster.forms,
          (form) => form.normalizedSource || form.source
        )
        return (
          <div key={timeRange} className={margined}>
            <h2 className={underlined}>{timeRange}</h2>
            {Object.entries(deduplicatedForms).map(([key, forms], idx) => {
              if (forms.length === 1) {
                const form = forms[0]
                return (
                  <div key={idx} className={wordRow}>
                    <div>{form.documentId}</div>
                    <div>{form.source}</div>
                    <div>{form.normalizedSource}</div>
                    <div>{form.simplePhonetics}</div>
                    <div>{form.englishGloss.join(", ")}</div>
                  </div>
                )
              } else {
                const simplePhonetics = forms.find(
                  (w) => w.simplePhonetics?.length
                )
                const englishGloss = forms.find((w) => w.englishGloss?.length)
                const docIds = _.uniq(forms.map((w) => w.documentId))
                return (
                  <div key={idx} className={wordRow}>
                    <div>{docIds.join(", ")}</div>
                    <div>{key}</div>
                    <div />
                    <div>{simplePhonetics?.simplePhonetics}</div>
                    <div>{englishGloss?.englishGloss.join(", ")}</div>
                  </div>
                )
              }
            })}
          </div>
        )
      })}
    </div>
  )
}

const FormRow = (p: {
  documentId: string
  source: string
  normalizedSource: string
  phonetic: string
  translation: string
}) => {
  return (
    <div className={wordRow}>
      <div>{p.documentId}</div>
      <div>{p.source}</div>
      <div>{p.normalizedSource}</div>
      <div>{p.phonetic}</div>
      <div>{p.translation}</div>
    </div>
  )
}

const wide = css`
  ${fullWidth}
`

export const bolden = css`
  font-weight: bold;
`

const underlined = css`
  border-bottom: 1px solid gray;
  margin-bottom: ${typography.rhythm(0.5)};
`

const margined = css`
  margin-bottom: ${typography.rhythm(1.5)};
`

export const wordRow = css`
  display: flex;
  flex-flow: row;
  margin-bottom: ${typography.rhythm(0.5)};
  & > * {
    width: 10rem;
  }
`

const query = gql`
  query Timeline($gloss: String!) {
    morphemeTimeClusters(gloss: $gloss, clusterYears: 50) {
      start {
        year
      }
      end {
        year
      }
      forms {
        source
        normalizedSource
        simplePhonetics
        phonemic
        documentId
        englishGloss
      }
    }
  }
`
