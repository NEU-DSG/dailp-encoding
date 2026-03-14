import React from "react"
import * as css from "./confirmation-dialog.css"
import { EmptyDialog } from "./empty-dialog"

interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  subtitle?: string
  children: React.ReactNode
  cancelText?: string
  confirmText?: string
}

export const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  subtitle,
  children,
}: ConfirmationDialogProps) => {
  return (
    <EmptyDialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
    >
      {children}

      <div className={css.buttons}>
        <button onClick={onClose} className={css.cancelButton}>
          Cancel
        </button>
        <button onClick={onConfirm} className={css.confirmButton}>
          Submit
        </button>
      </div>
    </EmptyDialog>
  )
}
