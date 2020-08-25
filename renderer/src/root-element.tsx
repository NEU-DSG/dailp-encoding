import React from "react"
import fetch from "isomorphic-fetch"
import { Provider } from "reakit"
import { ApolloClient, ApolloProvider } from "@apollo/client"
import Layout from "./layout"
import { Global } from "@emotion/core"
import { Helmet } from "react-helmet"

const globalStyles = (
  <Global
    styles={{
      "*": {
        boxSizing: "border-box",
      },
      body: {
        margin: 0,
      },
    }}
  />
)

export const wrapRootElement = ({ element }) => (
  <>
    {globalStyles}
    <Helmet>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/earlyaccess/notosanscherokee.css"
      />
    </Helmet>
    <Provider>{element}</Provider>
  </>
)
