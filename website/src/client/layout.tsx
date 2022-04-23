import React, { useMemo } from "react"
import { apolloClient } from "../apollo"
import { UserProvider, useCredentials } from "../auth"

const LayoutClient = (p: { children: any }) => {
  const creds = useCredentials()
  const token = creds?.signInUserSession.idToken.jwtToken ?? null
  const client = useMemo(() => apolloClient(token), [token])
  return p.children
}

export default (p: { children: any }) => (
  <UserProvider>
    <LayoutClient {...p} />
  </UserProvider>
)
