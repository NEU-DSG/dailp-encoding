import { style } from "@vanilla-extract/css"
import { button } from "src/components/button.css"
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

export const cancelButton = style([
  { fontFamily: fonts.header, width: buttonSize.small },
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


export const cancelPrompt = style({
  fontFamily: fonts.body,
  fontWeight: "normal",
  backgroundColor: "white",
  border: "solid #a9a9a9 1px",
  position: "absolute",
  width: "90%",
  textAlign: "center",
  left: "0",
  right: "0",
  top: "11rem",
  zIndex: "100",
  marginLeft: "auto",
  marginRight: "auto"
  
})