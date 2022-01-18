import { style } from "@vanilla-extract/css"
import { fullWidth, paddedWidth, vspace } from "src/sprinkles.css"

export const apaCitation = style({
  paddingLeft: "4ch",
  textIndent: "-4ch",
  marginBottom: vspace.one,
})

export const wideChild = style([fullWidth, paddedWidth])

export const wideList = style([
  wideChild,
  {
    listStyle: "none",
    marginLeft: 0,
  },
])
