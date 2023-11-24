import { style, styleVariants } from "@vanilla-extract/css"
import { marginX, marginY, paddingX, paddingY } from "./style/utils"
import {
    fontSize,
    fonts,
    hspace,
    mediaQueries,
    radii,
    rootFontSize,
    vspace,
  } from "src/style/constants"

export const commentButton = style({
    position: "relative",
    float: "right",
  })

export const editCherHeader = style([
    marginX(hspace.large),
    {
      fontFamily: fonts.cherokee,
      marginTop: vspace.one,
    },
  ])

export const spacing = style([
    marginY(vspace.large)
])