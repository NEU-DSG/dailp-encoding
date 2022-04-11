import cx from "classnames"
import { groupBy } from "lodash"
import pluralize from "pluralize"
import React, { useState } from "react"
import { Helmet } from "react-helmet"
import Link from "src/components/link"
import * as Dailp from "src/graphql/dailp"
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
import { TagSet } from "../types"

const GlossaryPage = () => {
  const [tagSet, setTagSet] = useState<TagSet>(TagSet.Learner)
  let system = Dailp.CherokeeOrthography.Taoc
  if (tagSet === TagSet.Crg) {
    system = Dailp.CherokeeOrthography.Crg
  } else if (tagSet === TagSet.Taoc) {
    system = Dailp.CherokeeOrthography.Taoc
  } else if (tagSet === TagSet.Learner) {
    system = Dailp.CherokeeOrthography.Learner
  }
  const [{ data }] = Dailp.useGlossaryQuery({ variables: { system } })
  const tags = data?.allTags
  // Group the tags by type.
  const groupedTags = groupBy(tags, (t) => t.morphemeType)
  return (
    <Layout>
      <Helmet title="Glossary of Terms" />
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
                {tags.map((tag) => (
                  <React.Fragment key={tag.tag}>
                    <dt id={morphemeTagId(tag.tag)}>
                      <span className={std.smallCaps}>{tag.tag}</span> –{" "}
                      {tag.title}
                    </dt>
                    <dd>{tag.definition}</dd>
                  </React.Fragment>
                ))}
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
