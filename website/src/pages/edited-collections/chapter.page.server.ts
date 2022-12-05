import { flatMap } from "lodash"
import { client } from "src/graphql"
import * as Dailp from "src/graphql/dailp"

export async function prerender() {
  const { data, error } = await client.dailp
    .query<Dailp.EditedCollectionQuery, Dailp.EditedCollectionQueryVariables>(
      Dailp.EditedCollectionDocument
    )
    .toPromise()

  if (error) {
    throw error
  }

  return flatMap(data?.editedCollection?.chapters, (chapter) => {
    const collectionSlug = data?.editedCollection
    const slug = chapter.title

    return [{ url: `/${collectionSlug}/chapters/${slug}` }]
  })
}
