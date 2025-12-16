import { clientSideGraphqlClient } from "src/graphql"
import * as Dailp from "src/graphql/dailp"
import { PageContext } from "src/renderer/PageShell"

export async function data(pageContext: PageContext) {
  const { collectionSlug, chapterSlug } = pageContext.routeParams as {
    collectionSlug: string
    chapterSlug: string
  }

  if (!collectionSlug || !chapterSlug) {
    return {}
  }

  const client = clientSideGraphqlClient()

  const { data, error } = await client
    .query<Dailp.CollectionChapterQuery, Dailp.CollectionChapterQueryVariables>(
      Dailp.CollectionChapterDocument,
      {
        collectionSlug,
        chapterSlug,
      }
    )
    .toPromise()

  if (error) {
    throw error
  }

  return {
    chapter: data?.chapter,
  }
}
