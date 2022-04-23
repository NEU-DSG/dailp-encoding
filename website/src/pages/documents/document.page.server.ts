import { flatMap } from "lodash"
import { client } from "src/graphql"
import * as Dailp from "src/graphql/dailp"

export async function prerender() {
  const { data, error } = await client.dailp
    .query<Dailp.DocumentsPagesQuery, Dailp.DocumentsPagesQueryVariables>(
      Dailp.DocumentsPagesDocument
    )
    .toPromise()

  if (error) {
    throw error
  }

  return flatMap(data?.allDocuments, (document) => {
    const slug = document.slug.toLowerCase()
    return [
      { url: `/documents/${slug}` },
      { url: `/documents/${slug}/details` },
    ]
  })
}
