import cx from "classnames"
import React, { ReactNode } from "react"
import { Button as ButtonBase, ButtonProps } from "reakit/Button"
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

type IconTextButtonProps<C extends React.ElementType> = ButtonProps & {
  icon: ReactNode
  children: ReactNode
  as?: C
}

export const IconTextButton = <C extends React.ElementType>({
  icon,
  children,
  as,
  ...props
}: IconTextButtonProps<C>) => {
  const Component = as || ButtonBase

  return (
    <Component {...props}>
      {icon}
      {children}
    </Component>
  )
}
