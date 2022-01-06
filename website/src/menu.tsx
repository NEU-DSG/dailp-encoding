import React from "react"
import { MdArrowDropDown, MdMenu } from "react-icons/md"
import {
  Dialog,
  DialogBackdrop,
  DialogDisclosure,
  useDialogState,
} from "reakit/Dialog"
import { Menu, MenuButton, MenuItem, useMenuState } from "reakit/Menu"
import * as Wordpress from "src/graphql/wordpress"
import { Link } from "src/components/link"
import { usePageContext } from "src/renderer/PageShell"
import {
  desktopNav,
  drawerBg,
  drawerItem,
  navButton,
  navDrawer,
  navLink,
  navMenu,
} from "./menu.css"
import { closeBlock } from "./sprinkles.css"

export const NavMenu = () => {
  const router = usePageContext()
  const [{ data }] = Wordpress.useMainMenuQuery()
  if (!data) {
    return null
  }

  const menuItems = data?.menuItems?.nodes
  const isTopLevel = (a) =>
    !menuItems?.some((b) =>
      b?.childItems?.nodes?.some((b) => b?.path === a?.path)
    )

  return (
    <nav className={desktopNav}>
      {menuItems?.filter(isTopLevel).map((item) => {
        if (!item) {
          return null
        } else if (item.childItems.nodes.length) {
          return <SubMenu key={item.label} item={item} router={router} />
        } else {
          let url = { pathname: item.path }
          if (item.path.startsWith("http")) {
            url = new URL(item.path)
          }
          return (
            <a
              key={item.path}
              href={url.pathname}
              className={navLink}
              aria-current={
                router.urlPathname === url.pathname ? "page" : undefined
              }
            >
              {item.label}
            </a>
          )
        }
      })}
    </nav>
  )
}

const SubMenu = ({ item, router }) => {
  const menu = useMenuState()
  return (
    <>
      <MenuButton {...menu} className={navLink}>
        {item.label}
        <MdArrowDropDown aria-label="Menu" />
      </MenuButton>
      <Menu {...menu} aria-label={item.label} className={navMenu}>
        {item.childItems.nodes.map((item) => {
          let url = { pathname: item.path }
          if (item.path.startsWith("http")) {
            url = new URL(item.path)
          }
          return (
            <MenuItem
              {...menu}
              as="a"
              key={item.path}
              href={url.pathname}
              aria-current={
                router.urlPathname === url.pathname ? "page" : undefined
              }
              className={navLink}
            >
              {item.label}
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
}

export const MobileNav = () => {
  const router = usePageContext()
  const dialog = useDialogState({ animated: true })
  const [{ data }] = Wordpress.useMainMenuQuery()
  const menuItems = data?.menuItems.nodes
  const isTopLevel = (a) =>
    !menuItems?.some((b) => b?.childItems.nodes.some((b) => b.path === a?.path))

  return (
    <>
      <DialogDisclosure
        {...dialog}
        className={navButton}
        aria-label="Open Mobile Navigation Drawer"
      >
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
            {menuItems?.filter(isTopLevel).map((item) => {
              let items = item?.childItems?.nodes
              if (items && !items.length) {
                items = [item]
              }
              return items?.map((item) => {
                let url = { pathname: item.path }
                if (item.path.startsWith("http")) {
                  url = new URL(item.path)
                }
                return (
                  <li className={closeBlock} key={item.path}>
                    <a
                      className={drawerItem}
                      href={url.pathname}
                      aria-current={
                        router.urlPathname === url.pathname ? "page" : undefined
                      }
                    >
                      {item.label}
                    </a>
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
