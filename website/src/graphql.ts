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

const GRAPHQL_URL = `${process.env["DAILP_API_URL"]}/graphql`
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
export const sharedSsr = ssrExchange({ isClient: true, initialState: {} })

export const client = {
  dailp: createClient({
    url: GRAPHQL_URL,
    exchanges: [dedupExchange, sharedCache, fetchExchange],
  }),
  wordpress: createClient({
    url: WP_GRAPHQL_URL,
    exchanges: [dedupExchange, sharedCache, fetchExchange],
  }),
}

export const customClient = (suspense: boolean, exchanges: Exchange[]) =>
  createClient({
    url: GRAPHQL_URL,
    exchanges: [dedupExchange, sharedCache, ...exchanges, fetchExchange],
    suspense,
    fetch,
  })

// export const withGraphQL = (component) =>
//   withUrqlClientBase(
//     (ssrExchange, ctx) => ({
//       url: GRAPHQL_URL,
//       exchanges: [dedupExchange, sharedCache, ssrExchange, fetchExchange],
//     }),
//     { ssr: false }
//   )(component)

// export async function getStaticQueries(
//   dailpQuery?: (client: Client) => any[],
//   wpQuery?: (client: Client) => any[]
// ) {
//   const ssrCache = ssrExchange({ isClient: false })
//   if (dailpQuery) {
//     const dailp = initUrqlClient(
//       {
//         url: GRAPHQL_URL,
//         exchanges: [dedupExchange, sharedCache, ssrCache, fetchExchange],
//       },
//       false
//     )
//     const qs = dailpQuery(dailp)
//     for (const q of qs) {
//       await q.toPromise()
//     }
//   }

//   if (wpQuery) {
//     const wp = initUrqlClient(
//       {
//         url: WP_GRAPHQL_URL,
//         exchanges: [dedupExchange, sharedCache, ssrCache, fetchExchange],
//       },
//       false
//     )
//     const qs = wpQuery(wp)
//     for (const q of qs) {
//       await q.toPromise()
//     }
//   }

//   return {
//     props: {
//       urqlState: ssrCache.extractData(),
//     },
//   }
// }

// export function getStaticQueriesNew(
//   makeQueries: (params: any, dailp: Client, wordpress: Client) => Promise<any>
// ) {
//   return async ({ params }) => {
//     if (process.env.NODE_ENV === "development") {
//       return { props: params || {} }
//     }

//     const ssrCache = ssrExchange({ isClient: false })
//     const dailp = initUrqlClient(
//       {
//         url: GRAPHQL_URL,
//         exchanges: [dedupExchange, sharedCache, ssrCache, fetchExchange],
//       },
//       false
//     )

//     const wp = initUrqlClient(
//       {
//         url: WP_GRAPHQL_URL,
//         exchanges: [dedupExchange, sharedCache, ssrCache, fetchExchange],
//       },
//       false
//     )

//     const pageProps = (await makeQueries(params, dailp, wp)) || {}

//     return {
//       props: {
//         urqlState: ssrCache.extractData(),
//         ...pageProps,
//       },
//     }
//   }
// }
