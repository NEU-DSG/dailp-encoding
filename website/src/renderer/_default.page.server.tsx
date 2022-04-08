import { pick } from "lodash"
import React from "react"
import ReactDOMServer from "react-dom/server"
import { Helmet } from "react-helmet"
import prepass from "react-ssr-prepass"
import { ssrExchange } from "urql"
import { dangerouslySkipEscape, escapeInject } from "vite-plugin-ssr"
import type { PageContextBuiltIn } from "vite-plugin-ssr/types"
import { customClient } from "src/graphql"
import { PageContextServer, PageShell, rootElementId } from "./PageShell"

/**
 * In production, render every page on the server then hydrate it on the client.
 */
export function render(pageContext: PageContextServer) {
  if (process.env["NODE_ENV"] === "development") {
    // In development, don't do SSR, just let the client render.
    return escapeInject`<!DOCTYPE html>
    <html>
      <head>${baseScript}</head>
      <body><div id="${rootElementId}"/></body>
    </html>`
  } else {
    const { pageHtml, pageHead } = pageContext
    return escapeInject`<!DOCTYPE html>
    <html ${dangerouslySkipEscape(pageHead.htmlAttributes.toString())}>
      <head>
        ${baseScript}
        ${dangerouslySkipEscape(pageHead.title.toString())}
        ${dangerouslySkipEscape(pageHead.meta.toString())}
        ${dangerouslySkipEscape(pageHead.link.toString())}
      </head>
      <body ${dangerouslySkipEscape(pageHead.bodyAttributes.toString())}>
        <div id="${rootElementId}">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`
  }
}

/**
 * Gather the required data for each page before rendering it.
 */
export async function onBeforeRender(
  pageContext: PageContextBuiltIn
): Promise<{ pageContext: Partial<PageContextServer> }> {
  const buildDate = new Date()
  const baseContext = { urqlState: {}, buildDate }
  // Don't prerender in development mode, let the client do all the rendering.
  // This keeps pages loading quickly as they change.
  if (process.env["NODE_ENV"] === "development") {
    return { pageContext: baseContext }
  } else {
    const ssr = ssrExchange({ initialState: undefined, isClient: false })
    const client = customClient(true, [ssr])

    const context = {
      ...pageContext,
      buildDate,
      isHydration: false,
      urqlState: {},
    }

    const page = <PageShell pageContext={context} client={client} />

    // This is the first pass, due to suspense it will work with prepass and populate the initial cache
    await prepass(page)
    // Then we construct an initial html with renderToString as our cache is hydrated
    const pageHtml = ReactDOMServer.renderToString(page)

    // Embed the initial head data into the static HTML.
    const pageHead = Helmet.renderStatic()

    return {
      pageContext: {
        pageHtml,
        pageHead,
        buildDate,
        urqlState: ssr.extractData(),
      },
    }
  }
}

/**
 * Pass these props to the client-side after server-side rendering.
 * See https://vite-plugin-ssr.com/data-fetching
 */
export const passToClient = [
  "pageProps",
  "urqlState",
  "routeParams",
  "buildDate",
]

/**
 * Embed these environment variables into the client HTML.
 * So don't add any sensitive data.
 */
const clientEnv = pick(process.env, [
  "DAILP_AWS_REGION",
  "DAILP_USER_POOL",
  "DAILP_USER_POOL_CLIENT",
  "DAILP_API_URL",
  "TF_STAGE",
  "AWS_REGION",
])

const clientProcess = dangerouslySkipEscape(JSON.stringify({ env: clientEnv }))

// Define `global` for some scripts that depend on it, and process.env to pass
// along some important environment variables.
const baseScript = escapeInject`
  <script>
    if (global === undefined) {
      var global = window;
    }
    var process = ${clientProcess};
  </script>
`
