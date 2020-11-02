import React from "react"
import { Link, graphql, useStaticQuery } from "gatsby"
import { useLocation } from "@reach/router"
import { styled } from "linaria/react"
import { css } from "linaria"
import theme from "./theme"
import {
  useDialogState,
  Dialog,
  DialogDisclosure,
  DialogBackdrop,
} from "reakit/Dialog"
import { MdMenu } from "react-icons/md"

export const NavMenu = () => {
  const data = useStaticQuery(query)
  const items: any[] = data.wpMenu.menuItems.nodes
  const isTopLevel = (y: { path: string }) =>
    !items.find(
      (item) => !!item.childItems.nodes.find((x: typeof y) => x.path === y.path)
    )
  const location = useLocation()

  return (
    <nav className={desktopNav}>
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

export const MobileNav = () => {
  const location = useLocation()
  const data = useStaticQuery(query)
  const dialog = useDialogState({ animated: true })
  const items: any[] = data.wpMenu.menuItems.nodes
  const isTopLevel = (y: { path: string }) =>
    !items.find(
      (item) => !!item.childItems.nodes.find((x: typeof y) => x.path === y.path)
    )
  const navItems = items.filter(isTopLevel)
  // Add a link to the collections page.
  navItems.splice(0, 0, { path: "/collections", label: "Collections" })

  return (
    <>
      <DialogDisclosure {...dialog} className={navButton}>
        <MdMenu size={32} />
      </DialogDisclosure>
      <DialogBackdrop {...dialog} className={drawerBg}>
        <Dialog
          {...dialog}
          as="nav"
          className={navDrawer}
          aria-label="Navigation Drawer"
        >
          <ul>
            {navItems.map((item) => (
              <DrawerItem key={item.path}>
                <Link
                  to={item.path}
                  aria-current={
                    location.pathname === item.path ? "page" : undefined
                  }
                >
                  {item.label}
                </Link>
              </DrawerItem>
            ))}
          </ul>
        </Dialog>
      </DialogBackdrop>
    </>
  )
}

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

  & > a {
    padding: 0.5rem 1rem;
    text-decoration: none;
    color: ${theme.colors.text};
    &[aria-current="page"] {
      color: ${theme.colors.link};
      border-bottom: 2px solid ${theme.colors.link};
    }
    &:hover {
      color: ${theme.colors.link};
    }
  }
`

const DrawerItem = styled.li`
  margin-bottom: 0.5rem;
  & > a {
    padding: 0.5rem;
    text-decoration: none;
    color: ${theme.colors.text};
    &[aria-current="page"],
    &:hover {
      color: ${theme.colors.link};
    }
  }
`

const desktopNav = css`
  display: none;
  ${theme.mediaQueries.medium} {
    display: initial;
  }
`

const navButton = css`
  ${theme.mediaQueries.medium} {
    display: none;
  }
  border: none;
  padding: 0;
  background: none;
  margin-right: 1rem;
  height: 32px;
`

const navDrawer = css`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  background-color: ${theme.colors.body};
  width: 16rem;
  transition: transform 150ms ease-in-out;
  transform: translateX(-16rem);
  &[data-enter] {
    transform: translateX(0);
  }

  padding: 0 ${theme.edgeSpacing};
  ul {
    list-style: none;
    padding-inline-start: 0;
  }
`

const drawerBg = css`
  ${theme.mediaQueries.medium} {
    display: none;
  }
  z-index: 999;
  inset: 0;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.2);
  transition: opacity 100ms ease-in-out;
  opacity: 0;
  &[data-enter] {
    opacity: 1;
  }
`
