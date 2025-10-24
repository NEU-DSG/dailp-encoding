import React from "react"
import { navigate } from "vite-plugin-ssr/client/router"
import { UserRole, useUserRole } from "src/auth"
import { PageContents } from "src/components/wordpress"
import { useMenuBySlugQuery, usePageByPathQuery } from "src/graphql/dailp"
import { edgePadded, fullWidth } from "src/style/utils.css"
import Layout from "../layout"

interface DailpPageProps {
  "*": string
}

const DailpPage = (props: DailpPageProps) => (
  <Layout>
    <main className={edgePadded}>
      <article className={fullWidth}>
        <Contents path={"/" + props["*"]} />
      </article>
    </main>
  </Layout>
)

export const Page = DailpPage

const Contents = (props: { path: string }) => {
  const [{ data, fetching }] = usePageByPathQuery({
    variables: { path: props.path },
  })

  const [{ data: menuData }] = useMenuBySlugQuery({
    variables: { slug: "default-nav" },
    pause: fetching, // Don't fetch menu until page query is complete
  })

  const page = data?.pageByPath
  const menu = menuData?.menuBySlug
  const firstBlock = page?.body?.[0]
  const content =
    firstBlock?.__typename === "Markdown" ? firstBlock.content : null

  const isInMenu = (slug: string) => {
    return (
      menu?.items
        ?.flatMap((item) => item.items)
        .some((item) => item?.path === slug) ?? false
    )
  }

  if (fetching) {
    return <p>Loading...</p>
  }

  if (!page || !content) {
    return <p>Page content not found.</p>
  }

  if (!isInMenu(props.path)) {
    return <p>Page content found. Add it to the menu to view it.</p>
  }

  const userRole = useUserRole()

  return (
    <>
      <header>
        <h1>{page.title}</h1>
        {/* dennis todo: should be admin in the future */}
        {userRole === UserRole.Editor && (
          <button onClick={() => navigate(`/edit${props.path}`)}>Edit</button>
        )}
      </header>
      <PageContents content={content} />
    </>
  )
}
