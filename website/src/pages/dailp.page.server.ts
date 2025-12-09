import { GRAPHQL_URL_READ, serverSideClients } from "src/graphql"
import * as Dailp from "src/graphql/dailp"

export async function prerender() {
  // Skip prerendering if GraphQL URL is not configured
  if (!GRAPHQL_URL_READ || GRAPHQL_URL_READ === "/graphql") {
    console.warn(
      "DAILP_API_URL not set, skipping page prerendering. Set DAILP_API_URL environment variable to enable prerendering."
    )
    return []
  }

  try {
    const { data, error } = await serverSideClients.dailp
      .query<Dailp.AllPagesQuery, Dailp.AllPagesQueryVariables>(
        Dailp.AllPagesDocument,
        {}
      )
      .toPromise()

    if (error) {
      console.warn(
        "Failed to fetch pages for prerendering:",
        error.message || error
      )
      return []
    }

    return (
      data?.allPages.map((page) => ({
        url: page.path,
      })) ?? []
    )
  } catch (error) {
    // Handle network errors gracefully during build
    console.warn(
      "GraphQL server not available during build, skipping page prerendering:",
      error instanceof Error ? error.message : String(error)
    )
    return []
  }
}
