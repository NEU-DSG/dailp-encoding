import { authExchange } from "@urql/exchange-auth"
import { CognitoIdToken } from "amazon-cognito-identity-js"
import { jwtDecode } from "jwt-decode"
import { makeOperation } from "urql"
import { getCurrentUser, getIdToken } from "src/auth"
import { getAuthToken } from "src/auth"
import {
  GRAPHQL_URL_READ,
  GRAPHQL_URL_WRITE,
  WP_GRAPHQL_URL,
} from "src/graphql"

function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<{ exp: number }>(token)
    return decoded.exp <= Date.now() / 1000
  } catch {
    return true
  }
}

export const createAuthExchange = () => {
  const AUTH_MODE = process.env["AUTH_MODE"] || "cognito"

  return authExchange<{ token: string }>({
    async getAuth({ authState }) {
      if (!authState || isTokenExpired(authState.token)) {
        if (AUTH_MODE === "cognito") {
          const cognitoToken = await getIdToken()
          if (cognitoToken) {
            return { token: cognitoToken.getJwtToken() } // Convert to string
          }
        } else {
          const token = await getAuthToken()
          if (token) return { token }
        }
      }
      return null
    },

    willAuthError({ authState }) {
      if (getCurrentUser()) {
        // if we are signed in, we must have a valid token
        return !authState || isTokenExpired(authState.token)
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
            Authorization: `Bearer ${authState.token}`,
          },
        },
      })
    },
  })
}
