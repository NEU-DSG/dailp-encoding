import React from "react"
import { MdArrowDropDown, MdMenu } from "react-icons/md/index"
import {
  Dialog,
  DialogBackdrop,
  DialogDisclosure,
  useDialogState,
} from "reakit"
import { Menu, MenuButton, MenuItem, useMenuState } from "reakit"
import Link from "src/components/link"
import * as Wordpress from "src/graphql/wordpress"
import * as Dailp from "src/graphql/dailp"
import { Location, useLocation, usePageContext } from "src/renderer/PageShell"
import {
  desktopNav,
  drawerBg,
  drawerItem,
  drawerList,
  navButton,
  navDrawer,
  navLink,
  navMenu,
  subMenuItems,
} from "./menu.css"

type MenuItemNode = Dailp.MenuBySlugQuery["menuBySlug"]["items"][number]
type ChildMenuItemNode = NonNullable<MenuItemNode["items"]>[number]

export const NavMenu = (p: { menuID: number }) => {
  const location = useLocation()
  const [{ data }] = Dailp.useMenuBySlugQuery({
    variables: { slug: "default-nav" },
  })
  const menu = data?.menuBySlug

  //const [{ data }] = Wordpress.useMenuByIdQuery({
    //variables: { id: p.menuID },
  //})
  //const menus = data?.menus?.nodes
  if (!menu) {
    return null
  }
  //const menu = menus[0]
  const menuItems = menu?.items
  if (!menuItems) {
    return null
  }
  const isTopLevel = (a: typeof menuItems[0]) =>
    !menuItems?.some((b) =>
      b?.items?.some((b) => b?.path === a?.path)
    )

  return (
    <nav className={desktopNav}>
      {menuItems?.filter(isTopLevel).map((item: MenuItemNode) => {
        if (!item) {
          return null
        } else if (item.items?.length) {
          return <SubMenu key={item.label} item={item} location={location} />
        } else {
          let url = { pathname: item.path }
          if (item.path && item.path.startsWith("http")) {
            url = new URL(item.path)
          }
          return (
            <Link
              key={item.path}
              href={url.pathname?.valueOf()}
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

const SubMenu = ({ item, location }: { location: Location; item: MenuItemNode }) => {
  const menu = useMenuState()
  return (
    <>
      <MenuButton {...menu} className={navLink}>
        {item.label}
        <MdArrowDropDown aria-label="Menu" />
      </MenuButton>
      <Menu {...menu} aria-label={item.label} className={navMenu}>
        {item.items?.map((item: ChildMenuItemNode) => {
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
              className={subMenuItems}
              onClick={() => menu.hide()}
            >
              {item.label}
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
}

export const MobileNav = (p: { menuID: number }) => {
  const router = usePageContext()
  const dialog = useDialogState({ animated: true })
  const [{ data }] = Wordpress.useMenuByIdQuery({
    variables: { id: p.menuID },
  })
  const menus = data?.menus?.nodes
  if (!menus) {
    return null
  }
  const menu = menus[0]
  const menuItems = menu?.menuItems?.nodes
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
          <ul className={drawerList}>
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
                if (item.path && item.path.startsWith("http")) {
                  url = new URL(item.path)
                }
                return (
                  <li key={item.path}>
                    <Link
                      className={drawerItem}
                      href={url.pathname?.valueOf()}
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
