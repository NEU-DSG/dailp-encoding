import React from "react"
import ReactDOM from "react-dom"
import { clientSideGraphqlClient, clientSsrExchange } from "src/graphql"
import { PageContext, PageShell, rootElementId } from "./PageShell"

export async function render(pageContext: PageContext) {
  const { urqlState } = pageContext
  clientSsrExchange.restoreData(urqlState)
  const client = clientSideGraphqlClient()
  const page = <PageShell pageContext={pageContext} client={client} />
  const elem = document.getElementById(rootElementId)
  ReactDOM.hydrate(page, elem)
}

export const clientRouting = true
