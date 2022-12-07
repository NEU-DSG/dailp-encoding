import { flatMap } from "lodash"
import { client } from "src/graphql"
import * as Dailp from "src/graphql/dailp"

export async function prerender() {
  const { data, error } = await client.dailp
    .query<Dailp.EditedCollectionsQuery, Dailp.EditedCollectionsQueryVariables>(
      Dailp.EditedCollectionsDocument
    )
    .toPromise()

  if (!data || error) {
    throw error
  }

  return flatMap(data.allEditedCollections, (collection) => {
    const collectionSlug = collection.slug

    return collection.chapters?.map((c) => {
      return {
        url: `/collections/${collectionSlug}/${
          c.path.length > 0 ? c.path[c.path.length - 1] : ""
        }`,
      }
    })
  })
}
