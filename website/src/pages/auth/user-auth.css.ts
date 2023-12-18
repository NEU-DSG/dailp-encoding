import { style } from "@vanilla-extract/css"
import { button } from "src/components/button.css"
import {
  buttonSize,
  colors,
  fonts,
  hspace,
  mediaQueries,
  radii,
  space,
  thickness,
  vspace,
} from "src/style/constants"
import { onFocus, onHover, paddingX, paddingY } from "src/style/utils"
import { centeredColumn, edgePadded, fullWidth } from "src/style/utils.css"

export const loginHeader = style({
  display: "flex",
  justifyContent: "flex-end",
  flex: 6,
})

export const popoverButton = style([
  paddingX(hspace.large),
  paddingY(vspace.medium),
  { margin: 0 },
])

export const skinnyWidth = style([
  fullWidth,
  edgePadded,
  {
    margin: "auto",
    "@media": {
      [mediaQueries.medium]: {
        width: "25rem",
      },
    },
  },
])

export const centeredForm = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
})

export const centeredHeader = style([
  centeredColumn,
  {
    textAlign: "justify",
  },
])

export const loginFormBox = style({
  padding: vspace.medium,
})

export const positionButton = style({
  display: "flex",
  justifyContent: "flex-end",
  marginTop: vspace.large,
})

export const secondaryButton = style([
  {
    borderWidth: thickness.thin,
    borderStyle: "solid",
    margin: vspace.small,
    borderRadius: radii.medium,
    background: "none",
  },
  onHover({
    background: "lightgrey",
  }),
  onFocus(
    {
      borderColor: colors.focus,
    },
    {
      borderColor: colors.primaryDark,
    }
  ),
])

export const loginButton = style([{ margin: 0, borderRadius: radii.medium }])
