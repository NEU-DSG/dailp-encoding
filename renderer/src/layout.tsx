import React from "react"
import {
  useToolbarState,
  Toolbar,
  ToolbarItem,
  ToolbarSeparator,
} from "reakit/Toolbar"
import { styled } from "linaria/react"
import { css } from "linaria"
import { Link } from "gatsby"

const Layout = ({ children }) => (
  <>
    <Header>
      <Link to="/" className={siteTitle}>
        Cherokee Reader (React Version)
      </Link>
    </Header>
    {children}
  </>
)
export default Layout

const Header = styled.nav`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  background-color: lightgray;
`

const siteTitle = css`
  color: black;
  text-decoration: none;
  font-size: 2rem;
  margin: 1.2rem 0;
`
