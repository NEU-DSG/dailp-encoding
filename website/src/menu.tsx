import React from "react"
import { Link, graphql } from "gatsby"
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
import { useMenuState, Menu, MenuItem, MenuButton } from "reakit/Menu"
import { MdMenu, MdArrowDropDown } from "react-icons/md"

const menuItems = [
  { path: "/", label: "Collections" },
  {
    label: "About",
    childItems: [
      { path: "/about", label: "About DAILP" },
      { path: "/about/our-team", label: "Our Team" },
      { path: "/about/our-goals", label: "Our Goals" },
      { path: "/about/why-now", label: "Why Now" },
      { path: "/about/project-history", label: "Project History" },
    ],
  },
  { path: "/credit", label: "Additional Resources" },
  { path: "/contact", label: "Interested in Working With Us?" },
]

export const NavMenu = () => {
  const location = useLocation()

  return (
    <div className={desktopNav}>
      {menuItems.map((item) => {
        if (item.childItems) {
          const menu = useMenuState()
          return (
            <>
              <MenuButton {...menu} className={navLink}>
                {item.label}
                <MdArrowDropDown />
              </MenuButton>
              <Menu {...menu} aria-label={item.label} className={navMenu}>
                {item.childItems.map((item) => (
                  <MenuItem
                    as={Link}
                    to={item.path}
                    key={item.path}
                    className={navLink}
                    {...menu}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
            </>
          )
        } else {
          return (
            <Link
              key={item.path}
              to={item.path}
              aria-current={
                location.pathname === item.path ? "page" : undefined
              }
              className={navLink}
            >
              {item.label}
            </Link>
          )
        }
      })}
    </div>
  )
}

export const MobileNav = () => {
  const location = useLocation()
  const dialog = useDialogState({ animated: true })

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
            {menuItems.map((item) => {
              const items: any[] = item.childItems ?? [item]
              return items.map((item) => (
                <li className={drawerItem} key={item.path}>
                  <Link
                    to={item.path}
                    aria-current={
                      location.pathname === item.path ? "page" : undefined
                    }
                    className={navLink}
                  >
                    {item.label}
                  </Link>
                </li>
              ))
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
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: ${theme.colors.text};
  background: none;
  border: none;
  display: flex;
  flex-flow: row;

  &[aria-current="page"] {
    color: ${theme.colors.link};
    border-bottom: 2px solid ${theme.colors.link};
  }
  &:hover,
  &:focus {
    color: ${theme.colors.link};
  }
`

const drawerItem = css`
  margin-bottom: 0.5rem;
  & > a {
    padding: 0.5rem;
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
