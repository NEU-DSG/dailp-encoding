import { style } from "@vanilla-extract/css"
import { margin, padding } from "polished"
import { hspace, vspace } from "src/style/constants"

export const margined = style(margin(vspace.half, hspace.edge))

export const scrollable = style([
  padding(vspace.half, hspace.edge),
  {
    overflowY: "scroll",
    WebkitOverflowScrolling: "touch",
    width: "100%",
    maxHeight: "75vh",
    minHeight: "20rem",
  },
])

export const closeButton = style({
  position: "absolute",
  top: vspace.half,
  right: hspace.halfEdge,
})
