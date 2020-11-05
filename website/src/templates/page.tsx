import React from "react"
import { graphql } from "gatsby"
import { css } from "linaria"
import { Helmet } from "react-helmet"
import theme, { fullWidth } from "../theme"
import Layout from "../layout"

export default (p: { data: any }) => {
  const page = p.data.page
  return (
    <Layout title={page.headings[0]?.value}>
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
        <article
          className={wideArticle}
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </main>
    </Layout>
  )
}

export const query = graphql`
  query ContentPage($id: String!) {
    page: markdownRemark(id: { eq: $id }) {
      content: html
      headings(depth: h1) {
        value
      }
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
