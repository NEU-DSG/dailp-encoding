import React from "react"
import { Helmet } from "react-helmet"
import { WordpressPageContents } from "src/components"
import * as Wordpress from "src/graphql/wordpress"
import Layout from "src/layouts/default"
import { edgePadded, fullWidth } from "src/style/utils.css"
import { wordpressUrl } from "../theme.css"

const WordpressPage = (props: { "*": string }) => (
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
        <Contents slug={props["*"]} />
      </article>
    </main>
  </Layout>
)

export const Page = WordpressPage

const Contents = (props: { slug: string }) => {
  const [{ data, fetching }] = Wordpress.usePageQuery({
    variables: { slug: props.slug },
  })
  const page = data?.page?.__typename === "Page" && data?.page
  if (page) {
    return (
      <>
        <header>
          <h1>{page.title}</h1>
        </header>
        <WordpressPageContents content={page.content} />
      </>
    )
  } else if (fetching) {
    return <p>Loading...</p>
  } else {
    return <p>Wordpress page not found.</p>
  }
}
