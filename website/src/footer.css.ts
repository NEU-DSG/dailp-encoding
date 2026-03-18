import { style } from "@vanilla-extract/css"
import { padding } from "polished"
import { linkColor } from "src/components/link/link.css"
import { colors, fonts, hspace, vspace } from "src/style/constants"
import { hideOnPrint, std } from "src/style/utils.css"

export const footer = style([hideOnPrint])

export const container = style([
  padding(vspace.one, hspace.edge),
  {
    fontFamily: fonts.header,
    backgroundColor: colors.primary,
    color: colors.body,
    fontSize: "0.9rem",
    display: "flex",
    flexFlow: "column nowrap",
    alignItems: "center",
  },
])

export const dark = style([
  container,
  {
    vars: {
      [linkColor]: "white",
      [colors.focus]: "white",
    },
  },
])

export const image = style({ marginBottom: 0 })

export const content = style([
  std.fullWidth,
  {
    display: "flex",
    flexFlow: "row wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
])

export const light = style([
  container,
  {
    backgroundColor: colors.body,
    color: colors.text,
    justifyContent: "space-evenly",
  },
])
