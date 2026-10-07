import React, { useEffect, useState } from "react"
import { MdFolder } from "react-icons/md/index"
import { Dialog, DialogBackdrop, DialogStateReturn } from "reakit"
import { Button, CleanButton } from "src/components"
import type * as Dailp from "src/graphql/dailp"
import * as css from "./asset-library.css"
import { Breadcrumbs } from "./breadcrumbs"
import type { SelectedItem } from "./types"
import { useLibraryContents } from "./use-library-contents"

type Folder = Dailp.FolderFieldsFragment

interface MoveModalProps {
  dialog: DialogStateReturn
  items: readonly SelectedItem[]
  startFolder: Folder | null
  // Null is the library root.
  onConfirm: (target: Folder | null) => void
}

export const MoveModal = ({
  dialog,
  items,
  startFolder,
  onConfirm,
}: MoveModalProps) => {
  const [location, setLocation] = useState<Folder | null>(startFolder)
  // Until a folder is clicked, the target is the folder being browsed, which is
  // the only way to pick the root.
  const [picked, setPicked] = useState<Folder | null>(null)

  useEffect(() => {
    if (!dialog.visible) return
    setLocation(startFolder)
    setPicked(null)
  }, [dialog.visible, startFolder])

  const { folders } = useLibraryContents(location?.path ?? "", "")

  // Paths are ltree labels joined by ".", so a descendant is a prefix match.
  const movingPaths = items.flatMap((item) =>
    item.kind === "folder" ? [item.folder.path] : []
  )
  const isInvalid = (folder: Folder) =>
    movingPaths.some(
      (path) => folder.path === path || folder.path.startsWith(`${path}.`)
    )

  const open = (folder: Folder | null) => {
    setLocation(folder)
    setPicked(null)
  }

  const target = picked ?? location
  const targetInvalid = target !== null && isInvalid(target)

  const confirm = () => {
    onConfirm(target)
    dialog.hide()
  }

  return (
    <DialogBackdrop {...dialog} className={css.smallBackdrop}>
      <Dialog {...dialog} className={css.smallDialog} aria-label="Move">
        <h3 className={css.smallDialogTitle}>
          Move {items.length} {items.length === 1 ? "item" : "items"}
        </h3>
        <Breadcrumbs path={location?.path ?? ""} onOpenFolder={open} />

        <ul className={css.pickerList}>
          {folders.length === 0 && (
            <li className={css.emptyMessage}>No folders here.</li>
          )}
          {folders.map((folder) => (
            <li key={folder.id}>
              <button
                type="button"
                className={
                  picked?.id === folder.id
                    ? css.pickerItem.picked
                    : css.pickerItem.idle
                }
                disabled={isInvalid(folder)}
                aria-pressed={picked?.id === folder.id}
                onClick={() => setPicked(folder)}
                onDoubleClick={() => open(folder)}
              >
                <MdFolder size={20} aria-hidden />
                {folder.name}
              </button>
            </li>
          ))}
        </ul>

        <p className={css.pickerMessage}>
          {targetInvalid
            ? "A folder can't be moved into itself."
            : `Move to "${target?.name ?? "Library"}" directory`}
        </p>
        <div className={css.smallDialogActions}>
          <CleanButton type="button" onClick={dialog.hide}>
            Cancel
          </CleanButton>
          <Button type="button" disabled={targetInvalid} onClick={confirm}>
            Confirm
          </Button>
        </div>
      </Dialog>
    </DialogBackdrop>
  )
}
