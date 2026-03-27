import { style } from "@vanilla-extract/css"
import { important } from "polished"
import { colors, fonts, space, thickness, vspace } from "src/style/constants"
import { std } from "src/style/utils.css"

export const headerContainer = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  marginBottom: space.large,
})

export const addButton = style({
  position: "absolute",
  right: 0,
  width: "8.625rem",
  height: "2.375rem",
  backgroundColor: "#9f4d43",
  color: "white",
  border: thickness.none,
  cursor: "pointer",
  fontFamily: "Quattrocento Sans, sans-serif",
})

export const listHeaderContainer = style([
  std.fullWidth,
  important({
    margin: 0,
  }),
  {
    display: "flex",
    position: "sticky",
    flexFlow: "row nowrap",
    height: vspace[1.75],
  },
])

export const listHeaderTab = style({
  borderRadius: 0,
  border: "none",
  flexGrow: 1,
  cursor: "default",
  fontFamily: fonts.header,
  fontSize: "1.1rem",
  backgroundColor: colors.secondary,
  color: colors.secondaryContrast,
  textAlign: "center",
})
