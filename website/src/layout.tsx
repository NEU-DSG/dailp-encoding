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
          <Link to="/" className={siteTitle}>
            DAILP
          </Link>
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

const HeaderContents = styled.div`
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
  color: ${theme.colors.headings};
  text-decoration: none;
  font-size: 2rem;
  ${theme.mediaQueries.medium} {
    margin: 1.2rem 0;
  }
`
