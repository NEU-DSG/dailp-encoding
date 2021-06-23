import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import fetch from "isomorphic-unfetch"
import { isSSR } from "./cms/routes"

export const apolloClient = (token: string) =>
  new ApolloClient({
    ssrMode: isSSR(),
    cache: new InMemoryCache(),
    link: authLink(token).concat(httpLink(token)),
  })

const httpLink = (token: string) =>
  new HttpLink({
    uri: process.env.DAILP_API_URL + (token ? "/graphql-edit" : "/graphql"),
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
