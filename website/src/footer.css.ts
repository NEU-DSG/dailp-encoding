import { style } from "@vanilla-extract/css"
import sprinkles, { std } from "src/sprinkles.css"

export const container = style([
  sprinkles({
    fontFamily: "header",
    paddingY: "one",
    paddingX: "edge",
    color: "body",
    backgroundColor: "footer",
  }),
  {
    fontSize: "0.9rem",
    display: "flex",
    flexFlow: "column nowrap",
    alignItems: "center",
  },
])

export const link = sprinkles({
  color: { any: "body", selected: "header" },
  outlineColor: { selected: "header" },
})

export const image = sprinkles({ marginBottom: 0 })

export const content = style([
  std.fullWidth,
  {
    display: "flex",
    flexFlow: "row wrap",
    justifyContent: "space-between",
  },
])

export const light = style([
  container,
  sprinkles({
    backgroundColor: "altFooter",
  }),
])
