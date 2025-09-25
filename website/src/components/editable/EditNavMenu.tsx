import React, { useEffect, useRef, useState } from "react"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import { MdArrowDropDown, MdDragIndicator, MdMenu } from "react-icons/md/index"
import {
  Dialog,
  DialogBackdrop,
  DialogDisclosure,
  Menu,
  MenuButton,
  MenuItem,
  useDialogState,
  useMenuState,
} from "reakit"
import Link from "src/components/link"
import * as Dailp from "src/graphql/dailp"
import * as Wordpress from "src/graphql/wordpress"
import { Location, useLocation, usePageContext } from "src/renderer/PageShell"
import {
  drawerBg,
  drawerItem,
  drawerList,
  navButton,
  navDrawer,
  navLink,
  navMenu,
  subMenuItems,
} from "../../menu.css"

export const EditableNavMenu = ({navMenuSlug}: {navMenuSlug: string}) => {
  const [{ data }] = Dailp.useMenuBySlugQuery({
    variables: { slug: navMenuSlug },
  })
  const menu = data?.menuBySlug
  const [updateMenuResult, updateMenu] = Dailp.useUpdateMenuMutation()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  //const location = useLocation()
  const [items, setItems] = useState<Dailp.MenuItem[]>([])
  const [menuName, setMenuName] = useState(menu?.name ?? "no name")
  // inline editor, no modal

  // Stable client ids to prevent DnD jumpiness when fields change
  const cidCounter = useRef(0)
  const newCid = () => `cid-${Date.now()}-${cidCounter.current++}`
  const withClientIds = (nodes: any[] | readonly any[] | undefined): any[] => {
    const attach = (arr: any[]): any[] =>
      arr.map((n) => {
        const _cid = n?._cid ?? newCid()
        return {
          ...n,
          _cid,
          items: n?.items ? attach(n.items) : n.items,
        }
      })
    return attach([...((nodes as any[]) ?? [])])
  }

  // Sync editable items when menu loads/changes
  useEffect(() => {
    // Clone and attach stable client ids
    setItems(withClientIds(menu?.items) as any[])
    setMenuName(menu?.name ?? "no name")
  }, [menu])

  if (!menu) {
    return null
  }

  const updateNode = (arr: any[], id: string, update: Partial<any>): any[] =>
    arr.map((n) =>
      String(n?._cid) === id
        ? { ...n, ...update }
        : { ...n, items: n?.items ? updateNode(n.items, id, update) : n.items }
    )

  const addChild = (arr: any[], parentId: string, child: any): any[] =>
    arr.map((n) =>
      String(n?._cid) === parentId
        ? { ...n, items: [...(n.items ?? []), { ...child, _cid: newCid() }] }
        : {
            ...n,
            items: n?.items ? addChild(n.items, parentId, child) : n.items,
          }
    )

  const removeNode = (arr: any[], id: string): any[] =>
    arr
      .filter((n) => String(n?._cid) !== id)
      .map((n) => ({
        ...n,
        items: n?.items ? removeNode(n.items, id) : n.items,
      }))

  const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
  }

  const handleDragEnd = (result: any) => {
    const { source, destination } = result
    if (!destination) return

    // Disallow cross-droppable moves for simplicity
    if (source.droppableId !== destination.droppableId) return

    if (source.droppableId === "top") {
      setItems((prev) => reorder(prev, source.index, destination.index))
      return
    }

    // child lists: droppableId = `child-${parentId}`
    if (source.droppableId.startsWith("child-")) {
      const parentId = source.droppableId.slice("child-".length)
      setItems((prev) =>
        prev.map((p: any) => {
          if (String(p?._cid) !== parentId) return p
          const children = p.items ?? []
          const next = reorder(children, source.index, destination.index)
          return { ...p, items: next }
        })
      )
    }
  }

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("save", items, menuName)
    const toMenuItemInput = (
      nodes: any[] | undefined
    ): ReadonlyArray<Dailp.MenuItemInput> | null => {
      if (!nodes || !nodes.length) return null
      return nodes.map((n) => ({
        label: n?.label,
        path: n?.path,
        items: toMenuItemInput(n?.items ?? []),
      })) as ReadonlyArray<Dailp.MenuItemInput>
    }
    const itemsInput = toMenuItemInput(items)
    const menuInput: Dailp.MenuUpdate = {
      id: menu?.id!,
      name: menuName,
      slug: menu?.slug!,
      items: itemsInput,
    }
    console.log("menuInput", menuInput)
    updateMenu({ menu: menuInput })
  }

  const handleAddNewItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const item = formData.get("add item")
    const itemPath = formData.get("add item path")
    // Reject duplicates: we use path as the id, so block if it already exists
    if (
      items.some((i) => {
        const p = (itemPath as string)?.toString().trim().toLowerCase()
        return i && i.path?.toString().trim().toLowerCase() === p
      })
    ) {
      setErrorMessage("An item with this path already exists.")
      return
    }
    setErrorMessage(null)
    setItems((prev) => [
      ...prev,
      {
        id: undefined,
        label: item as string,
        path: itemPath as string,
        items: [],
      },
    ])
    // clear form data
    formData.set("add item", "")
    formData.set("add item path", "")
    ;(e.target as HTMLFormElement).reset()
  }

  // dennis todo move off of wordpress query and use db query
  //const [{ data }] = Wordpress.useMenuByIdQuery({
  //variables: { id: p.menuID },
  //})
  //const menus = data?.menus?.nodes

  //const menu = menus[0]
  //const menuItems = menu?.menuItems?.nodes
  //if (!menuItems) {
  //return null
  //}

  //const isTopLevel = (a: typeof menuItems[0]) =>
  //!menuItems?.some((b) =>
  //b?.childItems?.nodes?.some((b) => b?.path === a?.path)
  //)

  //const topLevelItems = menuItems?.filter(isTopLevel) || []
  //const [items, setItems] = useState(topLevelItems)

  // old horizontal DnD removed in favor of tree editor DnD

  return (
    <>
      <input
        type="text"
        name="menu name"
        placeholder="Menu Name"
        value={menuName}
        onChange={(e) => setMenuName(e.target.value)}
      />
      <br />
      <br />
      <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
        <h4 style={{ marginTop: 0, marginBottom: 8 }}>Menu Editor</h4>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="top" direction="vertical">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{ minHeight: 12 }}
              >
                <TreeEditor
                  nodes={items}
                  setNodes={setItems}
                  onAddChild={(parentId) =>
                    setItems((prev) =>
                      addChild(prev, parentId, {
                        id: undefined,
                        label: "New Item",
                        path: "",
                        items: [],
                      })
                    )
                  }
                  onRemove={(id, label) => {
                    const ok = confirm(`Delete ${label}?`)
                    if (!ok) return
                    setItems((prev) => removeNode(prev, id))
                  }}
                  onChange={(id, update) =>
                    setItems((prev) => updateNode(prev, id, update))
                  }
                  depth={0}
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <form onSubmit={handleAddNewItem}>
        {errorMessage && (
          <p style={{ color: "#b00020", margin: "0 0 8px" }}>{errorMessage}</p>
        )}
        <input type="text" name="add item" placeholder="Item Label" />
        <input type="text" name="add item path" placeholder="Item Path" />
        <button type="submit">Add Item</button>
      </form>
      <form onSubmit={handleSave}>
        <button type="submit">Save</button>
        <button onClick={() => setItems(withClientIds(menu?.items) as any[])}>
          Reset
        </button>
      </form>

      {/* Inline editor replaces modal */}
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
        {(item.items ?? []).map((child: any) => {
          if (!child) return null
          let url = { pathname: child.path }
          if (child.path && child.path.startsWith("http")) {
            url = new URL(child.path)
          }
          return (
            <MenuItem
              {...menu}
              as="a"
              key={child.path || child.id}
              href={url.pathname}
              aria-current={
                location.pathname === url.pathname ? "page" : undefined
              }
              className={subMenuItems}
              onClick={() => menu.hide()}
            >
              {child.label}
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

const TreeEditor = ({
  nodes,
  setNodes,
  onAddChild,
  onRemove,
  onChange,
  depth = 0,
}: {
  nodes: any[]
  setNodes: (nodes: any[]) => void
  onAddChild: (parentId: string) => void
  onRemove: (id: string, label: string) => void
  onChange: (id: string, update: Partial<any>) => void
  depth?: number
}) => {
  const isTopLevel = depth === 0
  return (
    <ul style={{ listStyle: "none", paddingLeft: isTopLevel ? 12 : 20 }}>
      {nodes.map((n, index) => {
        let dragId = String(n?._cid ?? n?.id ?? n?.path ?? n?.label)
        if (!dragId) {
          dragId = String(index)
        }
        return (
          <Draggable key={dragId} draggableId={dragId} index={index}>
            {(provided, snapshot) => (
              <li
                ref={provided.innerRef}
                {...provided.draggableProps}
                style={{
                  ...provided.draggableProps.style,
                  margin: "6px 0",
                  background: snapshot.isDragging ? "#fafafa" : undefined,
                  borderRadius: 6,
                  padding: 6,
                  touchAction: "manipulation",
                  boxSizing: "border-box",
                  width: "100%",
                  minHeight: 40,
                }}
              >
                <div
                  style={{ display: "flex", gap: 6, alignItems: "center" }}
                  {...provided.dragHandleProps}
                >
                  <span style={{ color: "#666", cursor: "grab" }}>
                    <MdDragIndicator size={16} />
                  </span>
                  <input
                    type="text"
                    placeholder="Label"
                    value={n.label ?? ""}
                    onChange={(e) =>
                      onChange(dragId, { label: e.target.value })
                    }
                    style={{ width: 180, height: 28, lineHeight: "28px" }}
                  />
                  <input
                    type="text"
                    placeholder="Path"
                    value={n.path ?? ""}
                    onChange={(e) => onChange(dragId, { path: e.target.value })}
                    style={{ width: 220, height: 28, lineHeight: "28px" }}
                  />
                  {isTopLevel && (
                    <button type="button" onClick={() => onAddChild(dragId)}>
                      + Subitem
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onRemove(dragId, n.label)}
                  >
                    Delete
                  </button>
                </div>
                {n.items && n.items.length ? (
                  <Droppable
                    droppableId={`child-${dragId}`}
                    direction="vertical"
                    renderClone={undefined}
                  >
                    {(dropProvided) => (
                      <div
                        ref={dropProvided.innerRef}
                        {...dropProvided.droppableProps}
                        style={{ marginLeft: 16, minHeight: 12 }}
                      >
                        <TreeEditor
                          nodes={n.items}
                          setNodes={(childs) =>
                            setNodes(
                              nodes.map((m, i) =>
                                String(m?.id ?? m?.path ?? m?.label) ===
                                  dragId || String(i) === dragId
                                  ? { ...m, items: childs }
                                  : m
                              )
                            )
                          }
                          onAddChild={onAddChild}
                          onRemove={onRemove}
                          onChange={onChange}
                          depth={depth + 1}
                        />
                        {dropProvided.placeholder}
                      </div>
                    )}
                  </Droppable>
                ) : null}
              </li>
            )}
          </Draggable>
        )
      })}
    </ul>
  )
}
