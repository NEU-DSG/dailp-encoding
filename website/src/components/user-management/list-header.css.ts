import { style } from "@vanilla-extract/css"
import { important } from "polished"
import { colors, fonts, vspace } from "src/style/constants"
import { std } from "src/style/utils.css"

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
