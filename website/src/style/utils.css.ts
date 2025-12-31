import { style } from "@vanilla-extract/css"
import { padding } from "polished"
import {
  colors,
  fonts,
  hsize,
  hspace,
  layers,
  mediaQueries,
  rhythm,
  thickness,
  vspace,
} from "./constants"
import { media, paddingX } from "./utils"

export const hideOnPrint = style(media(mediaQueries.print, { display: "none" }))

export const withBg = style([
  hideOnPrint,
  padding(vspace.quarter, hspace.char),
  media(mediaQueries.medium, { maxWidth: "70vw" }),
  {
    backgroundColor: colors.body,
    borderColor: colors.text,
    borderWidth: thickness.thin,
    zIndex: layers.second,
  },
])

const tooltip = style([
  withBg,
  {
    fontFamily: fonts.body,
    color: colors.text,
    fontSize: "0.9rem",
    right: "auto",
  },
])

export const fullWidth = style({
  width: "100%",
  "@media": {
    [mediaQueries.medium]: {
      width: hsize.medium,
    },
    [mediaQueries.large]: {
      width: hsize.large,
    },
  },
})

export const paragraph = style({
  marginBottom: vspace.one,
})

export const closeBlock = style({
  marginBottom: vspace.half,
})

export const edgePadded = style(paddingX(hspace.edge))

export const wrappedRow = style({
  display: "flex",
  flexFlow: "row wrap",
})

export const row = style({
  display: "flex",
  flexFlow: "row nowrap",
})

export const column = style({
  display: "flex",
  flexFlow: "column nowrap",
})

export const centeredColumn = style({
  display: "flex",
  flexFlow: "column nowrap",
  alignItems: "center",
})

export const wrappedColumn = style({
  display: "flex",
  flexFlow: "column wrap",
})

const smallCaps = style([
  {
    fontFamily: fonts.smallCaps,
    fontFeatureSettings: `"smcp"`,
    textTransform: "lowercase",
  },
])

export const std = {
  tooltip,
  fullWidth,
  smallCaps,
}

export const paddedWidth = style(paddingX(hspace.edge))

export const largeDialog = style({
  width: "95vw",
  "@media": {
    [mediaQueries.medium]: {
      width: "35rem",
    },
    [mediaQueries.large]: {
      width: "45rem",
    },
  },
})

export const paddedCenterColumn = style([edgePadded, centeredColumn])

export const paddingAround = style(padding(rhythm(3 / 4), hspace.edge))

export const cardGroup = style({
  paddingTop: "0px",
  display: "flex",
  flexDirection: "row",
  gap: "30px",
  justifyContent: "center",
  alignItems: "stretch",

  "@media": {
    // Mobile (stack cards vertically)
    "screen and (max-width: 600px)": {
      flexDirection: "column",
      alignItems: "center",
    },

    // Tablet (2 cards per row)
    "screen and (min-width: 601px) and (max-width: 900px)": {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
    },

    // Desktop (3–4 cards per row)
    "screen and (min-width: 901px)": {
      flexDirection: "row",
    },
  },
})

export const storyCardGroup = style({
  paddingTop: "100px",
  paddingBottom: "100px",
  display: "flex",
  flexDirection: "row",
  gap: "20px",
  justifyContent: "center",
  alignItems: "stretch",

  "@media": {
    // Mobile (stack cards vertically)
    "screen and (max-width: 600px)": {
      flexDirection: "column",
      alignItems: "center",
    },

    // Tablet (2 cards per row)
    "screen and (min-width: 601px) and (max-width: 900px)": {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
    },

    // Desktop (3–4 cards per row)
    "screen and (min-width: 901px)": {
      flexDirection: "row",
    },
  },
})