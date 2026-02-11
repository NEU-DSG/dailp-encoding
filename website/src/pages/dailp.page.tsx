import React from "react"
import { useState } from "react"
import Markdown from "react-markdown"
import { UserRole, useUserRole } from "src/auth"
import { Link } from "src/components"
import {
  CollectionSection,
  MenuUpdate,
  useEditedCollectionQuery,
  useMenuBySlugQuery,
  usePageByPathQuery,
} from "src/graphql/dailp"
import * as Dailp from "src/graphql/dailp"
import { edgePadded, fullWidth } from "src/style/utils.css"
import { Alert } from "../components/alert"
import Layout from "../layout"
import chapterPageRoute from "./edited-collections/chapter.page.route"

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

  let collectionSlugs = ["cwkw", "willie-jumper-stories"]
  // check if page belongs in a collection
  const collectionSlug = props.path.split("/")[1]

  // const [{ data: collectionData }] = useEditedCollectionQuery({
  //   variables: { slug: collectionSlug || "" },
  //   pause: fetching || !collectionSlug,
  // })

  const page = data?.pageByPath
  const collectionSections = [
    CollectionSection.Intro,
    CollectionSection.Body,
    CollectionSection.Credit,
  ]
  // const collectionChapters = collectionData?.editedCollection?.chapters?.filter((chapter) =>
  //   (chapter.))
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

  // keep these variables above early returns to prevent React error
  // stores current "set page location" dropdown selection
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const isLocationSelected = selectedLocation !== ""
  const userRole = useUserRole()
  const [updateMenuResult, updateMenu] = Dailp.useUpdateMenuMutation()

  const isInCollection =
    collectionSlug && collectionSlugs.includes(collectionSlug)
  // true if page is either in a collection or in menu
  const isPublished = isInCollection || isInMenu(props.path)

  if (fetching) {
    return <p>Loading...</p>
  }

  if (!page || !content) {
    return <Alert>Page content not found. {props.path}</Alert>
  }

  const handlePublishClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const action = isPublished && !isLocationSelected ? "unpublish" : "publish"
    const confirm = window.confirm(
      `Are you sure you want to ${action} this page?`
    )
    if (!confirm) {
      e.preventDefault()
      return
    }
    if (isInCollection) {
      // update table of contents
      // publish page code not merged yet
    } else {
      const toMenuItemInput = (
        nodes: any[] | undefined
      ): ReadonlyArray<Dailp.MenuItemInput> | null => {
        if (!nodes || !nodes.length) return null
        return nodes.map((n) => ({
          label: n?.label,
          path: n?.path,
          items: toMenuItemInput(n?.items ?? []),
        })) as ReadonlyArray<Dailp.MenuItemInput>
      }

      const updatedItems =
        menu?.items?.map((item) => {
          if (action === "publish" && item.path === selectedLocation) {
            const currentItems = item.items || []
            return {
              ...item,
              items: [
                ...currentItems,
                {
                  label: page.title,
                  path: props.path,
                  items: [],
                },
              ],
            }
          }

          // looks through entire menu to get rid of all instances of selected page
          if (action === "unpublish") {
            return {
              ...item,
              items:
                item.items?.filter((subItem) => subItem.path !== props.path) ||
                null,
            }
          }
          return item
        }) || []

      const itemsInput = toMenuItemInput(updatedItems)
      const menuUpdate: Dailp.MenuUpdate = {
        id: menu?.id!,
        name: menu?.name!,
        items: itemsInput,
      }

      updateMenu({ menu: menuUpdate })
      // reset dropdown to "None" after action
      setSelectedLocation("")
    }
  }

  const locationList = isInCollection
    ? collectionSections?.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))
    : menu?.items?.map((item) => (
        <option key={item.label} value={item.path}>
          {item.label}
        </option>
      ))

  if (isInCollection) {
    return (
      <>
        <header>
          <h1>{page.title}</h1>
          {/* dennis todo: should be admin in the future */}
          {
            /* dropdown & publish button */
            userRole === UserRole.Editor && (
              <div>
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

  return (
    <>
      {!isPublished && (
        <Alert>
          Page content found. Add it to the menu to view it. {props.path}
        </Alert>
      )}
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
                    <option key={"None"} value="">
                      None
                    </option>
                    {locationList}
                  </select>
                </label>
                <button
                  onClick={handlePublishClick}
                  disabled={
                    (isPublished && isLocationSelected) ||
                    (!isPublished && !isLocationSelected)
                  }
                >
                  {isPublished && !isLocationSelected ? "Unpublish" : "Publish"}
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
