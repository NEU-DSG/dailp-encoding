import React from "react"
import { Link, graphql, useStaticQuery } from "gatsby"
import { styled } from "linaria/react"

const NavMenu = () => {
  const data = useStaticQuery(query)
  const items: any[] = data.wpMenu.menuItems.nodes
  const isTopLevel = (y: { path: string }) =>
    !items.find(
      (item) => !!item.childItems.nodes.find((x: typeof y) => x.path === y.path)
    )
  return (
    <nav>
      <NavList>
        <li>
          <Link to="/collections">Collections</Link>
        </li>
        {items.filter(isTopLevel).map((item) => (
          <li>
            <Link to={item.path}>{item.label}</Link>
          </li>
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
  li {
    display: inline;
    font-size: 1rem;
    & > a {
      padding: 0.5rem 1rem;
    }
  }
`
