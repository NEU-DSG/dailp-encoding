import React, { ReactNode, useEffect } from "react"
import { Button, Dialog, DialogBackdrop, useDialogState } from "reakit"
import { Link } from "src/components"
import { UserGroup } from "src/graphql/dailp"
import * as css from "./change-dialog.css"

interface CancelButtonProps {
  onClick?: () => void
  href?: string
}

export const CancelButton = ({ onClick, href }: CancelButtonProps) => {
  const button = (
    <button type="button" onClick={onClick} className={css.cancelButton}>
      Cancel
    </button>
  )

  return href ? <Link href={href}>{button}</Link> : button
}

interface CloseButtonProps {
  onClick: () => void
  className?: string
}

export const CloseButton = ({ onClick, className }: CloseButtonProps) => {
  return (
    <Button
      className={`${css.closeButton}${className ? ` ${className}` : ""}`}
      onClick={onClick}
      aria-label="Close"
    >
      X
    </Button>
  )
}

interface SubmitButtonProps {
  onClick?: () => void
  type?: "submit" | "button"
  children?: React.ReactNode
  disabled?: boolean
}

export const SubmitButton = ({
  onClick,
  type = "button",
  children = "Submit",
  disabled,
}: SubmitButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={css.submitButton}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

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

const userRoles: { value: UserGroup; label: string }[] = [
  { value: UserGroup.Readers, label: "Reader" },
  { value: UserGroup.Contributors, label: "Contributor" },
  { value: UserGroup.Editors, label: "Editor" },
  { value: UserGroup.Administrators, label: "Admin" },
]

interface RoleDropdownProps
  extends Omit<React.ComponentProps<"select">, "onChange" | "value"> {
  value: UserGroup
  onChange: (role: UserGroup) => void
}

export const RoleDropdown = ({
  value,
  onChange,
  ...props
}: RoleDropdownProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = userRoles.find((r) => r.value === e.target.value)?.value
    if (role) onChange(role)
  }

  return (
    <select
      {...props}
      className={css.roleSelect}
      value={value}
      onChange={handleChange}
    >
      {userRoles.map((r) => (
        <option key={r.value} value={r.value}>
          {r.label}
        </option>
      ))}
    </select>
  )
}
