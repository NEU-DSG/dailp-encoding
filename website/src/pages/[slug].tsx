import React from "react"
import { GetStaticPaths } from "next"
import { css } from "@emotion/react"
import { Helmet } from "react-helmet"
import theme, { fullWidth, wordpressUrl } from "../theme"
import Layout from "../layout"
import * as Wordpress from "src/graphql/wordpress"
import { client, getStaticQueriesNew } from "src/graphql"

const WordpressPage = ({ slug }) => {
  const [{ data }] = Wordpress.usePageQuery({ variables: { slug } })
  if (!data) {
    return null
  }
  const page = data?.pages?.nodes[0]
  return (
    <Layout>
      <Helmet>
        <link
          rel="stylesheet"
          id="wpforms-full-css"
          href={`${wordpressUrl}/wp-content/plugins/wpforms-lite/assets/css/wpforms-full.min.css?ver=1.6.3.1`}
          type="text/css"
          media="all"
        />
      </Helmet>
      <main css={padded}>
        <article css={wideArticle}>
          <header>
            <h1>{page.title}</h1>
          </header>
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
        </article>
      </main>
    </Layout>
  )
}
export default WordpressPage

export const getStaticProps = getStaticQueriesNew(async (params, dailp, wp) => {
  await wp.query(Wordpress.PageDocument, { slug: params.slug }).toPromise()
  return params
})

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await client.wordpress
    .query<Wordpress.PageIndexQuery, Wordpress.PageIndexQueryVariables>(
      Wordpress.PageIndexDocument
    )
    .toPromise()

  return {
    paths: data.pages.nodes.map((page) => ({
      params: { slug: page.slug },
    })),
    fallback: false,
  }
}

const padded = css`
  padding-left: ${theme.edgeSpacing};
  padding-right: ${theme.edgeSpacing};
`

const wideArticle = css`
  ${fullWidth}
`
