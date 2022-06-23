import cx from "classnames"
import React from "react"
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
