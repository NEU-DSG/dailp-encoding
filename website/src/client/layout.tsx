import React from "react"
import { ApolloProvider } from "@apollo/client"
import { useCMS, usePlugin } from "tinacms"
import { useCredentials, UserProvider } from "../auth"
import { apolloClient } from "../apollo"
import { PageCreatorPlugin } from "../cms/graphql-form"

const LayoutClient = (p: { children: any }) => {
  const creds = useCredentials()
  const token = creds ? creds.signInUserSession.idToken.jwtToken : null
  const client = apolloClient(token)
  useCMS().registerApi("graphql", client)
  return (
    <ApolloProvider client={client}>
      <LayoutCMS creds={creds}>{p.children}</LayoutCMS>
    </ApolloProvider>
  )
}

export default (p: { children: any }) => (
  <UserProvider>
    <LayoutClient {...p} />
  </UserProvider>
)

const LayoutCMS = (p: { children: any; creds: any }) => {
  usePlugin(PageCreatorPlugin)
  return <>{p.children}</>
}
