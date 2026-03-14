import { style } from "@vanilla-extract/css"

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
  backgroundColor: "#9f4d43",
  color: "white",
  border: "none",
  cursor: "pointer",
  fontFamily: "Quattrocento Sans, sans-serif",
})
