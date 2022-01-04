import React from "react"
import * as Dailp from "src/graphql/dailp"
import Link from "src/link"
import { useLocation } from "src/renderer/PageShell"
import { useHasMounted } from "../cms/routes"
import Layout from "../layout"
import { EditablePageContents } from "../templates/editable-page"

/**
 Handle client-only routes for pages that haven't been statically renderered
 yet, or those only available to authenticated users.
 */
const NotFoundPage = () => {
  const content = useHasMounted() ? <ClientPage /> : <NotFound />
  return <Layout>{content}</Layout>
}
export default NotFoundPage

const ClientPage = () => {
  const location = useLocation()
  const [{ data, fetching }] = Dailp.useEditablePageQuery({
    variables: { id: location.pathname },
  })
  if (fetching) {
    return null
  } else if (data && data.page) {
    return (
      <EditablePageContents
        data={{ dailp: data }}
        pageContext={{ id: window.location.pathname }}
      />
    )
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
