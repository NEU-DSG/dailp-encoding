import { style } from "@vanilla-extract/css"
import { button, cleanButton } from "src/components/button.css"
import { colors, fonts, hspace, radii, vspace } from "src/style/constants"
import { paddingX, paddingY } from "src/style/utils"

export const form = style({
  display: "flex",
  justifyContent: "flex-end",
  flex: 1,
  margin: 0,
})

export const editPanelButton = style([
  button,
  paddingX(hspace.large),
  paddingY(vspace.medium),
  {
    display: "flex",
    justifyContent: "space-around",
    marginLeft: hspace.small,
  },
])

export const cancelButton = style([
  { fontFamily: fonts.header, width: "4.5rem" },
])

export const formInputLabel = style({
  fontFamily: fonts.header,
  fontWeight: "normal",
  fontSize: "0.9rem",
})

export const formInput = style([
  paddingX(vspace.medium),
  {
    width: "100%",
    borderRadius: radii.medium,
    textOverflow: "ellipsis",
    resize: "none",
  },
])

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
