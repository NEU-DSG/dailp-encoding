import React from "react"
import { Provider } from "reakit"
import { css } from "linaria"
import { Helmet } from "react-helmet"
import theme from "./theme"

/** Injects global providers into the page for styling and data access. */
export const wrapRootElement = (p: { element: any }) => (
  <>
    <Helmet>
      <html lang="en" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
      display: flex;
      flex-flow: column nowrap;
      align-items: center;
      font-size: 1rem;
      padding-bottom: 1.5rem;
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
      main > & {
        padding-left: ${theme.edgeSpacing};
        padding-right: ${theme.edgeSpacing};
      }
    }

    button {
      cursor: pointer;
    }
  }
`
