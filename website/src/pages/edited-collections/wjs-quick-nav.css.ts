import { style } from "@vanilla-extract/css"
import { fonts } from "src/style/constants"

export const quickNav = style({
  display: "flex",
  flexDirection: "row",
})

export const navButtonStyle = style({
  border: "2px solid white",
  padding: "8px 16px",
  backgroundColor: "#7B2830",
  color: "white",
  fontFamily: fonts.header,
  ":hover": {
    backgroundColor: "#A33842",
  },
})
