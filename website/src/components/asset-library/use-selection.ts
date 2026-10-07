import { useCallback, useMemo, useState } from "react"
import type { SelectedItem } from "./types"

const idOf = (item: SelectedItem) =>
  item.kind === "folder" ? item.folder.id : item.image.id

/**
 * Outside select mode a click replaces the selection; inside it a click
 * toggles, so items can be gathered across folders.
 */
export function useSelection() {
  // Keyed by id so a refetch, which returns new objects, keeps the selection.
  const [items, setItems] = useState<ReadonlyMap<string, SelectedItem>>(
    () => new Map()
  )
  const [selecting, setSelecting] = useState(false)

  const select = useCallback(
    (item: SelectedItem) => {
      const id = idOf(item)
      setItems((current) => {
        if (!selecting) return new Map([[id, item]])
        const next = new Map(current)
        if (next.has(id)) next.delete(id)
        else next.set(id, item)
        return next
      })
    },
    [selecting]
  )

  // Right-clicking an item already in the selection acts on the whole
  // selection, as file managers do, rather than narrowing it to that item.
  const ensureSelected = useCallback(
    (item: SelectedItem) => {
      if (!items.has(idOf(item))) select(item)
    },
    [items, select]
  )

  const clear = useCallback(() => setItems(new Map()), [])

  const reset = useCallback(() => {
    setItems(new Map())
    setSelecting(false)
  }, [])

  const toggleSelecting = useCallback(() => {
    if (selecting) reset()
    else setSelecting(true)
  }, [selecting, reset])

  const isSelected = useCallback((id: string) => items.has(id), [items])

  return useMemo(
    () => ({
      items: Array.from(items.values()),
      selecting,
      select,
      ensureSelected,
      clear,
      reset,
      toggleSelecting,
      isSelected,
    }),
    [
      items,
      selecting,
      select,
      ensureSelected,
      clear,
      reset,
      toggleSelecting,
      isSelected,
    ]
  )
}
