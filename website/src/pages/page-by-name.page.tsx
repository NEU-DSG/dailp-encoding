import React, { ReactNode, useMemo } from "react"
import Markdown from "react-markdown"
import { usePageBySlugQuery } from "src/graphql/dailp"
import Layout from "src/layout"

export const DELIM = "^"
export const splitMarkdown = (content: string) : ReactNode =>  {
  return content.split(DELIM).map((s) => s.trim()).map((s) => <Markdown>{s}</Markdown>)
}

const PageByName = ({ pageName }: { pageName: string }) => {
  const [{ data }] = usePageBySlugQuery({ variables: { slug: pageName } })
  // Use routeParams to get the pageName from pageContext
  //const {data} = usePageBySlugQuery({variables: {slug: pageName}})
  const content = data?.pageBySlug?.body?.map((body: any) => {
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
        <p>
          {" "}
          page name: {pageName} 
        </p>
        {splitMarkdown(contentString)}
      </main>
    </Layout>
  )
}

export const Page = PageByName
