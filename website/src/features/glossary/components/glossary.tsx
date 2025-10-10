import cx from "classnames"
import { groupBy } from "lodash-es"
import pluralize from "pluralize"
import React from "react"
import { Helmet } from "react-helmet"
import * as Dailp from "src/graphql/dailp"
import { usePreferences } from "src/preferences-context"
import {
  closeBlock,
  edgePadded,
  fullWidth,
  paragraph,
  std,
} from "src/style/utils.css"
import Link from "src/ui/atoms/link/link"
import { glossarySectionId, morphemeTagId } from "src/routes"

export const Glossary = () => {
  const { cherokeeRepresentation } = usePreferences()
  const [{ data }] = Dailp.useGlossaryQuery({
    variables: { system: cherokeeRepresentation },
  })
  const tags = data?.allTags
  // Group the tags by type.
  const groupedTags = groupBy(tags, (t) => t.morphemeType)

  return (
    <>
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
                <li key={`glossary-${glossarySectionId(ty)}`}>
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
                {tags
                  .filter((tag) => !!tag.tag && !!tag.title)
                  .sort(
                    (a, b) =>
                      a.tag.toLowerCase().charCodeAt(0) -
                      b.tag.toLowerCase().charCodeAt(0)
                  )
                  .map((tag) => (
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
    </>
  )
}

const wideSection = cx(fullWidth, paragraph)
