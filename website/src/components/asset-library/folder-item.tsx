import React from "react"
import { MdFolder } from "react-icons/md/index"
import type * as Dailp from "src/graphql/dailp"
import * as css from "./asset-library.css"
import { formatBytes, formatDate } from "./format"

interface FolderItemProps {
  folder: Dailp.FolderFieldsFragment
  selected: boolean
  onSelect: () => void
  onOpen: () => void
}

/**
 * Folder-specific presentation, shared by both layouts. Keeping it here means
 * the grid card and the list row stay thin and can diverge freely without
 * duplicating what a folder *is*.
 */
export function useFolderDisplay(folder: Dailp.FolderFieldsFragment) {
  return {
    label: folder.name,
    type: "Folder",
    size: formatBytes(folder.sizeBytes),
    created: formatDate(folder.createdAt),
  }
}

export const FolderGridCard = (p: FolderItemProps) => {
  const display = useFolderDisplay(p.folder)
  return (
    <button
      type="button"
      className={
        p.selected ? css.folderCard.selected : css.folderCard.unselected
      }
      onClick={p.onSelect}
      onDoubleClick={p.onOpen}
      aria-label={`Folder ${display.label}`}
    >
      <MdFolder size={22} aria-hidden />
      <span className={css.itemName}>{display.label}</span>
    </button>
  )
}

export const FolderListRow = (p: FolderItemProps) => {
  const display = useFolderDisplay(p.folder)
  return (
    <tr
      className={p.selected ? css.listRow.selected : css.listRow.unselected}
      onClick={p.onSelect}
      onDoubleClick={p.onOpen}
    >
      <td className={css.listCell}>
        <div className={css.listNameCell}>
          <MdFolder size={20} aria-hidden />
          <span className={css.itemName}>{display.label}</span>
        </div>
      </td>
      <td className={css.listMetaCell}>{display.type}</td>
      <td className={css.listMetaCell}>{display.size}</td>
      <td className={css.listMetaCell}>{display.created}</td>
    </tr>
  )
}
