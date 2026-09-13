import { style } from "@vanilla-extract/css"
import { rgba } from "polished"
import {
  colors,
  fonts,
  hspace,
  layers,
  mediaQueries,
  vspace,
} from "src/style/constants"
import { marginY, media, paddingX } from "src/style/utils"
import {
  centeredColumn,
  fullWidth,
  hideOnPrint,
  row,
  wrappedRow,
} from "src/style/utils.css"

export const header = style([
  paddingX(hspace.edge),
  centeredColumn,
  hideOnPrint,
  {
    backgroundColor: colors.secondary,
    fontFamily: fonts.header,
    position: "sticky",
    top: 0,
    zIndex: layers.second,
    "@media": {
      [mediaQueries.medium]: {
        position: "static",
      },
    },
  },
])

export const headerContents = style([
  fullWidth,
  wrappedRow,
  {
    alignItems: "center",
  },
])

export const subHeader = style({
  display: "none",
  color: colors.secondaryContrast,
  paddingLeft: hspace.edge,
  "@media": {
    [mediaQueries.medium]: {
      display: "initial",
    },
  },
})

export const siteTitle = style([
  marginY(vspace.quarter),
  media(mediaQueries.medium, marginY(vspace.one)),
  {
    // runningHead: "title",
  },
])

export const siteLink = style({
  color: colors.secondaryContrast,
  textDecoration: "none",
})

export const contentContainer = style([row, { alignItems: "baseline" }])

export const iconLink = style({
  color: "inherit",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "44px",
  height: "44px",
  borderRadius: "50%",

  selectors: {
    "&:hover": {
      backgroundColor: rgba("black", 0.15),
    },
  },
})

export const wrapper = style({
  position: "relative",
  display: "inline-flex",
})

export const tooltip = style({
  position: "absolute",
  bottom: "-2.5rem",
  left: "50%",
  transform: "translateX(-50%) translateY(-4px)",
  visibility: "hidden",
  transition: "all 0.15s ease",
  padding: "0.35rem 0.6rem",
  borderRadius: "6px",
  background: "rgba(0,0,0,0.85)",
  color: "white",
  fontSize: "0.8rem",
  whiteSpace: "nowrap",
  pointerEvents: "none",
  zIndex: 1000,

  selectors: {
    [`${wrapper}:hover &`]: {
      opacity: 1,
      visibility: "visible",
      transform: "translateX(-50%) translateY(0)",
    },
  },
})
