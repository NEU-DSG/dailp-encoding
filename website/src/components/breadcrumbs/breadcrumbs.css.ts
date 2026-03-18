import { style } from "@vanilla-extract/css"
import { colors, fonts, hspace, rhythm } from "src/style/constants"

export const breadcrumbs = style({
  fontFamily: fonts.body,
  fontWeight: "normal",
  listStyle: "none",
  paddingInlineStart: 0,
  marginBottom: rhythm(1 / 2),
  marginLeft: 0,
  marginTop: 0,
})

export const breadcrumbElement = style({
  display: "inline",
  fontSize: "1rem",
  selectors: {
    "&:after": {
      padding: `0 ${hspace.halfEdge}`,
      content: `"/"`,
      color: colors.text,
    },
  },
})
