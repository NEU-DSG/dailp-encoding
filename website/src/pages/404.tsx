import React from "react"
import { Link } from "gatsby"
import Layout from "../layout"
import { queryPage } from "../cms/graphql-form"
import EditablePage from "../templates/editable-page"
import { useQuery } from "@apollo/client"
import { isSSR, useHasMounted } from "../cms/routes"

/**
 Handle client-only routes for pages that haven't been statically renderered
 yet, or those only available to authenticated users.
 */
const NotFoundPage = () => {
  const hasMounted = useHasMounted()
  if (hasMounted) {
    return <ClientPage />
  } else {
    return <NotFound />
  }
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
      <EditablePage
        data={data}
        pageContext={{ id: window.location.pathname }}
      />
    )
  } else {
    return <NotFound />
  }
}

const NotFound = () => (
  <Layout>
    <main>
      <h1>Page Not Found</h1>
      <p>
        We aren't sure what page you were looking for.{" "}
        <Link to="/">View our collection of Cherokee manuscripts</Link>
      </p>
    </main>
  </Layout>
)
