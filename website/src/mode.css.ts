import { style } from "@vanilla-extract/css"
import sprinkles from "src/sprinkles.css"

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
