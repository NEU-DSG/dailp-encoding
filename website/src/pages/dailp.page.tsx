import React from "react"
import { useEffect, useState } from "react"
import Markdown from "react-markdown"
import { navigate } from "vite-plugin-ssr/client/router"
import { UserRole, useUserRole } from "src/auth"
import { Link } from "src/components"
import {
  CollectionSection,
  MenuUpdate,
  useEditedCollectionsQuery,
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

  const [{ data: collectionData }] = useEditedCollectionsQuery({
    pause: fetching,
  })

  let collectionSlugs =
    collectionData?.allEditedCollections?.map((collection) =>
      collection.slug.replaceAll("_", "-")
    ) ?? []
  // check if page belongs in a collection
  const collectionSlug = props.path.split("/")[1]

  // todo: need way to differentiate between documents and pages in chapters
  // const collectionChapters = collectionData?.editedCollection?.chapters?.filter((chapter) =>
  //   (chapter.))

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
  const [updatePagePathResult, updatePagePath] =
    Dailp.useUpdatePagePathMutation()

  useEffect(() => {
    if (!menu) return
    const strip = (v: string) =>
      v.length > 1 && v.endsWith("/") ? v.slice(0, -1) : v
    const normalized = strip(props.path)
    const parent = menu.items?.find((item) =>
      item.items?.some((subItem) => strip(subItem.path) === normalized)
    )
    if (parent?.label) {
      setSelectedLocation(parent.label)
      return
    }
    const topLevel = menu.items?.find((item) => strip(item.path) === normalized)
    if (topLevel?.label) {
      setSelectedLocation(topLevel.label)
    }
  }, [menu, props.path])

  const isInCollection =
    collectionSlug && collectionSlugs.includes(collectionSlug)
  const isPublished = isInCollection || isInMenu(props.path)

  if (fetching) {
    return <p>Loading...</p>
  }

  if (!page || !content) {
    return <Alert>Page content not found. {props.path}</Alert>
  }

  const slugify = (value: string) =>
    value.toLowerCase().trim().split(" ").join("-")

  const stripTrailingSlash = (value: string) =>
    value.length > 1 && value.endsWith("/") ? value.slice(0, -1) : value

  const buildPublishedPath = (menuLabel: string, currentPath: string) => {
    const prefix = slugify(menuLabel)
    return `/${prefix}${stripTrailingSlash(currentPath)}`
  }

  const buildUnpublishedPath = (menuLabel: string, currentPath: string) => {
    const prefix = `/${slugify(menuLabel)}`
    const normalized = stripTrailingSlash(currentPath)
    return normalized.startsWith(prefix + "/") || normalized === prefix
      ? normalized.slice(prefix.length) || "/"
      : normalized
  }

  const findParentMenuLabel = (path: string) => {
    const normalized = stripTrailingSlash(path)
    const parent = menu?.items?.find((item) =>
      item.items?.some(
        (subItem) => stripTrailingSlash(subItem.path) === normalized
      )
    )
    return parent?.label ?? null
  }

  const findCurrentMenuLabel = (path: string) => {
    const parent = findParentMenuLabel(path)
    if (parent) return parent
    const normalized = stripTrailingSlash(path)
    const topLevel = menu?.items?.find(
      (item) => stripTrailingSlash(item.path) === normalized
    )
    return topLevel?.label ?? null
  }

  const currentLocation = findCurrentMenuLabel(props.path)
  const isTopLevelMenuPage =
    currentLocation !== null && findParentMenuLabel(props.path) === null

  const handlePublishClick = async (
    e: React.MouseEvent<HTMLButtonElement>,
    action: "publish" | "unpublish"
  ) => {
    const verb =
      action === "unpublish" ? "unpublish" : isPublished ? "move" : "publish"
    const confirm = window.confirm(
      `Are you sure you want to ${verb} this page?`
    )
    if (!confirm) {
      e.preventDefault()
      return
    }
    if (isInCollection) {
      // update table of contents method here
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

      const parentLabel = findParentMenuLabel(props.path)
      const isMove = action === "publish" && isPublished && parentLabel !== null

      const sourcePath = parentLabel
        ? buildUnpublishedPath(parentLabel, props.path)
        : props.path

      const targetPath =
        action === "unpublish"
          ? sourcePath
          : action === "publish"
          ? buildPublishedPath(selectedLocation, sourcePath)
          : props.path

      if (targetPath !== props.path) {
        const res = await updatePagePath({
          oldPath: props.path,
          newPath: targetPath,
        })
        if (res.error) {
          const verb = isMove ? "move" : action
          window.alert(`Failed to ${verb} page: ${res.error.message}`)
          return
        }
      }

      const updatedItems =
        menu?.items?.map((item) => {
          const stripped =
            action === "unpublish" || isMove
              ? item.items?.filter((subItem) => subItem.path !== props.path) ??
                null
              : item.items ?? null

          if (action === "publish" && item.label === selectedLocation) {
            return {
              ...item,
              items: [
                ...(stripped ?? []),
                {
                  label: page.title,
                  path: targetPath,
                  items: [],
                },
              ],
            }
          }

          return { ...item, items: stripped }
        }) || []

      const itemsInput = toMenuItemInput(updatedItems)
      const menuUpdate: Dailp.MenuUpdate = {
        id: menu?.id!,
        name: menu?.name!,
        items: itemsInput,
      }

      await updateMenu({ menu: menuUpdate })
      // reset dropdown to "None" after action
      setSelectedLocation("")

      if (targetPath !== props.path) {
        navigate(targetPath)
      }
    }
  }

  const locationList = isInCollection
    ? collectionSections?.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))
    : menu?.items?.map((item) => (
        <option key={item.label} value={item.label}>
          {item.label}
        </option>
      ))

  // katie todo: delete this after backend method to change collection table of contents is implemented
  if (isInCollection) {
    return (
      <>
        <header>
          <h1>{page.title}</h1>
          {/* dennis todo: should be admin in the future */}
          {userRole === UserRole.Editor && (
            <div>
              <Link href={`/edit?path=${props.path}`}>Edit</Link>
            </div>
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
              {props.path !== "/" && (
                <div>
                  <label>
                    Set Page Location:
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                    >
                      {!isPublished && (
                        <option key={"None"} value="">
                          None
                        </option>
                      )}
                      {locationList}
                    </select>
                  </label>
                  <button
                    onClick={(e) => handlePublishClick(e, "publish")}
                    disabled={
                      !isLocationSelected ||
                      (isPublished && selectedLocation === currentLocation) ||
                      (isTopLevelMenuPage &&
                        selectedLocation !== currentLocation)
                    }
                  >
                    {isPublished ? "Move" : "Publish"}
                  </button>
                  {isPublished && (
                    <button
                      onClick={(e) => handlePublishClick(e, "unpublish")}
                      disabled={isTopLevelMenuPage}
                    >
                      Unpublish
                    </button>
                  )}
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
