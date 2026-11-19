import React from "react"
import { useHasMounted } from "src/cms/routes"
import Link from "src/components/link"
import * as Dailp from "src/graphql/dailp"
import Layout from "src/layout"
import { DailpPageContents } from "src/pages/dailp.page"
import { Page as ChapterPage } from "src/pages/edited-collections/chapter.page"
import { CollectionProvider } from "src/pages/edited-collections/edited-collection-context"
import {
  PageContextProvider,
  useLocation,
  usePageContext,
} from "src/renderer/PageShell"

/* import { EditablePageContents } from "../templates/editable-page" */

// Same shape as the chapter route, /collections/@collectionSlug/@chapterSlug
const CHAPTER_PATH = /^\/collections\/([^/]+)\/([^/]+)\/?$/

/**
 Handle client-only routes for pages that haven't been statically renderered
 yet, or those only available to authenticated users.
 */
export const Page = () => {
  const hasMounted = useHasMounted()
  if (!hasMounted) return <Layout>{<NotFound />}</Layout>

  // Chapters created after the last deploy have no prerendered page, so the
  // host serves this one instead. Render the chapter here in the browser.
  const chapterMatch = window.location.pathname.match(CHAPTER_PATH)
  if (chapterMatch) {
    return (
      <ClientChapterPage
        collectionSlug={decodeURIComponent(chapterMatch[1]!)}
        chapterSlug={decodeURIComponent(chapterMatch[2]!)}
      />
    )
  }

  return <Layout>{<ClientPage />}</Layout>
}

// The collection layout, sidebar, and collection context read the slugs from
// the route params, which are empty on this page, so provide them here. The
// shell's CollectionProvider already ran with no slug, so wrap a fresh one.
const ClientChapterPage = (props: {
  collectionSlug: string
  chapterSlug: string
}) => {
  const pageContext = usePageContext()
  return (
    <PageContextProvider
      pageContext={{
        ...pageContext,
        routeParams: {
          collectionSlug: props.collectionSlug,
          chapterSlug: props.chapterSlug,
        },
      }}
    >
      <CollectionProvider>
        <ChapterPage
          collectionSlug={props.collectionSlug}
          chapterSlug={props.chapterSlug}
        />
      </CollectionProvider>
    </PageContextProvider>
  )
}

const ClientPage = () => {
  const location = useLocation()
  const path = location.pathname.endsWith("/")
    ? location.pathname.slice(0, -1)
    : location.pathname

  const [{ data, fetching }] = Dailp.usePageByPathQuery({
    variables: {
      path: path,
    },
    requestPolicy: "network-only",
  })

  if (fetching) {
    return null
  } else if (data && data.pageByPath) {
    return <DailpPageContents path={path} />
  } else {
    return <NotFound />
  }
}

const NotFound = () => (
  <main>
    <h1>Page Not Found</h1>
    <p>
      We aren't sure what page you were looking for.{" "}
      <Link href="/">View our collection of Cherokee manuscripts</Link>
    </p>
  </main>
)
