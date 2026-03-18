import { style } from "@vanilla-extract/css"
import { button } from "src/components/button/button.css"
import {
  buttonSize,
  fontSize,
  fonts,
  hspace,
  radii,
  vspace,
} from "src/style/constants"
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

export const editPanelButtonSmall = style([
  button,
  paddingX(hspace.medium),
  paddingY(vspace.small),
  {
    display: "flex",
    justifyContent: "space-around",
    marginLeft: hspace.small,
    fontSize: "0.8em",
    height: "auto",
    width: "auto",
  },
])

export const cancelButton = style([
  {
    fontFamily: fonts.header,
    width: buttonSize.small,
  },
])

export const cancelButtonSmall = style([
  {
    fontFamily: fonts.header,
    width: buttonSize.small,
    fontSize: "0.8em",
  },
])

export const formInputLabel = style({
  fontFamily: fonts.header,
  fontWeight: "normal",
  fontSize: fontSize.small,
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
