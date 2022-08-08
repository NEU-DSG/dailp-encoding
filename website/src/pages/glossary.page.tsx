import cx from "classnames"
import { groupBy } from "lodash"
import pluralize from "pluralize"
import React from "react"
import { Helmet } from "react-helmet"
import Link from "src/components/link"
import * as Dailp from "src/graphql/dailp"
import { usePreferences } from "src/preferences-context"
import {
  closeBlock,
  edgePadded,
  fullWidth,
  paragraph,
  std,
} from "src/style/utils.css"
import Layout from "../layout"
import { glossarySectionId, morphemeTagId } from "../routes"

const GlossaryPage = () => {
  const { cherokeeRepresentation } = usePreferences()
  const [{ data }] = Dailp.useGlossaryQuery({
    variables: { system: cherokeeRepresentation },
  })
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
