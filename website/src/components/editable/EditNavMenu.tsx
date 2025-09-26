import React, { useEffect, useState } from "react"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import { MdDragIndicator } from "react-icons/md/index"
import * as Dailp from "src/graphql/dailp"

// Stable identifiers for items: prefer backend id, then clientId
const idOf = (n: any): string => {
  if (!n) return ""
  const persistedId = n?.id != null ? String(n.id) : ""
  const clientId = n?.clientId != null ? String(n.clientId) : ""
  return persistedId || clientId
}

const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2)}`

const withClientIds = (nodes: readonly any[] | undefined): any[] =>
  (nodes ?? []).map((n) => ({
    ...n,
    clientId: idOf(n) || generateId(),
    items: n?.items ? withClientIds(n.items) : n.items,
  }))

const normalizePath = (p: unknown): string =>
  (p ?? "").toString().trim().toLowerCase()

const collectPaths = (
  nodes: readonly any[] | undefined,
  acc: string[] = []
): string[] => {
  if (!nodes) return acc
  for (const n of nodes) {
    const np = normalizePath(n?.path)
    if (np) acc.push(np)
    if (n?.items?.length) collectPaths(n.items, acc)
  }
  return acc
}

const findDuplicatePaths = (nodes: readonly any[] | undefined): string[] => {
  const paths = collectPaths(nodes)
  const seen = new Set<string>()
  const dups = new Set<string>()
  for (const p of paths) {
    if (seen.has(p)) dups.add(p)
    else seen.add(p)
  }
  return Array.from(dups)
}

export const EditableNavMenu = ({ navMenuSlug }: { navMenuSlug: string }) => {
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

  // Sync editable items when menu loads/changes
  useEffect(() => {
    setItems(withClientIds(menu?.items))
    setMenuName(menu?.name ?? "no name")
  }, [menu])

  if (!menu) {
    return null
  }

  const updateNode = (arr: any[], id: string, update: Partial<any>): any[] =>
    arr.map((n) =>
      idOf(n) === id
        ? { ...n, ...update }
        : { ...n, items: n?.items ? updateNode(n.items, id, update) : n.items }
    )

  const addChild = (arr: any[], parentId: string, child: any): any[] =>
    arr.map((n) =>
      idOf(n) === parentId
        ? { ...n, items: [...(n.items ?? []), { ...child }] }
        : {
            ...n,
            items: n?.items ? addChild(n.items, parentId, child) : n.items,
          }
    )

  const removeNode = (arr: any[], id: string): any[] =>
    arr
      .filter((n) => idOf(n) !== id)
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
    const { source, destination, type } = result
    if (!destination) return

    // Disallow cross-droppable moves for simplicity
    if (source.droppableId !== destination.droppableId) return

    if (type === "MENU_ITEMS") {
      setItems((prev) => reorder(prev, source.index, destination.index))
      return
    }

    // Handle nested items - type is the parent's dragId
    const parentId = type
    setItems((prev) =>
      prev.map((p: any) => {
        if (idOf(p) !== parentId) return p
        const children = p.items ?? []
        const next = reorder(children, source.index, destination.index)
        return { ...p, items: next }
      })
    )
  }

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const dupPaths = findDuplicatePaths(items)
    if (dupPaths.length) {
      setErrorMessage(
        `Duplicate path(s) found: ${dupPaths.join(", ")}. Paths must be unique.`
      )
      return
    }
    setErrorMessage(null)
    //console.log("save", items, menuName)
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
      items: itemsInput,
    }
    //console.log("menuInput", menuInput)
    updateMenu({ menu: menuInput })
  }

  const handleAddNewItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const item = formData.get("add item")
    const itemPath = formData.get("add item path")
    // Reject duplicates across entire tree
    const np = normalizePath(itemPath as string)
    if (np && findDuplicatePaths([...items, { path: np }]).includes(np)) {
      setErrorMessage("An item with this path already exists.")
      return
    }
    setErrorMessage(null)
    setItems((prev) => [
      ...prev,
      {
        id: undefined,
        clientId: generateId(),
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
          <Droppable droppableId="top" type="MENU_ITEMS" direction="vertical">
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
                        clientId: generateId(),
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
        <button onClick={() => setItems(withClientIds(menu?.items))}>
          Reset
        </button>
      </form>

      {/* Inline editor replaces modal */}
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
        const dragId = idOf(n)
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
                    type={`${dragId}`}
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
                                idOf(m) === dragId ? { ...m, items: childs } : m
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
