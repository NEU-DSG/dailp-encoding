import { style } from "@vanilla-extract/css"
import { space, thickness } from "src/style/constants"

export const headerContainer = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  marginBottom: space.large,
})

export const addButton = style({
  position: "absolute",
  right: 0,
  width: "8.625rem",
  height: "2.375rem",
  backgroundColor: "#9f4d43",
  color: "white",
  border: thickness.none,
  cursor: "pointer",
  fontFamily: "Quattrocento Sans, sans-serif",
})
