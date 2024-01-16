import React, { useMemo } from "react"
import { Provider as GraphQLProvider } from "urql"
import { clientSideGraphqlClient } from "src/graphql"
import { useCredentials } from "../auth"

export const LayoutClient = (p: { children: any }) => {
  const token = useCredentials() // uses credentials
  const client = useMemo(() => clientSideGraphqlClient(token), [token])
  if (token) {
    return <GraphQLProvider value={client}>{p.children}</GraphQLProvider>
  } else {
    return p.children
  }
}
