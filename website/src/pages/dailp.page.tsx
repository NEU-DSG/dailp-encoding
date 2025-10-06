import React from "react"
import { Helmet } from "react-helmet"
import { PageContents } from "src/components/wordpress"
import { usePageByPathQuery } from "src/graphql/dailp"
import { edgePadded, fullWidth } from "src/style/utils.css"
import Layout from "../layout"

const DailpPage = (props: { "*": string }) => (
  <Layout>
    <Helmet>
      <link
        rel="stylesheet"
        id="wpforms-full-css"
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

export const Page = DailpPage

const Contents = (props: { slug: string }) => {
  const [{ data, fetching }] = usePageByPathQuery({
    variables: { path: "/" + props.slug },
  })
  const page = data?.pageByPath && data?.pageByPath
  const firstBlock = page?.body?.[0]
  const content =
    firstBlock && firstBlock.__typename === "Markdown"
      ? firstBlock.content
      : null
  if (content && page) {
    return (
      <>
        <header>
          <h1>{page.title}</h1>
        </header>
        <PageContents content={content} />
      </>
    )
  } else if (fetching) {
    return <p>Loading...</p>
  } else {
    return <p>Page content not found.</p>
  }
}
