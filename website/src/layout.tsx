import React from "react"
import { styled } from "linaria/react"
import { css } from "linaria"
import { Link } from "gatsby"
import Footer from "./footer"
import theme, { fullWidth } from "./theme"
import { NavMenu, MobileNav } from "./menu"
import { Helmet } from "react-helmet"
import Sticky from "react-stickynode"
import { isMobile } from "react-device-detect"

import "fontsource-noto-serif"
import "fontsource-quattrocento-sans"
import "./fonts.css"

/** Wrapper for most site pages, providing them with a navigation header and footer. */
const Layout = (p: { title?: string; children: any }) => (
  <>
    <Helmet>
      <title>{p.title ? `${p.title} - ` : null} DAILP</title>
    </Helmet>

    <Sticky enabled={isMobile} innerZ={1}>
      <Header aria-label="Site Header" id="header">
        <HeaderContents>
          <MobileNav />
          <h1 className={siteTitle}>
            <Link to="/">DAILP</Link>
          </h1>
          <SubHeader>
            Digital Archive of American Indian Languages Preservation and
            Perseverance
          </SubHeader>
          <NavMenu />
        </HeaderContents>
      </Header>
    </Sticky>
    {p.children}
    <Footer />
  </>
)

export default Layout

const Header = styled.header`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  background-color: ${theme.colors.header};
  padding: 0 ${theme.edgeSpacing};
  font-family: ${theme.fonts.header};
`

const HeaderContents = styled.nav`
  ${fullWidth}
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  ${theme.mediaQueries.medium} {
    align-items: baseline;
  }
`

const SubHeader = styled.span`
  font-size: 0.9rem;
  color: ${theme.colors.headings};
  padding-left: 1rem;
  display: none;
  ${theme.mediaQueries.medium} {
    display: initial;
  }
`

const siteTitle = css`
  margin: 0.25rem 0;
  font-size: 2rem;
  ${theme.mediaQueries.medium} {
    margin: 1.2rem 0;
  }
  & > a {
    color: ${theme.colors.headings};
    text-decoration: none;
  }
`

// These styles affect all pages.
css`
  :global() {
    * {
      box-sizing: border-box;
    }
    html {
      font-size: ${theme.fontSizes.root};
      width: 100vw;
      overflow-x: hidden;
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
    ul {
      padding-inline-start: 1.5rem;
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
      main > & {
        padding-left: ${theme.edgeSpacing};
        padding-right: ${theme.edgeSpacing};
      }
    }

    h1 {
      font-size: 1.7rem;
    }
    h2 {
      font-size: 1.4rem;
    }
    h3 {
      font-size: 1.2rem;
    }
    h4,
    h5,
    h6 {
      font-size: 1rem;
    }

    button,
    input[type="radio"] {
      cursor: pointer;
      font-family: inherit;
      font-size: inherit;
    }

    a {
      color: ${theme.colors.text};
      text-decoration-thickness: 0.09em;
      border-radius: 0;

      &:hover,
      &:active,
      &:focus {
        color: ${theme.colors.link};
      }
    }

    *:focus {
      outline-color: ${theme.colors.link};
      outline-style: solid;
      outline-width: thin;
      outline-offset: 0;
    }

    figure {
      margin-inline-start: 0;
      max-width: 100%;
      ${theme.mediaQueries.medium} {
        margin-inline-start: 2rem;
      }
    }
  }
`
