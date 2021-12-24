import React, { useState } from "react"
import Link from "next/link"
import { css } from "@emotion/react"
import { groupBy } from "lodash"
import pluralize from "pluralize"
import theme, { fullWidth, std, typography } from "../theme"
import Layout from "../layout"
import { TagSetPicker } from "../mode"
import { morphemeDisplayTag, TagSet } from "../types"
import { glossarySectionId, morphemeTagId } from "../routes"
import * as Dailp from "src/graphql/dailp"

const GlossaryPage = () => {
  const [{ data }] = Dailp.useGlossaryQuery()
  const tags = data?.allTags
  // Group the tags by type.
  const groupedTags = groupBy(tags, (t) => t.morphemeType)
  const [tagSet, setTagSet] = useState<TagSet>(null)
  return (
    <Layout title="Glossary of Terms">
      <main css={padded}>
        <header css={wide}>
          <h1>Glossary of Terms</h1>
        </header>
        <p css={wide}>
          There are multiple conventions for describing the parts of a Cherokee
          word. Hover over each terminology mode below to see more details about
          what they offer.
        </p>

        <TagSetPicker onSelect={setTagSet} />

        <ul css={wide}>
          <h4 css={std.closeBlock}>Table of Contents</h4>
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
            <section key={ty} css={[wide, sec]}>
              <h2 id={glossarySectionId(ty)}>{pluralize(ty)}</h2>
              <dl>
                {tags.map((tag) => {
                  const scopedTag = morphemeDisplayTag(tag, tagSet)
                  if (scopedTag) {
                    return (
                      <React.Fragment key={tag.id}>
                        <dt id={morphemeTagId(tag.id)}>
                          <span css={std.smallCaps}>{scopedTag.tag}</span> –{" "}
                          {scopedTag.title}
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

const wide = css`
  ${fullWidth};
`

const sec = css`
  margin-bottom: ${typography.rhythm(1)};
`

const padded = css`
  padding-left: ${theme.edgeSpacing};
  padding-right: ${theme.edgeSpacing};
`
