import cx from "classnames"
import React, { ReactElement, ReactNode, forwardRef } from "react"
import { Button as ButtonBase, ButtonProps } from "reakit"
import { withClass } from "src/style/utils"
import * as css from "./button.css"

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
  as?: React.FC<any>
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
