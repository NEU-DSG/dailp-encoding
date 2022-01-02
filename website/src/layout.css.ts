import { style } from "@vanilla-extract/css"
import sprinkles, {
  centeredColumn,
  colors,
  fullWidth,
  hspace,
  row,
  theme,
  wrappedRow,
} from "src/sprinkles.css"
import { paddingX } from "src/style-utils"

export const header = style([
  paddingX(hspace.edge),
  centeredColumn,
  {
    backgroundColor: colors.header,
    fontFamily: theme.fonts.header,
  },
])

export const headerContents = style([
  fullWidth,
  wrappedRow,
  {
    justifyContent: "space-between",
    alignItems: "center",
  },
])

export const subHeader = style([
  sprinkles({ display: { any: "none", medium: "initial" } }),
  {
    color: colors.headings,
    paddingLeft: hspace.edge,
  },
])

export const siteTitle = style([
  sprinkles({ marginY: { any: "quarter", medium: "one" } }),
  {
    // runningHead: "title",
  },
])

export const siteLink = style({
  color: colors.headings,
  textDecoration: "none",
})

export const contentContainer = style([row, { alignItems: "baseline" }])
