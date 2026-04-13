import { style } from "@vanilla-extract/css"
import {
  hspace,
  layers,
  mediaQueries,
  radii,
  space,
  thickness,
  vspace,
} from "src/style/constants"

export const backdrop = style({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: layers.top,
})

export const dialog = style({
  position: "relative",
  backgroundColor: "white",
  borderRadius: radii.large,
  border: `${thickness.thin} solid #585858`,
  padding: `${vspace.one} ${hspace.edge}`,
  width: "90%",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  "@media": {
    [mediaQueries.medium]: {
      width: "28.75rem",
      height: "31.4375rem",
    },
  },
})

export const closeButtonContainer = style({
  position: "absolute",
  top: space.large,
  right: space.large,
})

export const title = style({
  font: `normal 400 1.625rem/1.2 'Charis SIL'`,
  marginBottom: space.large,
  marginTop: 0,
  textAlign: "center",
  color: "black",
})

export const subtitle = style({
  font: `normal 400 1rem/1.2 'Charis SIL'`,
  marginBottom: vspace.quarter,
  marginTop: 0,
  color: "black",
  textAlign: "center",
})

export const body = style({
  font: `normal 400 1.125rem/1.2 'Charis SIL'`,
  textAlign: "center",
  paddingBottom: "4rem",
  "@media": {
    [mediaQueries.medium]: {
      paddingBottom: 0,
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
