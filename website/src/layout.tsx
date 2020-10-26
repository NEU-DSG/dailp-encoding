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
      <Link to="/" className={siteTitle}>
        DAILP
      </Link>
    </Header>
    {p.children}
    <Footer />
  </>
)
export default Layout

const Header = styled.nav`
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  background-color: ${theme.colors.header};
  padding: 0 ${theme.edgeSpacing};
  & > * {
    ${fullWidth}
  }
`

const siteTitle = css`
  margin: 1.2rem 0;
  color: ${theme.colors.headings};
  text-decoration: none;
  font-size: 2rem;
  font-family: ${theme.fonts.header};
`
