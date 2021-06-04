import React from "react"
import { Link } from "gatsby"
import Layout from "../layout"
import { queryPage } from "../cms/graphql-form"
import { EditablePageContents } from "../templates/editable-page"
import { useQuery } from "@apollo/client"
import { isSSR, useHasMounted } from "../cms/routes"

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
  const { data, error, loading } = useQuery(queryPage, {
    variables: { id: window.location.pathname },
  })
  if (loading) {
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
