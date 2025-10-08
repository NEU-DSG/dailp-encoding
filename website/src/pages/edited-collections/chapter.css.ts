import { globalStyle, style } from "@vanilla-extract/css"
import { hspace, mediaQueries } from "src/style/constants"
import { paddingX, paddingY } from "src/style/utils"
import { std } from "src/style/utils.css"

export const docHeader = style([
  std.fullWidth,
  paddingY(0),
  paddingX(hspace.edge),
  {
    "@media": {
      [mediaQueries.print]: paddingX(0),
    },
  },
])

export const wordpressContentFix = style({
  width: "100%",
  maxWidth: "100%",
  overflow: "hidden",
  overflowX: "auto",
  WebkitOverflowScrolling: "touch",
})

// Use globalStyle for child element targeting:
globalStyle(
  `${wordpressContentFix} h1, ${wordpressContentFix} h2, ${wordpressContentFix} h3, ${wordpressContentFix} h4, ${wordpressContentFix} h5, ${wordpressContentFix} h6`,
  {
    clear: "both",
    width: "100%",
    float: "none",
    display: "block",
    marginBottom: "1rem",
  }
)

globalStyle(`${wordpressContentFix} p, ${wordpressContentFix} div`, {
  clear: "both",
  width: "100%",
  float: "none",
  maxWidth: "100%",
  paddingLeft: "min(var(--padding-left, 0px), 2rem) !important",
  paddingRight: "min(var(--padding-right, 0px), 2rem) !important",
})

globalStyle(`${wordpressContentFix} img`, {
  maxWidth: "100%",
  height: "auto",
  float: "none",
  display: "block",
  margin: "0 auto 1rem auto",
})

globalStyle(`${wordpressContentFix} table`, {
  width: "100%",
  maxWidth: "100%",
  tableLayout: "auto",
  wordWrap: "break-word",
  fontSize: "0.8rem",
})

globalStyle(
  `${wordpressContentFix} table td, ${wordpressContentFix} table th`,
  {
    padding: "0.4rem 0.2rem",
    overflow: "hidden",
    verticalAlign: "top",
    width: "auto",
    minWidth: "0px",
    maxWidth: "calc(50vw - 2rem)",
  }
)

globalStyle(`${wordpressContentFix} table th`, {
  fontWeight: "bold",
})

globalStyle(`${wordpressContentFix} table td`, {
  lineHeight: "1.2",
})

globalStyle(`${wordpressContentFix} table td img`, {
  width: "auto !important", // Override inline width="300"
  height: "auto !important", // Override inline height="300"
  minWidth: "calc(25vw) !important",
  display: "inline-block !important",
  verticalAlign: "top !important",
})

// Specific rules for tables with many columns (eg. 5 or more) making them scrollable
// Compromise between readability and usability
globalStyle(`${wordpressContentFix} table:has(tr td:nth-child(5))`, {
  minWidth: "max-content", // Wide tables can go as wide as needed
  whiteSpace: "nowrap",
})

globalStyle(`${wordpressContentFix} pre`, {
  whiteSpace: "pre-wrap",
  wordWrap: "break-word",
  overflowX: "auto",
  maxWidth: "100%",
  margin: "0 0 1rem 0",
  padding: "0.5rem",
  fontSize: "0.85rem",
})
