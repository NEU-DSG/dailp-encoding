import React from "react"
import { Provider } from "reakit"
import { css } from "linaria"
import { Helmet } from "react-helmet"

/** Injects global providers into the page for styling and data access. */
export const wrapRootElement = ({ element }) => (
  <>
    <Helmet>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/earlyaccess/notosanscherokee.css"
      />
    </Helmet>
    <Provider>{element}</Provider>
  </>
)

// These styles affect all pages.
css`
  :global() {
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      font-family: "Gentium Plus", "Gentium Basic", "Noto Sans Cherokee",
        "Arial", "serif";
    }
  }
`
