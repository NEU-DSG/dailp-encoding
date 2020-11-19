import React from "react"
import { graphql } from "gatsby"
import { css } from "linaria"
import { Helmet } from "react-helmet"
import theme, { fullWidth } from "../theme"
import Layout from "../layout"

export default (p: { data: GatsbyTypes.ContentPageQuery }) => {
  const page = p.data.page
  return (
    <Layout>
      <Helmet>
        <link
          rel="stylesheet"
          id="wpforms-full-css"
          href="https://dailp.northeastern.edu/wp-content/plugins/wpforms-lite/assets/css/wpforms-full.min.css?ver=1.6.3.1"
          type="text/css"
          media="all"
        />
      </Helmet>
      <main className={padded}>
        <article className={wideArticle}>
          <header>
            <h1>{page.title}</h1>
          </header>
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
        </article>
      </main>
    </Layout>
  )
}

export const query = graphql`
  query ContentPage($id: String!) {
    page: wpPage(id: { eq: $id }) {
      title
      content
    }
  }
`

const padded = css`
  padding-left: ${theme.edgeSpacing};
  padding-right: ${theme.edgeSpacing};
`

const wideArticle = css`
  ${fullWidth}
`
