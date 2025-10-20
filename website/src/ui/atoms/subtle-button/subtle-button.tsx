import { Button as ButtonBase } from "reakit"
import { withClass } from "src/style/utils"
import { subtleButton } from "./subtle-button.css"

export const SubtleButton = withClass(subtleButton, ButtonBase)
