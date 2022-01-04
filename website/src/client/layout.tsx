import React, { useMemo } from "react"
import { useCMS, usePlugin } from "tinacms"
import { apolloClient } from "../apollo"
import { UserProvider, useCredentials } from "../auth"
import { PageCreatorPlugin } from "../cms/graphql-form"

const LayoutClient = (p: { children: any }) => {
  const creds = useCredentials()
  const token = creds ? creds.signInUserSession.idToken.jwtToken : null
  const client = useMemo(() => apolloClient(token), [token])
  useCMS().registerApi("graphql", client)
  return <LayoutCMS creds={creds}>{p.children}</LayoutCMS>
}

export default (p: { children: any }) => (
  <UserProvider>
    <LayoutClient {...p} />
  </UserProvider>
)

const LayoutCMS = (p: { children: any; creds: any }) => {
  usePlugin(PageCreatorPlugin)
  return p.children
}
