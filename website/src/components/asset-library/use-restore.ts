import { useEffect, useRef, useState } from "react"
import { useDialogState } from "reakit"
import * as Dailp from "src/graphql/dailp"
import { splitExtension } from "./format"
import type { SelectedItem } from "./types"

interface UseRestoreOptions {
  onRenamedFolder: (folder: Dailp.FolderFieldsFragment) => void
  onFinished: () => void
}

/**
 * Takes items out of the trash. When a live item has taken an item's name,
 * `prompt` asks for a new name for the live one. Cancelling leaves that item in
 * the trash and moves on to the next.
 */
export function useRestore({ onRenamedFolder, onFinished }: UseRestoreOptions) {
  const [, renameFolder] = Dailp.useRenameFolderMutation()
  const [, renameImage] = Dailp.useRenameImageMutation()
  const [, restoreFolder] = Dailp.useRestoreFolderMutation()
  const [, restoreImage] = Dailp.useRestoreImageMutation()

  // One at a time, the first being in progress: two selected items can clash
  // with each other, and the prompt can only ask about one conflict at once.
  const [queue, setQueue] = useState<readonly SelectedItem[]>([])
  const item = queue[0]
  const failures = useRef<string[]>([])

  const id = item?.kind === "folder" ? item.folder.id : item?.image.id
  const [folderCheck] = Dailp.useFolderRestoreConflictQuery({
    variables: { id },
    pause: item?.kind !== "folder",
    requestPolicy: "network-only",
  })
  const [imageCheck] = Dailp.useImageRestoreConflictQuery({
    variables: { id },
    pause: item?.kind !== "image",
    requestPolicy: "network-only",
  })
  const check = item?.kind === "image" ? imageCheck : folderCheck

  const dialog = useDialogState()
  // The live item in the way, for as long as the prompt is asking about it.
  const [conflict, setConflict] = useState<SelectedItem | null>(null)

  const finishItem = (failure?: string) => {
    if (failure) failures.current.push(failure)
    const rest = queue.slice(1)
    setQueue(rest)
    if (rest.length) return
    if (failures.current.length) window.alert(failures.current.join("\n"))
    failures.current = []
    onFinished()
  }

  const restoreItem = async () => {
    const restored =
      item?.kind === "folder"
        ? await restoreFolder({ id })
        : await restoreImage({ id })
    finishItem(restored.error?.message)
  }

  const askAbout = (existing: SelectedItem) => {
    setConflict(existing)
    dialog.show()
  }

  // When a check finishes rather than whenever its result changes, since
  // renaming the conflict updates that result.
  useEffect(() => {
    if (!item || check.fetching) return
    const folder = folderCheck.data?.folderRestoreConflict
    const image = imageCheck.data?.imageRestoreConflict
    if (check.error) finishItem(check.error.message)
    else if (item.kind === "folder" && folder)
      askAbout({ kind: "folder", folder })
    else if (item.kind === "image" && image) askAbout({ kind: "image", image })
    else restoreItem()
  }, [item, check.fetching])

  // Closing the prompt any way but confirming leaves the item in the trash.
  useEffect(() => {
    if (dialog.visible || !conflict) return
    setConflict(null)
    finishItem()
  }, [dialog.visible])

  const renameConflict = async (name: string) => {
    if (!conflict) return
    setConflict(null)
    const renamed =
      conflict.kind === "folder"
        ? await renameFolder({ id: conflict.folder.id, name })
        : await renameImage({
            id: conflict.image.id,
            filename: name + splitExtension(conflict.image.filename).extension,
          })
    if (renamed.error) return finishItem(renamed.error.message)
    if (conflict.kind === "folder") onRenamedFolder(conflict.folder)
    restoreItem()
  }

  const kind = conflict?.kind ?? "image"
  const conflictName =
    conflict?.kind === "folder"
      ? conflict.folder.name
      : conflict?.image.filename

  return {
    // A repeated click while a selection is being worked through is ignored.
    restore: (items: readonly SelectedItem[]) => {
      if (!queue.length) setQueue(items)
    },
    prompt: {
      dialog,
      title: "Name already in use",
      description: `${
        kind === "image" ? "An" : "A"
      } ${kind} named "${conflictName}" is already in that location. Rename it to restore the one from the trash.`,
      label: `New name for the existing ${kind}`,
      initialValue:
        conflict?.kind === "folder"
          ? conflict.folder.name
          : splitExtension(conflict?.image.filename ?? "").base,
      confirmLabel: "Rename and restore",
      onConfirm: renameConflict,
    },
  }
}
