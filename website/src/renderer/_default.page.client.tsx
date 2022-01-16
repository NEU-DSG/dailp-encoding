import React from "react"
import ReactDOM from "react-dom"
import { ssrExchange } from "urql"
import { useClientRouter } from "vite-plugin-ssr/client/router"
import { customClient } from "src/graphql"
import { PageContext, PageShell, rootElementId } from "./PageShell"

const ssr = ssrExchange({ isClient: true, initialState: {} })
const client = customClient(false, [ssr])

const { hydrationPromise } = useClientRouter({
  async render(pageContext: PageContext) {
    const { urqlState, isHydration } = pageContext
    ssr.restoreData(urqlState)
    const page = <PageShell pageContext={pageContext} client={client} />
    const elem = document.getElementById(rootElementId)
    // `pageContext.isHydration` is set by `vite-plugin-ssr` and is `true` when the page
    // is already rendered to HTML.
    if (isHydration && process.env["NODE_ENV"] === "production") {
      // When we render the first page. (Since we do SSR, the first page is already
      // rendered to HTML and we merely have to hydrate it.)
      ReactDOM.hydrate(page, elem)
    } else {
      // When the user navigates to a new page.
      ReactDOM.render(page, elem)
    }
  },
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
