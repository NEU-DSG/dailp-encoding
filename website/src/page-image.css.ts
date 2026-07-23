import { globalStyle, style } from "@vanilla-extract/css"
import { colors, hspace, mediaQueries, vspace } from "src/style/constants"
import { marginX } from "src/style/utils"
import { hideOnPrint } from "src/style/utils.css"

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

export const control = style({ display: "block" })

export const pageNav = style([
  hideOnPrint,
  {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    "@media": {
      print: { display: "none" },
    },
  },
])

export const pageImage = style({
  width: "100%",
  height: "auto",
  marginBottom: vspace.small,
  "@media": {
    [mediaQueries.print]: {
      WebkitPrintColorAdjust: "exact",
      printColorAdjust: "exact",
      width: "482px",
      height: "auto",
      maxHeight: "600px",
      objectFit: "contain",
      display: "block",
      margin: "0 auto",
      breakAfter: "page",
    },
  },
})

globalStyle(`.${pageImage}:last-of-type`, {
  "@media": {
    [mediaQueries.print]: {
      breakAfter: "auto",
    },
  },
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

export const transformContent = style({ width: "100%" })
