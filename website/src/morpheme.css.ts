import { style } from "@vanilla-extract/css"
import sprinkles from "src/sprinkles.css"

export const margined = sprinkles({
  marginX: "edge",
  marginY: "half",
})

export const scrollable = style([
  sprinkles({
    paddingY: "half",
    paddingX: "edge",
  }),
  {
    overflowY: "scroll",
    WebkitOverflowScrolling: "touch",
    width: "100%",
    maxHeight: "75vh",
    minHeight: "20rem",
  },
])

export const closeButton = style([
  sprinkles({
    position: "absolute",
    top: "half",
    right: "halfEdge",
    padding: 0,
  }),
  {
    cursor: "pointer",
    border: "none",
    background: "none",
  },
])
