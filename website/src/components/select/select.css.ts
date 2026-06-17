import { style } from "@vanilla-extract/css"
import { padding } from "polished"
import { fonts, hspace, vspace } from "src/style/constants"

const spaceToSide = hspace.halfEdge

export const select = style({
  ...padding(vspace.quarter, spaceToSide),
  fontFamily: fonts.header,
})

export const label = style({
  // paddingLeft: spaceToSide,
  // marginLeft: 5,
  fontFamily: fonts.header,
})
