import { style } from "@vanilla-extract/css"
import {
  colors,
  hspace,
  mediaQueries,
  radii,
  vspace,
} from "src/style/constants"
import { edgePadded, fullWidth } from "src/style/utils.css"

export const loginHeader = style({
  display: "flex",
  justifyContent: "flex-end",
  flex: 6,
})

export const logoutPopover = style({
  display: "flex",
  flexDirection: "column",
  backgroundColor: colors.body,
  textAlign: "center",
  padding: hspace.large,
  borderRadius: radii.medium,
})

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

export const loginFormBox = style({
  padding: vspace.medium,
})

export const positionButton = style({
  display: "flex",
  justifyContent: "flex-end",
  marginTop: vspace.large,
})

export const loginButton = style([{ margin: 0, borderRadius: radii.medium }])
