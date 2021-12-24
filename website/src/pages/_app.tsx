import React from "react"
import { Helmet } from "react-helmet"
import { TinaCMS, TinaProvider } from "tinacms"
import { Provider as ReakitProvider } from "reakit"

import "../fonts.css"
import "../wordpress.css"
import "@fontsource/charis-sil/400.css"
import "@fontsource/charis-sil/400-italic.css"
import "@fontsource/charis-sil/700.css"
import "@fontsource/charis-sil/700-italic.css"
import "@fontsource/quattrocento-sans/latin.css"
import "@fortawesome/fontawesome-free/css/fontawesome.css"
import "@fortawesome/fontawesome-free/css/solid.css"
import { withGraphQL } from "src/graphql"

// This default export is required in a new `pages/_app.js` file.
/** Injects global providers into the page for styling and data access. */
function App({ Component, pageProps }) {
  return (
    <ReakitProvider>
      <InnerRoot>
        <Component {...pageProps} />
      </InnerRoot>
    </ReakitProvider>
  )
}

export default withGraphQL(App)

const InnerRoot = (p: { children: any }) => {
  return <TinaProvider cms={cms}>{p.children}</TinaProvider>
}

const cms = new TinaCMS({ enabled: false, sidebar: true, plugins: [] })
