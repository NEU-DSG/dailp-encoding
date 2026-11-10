import React, { useState } from "react"
import { MdFolder } from "react-icons/md/index"
import { Dialog, DialogBackdrop, DialogStateReturn } from "reakit"
import { Button, CleanButton } from "src/components"
import type * as Dailp from "src/graphql/dailp"
import * as css from "./asset-library.css"
import { Breadcrumbs } from "./breadcrumbs"
import { isWithin } from "./format"
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

export const MoveModal = (p: MoveModalProps) => (
  <DialogBackdrop {...p.dialog} className={css.smallBackdrop}>
    <Dialog {...p.dialog} className={css.smallDialog} aria-label="Move">
      {/* Only mounted while open, so its folders are fetched fresh each time. */}
      {p.dialog.visible && <MovePicker {...p} />}
    </Dialog>
  </DialogBackdrop>
)

const MovePicker = ({
  dialog,
  items,
  startFolder,
  onConfirm,
}: MoveModalProps) => {
  const [location, setLocation] = useState<Folder | null>(startFolder)
  // Until a folder is clicked, the target is the folder being browsed, which is
  // the only way to pick the root.
  const [picked, setPicked] = useState<Folder | null>(null)

  const { folders } = useLibraryContents(location?.path ?? "", "")

  const movingPaths = items.flatMap((item) =>
    item.kind === "folder" ? [item.folder.path] : []
  )
  const isInvalid = (folder: Folder) =>
    movingPaths.some((path) => isWithin(folder.path, path))

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
    <>
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
    </>
  )
}
