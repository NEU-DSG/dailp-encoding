import { style } from "@vanilla-extract/css"
import { colors, fonts } from "src/sprinkles.css"
import { typography } from "./theme"

export const breadcrumbs = style({
  fontFamily: fonts.body,
  fontWeight: "normal",
  listStyle: "none",
  paddingInlineStart: 0,
  marginBottom: typography.rhythm(1 / 2),
  marginLeft: 0,
  marginTop: 0,
})

export const breadcrumbElement = style({
  display: "inline",
  fontSize: "1rem",
  selectors: {
    "&:after": {
      padding: "0 0.5rem",
      content: `"/"`,
      color: colors.text,
    },
  },
})
