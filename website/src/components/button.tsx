import React from "react"
import { Button as ButtonBase } from "reakit/Button"
import { withClass } from "src/style/utils"
import * as css from "./button.css"

export const Button = withClass(css.button, ButtonBase)
export const IconButton = withClass(css.iconButton, ButtonBase)
export const CleanButton = withClass(css.cleanButton, ButtonBase)
