import React, { ReactNode, useMemo } from "react"
import Markdown from "react-markdown"
import { usePageByPathQuery } from "src/graphql/dailp"
import Layout from "src/layout"

export const DELIM = "^"
export const splitMarkdown = (content: string) : ReactNode =>  {
  return content.split(DELIM).map((s) => s.trim()).map((s) => <Markdown>{s}</Markdown>)
}

const PageByName = ({ pageName }: { pageName: string }) => {
  const [{ data }] = usePageByPathQuery({ variables: { path: pageName } })
  const content = data?.pageByPath?.body?.map((body: any) => {
    if (body.__typename === "Markdown") {
      return body.content
    }
    return ""
  })
  // if content but not in menu, redirect to menu edit page and let them add it to the menu!
  //if(content && isInMenu(path)) {
    //navigate(`/admin/edit-menu?path=${pageName}`)
  //}

  if(!content) {
    return (
    <Layout>
      <main>
        <p>
          No page content found
        </p>
      </main>
    </Layout>)
  }

  const contentString = content.join(" ")


  return (
    <Layout>
      <main>
        {splitMarkdown(contentString)}
      </main>
    </Layout>
  )
}

export const Page = PageByName
