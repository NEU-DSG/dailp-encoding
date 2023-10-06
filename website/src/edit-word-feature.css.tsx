import { style } from "@vanilla-extract/css"
import { button } from "src/components/button.css"
import { fonts, hspace, radii, vspace } from "src/style/constants"
import { paddingX, paddingY } from "src/style/utils"

export const form = style({
  display: "flex",
  justifyContent: "flex-end",
  flex: 1,
  margin: 0,
})

export const editPanelButton = style([
  button,
  paddingX(hspace.large),
  paddingY(vspace.medium),
  {
    display: "flex",
    justifyContent: "space-around",
    marginLeft: hspace.small,
  },
])

export const cancelButton = style([
  { fontFamily: fonts.header, width: "4.5rem" },
])

export const formInputLabel = style({
  fontFamily: fonts.header,
  fontWeight: "normal",
  fontSize: "0.9rem",
})

export const dateInputConatiner = style({
  width: "25%",
})

export const formInput = style([
  paddingX(vspace.medium),
  {
    width: "100%",
    borderRadius: radii.medium,
    textOverflow: "ellipsis",
    resize: "none",
  },
])
