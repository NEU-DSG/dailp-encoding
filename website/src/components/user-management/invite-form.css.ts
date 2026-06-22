import { style } from "@vanilla-extract/css"
import { radii, space, thickness, vspace } from "src/style/constants"

export const userFieldsContainer = style({
  display: "flex",
  flexDirection: "column",
  marginBottom: vspace.one,
})

export const userFieldsRow = style({
  display: "flex",
  flexDirection: "row",
  gap: space.large,
  alignItems: "flex-start",
  marginBottom: space.large,
})

export const fieldGroup = style({
  display: "flex",
  flexDirection: "column",
  gap: space.small,
})

export const fieldLabel = style({
  font: `normal 400 0.9375rem/1.2 'Charis SIL'`,
})

export const emailInput = style({
  width: "282px",
  height: "1.9375rem",
  border: `${thickness.thin} solid #5c3b37`,
  borderRadius: radii.large,
  padding: `0 ${space.medium}`,
  font: `normal 400 0.9375rem/1.2 'Charis SIL'`,
})

export const messageContainer = style({
  marginBottom: vspace.one,
})

export const messageTextarea = style({
  width: "459px",
  height: "48px",
  border: `${thickness.thin} solid #5c3b37`,
  borderRadius: radii.large,
  padding: space.medium,
  font: `normal 400 0.9375rem/1.2 'Charis SIL'`,
  resize: "vertical",
  display: "block",
})

export const addAnotherContainer = style({
  marginBottom: vspace.one,
})

export const addAnotherButton = style({
  cursor: "pointer",
  border: `${thickness.thin} solid #415373`,
  borderRadius: radii.large,
  backgroundColor: "#415373",
  color: "white",
  font: `normal 400 0.9375rem/1.2 'Charis SIL'`,
  padding: `${space.small} ${space.large}`,
})

export const rowCloseButton = style({
  marginTop: "1rem",
  marginLeft: "-2.9rem",
  alignSelf: "flex-start",
})

export const rowCloseButtonOffset = style({
  position: "relative",
  top: "0.5rem",
  left: "2.5rem",
})

export const actionButtons = style({
  display: "flex",
  gap: space.medium,
})

export const errorMessage = style({
  color: "red",
  background: "#ffe6e6",
  padding: "10px",
  border: `${thickness.thin} solid #ff9999`,
  borderRadius: radii.small,
  marginBottom: vspace.one,
})

export const dialogScrollable = style({
  maxHeight: "20rem",
  overflowY: "auto",
})

export const dialogUsername = style({
  color: "#415373",
})

export const dialogRole = style({
  color: "#9f4d43",
})
