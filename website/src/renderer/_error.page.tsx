import React from "react"
import { useHasMounted } from "src/cms/routes"
import Link from "src/components/link"
import * as Dailp from "src/graphql/dailp"
import Layout from "src/layout"
import { DailpPageContents } from "src/pages/dailp.page"
import { useLocation } from "src/renderer/PageShell"

/* import { EditablePageContents } from "../templates/editable-page" */

/**
 Handle client-only routes for pages that haven't been statically renderered
 yet, or those only available to authenticated users.
 */
export const Page = () => {
  const content = useHasMounted() ? <ClientPage /> : <NotFound />
  return <Layout>{content}</Layout>
}

const ClientPage = () => {
  const location = useLocation()
  const [{ data, fetching }] = Dailp.usePageByPathQuery({
    variables: { path: location.pathname },
    requestPolicy: "network-only",
  })

  if (fetching) {
    return null
  } else if (data && data.pageByPath) {
    return <DailpPageContents path={location.pathname} />
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
