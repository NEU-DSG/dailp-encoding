import { style } from "@vanilla-extract/css"
import { button } from "src/components/button.css"
import { hspace, radii, vspace } from "src/style/constants"
import { marginX, paddingX, paddingY } from "src/style/utils"

export const formStyle = style({
  display: "flex",
  justifyContent: "flex-end",
  flex: 1,
  margin: 0,
})

export const buttonStyle = style([
  button,
  paddingX(hspace.medium),
  paddingY(vspace.small),
  marginX(hspace.large),
  {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    gap: hspace.small,
  },
])

export const inputStyle = style([
  {
    width: "100%",
    height: vspace["1.5"],
    padding: vspace.medium,
    borderRadius: radii.medium,
    resize: "none",
  },
])
