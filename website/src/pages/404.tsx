import React from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Layout from "../layout"
import { queryPage } from "../cms/graphql-form"
import { EditablePageContents } from "../templates/editable-page"
import { useHasMounted } from "../cms/routes"
import * as Wordpress from "src/graphql/wordpress"

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
  const router = useRouter()
  const [{ data, error, fetching }] = Wordpress.usePageQuery({
    variables: { id: router.pathname },
  })
  if (fetching) {
    return null
  } else if (data) {
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
      <Link to="/">View our collection of Cherokee manuscripts</Link>
    </p>
  </main>
)
