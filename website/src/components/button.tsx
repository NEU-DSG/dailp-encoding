import cx from "classnames"
import React, { ReactNode } from "react"
import { Button as ButtonBase, ButtonProps } from "reakit"
import { withClass } from "src/style/utils"
import * as css from "./button.css"

export const Button = withClass(css.button, ButtonBase)
export const CleanButton = withClass(css.cleanButton, ButtonBase)

type IconButtonProps = ButtonProps & {
  round?: boolean
}
export const IconButton = ({
  round = true,
  className,
  ...props
}: IconButtonProps) => (
  <ButtonBase {...props} className={cx(css.iconButton({ round }), className)} />
)

// Definition for a button with an icon along with text.
type IconTextButtonProps = ButtonProps & {
  icon: ReactNode
  children: ReactNode
  as?: React.FC
}

export const IconTextButton = ({
  icon,
  children,
  as,
  ...props
}: IconTextButtonProps) => {
  const Component = as || ButtonBase
  return (
    <Component {...props}>
      {icon}
      {children}
    </Component>
  )
}
