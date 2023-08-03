import fetch from "isomorphic-unfetch"
import {
  AnyVariables,
  Exchange,
  UseQueryArgs,
  cacheExchange,
  createClient,
  dedupExchange,
  fetchExchange,
  ssrExchange,
  useQuery,
} from "urql"
import { authLink } from "./graphql/client"

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

export const sharedCache = cacheExchange
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
    exchanges: [dedupExchange, sharedCache, fetchExchange],
  }),
  wordpress: createClient({
    url: WP_GRAPHQL_URL,
    exchanges: [dedupExchange, sharedCache, fetchExchange],
  }),
}

export const customClient = (
  suspense: boolean,
  exchanges: Exchange[],
  token: string | null
) =>
  createClient({
    url: GRAPHQL_URL(token),
    exchanges: [
      dedupExchange,
      sharedCache,
      ...exchanges,
      ...(token ? [authLink(token)] : []),
      fetchExchange,
    ],
    suspense,
    fetch,
  })
