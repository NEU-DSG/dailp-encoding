import { style } from "@vanilla-extract/css"

export const carousel = style({
  position: "relative",
})

const slideButton = style({
  position: "absolute",
  top: 0,
  height: "100%",
  outline: "none",
  border: "none",
  background: "none",
  width: "4rem",
})

export const leftButton = style([slideButton, { left: 0 }])
export const rightButton = style([slideButton, { right: 0 }])

export const centerText = style({ textAlign: "center" })
