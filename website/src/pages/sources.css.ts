import { style } from "@vanilla-extract/css"
import { vspace } from "src/style/constants"
import { fullWidth, paddedWidth } from "src/style/utils.css"

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
