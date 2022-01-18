import { globalStyle, style } from "@vanilla-extract/css"
import { vspace } from "src/sprinkles.css"

export const underlined = style({
  borderBottom: "1px solid gray",
  marginBottom: vspace.half,
})

export const margined = style({
  marginBottom: vspace[1.5],
})

export const wordRow = style({
  display: "flex",
  flexFlow: "row",
  marginBottom: vspace.half,
})

export const boldWordRow = style([wordRow, { fontWeight: "bold" }])

globalStyle(`${wordRow} > *`, {
  width: "10rem",
})
