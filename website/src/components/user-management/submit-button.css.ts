import { style } from "@vanilla-extract/css"
import { radii, space, thickness } from "src/style/constants"

export const submitButton = style({
  width: "8.625rem",
  height: "1.9375rem",
  cursor: "pointer",
  border: `${thickness.thin} solid #5c3b37`,
  borderRadius: radii.large,
  backgroundColor: "#415373",
  color: "white",
  font: `normal 400 0.9375rem/1.2 'Charis SIL'`,
})
