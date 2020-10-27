import React from "react"
import { styled } from "linaria/react"
import { css } from "linaria"
import { Link } from "gatsby"
import Footer from "./footer"
import theme, { fullWidth } from "./theme"

/** Wrapper for most site pages, providing them with a navigation header and footer. */
const Layout = (p: { children: any }) => (
  <>
    <Header>
      <HeaderContents>
        <Link to="/" className={siteTitle}>
          DAILP
        </Link>
        <SubHeader>
          Digital Archive of American Indian Languages Preservation and
          Perseverance
        </SubHeader>
      </HeaderContents>
    </Header>
    {p.children}
    <Footer />
  </>
)

export default Layout

const Header = styled.nav`
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
  align-items: baseline;
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
  margin: 1.2rem 0;
  color: ${theme.colors.headings};
  text-decoration: none;
  font-size: 2rem;
`
