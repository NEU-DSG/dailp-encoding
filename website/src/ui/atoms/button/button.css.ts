import { style } from "@vanilla-extract/css"
import { recipe } from "@vanilla-extract/recipes"
import { rgba } from "polished"
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
    boxShadow: `${space.small} ${space.small} rgba(0,0,0,0.25)`,
    fontFamily: fonts.header,
    ":active": {
      boxShadow: "none",
      transform: `translate(${space.small}, ${space.small})`,
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

export const iconButton = recipe({
  base: [
    {
      padding: space.medium,
      margin: 0,
      background: "none",
      border: "none",
      lineHeight: 0,
    },
    onHover({ backgroundColor: rgba("black", 0.15) }),
  ],
  variants: {
    round: {
      true: { borderRadius: "50%" },
    },
  },
})

export const cleanButton = style({
  padding: space.small,
  background: "none",
  border: "none",
  outline: "none",
  cursor: "pointer",
  margin: 0,
})


