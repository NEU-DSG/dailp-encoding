import React, { useEffect, useRef, useState } from "react"
import { Dialog, DialogBackdrop, DialogStateReturn } from "reakit"
import { Button, CleanButton } from "src/components"
import * as css from "./asset-library.css"

interface NameModalProps {
  dialog: DialogStateReturn
  title: string
  label: string
  initialValue?: string
  onConfirm: (name: string) => void
}

/** Asks for a single name. Shared by creating a folder and renaming an item. */
export const NameModal = ({
  dialog,
  title,
  label,
  initialValue = "",
  onConfirm,
}: NameModalProps) => {
  const [value, setValue] = useState(initialValue)
  const input = useRef<HTMLInputElement>(null)

  // The dialog stays mounted between opens, so clear out the last entry.
  useEffect(() => {
    if (dialog.visible) setValue(initialValue)
  }, [dialog.visible, initialValue])

  const name = value.trim()

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!name) return
    onConfirm(name)
    dialog.hide()
  }

  return (
    <DialogBackdrop {...dialog} className={css.smallBackdrop}>
      <Dialog
        {...dialog}
        className={css.smallDialog}
        aria-label={title}
        unstable_initialFocusRef={input}
      >
        <form onSubmit={submit}>
          <h3 className={css.smallDialogTitle}>{title}</h3>
          <label className={css.smallDialogLabel}>
            {label}
            <input
              ref={input}
              className={css.smallDialogInput}
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
          </label>
          <div className={css.smallDialogActions}>
            <CleanButton type="button" onClick={dialog.hide}>
              Cancel
            </CleanButton>
            <Button type="submit" disabled={!name}>
              Confirm
            </Button>
          </div>
        </form>
      </Dialog>
    </DialogBackdrop>
  )
}
