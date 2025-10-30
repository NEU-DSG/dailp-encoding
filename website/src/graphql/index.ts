import {
  Client,
  Exchange,
  SSRExchange,
  createClient,
  fetchExchange,
  ssrExchange,
} from "@urql/core"
import { devtoolsExchange } from "@urql/devtools"
import { cacheExchange } from "@urql/exchange-graphcache"
import fetch from "isomorphic-unfetch"
import { Environment, deploymentEnvironment } from "../env"
import { createAuthExchange } from "./authExchange"

export const GRAPHQL_URL_READ = process.env["DAILP_API_URL"] + "/graphql"
export const GRAPHQL_URL_WRITE = process.env["DAILP_API_URL"] + "/graphql-edit"
export const WP_GRAPHQL_URL = "https://wp.dailp.northeastern.edu/graphql"

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

/**
 * This is the client SSR exchange.
 * Shared between WP and DAILP gql endpoints.
 */
export const clientSsrExchange = ssrExchange({
  isClient: true,
  initialState: {},
  // this lets us rehydrate our pages quickly but still get the most updated
  // data in a timely manner
  staleWhileRevalidate: true,
})

/**
 * These are clients used to make requests in `prerender` functions. They do not
 * have any auth or SSR exchanges.
 */
export const serverSideClients = {
  dailp: createClient({
    url: GRAPHQL_URL_READ,
    exchanges: [sharedCache, fetchExchange],
  }),
  wordpress: createClient({
    url: WP_GRAPHQL_URL,
    exchanges: [sharedCache, fetchExchange],
  }),
}

const maybeDevExchange =
  deploymentEnvironment === Environment.Production ? [] : [devtoolsExchange]

/**
 * A custom client that will point at the DAILP GraphQL server.
 * Has the following exchanges by default:
 * - devtoolsExchange (not added in production)
 * - sharedCache
 * - Any caller-specified exchanges (see `exchanges` param)
 * - cognitoAuthExchange (client-side only)
 * - fetchExchange
 * @param serverSide - if this client is for server-side use. Otherwise client-side is assumed.
 * @param exchanges - extra exchanges the caller needs (ie. a specific client/server SSR exchange)
 * @returns
 */
const customClient = (serverSide: boolean, exchanges: Exchange[]) =>
  createClient({
    url: GRAPHQL_URL_READ, // the auth link will move this to the write endpoint if needed
    exchanges: [
      ...maybeDevExchange,
      sharedCache,
      ...exchanges,
      // only the client needs the auth link
      ...(serverSide ? [] : [createAuthExchange()]),
      fetchExchange,
    ],
    suspense: serverSide,
    fetch, // TODO: is this needed?
  })

/**
 * Create a fresh SSR exchange and client to serve a single SSR request.
 * */
export function ssrClientAndExchange(): [SSRExchange, Client] {
  // We want to make a new SSR exchange every time so that only queries on the individual request and captured and sent to the client.
  const ssr = ssrExchange({ initialState: undefined, isClient: false })
  // We turn suspense on for the server-side SSR client so it can await rendering the whole tree, along with queries.
  const client = customClient(true, [ssr])
  return [ssr, client]
}

export const clientSideGraphqlClient = () =>
  customClient(false, [clientSsrExchange])
