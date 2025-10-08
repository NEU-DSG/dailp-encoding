import { style } from "@vanilla-extract/css"
import { fonts, hspace, vspace } from "src/style/constants"
import { marginX, marginY } from "../../../style/utils"

export const commentButton = style([
  marginY(vspace.large),
  { position: "relative", float: "right" },
])

export const wordPanelHeader = style({
  padding: "8px",
  fontFamily: fonts.body,
})

export const editCherHeader = style([
  marginX(hspace.large),
  {
    fontFamily: fonts.cherokee,
    marginTop: vspace.one,
  },
])

export const spacing = style([marginY(vspace.large), marginX(hspace.small)])

export const inputStyling = style([
  marginY(vspace.large),
  marginX(hspace.small),
  { height: "100px", width: "95%" },
])
