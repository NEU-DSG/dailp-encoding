import { style } from "@vanilla-extract/css"
import { BiSpaceBar } from "react-icons/bi"
import sprinkles, { fullWidth, row, theme, vspace, wrappedRow } from "src/sprinkles.css"
import { collPanelButton } from "./word-panel.css"

export const highlightedLabel = sprinkles({
  outlineStyle: "dashed",
  outlineColor: "headings",
  outlineWidth: "thick",
})

export const levelGroup = style([
  sprinkles({
    display: { any: "flex", print: "none" },
    marginY: "quarter",
  }),
  {
    flexFlow: "row wrap",
    justifyContent: "center",
  },
])

export const levelLabel = sprinkles({
  marginRight: "edge",
  paddingX: "char",
  cursor: "pointer",
})

export const prefBand = style([
  fullWidth,
  {
    paddingTop: vspace.half,
    paddingBottom: vspace.half,
  },
])

export const prefButton = style([
  collPanelButton
])