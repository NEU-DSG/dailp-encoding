import { Button as ButtonBase } from "reakit/Button"
import { button, cleanButton, iconButton } from "src/sprinkles.css"
import { withClass } from "src/style-utils"

export const Button = withClass(button, ButtonBase)
export const IconButton = withClass(iconButton, ButtonBase)
export const CleanButton = withClass(cleanButton, ButtonBase)
