import { style } from "@vanilla-extract/css"
import sprinkles, { mediaQueries } from "src/sprinkles.css"

export const floatingControls = sprinkles({
  position: "absolute",
  right: "halfEdge",
  bottom: "half",
  backgroundColor: "body",
})

export const control = sprinkles({ display: "block" })

export const pageNav = style([
  sprinkles({ display: { print: "none" } }),
  {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
])

export const pageImage = sprinkles({
  width: "full",
  height: "auto",
  marginBottom: "small",
})

export const caption = sprinkles({
  marginTop: "half",
  marginX: "edge",
})

export const annotationFigure = sprinkles({
  width: "full",
  marginBottom: "double",
})

export const transformWrapper = style({
  position: "relative",
  cursor: "grab",
  maxHeight: "20rem",
  "@media": {
    [mediaQueries.medium]: { maxHeight: "30rem" },
    [mediaQueries.print]: { maxHeight: "initial" },
  },
})

export const transformContent = sprinkles({ width: "full" })
