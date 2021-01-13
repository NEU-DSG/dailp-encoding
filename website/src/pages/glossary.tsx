import React, { useState } from "react"
import { graphql } from "gatsby"
import { css, cx } from "linaria"
import _ from "lodash"
import pluralize from "pluralize"
import { AnchorLink } from "gatsby-plugin-anchor-links"
import theme, { fullWidth, std } from "../theme"
import Layout from "../layout"
import { TagSetPicker } from "../mode"
import { morphemeDisplayTag, TagSet } from "../types"
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

        <ul className={wide}>
          <h4 className={std.closeBlock}>Table of Contents</h4>
          {Object.entries(groupedTags).map(
            ([ty]) =>
              ty && (
                <li>
                  <AnchorLink to={`#${glossarySectionId(ty)}`}>
                    {pluralize(ty)}
                  </AnchorLink>
                </li>
              )
          )}
        </ul>

        {Object.entries(groupedTags).map(([ty, tags]) => {
          return (
            <section key={ty} className={cx(wide, sec)}>
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
