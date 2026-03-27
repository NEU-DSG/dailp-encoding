import { style } from "@vanilla-extract/css"
import { space, thickness } from "src/style/constants"

export const closeButton = style({
  width: "2rem",
  height: "1.5rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  backgroundColor: "#965f5a",
  border: `${thickness.thin} solid #5c3b37`,
  font: `normal 400 1rem/1.2 'Charis SIL'`,
  color: "white",
})
