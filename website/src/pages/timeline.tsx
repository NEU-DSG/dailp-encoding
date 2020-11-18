import React, { useState, useRef } from "react"
import { useQuery, gql } from "@apollo/client"
import { css } from "linaria"
import { Input } from "reakit/Input"
import { Button } from "reakit/Button"
import { fullWidth } from "../theme"
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
      {timeline.data.morphemeTimeClusters.map((cluster: any) => (
        <div
          key={cluster.start.year}
          style={{ marginBottom: "3rem" }}
        >
          <h2 style={{ borderBottom: "2px solid black" }}>
            {cluster.start ? Math.floor(cluster.start!.year / 50) * 50 : "None"} -{" "}
            {cluster.end ? Math.ceil(cluster.end!.year / 50) * 50 : "None"}
          </h2>
          {cluster.forms.map((form: any, i: number) => (
            <div key={i} className={wordRow}>
              <div>{form.documentId}</div>
              <div>{form.normalizedSource || form.source}</div>
              <div>{form.simplePhonetics}</div>
              <div>{form.englishGloss.join(", ")}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

const wide = css`
  ${fullWidth}
`

const wordRow = css`
  display: flex;
  flex-flow: row;
  margin-bottom: 1rem;
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
        documentId
        englishGloss
      }
    }
  }
`
