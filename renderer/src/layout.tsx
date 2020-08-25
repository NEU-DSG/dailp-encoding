import React from "react"
import {
  useToolbarState,
  Toolbar,
  ToolbarItem,
  ToolbarSeparator,
} from "reakit/Toolbar"
import styled from "@emotion/styled"
import { Link } from "gatsby"

const Layout = ({ children }) => (
  <>
    <Header>
      <SiteTitle to="/">Cherokee Reader</SiteTitle>
    </Header>
    {children}
  </>
)
export default Layout

const Header = styled.nav({
  display: "flex",
  flexFlow: "row nowrap",
  justifyContent: "center",
  backgroundColor: "lightgray",
})

const SiteTitle = styled(Link)({
  color: "black",
  textDecoration: "none",
  fontSize: "2rem",
  margin: "1.2rem 0",
})

// const NavBar = () => {
//     const toolbar = useToolbarState()
//     return (
//         <Toolbar {...toolbar}>
//             <ToolbarItem {...toolbar} as={Link} to="/">
//
//             </ToolbarItem>
//
//         </Toolbar>
//     )
// }
