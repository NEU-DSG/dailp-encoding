import { flatMap } from "lodash"
import { client } from "src/graphql"
import * as Dailp from "src/graphql/dailp"

export async function prerender() {
  const { data } = await client.dailp
    .query<Dailp.DocumentsPagesQuery, Dailp.DocumentsPagesQueryVariables>(
      Dailp.DocumentsPagesDocument
    )
    .toPromise()

  return flatMap(data.allDocuments, (document) => {
    const id = document.id.toLowerCase()
    return [{ url: `/documents/${id}` }, { url: `/documents/${id}/details` }]
  })
}
