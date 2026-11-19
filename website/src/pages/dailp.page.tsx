import React from "react"
import { useState } from "react"
import Markdown from "react-markdown"
import { UserRole, useUserRole } from "src/auth"
import { Link } from "src/components"
import {
  ChapterContents,
  CollectionSection,
  MenuUpdate,
  useEditedCollectionQuery,
  useEditedCollectionsQuery,
  useMenuBySlugQuery,
  usePageByPathQuery,
} from "src/graphql/dailp"
import * as Dailp from "src/graphql/dailp"
import { edgePadded, fullWidth } from "src/style/utils.css"
import { slugKey, withoutUnassigned } from "src/utils/edit-toc"
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

  // The menu and collections below drive the publish menu, so always check the
  // server: cached copies miss edits made elsewhere (e.g. in the TOC editor)
  const [{ data: menuData }] = useMenuBySlugQuery({
    variables: { slug: "default-nav" },
    pause: fetching, // Don't fetch menu until page query is complete
    requestPolicy: "cache-and-network",
  })

  const [{ data: collectionData }] = useEditedCollectionsQuery({
    pause: fetching,
    requestPolicy: "cache-and-network",
  })

  let collectionSlugs =
    collectionData?.allEditedCollections?.map((collection) =>
      collection.slug.replaceAll("_", "-")
    ) ?? []
  // check if page belongs in a collection
  const collectionSlug = props.path.split("/")[1]

  const [{ data: collectionPagesData }] = useEditedCollectionQuery({
    variables: { slug: collectionSlug || "" },
    pause: fetching || !collectionSlug,
    requestPolicy: "cache-and-network",
  })

  // Only page chapters currently in the TOC (not removed/unassigned ones)
  const collectionPageChapters = withoutUnassigned(
    collectionPagesData?.editedCollection?.chapters ?? []
  ).filter((ch) => ch.contentType === ChapterContents.Page)
  const page = data?.pageByPath
  const collectionSections = [
    CollectionSection.Intro,
    CollectionSection.Body,
    CollectionSection.Credit,
  ]
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

  // collectionSlugs are dashed; the path may use underscores (willie_jumper_stories)
  const isInCollection =
    collectionSlug &&
    collectionSlugs.includes(collectionSlug.replaceAll("_", "-"))
  const isPublished = isInCollection || isInMenu(props.path)

  // A collection page is only published once its chapter is placed in the
  // collection's TOC (new chapters start unassigned, index -1)
  // Compared with slugKey: GraphQL slugs are dashed, paths may use either form
  const chapterSlug = props.path.split("/")[2]
  const collectionChapters = collectionPagesData?.editedCollection?.chapters
  const isChapterInToc =
    !!chapterSlug &&
    withoutUnassigned(collectionChapters ?? []).some(
      (ch) => slugKey(ch.slug) === slugKey(chapterSlug)
    )
  const showUnpublishedChapterAlert =
    isInCollection &&
    collectionChapters !== undefined && // Wait for chapters to avoid a flash
    !isChapterInToc &&
    userRole === UserRole.Editor
  const editTocHref = `/collections/edit-toc?collectionSlug=${slugKey(
    collectionSlug ?? ""
  )}`

  if (fetching) {
    return <p>Loading...</p>
  }

  if (!page || !content) {
    return <Alert>Page content not found. {props.path}</Alert>
  }

  const handlePublishClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const action = isPublished && !isLocationSelected ? "unpublish" : "publish"
    const confirm = window.confirm(
      `Are you sure you want to ${action} this page? (Publishing feature for collections is still in development.)`
    )
    if (!confirm) {
      e.preventDefault()
      return
    }
    if (isInCollection) {
      // todo: add collections publishing backend
      alert(
        "Action failed: Publishing feature for collections is still in development."
      )
      return
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
    ? [
        ...(collectionSections ?? []),
        ...(collectionPageChapters?.map((ch) => ch.title) ?? []),
      ].map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))
    : menu?.items?.map((item) => (
        <option key={item.label} value={item.path}>
          {item.label}
        </option>
      ))

  // // katie todo: delete this after backend method to change collection table of contents is implemented
  // if (isInCollection) {
  //   return (
  //     <>
  //       <header>
  //         <h1>{page.title}</h1>
  //         {/* dennis todo: should be admin in the future */}
  //         {userRole === UserRole.Editor && (
  //           <div>
  //             <Link href={`/edit?path=${props.path}`}>Edit</Link>
  //           </div>
  //         )}
  //       </header>
  //       {content.charAt(0) === "<" ? (
  //         <div dangerouslySetInnerHTML={{ __html: content }} />
  //       ) : (
  //         <Markdown>{content}</Markdown>
  //       )}
  //     </>
  //   )
  // }

  return (
    <>
      {!isPublished && (
        <Alert>
          Page content found. Add it to the menu to view it. {props.path}
        </Alert>
      )}
      {showUnpublishedChapterAlert && (
        <Alert>
          This chapter is unpublished. To publish it, add it to the table of
          contents in <Link href={editTocHref}>Edit TOC</Link>.
        </Alert>
      )}
      <header>
        <h1>{page.title}</h1>
        {/* dennis todo: should be admin in the future */}
        {
          /* dropdown & publish button */
          userRole === UserRole.Editor && (
            <div>
              {/* Publishing to collections is still in development, so the
                  publish menu is hidden on collection pages for now.
                  To restore it, remove the `!isInCollection &&` check. */}
              {!isInCollection && (
                <div>
                  <label>
                    Set New Page Location:
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
                    {isPublished && !isLocationSelected
                      ? "Unpublish"
                      : "Publish"}
                  </button>
                </div>
              )}
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
