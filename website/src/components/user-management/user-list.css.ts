import { globalStyle, style } from "@vanilla-extract/css"
import { vspace } from "src/style/constants"

export const scrollable = style({
  maxHeight: "500px",
  overflowY: "auto",
  border: "1px solid #ddd",
  borderRadius: "8px",
  backgroundColor: "#fff",
})

export const userRow = style({
  display: "flex",
  flexFlow: "row",
  marginBottom: vspace.half,
})

globalStyle(`${userRow} > *`, {
  width: "10rem",
})
