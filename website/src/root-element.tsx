import React from "react"
import { Provider } from "reakit"
import { css } from "linaria"
import { Helmet } from "react-helmet"
import "typeface-gentium-basic"
import "typeface-open-sans"

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
    body {
      margin: 0;
      font-family: "Gentium Plus", "Gentium Basic", "Noto Sans Cherokee",
        "Arial", "serif";
      font-size: 18px;
      background-color: rgb(63, 82, 113);
    }
    main {
      background-color: white;
    }
    h1,
    h2 {
      color: #bb675d;
    }
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      font-family: "Open Sans";
    }
  }
`
