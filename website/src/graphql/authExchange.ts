import { authExchange } from "@urql/exchange-auth"
import { CognitoIdToken } from "amazon-cognito-identity-js"
import { makeOperation } from "urql"
import { getCurrentUser, getIdToken } from "src/components/auth"
import {
  GRAPHQL_URL_READ,
  GRAPHQL_URL_WRITE,
  WP_GRAPHQL_URL,
} from "src/graphql"

const secondsSinceEpoch = () => Date.now() / 1000

const isExpired = (token: CognitoIdToken) =>
  token.getExpiration() <= secondsSinceEpoch()

export const cognitoAuthExchange = () =>
  authExchange<{ token: CognitoIdToken }>({
    async getAuth({ authState }) {
      if (!authState || isExpired(authState.token)) {
        const token = await getIdToken()
        if (token) return { token }
      }

      return null
    },

    willAuthError({ authState }) {
      if (getCurrentUser()) {
        // if we are signed in, we must have a valid token
        return !authState || isExpired(authState.token)
      } else if (authState) {
        // we aren't signed in but we have a token, we need to get rid of it
        return true
      } else {
        return false
      }
    },
    addAuthToOperation({ authState, operation }) {
      // We don't send tokens if we don't have them or if we are talking to Wordpress
      if (!authState || operation.context.url === WP_GRAPHQL_URL) {
        return operation
      }

      const fetchOptions =
        typeof operation.context.fetchOptions === "function"
          ? operation.context.fetchOptions()
          : operation.context.fetchOptions || {}

      // we need to send requests with JWTs to the /graphql-edit endpoint, which
      // has the appropriate authorizer to accept them
      const url =
        operation.context.url === GRAPHQL_URL_READ
          ? GRAPHQL_URL_WRITE
          : operation.context.url

      // get the authentication token to the headers
      return makeOperation(operation.kind, operation, {
        ...operation.context,
        url,
        fetchOptions: {
          ...fetchOptions,
          headers: {
            ...fetchOptions.headers,
            Authorization: `Bearer ${authState.token.getJwtToken()}`,
          },
        },
      })
    },
  })
