import { flatMap } from "lodash"
import * as Dailp from "src/graphql/dailp"

export async function prerender() {
  //   const { data, error } = await client.dailp
  //     .query<Dailp.editedCollectionQuery, Dailp.EditedCollectionQueryVariables>()
  //     .toPromise()

  const [{ data, error }] = Dailp.useEditedCollectionQuery({
    variables: { slug: "cwkw" },
  })

  if (error) {
    throw error
  }

  return flatMap(data?.editedCollection?.chapters, (chapter) => {
    const slug = chapter.title.toLowerCase()
    return [{ url: `cwkw/chapters/${slug}` }]
  })
}
