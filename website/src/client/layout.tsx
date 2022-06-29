import React, { useMemo } from "react"
import { Provider as GraphQLProvider } from "urql"
import { useCredentials } from "../auth"
import { urqlClient } from "../urql"

export const LayoutClient = (p: { children: any }) => {
  const token = useCredentials() // uses credentials
  const client = useMemo(() => urqlClient(token), [token])
  return <GraphQLProvider value={client}>{p.children}</GraphQLProvider>
}
