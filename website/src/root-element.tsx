import React from "react"
import { Provider } from "reakit"
import { css } from "linaria"
import { Helmet } from "react-helmet"
import theme from "./theme"

/** Injects global providers into the page for styling and data access. */
export const wrapRootElement = (p: { element: any }) => (
  <>
    <Helmet>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/earlyaccess/notosanscherokee.css"
      />
    </Helmet>
    <Provider>{p.element}</Provider>
  </>
)

// These styles affect all pages.
css`
  :global() {
    * {
      box-sizing: border-box;
    }
    html {
      font-size: ${theme.fontSizes.root};
    }
    body {
      margin: 0;
      font-family: ${theme.fonts.body};
      background-color: ${theme.colors.footer};
    }
    main {
      background-color: ${theme.colors.body};
    }
    h1,
    h2 {
      color: ${theme.colors.headings};
    }
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      font-family: ${theme.fonts.header};
      padding: 0 ${theme.edgeSpacing};
    }
  }
`
