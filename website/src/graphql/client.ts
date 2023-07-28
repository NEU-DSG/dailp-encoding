import { authExchange } from "@urql/exchange-auth"
import { createClient, dedupExchange, fetchExchange, makeOperation } from "urql"
import { GRAPHQL_URL, sharedCache, sharedSsr } from "../graphql"

export const graphqlClient = (token: string | null) =>
  createClient({
    url: GRAPHQL_URL(token),
    exchanges: [
      dedupExchange,
      sharedCache,
      // sharedSsr,
      ...(token ? [authLink(token)] : []),
      fetchExchange,
    ],
  })

export const authLink = (token: string) =>
  authExchange<{ token: string }>({
    async getAuth({ authState }) {
      if (!authState) {
        return { token }
      } else {
        return null
      }
    },

    addAuthToOperation({ authState, operation }) {
      if (!authState || !authState.token) {
        return operation
      }

      const fetchOptions =
        typeof operation.context.fetchOptions === "function"
          ? operation.context.fetchOptions()
          : operation.context.fetchOptions || {}

      // get the authentication token from local storage if it exists
      // return the headers to the context so httpLink can read them
      return makeOperation(operation.kind, operation, {
        ...operation.context,
        fetchOptions: {
          ...fetchOptions,
          headers: {
            ...fetchOptions.headers,
            Authorization: `Bearer ${authState.token}`,
          },
        },
      })
    },
  })
