import React, { ReactNode, useMemo } from "react"
import Markdown from "react-markdown"
import { usePageByPathQuery } from "src/graphql/dailp"
import Layout from "src/layout"

const PageByName = ({ pageName }: { pageName: string }) => {
  const [{ data }] = usePageByPathQuery({ variables: { path: "/pages/" + pageName } })
  const content = data?.pageByPath?.body?.map((body: any) => {
    if (body.__typename === "Markdown") {
      return body.content
    }
    return ""
  })

  if (!content) {
    return (
      <Layout>
        <main>
          <p>No page content found</p>
        </main>
      </Layout>
    )
  }

  const contentString = content.join(" ")

  return (
    <Layout>
      <main>
        <Markdown>{contentString}</Markdown>
      </main>
    </Layout>
  )
}

export const Page = PageByName
