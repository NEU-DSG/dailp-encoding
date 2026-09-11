import { style } from "@vanilla-extract/css"
import { colors } from "src/style/app-theme-contract.css"
import { radii } from "src/style/design-tokens"
import { cleanButton } from "./button.css"

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
