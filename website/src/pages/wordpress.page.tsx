import React from "react"
import { Helmet } from "react-helmet"
import * as Wordpress from "src/graphql/wordpress"
import { edgePadded, fullWidth } from "src/sprinkles.css"
import Layout from "../layout"
import { wordpressUrl } from "../theme"

const WordpressPage = ({ "*": slug }) => {
  const [{ data }] = Wordpress.usePageQuery({ variables: { slug } })
  const page = data?.page?.__typename === "Page" && data?.page
  if (!page) {
    return null
  }
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
      <main className={edgePadded}>
        <article className={fullWidth}>
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
