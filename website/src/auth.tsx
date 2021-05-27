import React, { useEffect, useState } from "react"
import { Auth, Hub } from "aws-amplify"
import {
  withAuthenticator,
  AmplifySignIn,
  AmplifySignOut,
} from "@aws-amplify/ui-react"
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import fetch from "isomorphic-unfetch"

export const SignIn = withAuthenticator((props) => {
  const creds = useCredentials()
  if (creds) {
    return <AmplifySignOut />
  } else {
    return <AmplifySignIn />
  }
})

export const useCredentials = () => {
  const [creds, setCreds] = useState(null)

  useEffect(() => {
    Auth.currentUserPoolUser()
      .then((creds) => setCreds(creds))
      .catch((err) => setCreds(null))

    const listener = async (data) => {
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

export const apolloClient = (token) =>
  new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink(token).concat(httpLink(token)),
  })

const httpLink = (token) =>
  new HttpLink({
    uri: `https://dailp.northeastern.edu/${
      token ? "api/graphql-edit" : "graphql"
    }`,
    fetch,
  })

const authLink = (token) =>
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
