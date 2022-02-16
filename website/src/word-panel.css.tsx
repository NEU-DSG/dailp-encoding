import { style } from "@vanilla-extract/css"
import sprinkles, { hspace, mediaQueries, theme, vspace } from "./sprinkles.css"

export const wholePanel = style({
  position: "sticky",
  top: 125,
})

export const wordPanelButton = style({
  lineHeight: 1.5,
  boxSizing: "border-box",
  border: "transparent",
  cursor: "pointer",
  borderRadius: "0.25rem",
  selectors: {
    "&:before": {
      display: "inline-block",
      margin: "4px",
    },
  },
  position: "absolute",
  top: vspace.half,
  right: hspace.halfEdge,
})

export const wordPanelContent = style({
  border: "none",
  borderRadius: "4px",
  padding: "8px",
  position: "relative",
  fontFamily: theme.fonts.cherokee,
  "@media": {
    [mediaQueries.medium]: {
      border: "1px solid #ddd",
    },
  },
})

export const audioContainer = style({ paddingLeft: "40%" })
