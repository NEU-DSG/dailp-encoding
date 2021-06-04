import React from "react"
import { Provider } from "reakit"
import { Helmet } from "react-helmet"
import { TinaCMS, TinaProvider } from "tinacms"
import { isSSR } from "./cms/routes"

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
  const cms = React.useMemo(
    () => new TinaCMS({ enabled: !isSSR(), sidebar: true, plugins: [] }),
    []
  )
  return <TinaProvider cms={cms}>{p.children}</TinaProvider>
}
