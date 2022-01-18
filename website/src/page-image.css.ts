import { globalStyle, style } from "@vanilla-extract/css"
import sprinkles, {
  colors,
  hspace,
  mediaQueries,
  vspace,
} from "src/sprinkles.css"
import { marginX } from "./style-utils"

export const floatingControls = style({
  position: "absolute",
  right: hspace.halfEdge,
  bottom: vspace.half,
  backgroundColor: colors.body,
  display: "block",
})

globalStyle(`${floatingControls} > *`, {
  display: "block",
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

export const pageImage = style({
  width: "100%",
  height: "auto",
  marginBottom: vspace.small,
})

export const caption = style({
  marginTop: vspace.half,
  ...marginX(hspace.edge),
})

export const annotationFigure = style({
  width: "100%",
  marginBottom: vspace.double,
  marginLeft: 0,
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
