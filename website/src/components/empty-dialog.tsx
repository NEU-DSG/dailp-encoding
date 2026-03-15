import React, { ReactNode, useEffect } from "react"
import { MdClose } from "react-icons/md/index"
import { Button, Dialog, DialogBackdrop, useDialogState } from "reakit"
import * as css from "./empty-dialog.css"

interface EmptyDialogProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  children: ReactNode
}

export const EmptyDialog = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
}: EmptyDialogProps) => {
  const dialog = useDialogState()

  useEffect(() => {
    if (isOpen) {
      dialog.show()
    } else {
      dialog.hide()
    }
  }, [isOpen])

  const handleClose = () => {
    onClose()
    dialog.hide()
  }

  return (
    <DialogBackdrop {...dialog} className={css.backdrop}>
      <Dialog
        {...dialog}
        className={css.dialog}
        aria-label={title || "Dialog"}
        hideOnClickOutside={false}
      >
        <Button
          className={css.closeButton}
          onClick={handleClose}
          aria-label="Close dialog"
        >
          X
        </Button>

        {title && <h1 className={css.title}>{title}</h1>}
        {subtitle && <h2 className={css.subtitle}>{subtitle}</h2>}

        <div className={css.body}>{children}</div>
      </Dialog>
    </DialogBackdrop>
  )
}
