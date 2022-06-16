import { style } from "@vanilla-extract/css"
import { button, centeredColumn, edgePadded } from "src/sprinkles.css"

export const loginHeader = style({
  display: "flex",
  justifyContent: "flex-end",
  flex: 5,
  padding: "8px",
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

export const positionButton = style({ marginLeft: "80%", marginTop: "5%" })

export const submitButton = style([button, { borderRadius: "10%" }])
