import cx from "classnames"
import { groupBy } from "lodash"
import pluralize from "pluralize"
import React, { useState } from "react"
import * as Dailp from "src/graphql/dailp"
import Link from "src/link"
import {
  closeBlock,
  edgePadded,
  fullWidth,
  paragraph,
  std,
} from "src/sprinkles.css"
import Layout from "../layout"
import { TagSetPicker } from "../mode"
import { glossarySectionId, morphemeTagId } from "../routes"
import { TagSet, morphemeDisplayTag } from "../types"

const GlossaryPage = () => {
  const [{ data }] = Dailp.useGlossaryQuery()
  const tags = data?.allTags
  // Group the tags by type.
  const groupedTags = groupBy(tags, (t) => t.morphemeType)
  const [tagSet, setTagSet] = useState<TagSet>(TagSet.Learner)
  return (
    <Layout title="Glossary of Terms">
      <main className={edgePadded}>
        <header className={fullWidth}>
          <h1>Glossary of Terms</h1>
        </header>
        <p className={fullWidth}>
          There are multiple conventions for describing the parts of a Cherokee
          word. Hover over each terminology mode below to see more details about
          what they offer.
        </p>

        <TagSetPicker onSelect={setTagSet} />

        <ul className={fullWidth}>
          <h4 className={closeBlock}>Table of Contents</h4>
          {Object.entries(groupedTags).map(
            ([ty]) =>
              ty && (
                <li>
                  <Link href={`#${glossarySectionId(ty)}`}>
                    {pluralize(ty)}
                  </Link>
                </li>
              )
          )}
        </ul>

        {Object.entries(groupedTags).map(([ty, tags]) => {
          return (
            <section key={ty} className={wideSection}>
              <h2 id={glossarySectionId(ty)}>{pluralize(ty)}</h2>
              <dl>
                {tags.map((tag) => {
                  const scopedTag = morphemeDisplayTag(tag, tagSet)
                  if (scopedTag) {
                    return (
                      <React.Fragment key={tag.id}>
                        <dt id={morphemeTagId(tag.id)}>
                          <span className={std.smallCaps}>{scopedTag.tag}</span>{" "}
                          – {scopedTag.title}
                        </dt>
                        <dd>{scopedTag.definition}</dd>
                      </React.Fragment>
                    )
                  } else {
                    return null
                  }
                })}
              </dl>
            </section>
          )
        })}
      </main>
    </Layout>
  )
}
export default GlossaryPage

const wideSection = cx(fullWidth, paragraph)
