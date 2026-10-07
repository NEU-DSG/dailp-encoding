import React, { useState } from "react"
import { MdClose } from "react-icons/md/index"
import {
  Dialog,
  DialogBackdrop,
  DialogStateReturn,
  useDialogState,
} from "reakit"
import { IconButton } from "src/components"
import * as Dailp from "src/graphql/dailp"
import { AssetLibraryBrowser } from "./asset-library-browser"
import { AssetLibrarySidePanel } from "./asset-library-side-panel"
import { AssetLibraryToolbar } from "./asset-library-toolbar"
import * as css from "./asset-library.css"
import { ContextMenu, useContextMenu } from "./context-menu"
import { MoveModal } from "./move-modal"
import { NameModal } from "./name-modal"
import { SelectionToolbar } from "./selection-toolbar"
import type { SelectedItem, ViewMode } from "./types"
import { UploadPanel } from "./upload-panel"
import { useImageUpload } from "./use-image-upload"
import { useLibraryContents } from "./use-library-contents"
import { useSelection } from "./use-selection"

// An image's extension is kept out of rename so it always matches its contents.
// A leading dot (".hidden") is part of the name, not an extension.
const splitExtension = (filename: string) => {
  const dot = filename.lastIndexOf(".")
  return dot > 0
    ? { base: filename.slice(0, dot), extension: filename.slice(dot) }
    : { base: filename, extension: "" }
}

interface AssetLibraryModalProps {
  // From `useDialogState` in the opening component.
  dialog: DialogStateReturn
  // Called when the user picks an image to place in the page.
  onInsertImage?: (image: Dailp.ImageFieldsFragment) => void
}

/**
 * The asset library browser, as a modal.
 *
 * Owns all of the library's state: current folder, selection, view mode.
 * So everything below it stays presentational.
 */
export const AssetLibraryModal = ({
  dialog,
  onInsertImage,
}: AssetLibraryModalProps) => {
  // The folder being browsed, or null at the root of the library. Held as the
  // whole folder rather than just its path because uploads are recorded against
  // a `folderId`, and navigation always starts from a rendered folder card that
  // already has both.
  const [currentFolder, setCurrentFolder] =
    useState<Dailp.FolderFieldsFragment | null>(null)
  const selection = useSelection()
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [search, setSearch] = useState("")

  const currentPath = currentFolder?.path ?? ""
  const contents = useLibraryContents(currentPath, search)

  const upload = useImageUpload({
    folderId: currentFolder?.id ?? null,
    onUploaded: contents.refetch,
    // One combined dialog per batch: `window.alert` blocks, so alerting per
    // file would make the user dismiss them one at a time (annoying).
    onRejected: (messages) => window.alert(messages.join("\n")),
  })

  const [, createFolder] = Dailp.useCreateFolderMutation()

  const handleCreateFolder = async (name: string) => {
    const result = await createFolder({
      parentId: currentFolder?.id ?? null,
      name,
    })
    if (result.error) window.alert(result.error.message)
    else contents.refetch()
  }

  // Null is the library root, which only the breadcrumbs can navigate to.
  const openFolder = (folder: Dailp.FolderFieldsFragment | null) => {
    setCurrentFolder(folder)
    // Select mode gathers items across folders; otherwise the selection
    // belonged to the folder just left.
    if (!selection.selecting) selection.clear()
    // Opening a result is how you leave a search: the listing has to show the
    // folder you just entered rather than the matches you came from.
    setSearch("")
  }

  const renameDialog = useDialogState()
  const moveDialog = useDialogState()
  const [, renameFolder] = Dailp.useRenameFolderMutation()
  const [, renameImage] = Dailp.useRenameImageMutation()
  const [, moveFolder] = Dailp.useMoveFolderMutation()
  const [, moveImage] = Dailp.useMoveImageMutation()

  // Held items carry stale names and parents once an action lands.
  const afterAction = () => {
    selection.reset()
    contents.refetch()
  }

  const [only] = selection.items
  const currentName =
    only?.kind === "folder"
      ? only.folder.name
      : splitExtension(only?.image.filename ?? "").base

  const handleRename = async (name: string) => {
    if (!only) return
    const result =
      only.kind === "folder"
        ? await renameFolder({ id: only.folder.id, name })
        : await renameImage({
            id: only.image.id,
            filename: name + splitExtension(only.image.filename).extension,
          })
    if (result.error) window.alert(result.error.message)
    else afterAction()
  }

  const handleMove = async (target: Dailp.FolderFieldsFragment | null) => {
    const parentId = target?.id ?? null
    const failures: string[] = []
    // One at a time, so items bound for the same folder clash predictably.
    for (const item of selection.items) {
      const result =
        item.kind === "folder"
          ? await moveFolder({ id: item.folder.id, parentId })
          : await moveImage({ id: item.image.id, folderId: parentId })
      if (result.error) failures.push(result.error.message)
    }
    if (failures.length) window.alert(failures.join("\n"))
    afterAction()
  }

  const contextMenu = useContextMenu()

  const openItemMenu = (item: SelectedItem, event: React.MouseEvent) => {
    event.preventDefault()
    selection.ensureSelected(item)
    contextMenu.openAt(event.clientX, event.clientY)
  }

  // Insertion into the page is a later deliverable, so without a handler this
  // is deliberately inert rather than closing the modal for no reason.
  const insertImage = (image: Dailp.ImageFieldsFragment) => {
    if (!onInsertImage) return
    onInsertImage(image)
    dialog.hide()
  }

  return (
    <DialogBackdrop {...dialog} className={css.backdrop}>
      <Dialog
        {...dialog}
        className={css.dialog}
        aria-label="Asset library"
        // The browser owns focus management for its own items.
        preventBodyScroll
      >
        <header className={css.header}>
          <h2 className={css.headerTitle}>Asset Library</h2>
          <IconButton
            className={css.closeButton}
            onClick={dialog.hide}
            aria-label="Close the asset library"
          >
            <MdClose size={24} />
          </IconButton>
        </header>

        <AssetLibraryToolbar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          path={currentPath}
          onOpenFolder={openFolder}
          onFilesSelected={upload.upload}
          onCreateFolder={handleCreateFolder}
          selecting={selection.selecting}
          onToggleSelecting={selection.toggleSelecting}
          search={search}
          onSearchChange={setSearch}
        />

        {/* Always shown: appearing on the first click would shift the grid
            under the second click of a double-click. */}
        <SelectionToolbar
          count={selection.items.length}
          onClear={selection.clear}
          onRename={renameDialog.show}
          onMove={moveDialog.show}
        />

        <UploadPanel
          items={upload.items}
          onRetry={upload.retry}
          onDismiss={upload.dismiss}
          onClearFinished={upload.clearFinished}
        />

        <div className={css.body}>
          <AssetLibraryBrowser
            folders={contents.folders}
            images={contents.images}
            fetching={contents.fetching}
            error={contents.error}
            viewMode={viewMode}
            isSelected={selection.isSelected}
            onSelect={selection.select}
            onContextMenu={openItemMenu}
            onOpenFolder={openFolder}
            onInsertImage={insertImage}
          />
          <AssetLibrarySidePanel selected={selection.items} />
        </div>

        {/* Before the dialogs, so their focus lands after the menu hands it back. */}
        <ContextMenu
          menu={contextMenu.menu}
          count={selection.items.length}
          onRename={renameDialog.show}
          onMove={moveDialog.show}
        />
        <NameModal
          dialog={renameDialog}
          title="Rename"
          label="Name"
          initialValue={currentName}
          onConfirm={handleRename}
        />
        <MoveModal
          dialog={moveDialog}
          items={selection.items}
          startFolder={currentFolder}
          onConfirm={handleMove}
        />
      </Dialog>
    </DialogBackdrop>
  )
}
