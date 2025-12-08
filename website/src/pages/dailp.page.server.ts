import { serverSideClients } from "src/graphql"
import * as Dailp from "src/graphql/dailp"
import { PageContext } from "src/renderer/PageShell"

export async function prerender(pageContext: PageContext) {
  const { data } = await serverSideClients.dailp
    .query<Dailp.PageByPathQuery, Dailp.PageByPathQueryVariables>(
      Dailp.PageByPathDocument,
      { path: pageContext.urlPathname }
    )
    .toPromise()

  return { pageContext: { pageContent: data?.pageByPath } }
}
