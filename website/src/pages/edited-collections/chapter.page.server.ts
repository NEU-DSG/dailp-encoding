import { serverSideClients } from "src/graphql"
import * as Dailp from "src/graphql/dailp"

export async function prerender() {
  const { data, error } = await serverSideClients.dailp
    .query<Dailp.EditedCollectionsQuery, Dailp.EditedCollectionsQueryVariables>(
      Dailp.EditedCollectionsDocument,
      {}
    )
    .toPromise()

  if (!data || error) {
    throw error
  }

  return data.allEditedCollections.flatMap((collection) => {
    const collectionSlug = collection.slug
    if (!collection.chapters) {
      return []
    }
    return collection.chapters
      ?.filter((c) => c.path.length > 0)
      .map((c) => {
        const slug = c.path[c.path.length - 1]!
        return {
          url: `/collections/${collectionSlug}/${slug}`,
          pageContext: {},
        }
      })
  })
}
