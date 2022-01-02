import { style } from "@vanilla-extract/css"
import theme, { typography } from "./theme"

export const breadcrumbs = style({
  fontFamily: theme.fonts.body,
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
      color: theme.colors.text,
    },
  },
})
