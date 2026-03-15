import { style } from "@vanilla-extract/css"
import {
  hspace,
  mediaQueries,
  radii,
  space,
  thickness,
  vspace,
} from "src/style/constants"

export const buttons = style({
  display: "flex",
  gap: space.medium,
  justifyContent: "space-between",
  marginTop: vspace.one,
  "@media": {
    [mediaQueries.medium]: {
      position: "absolute",
      bottom: "4.1875rem",
      left: "3.5rem",
      right: "3.5rem",
      marginTop: 0,
    },
  },
})

export const cancelButton = style({
  width: "8.625rem",
  height: "1.9375rem",
  cursor: "pointer",
  border: `${thickness.thin} solid #5c3b37`,
  borderRadius: radii.large,
  backgroundColor: "#ffffff",
  font: `normal 400 0.9375rem/1.2 'Charis SIL'`,
})

export const confirmButton = style({
  width: "8.625rem",
  height: "1.9375rem",
  cursor: "pointer",
  border: `${thickness.thin} solid #5c3b37`,
  borderRadius: radii.large,
  backgroundColor: "#415373",
  color: "white",
  font: `normal 400 0.9375rem/1.2 'Charis SIL'`,
})
