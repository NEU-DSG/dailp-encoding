import { style } from "@vanilla-extract/css"
import { radii, thickness } from "src/style/constants"

export const roleSelect = style({
  width: "8rem",
  height: "1.9375rem",
  appearance: "none",
  backgroundColor: "white",
  border: `${thickness.thin} solid black`,
  borderRadius: radii.large,
  padding: "0 1.75rem 0 0.5rem",
  font: `normal 400 0.9375rem/1.2 'Charis SIL'`,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpolygon points='0,0 10,0 5,6' fill='%239f4d43'/%3E%3C/svg%3E"), linear-gradient(to left, #f8eeed 1.75rem, white 1.75rem)`,
  backgroundRepeat: "no-repeat, no-repeat",
  backgroundPosition: "right 0.6rem center, 0 0",
  backgroundSize: "auto, 100%",
  cursor: "pointer",
})
