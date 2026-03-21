import { style } from "@vanilla-extract/css"
import { radii, space, thickness, vspace } from "src/style/constants"

export const pageHeader = style({
  font: `normal 400 26px/1.2 'Charis SIL'`,
  color: "black",
  marginBottom: space.small,
})

export const subtitle = style({
  font: `normal 400 0.875rem/1.2 'Charis SIL'`,
  marginBottom: vspace.one,
})

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

export const roleSelect = style({
  width: "129px",
  height: "1.9375rem",
  border: `${thickness.thin} solid #5c3b37`,
  borderRadius: radii.large,
  padding: `0 ${space.small}`,
  font: `normal 400 0.9375rem/1.2 'Charis SIL'`,
  backgroundColor: "#ffffff",
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

export const actionButtons = style({
  display: "flex",
  gap: space.medium,
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
