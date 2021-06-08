import React from "react"
import { Provider } from "reakit"
import { Helmet } from "react-helmet"
import { TinaCMS, TinaProvider } from "tinacms"

/** Injects global providers into the page for styling and data access. */
export const wrapRootElement = (p: { element: any }) => (
  <>
    <Helmet>
      <html lang="en" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Helmet>
    <Provider>
      <InnerRoot>{p.element}</InnerRoot>
    </Provider>
  </>
)

const InnerRoot = (p: { children: any }) => {
  return <TinaProvider cms={cms}>{p.children}</TinaProvider>
}

const cms = new TinaCMS({ enabled: false, sidebar: true, plugins: [] })
