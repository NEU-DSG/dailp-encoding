import React, { useEffect, useState } from "react"
import { Auth, Hub } from "aws-amplify"
import { HubCallback } from "@aws-amplify/core"
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import fetch from "isomorphic-unfetch"
import { isSSR, ClientOnly } from "./cms/routes"
import { Button } from "./theme"
import { Link } from "gatsby"

export const SignIn = () => (
  <ClientOnly>
    <ClientSignIn />
  </ClientOnly>
)

const ClientSignIn = () => {
  const creds = useCredentials()
  if (creds) {
    return <Button onClick={() => Auth.signOut()}>Sign Out</Button>
  } else {
    return (
      <Button as={Link} to="/signin">
        Sign In
      </Button>
    )
  }
}

export const useCredentials = () => {
  const [creds, setCreds] = useState(null)

  useEffect(() => {
    Auth.currentUserPoolUser()
      .then((creds) => setCreds(creds))
      .catch((_err) => setCreds(null))

    const listener: HubCallback = async (data) => {
      switch (data.payload.event) {
        case "signIn":
        case "signUp":
          setCreds(await Auth.currentUserPoolUser())
          break
        case "signOut":
          setCreds(null)
          break
      }
    }
    Hub.listen("auth", listener)
    return () => Hub.remove("auth", listener)
  }, [])

  return creds
}

export const apolloClient = (token: string) =>
  new ApolloClient({
    ssrMode: isSSR(),
    cache: new InMemoryCache(),
    link: authLink(token).concat(httpLink(token)),
  })

const httpLink = (token: string) =>
  new HttpLink({
    uri: `https://dailp.northeastern.edu/${
      token ? "api/graphql-edit" : "graphql"
    }`,
    fetch,
  })

const authLink = (token: string) =>
  setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    }
  })
