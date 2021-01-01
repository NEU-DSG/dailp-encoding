import React, { useState } from "react"
import { graphql } from "gatsby"
import { css, cx } from "linaria"
import _ from "lodash"
import theme, { fullWidth } from "../theme"
import Layout from "../layout"
import { ExperiencePicker, TagSetPicker } from "../mode"
import {
  ExperienceLevel,
  morphemeDisplayTag,
  TagSet,
  tagSetForMode,
} from "../types"
import { glossarySectionId, morphemeTagId } from "../routes"

export default (p: { data: GatsbyTypes.GlossaryQuery }) => {
  const tags = p.data.dailp.allTags
  // Group the tags by type.
  const groupedTags = _.groupBy(tags, (t) => t.morphemeType)
  const [tagSet, setTagSet] = useState<TagSet>(null)
  return (
    <Layout title="Morpheme Glossary">
      <main className={padded}>
        <header className={wide}>
          <h1>Morpheme Glossary</h1>
        </header>
        <TagSetPicker onSelect={setTagSet} />
        {Object.entries(groupedTags).map(([ty, tags]) => {
          return (
            <section key={ty} className={cx(wide, sec)}>
              <h2 id={glossarySectionId(ty)}>{ty}</h2>
              <dl>
                {tags.map((tag) => {
                  const scopedTag = morphemeDisplayTag(tag, tagSet)
                  return (
                    <React.Fragment key={tag.id}>
                      <dt id={morphemeTagId(tag.id)}>
                        {scopedTag.tag} – {scopedTag.title}
                      </dt>
                      <dd>{scopedTag.definition}</dd>
                    </React.Fragment>
                  )
                })}
              </dl>
            </section>
          )
        })}
      </main>
    </Layout>
  )
}

export const query = graphql`
  query Glossary {
    dailp {
      allTags {
        id
        crg {
          tag
          title
          definition
        }
        taoc {
          tag
          title
          definition
        }
        learner {
          tag
          title
          definition
        }
        morphemeType
      }
    }
  }
`

const wide = css`
  ${fullWidth}
`

const sec = css`
  margin-bottom: ${theme.rhythm}rem;
`

const padded = css`
  padding-left: ${theme.edgeSpacing};
  padding-right: ${theme.edgeSpacing};
`
