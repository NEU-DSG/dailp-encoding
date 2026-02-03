import React from "react"
import { useState } from "react"
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
  const isInCollection =
    collectionSlug && collectionSlugs.includes(collectionSlug)
  if (isInCollection) {
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

  // true if page is either in a collection or in menu
  const isPublished = isInCollection || isInMenu(props.path)
  // stores current "set page location" dropdown selection
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const locationSelected = selectedLocation !== ""

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
        {
          /* dropdown & publish button */
          userRole === UserRole.Editor && (
            <div>
              <div>
                <label>
                  Set Page Location:
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    <option value="">None</option>
                    {menu?.items?.map((item: any) => (
                      <option key={item.label} value={item.path}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  disabled={
                    (isPublished && locationSelected) ||
                    (!isPublished && !locationSelected)
                  }
                >
                  {isPublished && !locationSelected ? "Unpublish" : "Publish"}
                </button>
              </div>
              <Link href={`/edit?path=${props.path}`}>Edit</Link>
            </div>
          )
        }
      </header>
      {content.charAt(0) === "<" ? (
        <div dangerouslySetInnerHTML={{ __html: content }} />
      ) : (
        <Markdown>{content}</Markdown>
      )}
    </>
  )
}
