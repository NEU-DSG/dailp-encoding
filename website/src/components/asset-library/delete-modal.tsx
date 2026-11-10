import React from "react"
import { Dialog, DialogBackdrop, DialogStateReturn } from "reakit"
import { Button, CleanButton } from "src/components"
import * as Dailp from "src/graphql/dailp"
import * as css from "./asset-library.css"
import type { SelectedItem } from "./types"

interface DeleteModalProps {
  dialog: DialogStateReturn
  items: readonly SelectedItem[]
  onConfirm: () => void
}

/** Confirms a delete, naming the pages that use any image it would remove. */
export const DeleteModal = ({ dialog, items, onConfirm }: DeleteModalProps) => {
  const folderIds = items.flatMap((item) =>
    item.kind === "folder" ? [item.folder.id] : []
  )
  const imageIds = items.flatMap((item) =>
    item.kind === "image" ? [item.image.id] : []
  )

  const [usage] = Dailp.useImagesInUseQuery({
    variables: { folderIds, imageIds },
    pause: !dialog.visible,
    // Any page saved since the last check can change the answer.
    requestPolicy: "network-only",
  })
  const checking = usage.fetching || (!usage.data && !usage.error)
  const inUse = usage.data?.imagesInUse ?? []

  const confirm = () => {
    onConfirm()
    dialog.hide()
  }

  return (
    <DialogBackdrop {...dialog} className={css.smallBackdrop}>
      <Dialog {...dialog} className={css.smallDialog} aria-label="Delete">
        <h3 className={css.smallDialogTitle}>
          Delete {items.length} {items.length === 1 ? "item" : "items"}
        </h3>
        <p className={css.smallDialogText}>
          {folderIds.length > 0 &&
            "Everything inside a selected folder is deleted with it. "}
          Deleted items can be restored from the trash.
        </p>

        {checking ? (
          <p className={css.smallDialogText}>Checking where these are used…</p>
        ) : usage.error ? (
          <p className={css.usageWarning} role="alert">
            Could not check which pages use these images: {usage.error.message}
          </p>
        ) : (
          inUse.length > 0 && (
            <div role="status">
              <p className={css.usageWarning}>
                These pages use images you are about to delete:
              </p>
              <ul className={css.usageList}>
                {inUse.map(({ image, pages }) => (
                  <li key={image.id} className={css.usageImage}>
                    <strong>{image.filename}</strong>
                    <ul className={css.usagePages}>
                      {pages.map((page) => (
                        <li key={page.pageId} className={css.usagePage}>
                          {page.title} ({page.path})
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          )
        )}

        <div className={css.smallDialogActions}>
          <CleanButton type="button" onClick={dialog.hide}>
            Cancel
          </CleanButton>
          <Button type="button" disabled={checking} onClick={confirm}>
            Delete
          </Button>
        </div>
      </Dialog>
    </DialogBackdrop>
  )
}
