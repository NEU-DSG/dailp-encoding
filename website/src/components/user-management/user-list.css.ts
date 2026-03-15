import { globalStyle, style } from "@vanilla-extract/css"
import { radii, space, vspace } from "src/style/constants"

export const scrollable = style({
  maxHeight: "31.25rem",
  overflowY: "auto",
  borderRadius: radii.large,
  padding: space.large,
})

export const userRow = style({
  display: "flex",
  flexFlow: "row",
  marginBottom: vspace.half,
  gap: "2rem",
  alignItems: "center",
})

globalStyle(`${userRow} > *`, {
  width: "10rem",
})
