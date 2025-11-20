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
    return { url: `/collections/${collection.slug}`, pageContext: {} }
  })
}
