import { globalStyle, style } from "@vanilla-extract/css"
import { vspace } from "src/style/constants"


export const scrollable = style({
  maxHeight: "500px",
  overflowY: "auto",
  borderRadius: "8px",
  padding: "16px",
})

export const userRow = style({
  display: "flex",
  flexFlow: "row",
  marginBottom: vspace.half,
  gap: "32px",
  alignItems: "center",
})

export const headerContainer = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  marginBottom: "20px",
})

export const addButton = style({
  position: "absolute",
  right: 0,
  width: "138px",
  height: "38px",
})

globalStyle(`${userRow} > *`, {
  width: "10rem",
})
