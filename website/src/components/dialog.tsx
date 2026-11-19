import React, { ReactNode, useEffect } from "react"
import { Dialog, DialogBackdrop, useDialogState } from "reakit"
import { CancelButton, CloseButton, SubmitButton } from "./button"
import * as css from "./dialog.css"

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

interface DropdownProps {
  label: string
  options: string[]
  value: string
  onChange: (value: string) => void
}

export const Dropdown = ({
  label,
  options,
  value,
  onChange,
}: DropdownProps) => (
  <div className={css.dropdownGroup}>
    <p className={css.dropdownLabel}>{label}</p>
    <select
      className={css.dropdownSelect}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
)
