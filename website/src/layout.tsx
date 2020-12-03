import React from "react"
import { css } from "linaria"
import { Link } from "gatsby"
import Footer from "./footer"
import theme, { fullWidth } from "./theme"
import { NavMenu, MobileNav } from "./menu"
import { Helmet } from "react-helmet"
import Sticky from "react-stickynode"
import { isMobile } from "react-device-detect"
import Typography from "typography"

import "fontsource-noto-serif"
import "fontsource-quattrocento-sans"
import "./fonts.css"

/** Wrapper for most site pages, providing them with a navigation header and footer. */
const Layout = (p: { title?: string; children: any }) => (
  <>
    <Helmet title={p.title ? `${p.title} - DAILP` : "DAILP"} />
    <Sticky enabled={isMobile} innerZ={2}>
      <header aria-label="Site Header" id="header" className={header}>
        <nav className={headerContents}>
          <MobileNav />
          <h1 className={siteTitle}>
            <Link to="/">DAILP</Link>
          </h1>
          <span className={subHeader}>
            Digital Archive of American Indian Languages Preservation and
            Perseverance
          </span>
          <NavMenu />
        </nav>
      </header>
    </Sticky>
    {p.children}
    <Footer />
  </>
)

export default Layout

const header = css`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  background-color: ${theme.colors.header};
  padding: 0 ${theme.edgeSpacing};
  font-family: ${theme.fonts.header};
`

const headerContents = css`
  ${fullWidth}
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  ${theme.mediaQueries.medium} {
    align-items: baseline;
  }
`

const subHeader = css`
  color: ${theme.colors.headings};
  padding-left: 1rem;
  display: none;
  ${theme.mediaQueries.medium} {
    display: initial;
  }
`

const siteTitle = css`
  margin: ${theme.rhythm / 4}rem 0;
  ${theme.mediaQueries.medium} {
    margin: ${theme.rhythm}rem 0;
  }
  & > a {
    color: ${theme.colors.headings};
    text-decoration: none;
  }
`

const typography = new Typography({
  baseFontSize: theme.fontSizes.root,
  baseLineHeight: theme.rhythm,
  headerFontFamily: theme.fonts.headerArr,
  bodyFontFamily: theme.fonts.bodyArr,
  bodyGray: 5,
  headerGray: 10,
  // blockMarginBottom: 0.5,
})

// These styles affect all pages.
css`
  :global() {
    ${typography.toString()}

    * {
      box-sizing: border-box;
    }

    html {
      font-size: ${theme.fontSizes.root} !important;
    }

    body {
      margin: 0;
      font-family: ${theme.fonts.body};
      background-color: ${theme.colors.footer} !important;
    }

    a {
      color: ${theme.colors.footer};
      text-decoration-thickness: 0.09em;
      border-radius: 0;

      &:hover,
      &:active,
      &:focus {
        color: ${theme.colors.altFooter};
      }
    }

    *:focus {
      outline-color: ${theme.colors.link};
      outline-style: solid;
      outline-width: thin;
      outline-offset: 0;
    }

    main {
      background-color: ${theme.colors.body};
      display: flex;
      flex-flow: column wrap;
      align-items: center;
      font-size: 1rem;
      padding: ${theme.rhythm}rem 0;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    header {
      color: ${theme.colors.headings};
      font-family: ${theme.fonts.header};
    }

    button,
    input[type="radio"] {
      cursor: pointer;
      font-family: inherit;
      font-size: inherit;
    }

    figure {
      margin-inline-start: 0;
      max-width: 100%;
      ${theme.mediaQueries.medium} {
        margin-inline-start: 2rem;
      }
    }

    dd {
      margin-left: ${theme.rhythm}rem;
    }
  }
`
