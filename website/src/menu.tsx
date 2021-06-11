import React from "react"
import { css } from "@emotion/react"
import { Link, graphql, useStaticQuery } from "gatsby"
import { useLocation } from "@gatsbyjs/reach-router"
import theme, { fullWidth, typography } from "./theme"
import {
  useDialogState,
  Dialog,
  DialogDisclosure,
  DialogBackdrop,
} from "reakit/Dialog"
import { useMenuState, Menu, MenuItem, MenuButton } from "reakit/Menu"
import { MdMenu, MdArrowDropDown } from "react-icons/md"

const useMenu = () =>
  useStaticQuery(graphql`
    query {
      wpMenu {
        menuItems {
          nodes {
            label
            path
            childItems {
              nodes {
                label
                path
              }
            }
          }
        }
      }
    }
  `)

export const NavMenu = () => {
  const location = useLocation()
  const data = useMenu()
  const menuItems = data.wpMenu.menuItems.nodes
  const isTopLevel = (a) =>
    !menuItems.some((b) => b.childItems.nodes.some((b) => b.path === a.path))

  return (
    <nav css={desktopNav}>
      {menuItems.filter(isTopLevel).map((item) => {
        if (item.childItems.nodes.length) {
          const menu = useMenuState()
          return (
            <React.Fragment key={item.label}>
              <MenuButton {...menu} css={navLink}>
                {item.label}
                <MdArrowDropDown aria-label="Menu" />
              </MenuButton>
              <Menu {...menu} aria-label={item.label} css={navMenu}>
                {item.childItems.nodes.map((item) => {
                  let url = { pathname: item.path }
                  if (item.path.startsWith("http")) {
                    url = new URL(item.path)
                  }
                  return (
                    <MenuItem
                      {...menu}
                      as={Link}
                      to={url.pathname}
                      key={item.path}
                      css={navLink}
                      aria-current={
                        location.pathname === url.pathname ? "page" : undefined
                      }
                    >
                      {item.label}
                    </MenuItem>
                  )
                })}
              </Menu>
            </React.Fragment>
          )
        } else {
          let url = { pathname: item.path }
          if (item.path.startsWith("http")) {
            url = new URL(item.path)
          }
          return (
            <Link
              key={item.path}
              to={url.pathname}
              aria-current={
                location.pathname === url.pathname ? "page" : undefined
              }
              css={navLink}
            >
              {item.label}
            </Link>
          )
        }
      })}
    </nav>
  )
}

export const MobileNav = () => {
  const location = useLocation()
  const dialog = useDialogState({ animated: true })
  const data = useMenu()
  const menuItems = data.wpMenu.menuItems.nodes
  const isTopLevel = (a) =>
    !menuItems.some((b) => b.childItems.nodes.some((b) => b.path === a.path))

  return (
    <>
      <DialogDisclosure
        {...dialog}
        css={navButton}
        aria-label="Open Mobile Navigation Drawer"
      >
        <MdMenu size={32} />
      </DialogDisclosure>
      <DialogBackdrop {...dialog} css={drawerBg}>
        <Dialog
          {...dialog}
          as="nav"
          css={navDrawer}
          aria-label="Navigation Drawer"
        >
          <ul>
            {menuItems.filter(isTopLevel).map((item) => {
              let items = item.childItems.nodes
              if (!items.length) {
                items = [item]
              }
              return items.map((item) => {
                let url = { pathname: item.path }
                if (item.path.startsWith("http")) {
                  url = new URL(item.path)
                }
                return (
                  <li css={drawerItem} key={item.path}>
                    <Link
                      to={url.pathname}
                      aria-current={
                        location.pathname === url.pathname ? "page" : undefined
                      }
                      css={navLink}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })
            })}
          </ul>
        </Dialog>
      </DialogBackdrop>
    </>
  )
}

const navMenu = css`
  display: flex;
  flex-flow: column;
  background-color: ${theme.colors.body};
  border: 2px solid ${theme.colors.link};
  &:focus {
    outline: none;
  }
`

const navLink = css`
  padding: ${typography.rhythm(1 / 4)} 1ch;
  text-decoration: none;
  color: ${theme.colors.text};
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  display: flex;
  flex-flow: row;
  align-items: center;

  ${theme.mediaQueries.large} {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  &[aria-current="page"] {
    color: ${theme.colors.link};
    border-color: ${theme.colors.link};
  }
  &:hover,
  &:focus {
    color: ${theme.colors.link};
  }
`

const drawerItem = css`
  margin-bottom: ${typography.rhythm(1 / 2)};
  & > a {
    padding: ${typography.rhythm(1 / 2)};
    text-decoration: none;
    color: ${theme.colors.text};

    &[aria-current="page"],
    &:hover,
    &:focus {
      color: ${theme.colors.link};
    }
  }
`

const desktopNav = css`
  ${fullWidth};
  display: none;
  ${theme.mediaQueries.medium} {
    display: flex;
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
  font-family: ${theme.fonts.header};
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
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.2);
  transition: opacity 100ms ease-in-out;
  opacity: 0;
  &[data-enter] {
    opacity: 1;
  }
`
