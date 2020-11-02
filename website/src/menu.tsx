import React from "react"
import { Link, graphql, useStaticQuery } from "gatsby"
import { useLocation } from "@reach/router"
import { styled } from "linaria/react"
import theme from "./theme"

const NavMenu = () => {
  const data = useStaticQuery(query)
  const items: any[] = data.wpMenu.menuItems.nodes
  const isTopLevel = (y: { path: string }) =>
    !items.find(
      (item) => !!item.childItems.nodes.find((x: typeof y) => x.path === y.path)
    )
  const location = useLocation()

  return (
    <nav>
      <NavList>
        <NavItem>
          <Link to="/collections">Collections</Link>
        </NavItem>

        {items.filter(isTopLevel).map((item) => (
          <NavItem>
            <Link
              to={item.path}
              aria-current={
                location.pathname === item.path ? "page" : undefined
              }
            >
              {item.label}
            </Link>
          </NavItem>
        ))}
      </NavList>
    </nav>
  )
}

export default NavMenu

const query = graphql`
  query {
    wpMenu {
      menuItems {
        nodes {
          path
          label
          childItems {
            nodes {
              path
              label
            }
          }
        }
      }
    }
  }
`

const NavList = styled.ul`
  list-style: none;
  padding-inline-start: 0;
  margin-top: 0;
  margin-bottom: 0.6rem;
`

const NavItem = styled.li`
  display: inline;
  font-size: 1rem;

  &:hover > a {
    color: ${theme.colors.link};
  }

  & > a {
    padding: 0.5rem 1rem;
    text-decoration: none;
    color: ${theme.colors.text};
    &[aria-current="page"] {
      color: ${theme.colors.link};
      border-bottom: 2px solid ${theme.colors.link};
    }
  }
`
