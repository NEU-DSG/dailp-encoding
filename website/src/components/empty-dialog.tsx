import React, { ReactNode, useEffect } from "react"
import { Dialog, DialogBackdrop, useDialogState } from "reakit"
import { CloseButton } from "./close-button"
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
        <div className={css.closeButtonContainer}>
          <CloseButton onClick={handleClose} />
        </div>

        {title && <h1 className={css.title}>{title}</h1>}
        {subtitle && <h2 className={css.subtitle}>{subtitle}</h2>}

        <div className={css.body}>{children}</div>
      </Dialog>
    </DialogBackdrop>
  )
}
