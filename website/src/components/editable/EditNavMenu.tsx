import React, { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { MdArrowDropDown, MdMenu, MdDragIndicator } from "react-icons/md/index"
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
} from "../../menu.css"

export const EditableNavMenu = (p: { menuID: number }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleDelete = (item: any) => {
    const label = item?.label || item?.path || "this item"
    const ok = typeof window !== "undefined" && window.confirm(`Delete "${label}"?`)
    if (!ok) return
    setItems(items.filter((i) => i.id !== item.id))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const item = formData.get("add item")
    const itemPath = formData.get("add item path")
    // Reject duplicates: we use path as the id, so block if it already exists
    if (
      items.some(
        (i) => i && (i.id === (itemPath as string) || i.path === (itemPath as string))
      )
    ) {
      setErrorMessage("An item with this path already exists.")
      return
    }
    setErrorMessage(null)
    setItems([...items, {
      id: itemPath as string,
      label: item as string,
      path: itemPath as string,
      childItems: { nodes: [] }
    }])
    // clear form data
    formData.set("add item", "")
    formData.set("add item path", "")
    ;(e.target as HTMLFormElement).reset()
  }

  const location = useLocation()
  // dennis todo move off of wordpress query and use db query
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
      b?.childItems?.nodes?.some((b) => b?.path === a?.path)
    )

  const topLevelItems = menuItems?.filter(isTopLevel) || []
  const [items, setItems] = useState(topLevelItems)

  const handleDragEnd = (result: any) => {
    if (!result.destination) {
      return
    }

    const newItems = Array.from(items)
    const [reorderedItem] = newItems.splice(result.source.index, 1)
    if (reorderedItem) {
      newItems.splice(result.destination.index, 0, reorderedItem)
      setItems(newItems)
    }
  }

  return (
    <>
    <nav className={desktopNav}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="nav-items" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ display: "flex" }}
            >
              {items.map((item, index) => {
                if (!item) {
                  return null
                } else if (item.childItems?.nodes?.length) {
                  return (
                    <Draggable key={item.label || `submenu-${index}`} draggableId={item.label || `submenu-${index}`} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={{
                            ...provided.draggableProps.style,
                            opacity: snapshot.isDragging ? 0.8 : 1,
                            display: "flex",
                            alignItems: "center",
                            cursor: "grab",
                          }}
                        >
                      <p onClick={() => handleDelete(item)}>x</p>
                          <div
                            {...provided.dragHandleProps}
                            style={{
                              marginRight: "4px",
                              color: "#666",
                              cursor: "grab",
                            }}
                          >
                            <MdDragIndicator size={16} />
                          </div>
                          <SubMenu item={item} location={location} />
                        </div>
                      )}
                    </Draggable>
                  )
                } else {
                  let url = { pathname: item.path }
                  if (item.path && item.path.startsWith("http")) {
                    url = new URL(item.path)
                  }
                  return (
                    <Draggable key={item.path || `link-${index}`} draggableId={item.path || `link-${index}`} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={{
                            ...provided.draggableProps.style,
                            opacity: snapshot.isDragging ? 0.8 : 1,
                            display: "flex",
                            alignItems: "center",
                            cursor: "grab",
                          }}
                        >
                      <p onClick={() => handleDelete(item)}>x</p>
                          <div
                            {...provided.dragHandleProps}
                            style={{
                              marginRight: "4px",
                              color: "#666",
                              cursor: "grab",
                            }}
                          >
                            <MdDragIndicator size={16} />
                          </div>
                          <Link
                            href={url.pathname?.valueOf()}
                            className={navLink}
                            aria-current={
                              location.pathname === url.pathname ? "page" : undefined
                            }
                          >
                            {item.label}
                          </Link>
                        </div>
                      )}
                    </Draggable>
                  )
                }
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </nav>
    <form onSubmit={handleSubmit}>
      {errorMessage && (
        <p style={{ color: "#b00020", margin: "0 0 8px" }}>{errorMessage}</p>
      )}
      <input type="text" name="add item" placeholder="Item Label" />
      <input type="text" name="add item path" placeholder="Item Path" />
      <button type="submit">Add Item</button>
    </form>
    <form>
      <button type="submit">Save</button>
      <button type="button">Cancel</button>
    </form>
</>
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
