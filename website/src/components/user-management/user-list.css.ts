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
  gap: "1rem",
  alignItems: "center",
})

globalStyle(`${userRow} > *`, {
  width: "10rem",
})

export const usernameCell = style({
  width: "16rem",
})

export const roleCell = style({
  width: "13rem",
})

export const pendingCell = style({
  width: "5rem",
  marginLeft: "-1rem",
  marginRight: "2rem",
})

export const removeCell = style({
  marginRight: 0,
})
