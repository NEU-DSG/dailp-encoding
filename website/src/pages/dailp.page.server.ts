import { serverSideClients } from "src/graphql"
import * as Dailp from "src/graphql/dailp"

export async function prerender() {
  const { data, error } = await serverSideClients.dailp
    .query<Dailp.AllPagesQuery, Dailp.AllPagesQueryVariables>(
      Dailp.AllPagesDocument,
      {}
    )
    .toPromise()

  if (error) {
    throw error
  }

  return (
    data?.allPages.map((page) => ({
      url: page.id,
    })) ?? []
  )
}
