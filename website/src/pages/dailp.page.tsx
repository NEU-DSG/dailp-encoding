import React from "react"
import Markdown from "react-markdown"
import { UserRole, useUserRole } from "src/auth"
import { Link } from "src/components"
import { useMenuBySlugQuery, usePageByPathQuery } from "src/graphql/dailp"
import { edgePadded, fullWidth } from "src/style/utils.css"
import { Alert } from "../components/alert"
import Layout from "../layout"

interface DailpPageProps {
  "*": string
}

const DailpPage = (props: DailpPageProps) => (
  <Layout>
    <main className={edgePadded}>
      <article className={fullWidth}>
        <DailpPageContents path={"/" + props["*"]} />
      </article>
    </main>
  </Layout>
)

export const Page = DailpPage

export const DailpPageContents = (props: { path: string }) => {
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
    if (slug == "/" || slug.indexOf("/pages/") !== -1) {
      return true
    }
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
    return <Alert>Page content not found. {props.path}</Alert>
  }
  let collectionSlugs = ["cwkw", "willie-jumper-stories"]

  // check if page belongs in a collection
  const collectionSlug = props.path.split("/")[1]
  if (collectionSlug && collectionSlugs.includes(collectionSlug)) {
    const userRole = useUserRole()

    return (
      <>
        <header>
          <h1>{page.title}</h1>
          {/* dennis todo: should be admin in the future */}
          {userRole === UserRole.Editor && (
            <Link href={`/edit?path=${props.path}`}>Edit</Link>
          )}
        </header>
        {/* html chceking here please*/}
        {content.charAt(0) === "<" ? (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          <Markdown>{content}</Markdown>
        )}
      </>
    )
  }

  const userRole = useUserRole()

  return (
    <>
      {
        /* check if page is in menu */
        !isInMenu(props.path) && (
          <Alert>
            Page content found. Add it to the menu to view it. {props.path}
          </Alert>
        )
      }
      <header>
        <h1>{page.title}</h1>
        {/* dennis todo: should be admin in the future */}
        {userRole === UserRole.Editor && (
          <Link href={`/edit?path=${props.path}`}>Edit</Link>
        )}
      </header>
      {content.charAt(0) === "<" ? (
        <div dangerouslySetInnerHTML={{ __html: content }} />
      ) : (
        <Markdown>{content}</Markdown>
      )}
    </>
  )
}
