import { style } from "@vanilla-extract/css"
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
