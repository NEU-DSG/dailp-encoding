import React from "react"
import { Button as ButtonBase, ButtonProps } from "reakit/Button"
import { withClass } from "src/style/utils"
import * as css from "./button.css"

export const Button = withClass(css.button, ButtonBase)
export const CleanButton = withClass(css.cleanButton, ButtonBase)

type IconButtonProps = ButtonProps & {
  round?: boolean
}
export const IconButton = ({ round = true, ...props }: IconButtonProps) => (
  <ButtonBase className={css.iconButton({ round })} {...props} />
)
