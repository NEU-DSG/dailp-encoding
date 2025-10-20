import { groupBy, uniq } from "lodash-es"
import React, { useRef, useState } from "react"
import { Helmet } from "react-helmet"
import { Button } from "reakit"
import { Input } from "reakit"
import * as Dailp from "src/graphql/dailp"
import Layout from "src/layouts/default"
import { fullWidth } from "src/style/utils.css"
import { boldWordRow, margined, underlined, wordRow } from "./timeline.css"

const TimelinePage = () => {
  const staticMorphemeId = useRef("")
  const [morphemeId, setMorpheme] = useState("")
  return (
    <Layout>
      <Helmet title="Timeline" />
      <main>
        <Input
          placeholder="Morpheme ID"
          onChange={(e) => (staticMorphemeId.current = e.target.value)}
        />
        <Button onClick={() => setMorpheme(staticMorphemeId.current)}>
          Search
        </Button>
        {!!morphemeId && <Timeline gloss={morphemeId} />}
      </main>
    </Layout>
  )
}
export const Page = TimelinePage

const Timeline = (p: { gloss: string }) => {
  const [timeline] = Dailp.useTimelineQuery({
    variables: { gloss: p.gloss },
  })

  if (timeline.fetching || !timeline.data) {
    return <>Loading...</>
  } else if (timeline.error) {
    console.error(timeline.error)
    return <>Error!</>
  }

  return (
    <div className={fullWidth}>
      <div className={boldWordRow}>
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
          <div key={timeRange} className={margined}>
            <h2 className={underlined}>{timeRange}</h2>
            {Object.entries(deduplicatedForms).map(([key, forms], idx) => {
              if (forms.length === 1) {
                const form = forms[0]
                return (
                  <div key={idx} className={wordRow}>
                    <div>{form.documentId}</div>
                    <div>{form.source}</div>
                    <div>{form.romanizedSource}</div>
                    <div>{form.englishGloss.join(", ")}</div>
                  </div>
                )
              } else {
                const wordWithRomanization = forms.find(
                  (w) => w.romanizedSource?.length
                )
                const englishGloss = forms.find((w) => w.englishGloss?.length)
                const docIds = uniq(forms.map((w) => w.documentId))
                return (
                  <div key={idx} className={wordRow}>
                    <div>{docIds.join(", ")}</div>
                    <div>{key}</div>
                    <div />
                    <div>{wordWithRomanization?.romanizedSource}</div>
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
