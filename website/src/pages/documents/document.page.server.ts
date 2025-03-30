import { serverSideClients } from "src/graphql"
import * as Dailp from "src/graphql/dailp"

export async function prerender() {
  const { data, error } = await serverSideClients.dailp
    .query<
      Dailp.DocumentsPagesQuery,
      Dailp.DocumentsPagesQueryVariables
    >(Dailp.DocumentsPagesDocument, {})
    .toPromise()

  if (error) {
    throw error
  }

  return data?.allDocuments.flatMap((document) => {
    const slug = document.slug.toLowerCase()
    return [{ url: `/documents/${slug}` }]
  })
}
