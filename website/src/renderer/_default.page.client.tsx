import React from "react"
import ReactDOM from "react-dom"
import { Client } from "urql"
import { getCredentials } from "src/auth"
import { customClient, sharedSsr } from "src/graphql"
import { PageContext, PageShell, rootElementId } from "./PageShell"

async function getClient() {
  const token = await getCredentials()
  console.log("[charlie]", { token })
  return customClient(false, [sharedSsr], token)
}
let clientPromise: null | Promise<Client> = null

export async function render(pageContext: PageContext) {
  const { urqlState } = pageContext
  sharedSsr.restoreData(urqlState)
  const client = clientPromise
    ? await clientPromise
    : await (clientPromise = getClient())
  const page = <PageShell pageContext={pageContext} client={client} />
  const elem = document.getElementById(rootElementId)
  ReactDOM.hydrate(page, elem)
}

export const clientRouting = true
