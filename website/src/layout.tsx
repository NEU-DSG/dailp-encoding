import React from "react"
import { css, cx } from "linaria"
import { Link } from "gatsby"
import Footer from "./footer"
import theme, { fullWidth, hideOnPrint, typography } from "./theme"
import { NavMenu, MobileNav } from "./menu"
import { Helmet } from "react-helmet"
import Sticky from "react-stickynode"
import { isMobile } from "react-device-detect"

import "@fontsource/spectral"
import "@fontsource/spectral-sc"
import "@fontsource/quattrocento-sans"
import "./fonts.css"

/** Wrapper for most site pages, providing them with a navigation header and footer. */
const Layout = (p: { title?: string; children: any }) => (
  <>
    <Helmet title={p.title ? `${p.title} - DAILP` : "DAILP"} />
    <Sticky enabled={isMobile} innerZ={2} className={hideOnPrint}>
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
  font-family: ${theme.fonts.headerArr.join(",")};
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
  running-head: title;
  margin: ${typography.rhythm(1 / 4)} 0;
  ${theme.mediaQueries.medium} {
    margin: ${typography.rhythm(1)} 0;
  }
  & > a {
    color: ${theme.colors.headings};
    text-decoration: none;
  }
`

// These styles affect all pages.
css`
  :global() {
    ${typography.toString()}

    * {
      box-sizing: border-box;
    }

    html {
      margin: 0;
      padding: 0;
      overflow: initial;
      font-size: ${theme.fontSizes.root} !important;
      ${theme.mediaQueries.print} {
        font-size: 11.5pt !important;
      }
    }

    body {
      margin: 0;
      padding: 0;
      background-color: ${theme.colors.footer} !important;
      ${theme.mediaQueries.print} {
        background-color: none !important;
        color: black;
      }
    }

    ${theme.mediaQueries.print} {
      abbr[title] {
        border-bottom: none;
        text-decoration: none;
      }
    }

    p,
    h1,
    h2 {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    @page {
      margin: 0.75in;
      :left :header {
        content: first(title);
      }
      :right :header {
        content: first(chapter), , decimal(pageno);
      }
    }

    a {
      color: ${theme.colors.footer};
      text-decoration-thickness: 0.08em;
      border-radius: 0;

      &:hover,
      &:active,
      &:focus {
        color: ${theme.colors.altFooter};
      }

      ${theme.mediaQueries.print} {
        color: ${theme.colors.text};
        text-decoration: none;
      }
    }

    button:focus,
    a:focus,
    img:focus,
    *[tabindex]:focus {
      outline-color: ${theme.colors.link};
      outline-style: solid;
      outline-width: thin;
      outline-offset: 0;

      ${theme.mediaQueries.print} {
        outline: none;
      }
    }

    main {
      background-color: ${theme.colors.body};
      display: flex;
      flex-flow: column wrap;
      align-items: center;
      padding: ${typography.rhythm(1)} 0;
      ${theme.mediaQueries.print} {
        display: block;
        padding-bottom: 0;
      }
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    header {
      color: ${theme.colors.headings};
      font-family: ${theme.fonts.headerArr.join(",")};
      ${theme.mediaQueries.print} {
        color: black;
      }
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
      margin-left: ${typography.rhythm(1)};
    }
  }
`
