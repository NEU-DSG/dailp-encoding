import React from "react"
import { CancelButton } from "./cancel-button"
import * as css from "./confirmation-dialog.css"
import { EmptyDialog } from "./empty-dialog"
import { SubmitButton } from "./submit-button"

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
        <CancelButton onClick={onClose} />
        <SubmitButton onClick={onConfirm} />
      </div>
    </EmptyDialog>
  )
}
