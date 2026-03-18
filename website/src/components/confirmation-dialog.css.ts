import { style } from "@vanilla-extract/css"
import { mediaQueries, space, vspace } from "src/style/constants"

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
