import React, { useState } from "react"
import { MdClose } from "react-icons/md/index"
import { Dialog, DialogBackdrop, DialogStateReturn } from "reakit"
import { IconButton } from "src/components"
import type * as Dailp from "src/graphql/dailp"
import { AssetLibraryBrowser } from "./asset-library-browser"
import { AssetLibrarySidePanel } from "./asset-library-side-panel"
import { AssetLibraryToolbar } from "./asset-library-toolbar"
import * as css from "./asset-library.css"
import type { Selection, ViewMode } from "./types"
import { UploadPanel } from "./upload-panel"
import { useImageUpload } from "./use-image-upload"
import { useLibraryContents } from "./use-library-contents"

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
  const [selected, setSelected] = useState<Selection | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("grid")

  const currentPath = currentFolder?.path ?? ""
  const contents = useLibraryContents(currentPath)

  const upload = useImageUpload({
    folderId: currentFolder?.id ?? null,
    onUploaded: contents.refetch,
    // One combined dialog per batch: `window.alert` blocks, so alerting per
    // file would make the user dismiss them one at a time (annoying).
    onRejected: (messages) => window.alert(messages.join("\n")),
  })

  const openFolder = (folder: Dailp.FolderFieldsFragment) => {
    setCurrentFolder(folder)
    // The previous selection lives in a folder we just left.
    setSelected(null)
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
          uploading={upload.items.some(
            (item) => item.status !== "done" && item.status !== "failed"
          )}
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
            selected={selected}
            onSelect={setSelected}
            onOpenFolder={openFolder}
            onInsertImage={insertImage}
          />
          <AssetLibrarySidePanel selected={selected} />
        </div>
      </Dialog>
    </DialogBackdrop>
  )
}
