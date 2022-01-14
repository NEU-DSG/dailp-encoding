import React from "react"
import { MdArrowDropDown, MdMenu } from "react-icons/md"
import {
  Dialog,
  DialogBackdrop,
  DialogDisclosure,
  useDialogState,
} from "reakit/Dialog"
import { Menu, MenuButton, MenuItem, useMenuState } from "reakit/Menu"
import Link from "src/components/link"
import * as Wordpress from "src/graphql/wordpress"
import { Location, useLocation, usePageContext } from "src/renderer/PageShell"
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
  const location = useLocation()
  const [{ data }] = Wordpress.useMainMenuQuery()
  const menuItems = data?.menuItems?.nodes
  if (!menuItems) {
    return null
  }

  const isTopLevel = (a: typeof menuItems[0]) =>
    !menuItems?.some((b) =>
      b?.childItems?.nodes?.some((b) => b?.path === a?.path)
    )

  return (
    <nav className={desktopNav}>
      {menuItems?.filter(isTopLevel).map((item) => {
        if (!item) {
          return null
        } else if (item.childItems?.nodes?.length) {
          return <SubMenu key={item.label} item={item} location={location} />
        } else {
          let url = { pathname: item.path }
          if (item.path.startsWith("http")) {
            url = new URL(item.path)
          }
          return (
            <Link
              key={item.path}
              href={url.pathname}
              className={navLink}
              aria-current={
                location.pathname === url.pathname ? "page" : undefined
              }
            >
              {item.label}
            </Link>
          )
        }
      })}
    </nav>
  )
}

const SubMenu = ({ item, location }: { location: Location; item: any }) => {
  const menu = useMenuState()
  return (
    <>
      <MenuButton {...menu} className={navLink}>
        {item.label}
        <MdArrowDropDown aria-label="Menu" />
      </MenuButton>
      <Menu {...menu} aria-label={item.label} className={navMenu}>
        {item.childItems.nodes.map((item: any) => {
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
                location.pathname === url.pathname ? "page" : undefined
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
  const menuItems = data?.menuItems?.nodes
  if (!menuItems) {
    return null
  }
  const isTopLevel = (a: typeof menuItems[0]) =>
    !menuItems?.some((b) =>
      b?.childItems!.nodes!.some((b) => b?.path === a?.path)
    )

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
                if (!item) {
                  return null
                }
                let url = { pathname: item.path }
                if (item.path.startsWith("http")) {
                  url = new URL(item.path)
                }
                return (
                  <li className={closeBlock} key={item.path}>
                    <Link
                      className={drawerItem}
                      href={url.pathname}
                      aria-current={
                        router.urlPathname === url.pathname ? "page" : undefined
                      }
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
