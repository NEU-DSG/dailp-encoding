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
  schema: {
    __schema: {
      queryType: { name: "Query" },
      mutationType: { name: "Mutation" },
      subscriptionType: null,
    },
  },
  resolvers: {
    Query: {
      document: (_, args, cache) => {
        return cache.keyOfEntity({
          __typename: "AnnotatedDoc",
          slug: args["slug"]!,
        })
      },
    },
  },
  // This defines how data should be keyed
  // Using "null" as a key means the data should be cached on its parent
  keys: {
    Contributor: () => null,
    Date: () => null,
    MorphemeTag: () => null,
    PageImage: () => null,
    PositionInDocument: () => null,
    WordSegment: () => null,
    DocumentPage: () => null,
    AnnotatedDoc: (data) => data["slug"] as string,
    AudioSlice: (data) => data["sliceId"] as string,
    DocumentCollection: (data) => data["slug"] as string,
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
