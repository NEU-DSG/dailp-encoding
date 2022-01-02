import React from "react"
import ReactDOM from "react-dom"
import { Provider as ReakitProvider } from "reakit"
import { Provider, ssrExchange } from "urql"
import { useClientRouter } from "vite-plugin-ssr/client/router"
import { customClient } from "src/graphql"
import { PageContext, PageShell } from "./PageShell"

const ssr = ssrExchange({ isClient: true, initialState: {} })
const client = customClient(false, [ssr])

const { hydrationPromise } = useClientRouter({
  async render(pageContext: PageContext) {
    const { Page, pageProps, urqlState, isHydration, routeParams } = pageContext
    ssr.restoreData(urqlState)
    const page = (
      <PageShell pageContext={pageContext}>
        <Provider value={client}>
          <ReakitProvider>
            <Page {...routeParams} {...pageProps} />
          </ReakitProvider>
        </Provider>
      </PageShell>
    )
    const elem = document.getElementById("page-view")
    // `pageContext.isHydration` is set by `vite-plugin-ssr` and is `true` when the page
    // is already rendered to HTML.
    if (isHydration && process.env.NODE_ENV === "production") {
      // When we render the first page. (Since we do SSR, the first page is already
      // rendered to HTML and we merely have to hydrate it.)
      ReactDOM.hydrate(page, elem)
    } else {
      // When the user navigates to a new page.
      ReactDOM.render(page, elem)
    }
  },

  // If `ensureHydration: true` then `vite-plugin-ssr` ensures that the first render is always
  // a hydration. I.e. the first `render()` call is never interrupted — even if the user clicks
  // on a link. Default value: `false`.
  // If we use Vue, we set `ensureHydration: true` to avoid "Hydration Mismatch" errors.
  // If we use React, we leave `ensureHydration: false` for a slight performance boost.
  /* ensureHydration: true, */

  // Prefetch `<a>` links when they appear in the user's viewport.
  // We can override individual links: `<a data-prefetch="true" href="/some-link" />`.
  // Default value: `false`.
  /* prefetchLinks: true, */

  // To create custom page transition animations
  /* onTransitionStart,
   * onTransitionEnd, */
})

hydrationPromise.then(() => {
  console.log("Hydration finished; page is now interactive.")
})
