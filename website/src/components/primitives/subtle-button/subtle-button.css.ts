import { style } from "@vanilla-extract/css"
import { radii } from "src/style/constants"
import { colors } from "src/style/theme-contract.css"
import { cleanButton } from '../button/button.css'

export const subtleButton = style([
  cleanButton,
  {
    lineHeight: "inherit",
    alignItems: "center",
    gap: 4,
    display: "flex",
    color: colors.text,
    fontWeight: "normal",
    border: `2px solid`,
    borderColor: colors.borders,
    borderRadius: radii.large,
  },
])

export const subtleButtonActive = style([
  subtleButton,
  {
    background: colors.bodyDark,
  },
])
