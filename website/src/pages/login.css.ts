import { style } from "@vanilla-extract/css"
import { button, centeredColumn, edgePadded } from "src/sprinkles.css"

export const loginHeader = style({
  display: "flex",
  justifyContent: "flex-end",
  flex: 5,
  padding: "8px",
})

export const logoutPopover = style({
  display: "flex",
  flexDirection: "column",
  backgroundColor: "white",
  padding: "16px",
  borderRadius: "10%",
  textAlign: "center",
})

export const skinnyWidth = style([
  edgePadded,
  centeredColumn,
  { margin: "auto", width: "35%" },
])

export const centeredForm = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
})

export const loginFormBox = style({ width: "100%", padding: "1%" })

export const positionButton = style({
  display: "flex",
  justifyContent: "flex-end",
  marginTop: "5%",
})

export const submitButton = style([button, { margin: 0, borderRadius: "10%" }])
