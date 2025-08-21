import { authExchange as urqlAuthExchange } from "@urql/exchange-auth"
import { Auth } from "aws-amplify"
import { makeOperation } from "urql"

// Explicitly define these constants here to avoid import issues
export const GRAPHQL_URL_READ = `${process.env["DAILP_API_URL"] ?? ""}/graphql`
export const GRAPHQL_URL_WRITE = `${
  process.env["DAILP_API_URL"] ?? ""
}/graphql-edit`
export const WP_GRAPHQL_URL = "https://wp.dailp.northeastern.edu/graphql"

const secondsSinceEpoch = () => Math.floor(Date.now() / 1000)

const isExpired = (token: string) => {
  const parts = token.split(".")
  if (parts.length !== 3) return false

  const payload = parts[1]
  if (!payload) return false

  try {
    const decoded = JSON.parse(atob(payload))
    return secondsSinceEpoch() > (decoded.exp || 0)
  } catch {
    return false
  }
}

export const authExchange = urqlAuthExchange<{ token: string }>({
  async getAuth() {
    try {
      const session = await Auth.currentSession()
      const jwtToken = session.getIdToken().getJwtToken()
      if (typeof jwtToken === "string") {
        return { token: jwtToken }
      }
      return null
    } catch {
      return null
    }
  },
  addAuthToOperation({ authState, operation }) {
    // Don't send tokens if we don't have them or if we are talking to Wordpress
    if (
      !authState ||
      !authState.token ||
      operation.context.url === WP_GRAPHQL_URL
    ) {
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
  willAuthError({ authState }) {
    if (!authState || !authState.token) {
      return true
    }

    // Try to refresh the session when checking for auth errors
    // This doesn't block, but helps keep the token fresh
    Auth.currentSession().catch((e) => {
      console.error("Failed to refresh authentication", e)
    })

    return false
  },
})
