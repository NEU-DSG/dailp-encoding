import { client } from "src/graphql"
import * as Dailp from "src/graphql/dailp"

export async function prerender() {
  const { data } = await client.dailp
    .query<
      Dailp.CollectionsListingQuery,
      Dailp.CollectionsListingQueryVariables
    >(Dailp.CollectionsListingDocument)
    .toPromise()

  return data.allCollections.map((collection) => ({
    url: `/collections/${collection.slug}`,
  }))
}
