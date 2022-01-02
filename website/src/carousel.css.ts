import { style } from "@vanilla-extract/css"
import sprinkles from "src/sprinkles.css"

export const carousel = sprinkles({
  position: "relative",
})

const slideButton = style([
  sprinkles({
    position: "absolute",
    top: 0,
    height: "full",
  }),
  {
    outline: "none",
    border: "none",
    background: "none",
    width: "4rem",
  },
])

export const leftButton = style([slideButton, { left: 0 }])
export const rightButton = style([slideButton, { right: 0 }])

export const centerText = style({ textAlign: "center" })
