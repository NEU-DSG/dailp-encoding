import { style } from "@vanilla-extract/css"
import {
  colors,
  fonts,
  hspace,
  space,
  thickness,
  vspace,
} from "src/style/constants"
import { marginX, onFocus, onHover, paddingX, paddingY } from "src/style/utils"

export const button = style([
  {
    color: colors.primaryText,
    backgroundColor: colors.primary,
    borderWidth: thickness.thin,
    borderStyle: "solid",
    boxShadow: `${space.small} ${space.small} darkgray`,
    fontFamily: fonts.header,
    ":active": {
      boxShadow: "none",
      transform: "translate(3px, 3px)",
      outline: "none",
    },
    ":disabled": {
      backgroundColor: "lightgray",
      borderColor: "darkgray",
      color: "darkgray",
    },
  },
  onFocus(
    {
      borderColor: colors.focus,
    },
    {
      borderColor: colors.primaryDark,
    }
  ),
  onHover({
    backgroundColor: colors.primaryDark,
  }),
  paddingX(hspace.edge),
  paddingY(vspace.half),
  marginX(hspace.edge),
])

export const iconButton = style([
  {
    padding: space.medium,
    margin: 0,
    borderRadius: "50%",
    background: "none",
    border: "none",
    lineHeight: 0,
  },
  onHover({ backgroundColor: colors.secondaryDark }),
])

export const cleanButton = style({
  padding: space.small,
  background: "none",
  border: "none",
  outline: "none",
  cursor: "pointer",
  margin: 0,
})
