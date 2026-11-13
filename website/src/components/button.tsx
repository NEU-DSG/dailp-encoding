import cx from "classnames"
import React, { ReactElement, ReactNode, forwardRef } from "react"
import { Button as ButtonBase, ButtonProps } from "reakit"
import { withClass } from "src/style/utils"
import * as css from "./button.css"
import Link from "./link"

export const Button = withClass(css.button, ButtonBase)
export const CleanButton = withClass(css.cleanButton, ButtonBase)

type IconButtonProps = ButtonProps & {
  round?: boolean
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ round = true, className, ...props }, ref) => (
    <ButtonBase
      {...props}
      ref={ref}
      className={cx(css.iconButton({ round }), className)}
    />
  )
)

// Definition for a button with an icon along with text.
type IconTextButtonProps = ButtonProps & {
  icon: ReactNode
  children: ReactNode
  as?: React.FC
}

export const IconTextButton = forwardRef<
  HTMLButtonElement,
  IconTextButtonProps
>(({ icon, children, as, ...props }, ref) => {
  const Component = as || ButtonBase

  return (
    <Component {...props} ref={ref}>
      {icon}
      {children}
    </Component>
  )
})

interface CancelButtonProps {
  onClick?: () => void
  href?: string
  children?: React.ReactNode
}

export const CancelButton = ({
  onClick,
  href,
  children = "Cancel",
}: CancelButtonProps) => {
  const button = (
    <button
      type="button"
      onClick={onClick}
      className={css.dialogButton({ kind: "cancel" })}
    >
      {children}
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
    <ButtonBase
      className={cx(css.dialogButton({ kind: "close" }), className)}
      onClick={onClick}
      aria-label="Close"
    >
      X
    </ButtonBase>
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
      className={css.dialogButton({ kind: "submit" })}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
