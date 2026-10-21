import React, { useEffect, useRef, useState } from "react"
import { Dialog, DialogBackdrop, DialogStateReturn } from "reakit"
import { Button, CleanButton } from "src/components"
import * as css from "./asset-library.css"

interface EmbedModalProps {
  dialog: DialogStateReturn
  onConfirm: (altText: string, caption: string) => void
}

/** Asks for the alt text and caption an image gets on this page. */
export const EmbedModal = ({ dialog, onConfirm }: EmbedModalProps) => {
  const [altText, setAltText] = useState("")
  const [caption, setCaption] = useState("")
  const altInput = useRef<HTMLInputElement>(null)

  // Both are specific to the page being edited, so each insert starts blank.
  useEffect(() => {
    if (!dialog.visible) return
    setAltText("")
    setCaption("")
  }, [dialog.visible])

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    onConfirm(altText.trim(), caption.trim())
    dialog.hide()
  }

  return (
    <DialogBackdrop {...dialog} className={css.smallBackdrop}>
      <Dialog
        {...dialog}
        className={css.smallDialog}
        aria-label="Insert image"
        unstable_initialFocusRef={altInput}
      >
        <form onSubmit={submit}>
          <h3 className={css.smallDialogTitle}>Insert image</h3>
          <div className={css.smallDialogFields}>
            <label className={css.smallDialogLabel}>
              Alt text (image description)
              <input
                ref={altInput}
                className={css.smallDialogInput}
                value={altText}
                onChange={(event) => setAltText(event.target.value)}
              />
              {!altText.trim() && (
                <span className={css.smallDialogWarning} role="status">
                  Without a description, people using screen readers won't know
                  what this image shows.
                </span>
              )}
            </label>
            <label className={css.smallDialogLabel}>
              Caption (optional)
              <input
                className={css.smallDialogInput}
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
              />
            </label>
          </div>
          <div className={css.smallDialogActions}>
            <CleanButton type="button" onClick={dialog.hide}>
              Cancel
            </CleanButton>
            <Button type="submit">Confirm</Button>
          </div>
        </form>
      </Dialog>
    </DialogBackdrop>
  )
}
