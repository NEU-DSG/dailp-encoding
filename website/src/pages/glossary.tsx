import React from "react"
import { graphql } from "gatsby"
import { css, cx } from "linaria"
import _ from "lodash"
import theme, { fullWidth } from "../theme"
import Layout from "../layout"

export default (p: { data: GatsbyTypes.GlossaryQuery }) => {
  const tags = p.data.dailp.allTags
  // Group the tags by type.
  const groupedTags = _.groupBy(tags, (t) => t.morphemeType)
  return (
    <Layout title="Morpheme Glossary">
      <main className={padded}>
        <header className={wide}>
          <h1>Morpheme Glossary</h1>
        </header>
        {Object.entries(groupedTags).map(([ty, tags]) => (
          <section key={ty} className={cx(wide, sec)}>
            <h2>{ty}</h2>
            <dl>
              {tags.map((tag) => (
                <React.Fragment key={tag.id}>
                  <dt id={tag.id}>
                    {tag.id === tag.crg ? tag.id : `${tag.id} / ${tag.crg}`}
                  </dt>
                  <dd>{tag.name}</dd>
                </React.Fragment>
              ))}
            </dl>
          </section>
        ))}
      </main>
    </Layout>
  )
}

export const query = graphql`
  query Glossary {
    dailp {
      allTags {
        id
        name
        crg
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
