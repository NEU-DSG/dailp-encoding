import React from "react"
import { styled } from "linaria/react"
import { css } from "linaria"
import { Link } from "gatsby"
import Footer from "./footer"

/** Wrapper for most site pages, providing them with a navigation header and footer. */
const Layout = (p: { children: any }) => (
  <>
    <Header>
      <Link to="/" className={siteTitle}>
        Digital Archive of American Indian Languages Preservation and
        Perseverance
      </Link>
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
  background-color: #f7eeed;
`

const siteTitle = css`
  margin: 1.2rem 0;
  color: #bb675d;
  text-decoration: none;
  font-size: 2rem;
  font-family: "Open Sans";
`
