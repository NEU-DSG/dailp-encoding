import { pick } from "lodash"
import React from "react"
import ReactDOMServer from "react-dom/server"
import { Helmet } from "react-helmet"
import prepass from "react-ssr-prepass"
import { Provider as ReakitProvider } from "reakit"
import { Provider, ssrExchange } from "urql"
import { dangerouslySkipEscape, escapeInject } from "vite-plugin-ssr"
import type { PageContextBuiltIn } from "vite-plugin-ssr/types"
import { customClient } from "src/graphql"
import { PageContext, PageShell } from "./PageShell"

// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = ["pageProps", "urqlState", "routeParams"]

const clientEnv = pick(process.env, [
  "DAILP_AWS_REGION",
  "DAILP_USER_POOL",
  "DAILP_USER_POOL_CLIENT",
  "DAILP_API_URL",
  "TF_STAGE",
  "AWS_REGION",
])

export async function render(pageContext: PageContextBuiltIn & PageContext) {
  const { pageHtml } = pageContext
  const pageHead = Helmet.renderStatic()

  return escapeInject`<!DOCTYPE html>
    <html ${pageHead.htmlAttributes.toString()}>
      <head>
<script>
  if (global === undefined) {
    var global = window;
  }
  var process = { env: ${dangerouslySkipEscape(JSON.stringify(clientEnv))} };
</script>
        ${dangerouslySkipEscape(pageHead.title.toString())}
        ${dangerouslySkipEscape(pageHead.meta.toString())}
        ${dangerouslySkipEscape(pageHead.link.toString())}
      </head>
      <body ${pageHead.bodyAttributes.toString()}>
        <div id="page-view">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`
}

export const onBeforeRender = async (
  pageContext: PageContextBuiltIn & PageContext
) => {
  const { Page, pageProps, routeParams } = pageContext

  if (process.env.NODE_ENV === "development") {
    return {
      pageContext: { pageHtml: "", urqlState: {} },
    }
  }

  const ssr = ssrExchange({ initialState: undefined, isClient: false })
  const client = customClient(true, [ssr])

  const page = () => (
    <PageShell pageContext={pageContext}>
      <Provider value={client}>
        <ReakitProvider>
          <Page {...routeParams} {...pageProps} />
        </ReakitProvider>
      </Provider>
    </PageShell>
  )

  // This is the first pass, due to suspense: true it will work with prepass and populate the initial cache
  await prepass(page())
  // After we can construct an initial html with renderToString as our cache is hydrated
  const pageHtml = ReactDOMServer.renderToString(page())

  return {
    pageContext: {
      pageHtml,
      urqlState: ssr.extractData(),
    },
  }
}
