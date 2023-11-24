import { style } from "@vanilla-extract/css"
import { marginX, marginY } from "./style/utils"
import {
    fonts,
    hspace,
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
    marginY(vspace.large),
    marginX(hspace.small)
])

export const inputStyling = style([
    marginY(vspace.large),
    marginX(hspace.small),
    {height: "100px",
    width: "95%"}
])