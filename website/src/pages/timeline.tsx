import React, { useState, useRef } from "react"
import { useQuery, gql } from "@apollo/client"
import { css } from "@emotion/react"
import { Input } from "reakit/Input"
import { Button } from "reakit/Button"
import { fullWidth, typography } from "../theme"
import { groupBy, uniq } from "lodash"
import Layout from "../layout"

const TimelinePage = () => {
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
export default TimelinePage

const Timeline = (p: { gloss: string }) => {
  const timeline = useQuery(query, {
    variables: { gloss: p.gloss },
    skip: !p.gloss,
  })
  if (timeline.loading || !timeline.data) {
    return <>Loading...</>
  }
  if (timeline.error) {
    console.error(timeline.error)
    return <>Error!</>
  }
  return (
    <div css={wide}>
      <div css={[wordRow, bolden]}>
        <div>Document ID</div>
        <div>Original</div>
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
        const deduplicatedForms = groupBy(
          cluster.forms,
          (form) => form.normalizedSource || form.source
        )
        return (
          <div key={timeRange} css={margined}>
            <h2 css={underlined}>{timeRange}</h2>
            {Object.entries(deduplicatedForms).map(([key, forms], idx) => {
              if (forms.length === 1) {
                const form = forms[0]
                return (
                  <div key={idx} css={wordRow}>
                    <div>{form.documentId}</div>
                    <div>{form.source}</div>
                    <div>{form.simplePhonetics}</div>
                    <div>{form.englishGloss.join(", ")}</div>
                  </div>
                )
              } else {
                const simplePhonetics = forms.find(
                  (w) => w.simplePhonetics?.length
                )
                const englishGloss = forms.find((w) => w.englishGloss?.length)
                const docIds = uniq(forms.map((w) => w.documentId))
                return (
                  <div key={idx} css={wordRow}>
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

const wide = css`
  ${fullWidth};
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
