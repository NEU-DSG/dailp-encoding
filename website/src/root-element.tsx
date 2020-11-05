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
