import React, { useMemo } from "react"
import { apolloClient } from "../apollo"
import { useCredentials } from "../auth"
import { Provider as GraphQLProvider } from "urql"

export const LayoutClient = (p: { children: any }) => {
  // const creds = useCredentials()
  const token = useCredentials() ?? null; // uses credentials
  const client = useMemo(() => apolloClient(token), [token])
  return <GraphQLProvider value={client}>{p.children}</GraphQLProvider>
}

// export default (p: { children: any }) => (
  // <UserProvider>
  // <LayoutClient {...p} />
  // </UserProvider>
// )
