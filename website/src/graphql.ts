import {
  AnyVariables,
  Exchange,
  createClient,
  fetchExchange,
  ssrExchange,
} from "@urql/core"
import { devtoolsExchange } from "@urql/devtools"
import { cacheExchange } from "@urql/exchange-graphcache"
import fetch from "isomorphic-unfetch"
import { UseQueryArgs, useQuery } from "urql"
import { Environment, deploymentEnvironment } from "./env"
import { authLink } from "./graphql/client"
import { DocumentPage } from "./graphql/dailp"

export const GRAPHQL_URL = (token: string | null) =>
  process.env["DAILP_API_URL"] + (token ? "/graphql-edit" : "/graphql")
const WP_GRAPHQL_URL = "https://wp.dailp.northeastern.edu/graphql"

export { useQuery }

const context = { url: WP_GRAPHQL_URL }

export function useWpQuery<Data, Variables extends AnyVariables>(
  params: UseQueryArgs<Variables, Data>
) {
  return useQuery({
    context,
    ...params,
  })
}

export const sharedCache = cacheExchange({
  keys: {
    WordSegment: () => null,
    MorphemeTag: () => null,
    Contibutor: () => null,
    // DocumentPage: (data) => data["pageNumber"]?.toString() ?? null,
  },
})
export const sharedSsr = ssrExchange({
  isClient: true,
  initialState: {},
  // this lets us rehydrate our pages quickly but still get the most updated
  // date in a timely manner
  staleWhileRevalidate: true,
})

export const serverSideClients = {
  dailp: createClient({
    url: GRAPHQL_URL(null),
    exchanges: [sharedCache, fetchExchange],
  }),
  wordpress: createClient({
    url: WP_GRAPHQL_URL,
    exchanges: [sharedCache, fetchExchange],
  }),
}

const maybeDevExchange =
  deploymentEnvironment === Environment.Production ? [] : [devtoolsExchange]

console.log("[charlie]", { maybeDevExchange })
export const customClient = (
  suspense: boolean,
  exchanges: Exchange[],
  token: string | null
) =>
  createClient({
    url: GRAPHQL_URL(token),
    exchanges: [
      ...maybeDevExchange,
      sharedCache,
      ...exchanges,
      ...(token ? [authLink(token)] : []),
      fetchExchange,
    ],
    suspense,
    fetch,
  })
