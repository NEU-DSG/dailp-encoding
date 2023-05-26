import React from "react"
import ReactDOM from "react-dom"
import { customClient, sharedSsr } from "src/graphql"
import { PageContext, PageShell, rootElementId } from "./PageShell"

const client = customClient(false, [sharedSsr])

export async function render(pageContext: PageContext) {
  const { urqlState } = pageContext
  sharedSsr.restoreData(urqlState)
  const page = <PageShell pageContext={pageContext} client={client} />
  const elem = document.getElementById(rootElementId)
  ReactDOM.hydrate(page, elem)
}

export const clientRouting = true
