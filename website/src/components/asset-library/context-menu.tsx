import React, { MutableRefObject, useMemo, useRef } from "react"
import { Menu, MenuItem, MenuStateReturn, useMenuState } from "reakit"
import * as css from "./asset-library.css"

// One menu for the whole library, opened wherever the pointer is.
export function useContextMenu() {
  const menu = useMenuState({ unstable_fixed: true, placement: "bottom-start" })
  const point = useRef({ x: 0, y: 0 })
  // popper keeps the anchor it was created with, so one object is reused and
  // only its coordinates change between openings.
  const anchor = useMemo(
    () => ({
      getBoundingClientRect: () =>
        new DOMRect(point.current.x, point.current.y, 0, 0),
    }),
    []
  )

  const openAt = (x: number, y: number) => {
    point.current = { x, y }
    // Typed as an element, but popper only reads its rect.
    ;(menu.unstable_referenceRef as MutableRefObject<unknown>).current = anchor
    // When the menu is already open and another card is right-clicked, that card
    // takes focus and reakit queues a hide before this runs. `show()` cancels it;
    // `unstable_update()` moves the menu when it was never hidden (list rows).
    menu.show()
    menu.unstable_update()
  }

  return { menu, openAt }
}

interface ContextMenuProps {
  menu: MenuStateReturn
  count: number
  onRename: () => void
  onMove: () => void
}

export const ContextMenu = ({
  menu,
  count,
  onRename,
  onMove,
}: ContextMenuProps) => {
  const run = (action: () => void) => () => {
    menu.hide()
    action()
  }

  return (
    <Menu {...menu} aria-label="Item actions" className={css.popupMenu}>
      <MenuItem
        {...menu}
        as="button"
        type="button"
        className={css.popupMenuItem}
        disabled={count !== 1}
        onClick={run(onRename)}
      >
        Rename
      </MenuItem>
      <MenuItem
        {...menu}
        as="button"
        type="button"
        className={css.popupMenuItem}
        disabled={count === 0}
        onClick={run(onMove)}
      >
        Move
      </MenuItem>
    </Menu>
  )
}
