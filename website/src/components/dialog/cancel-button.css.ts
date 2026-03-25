import { style } from "@vanilla-extract/css"
import { radii, space, thickness } from "src/style/constants"

export const cancelButton = style({
  width: "8.625rem",
  height: "1.9375rem",
  cursor: "pointer",
  border: `${thickness.thin} solid #5c3b37`,
  borderRadius: radii.large,
  backgroundColor: "#ffffff",
  font: `normal 400 0.9375rem/1.2 'Charis SIL'`,
})
