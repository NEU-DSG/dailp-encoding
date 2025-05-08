import { style } from "@vanilla-extract/css"
import {
  colors,
  hspace,
  layers,
  radii,
  thickness,
  vspace,
} from "src/style/constants"
import { hideOnPrint } from "src/style/utils.css"

export const accountMenuDisclosure = style([
  hideOnPrint,
  {
    padding: hspace.medium,
  },
])

export const accountMenuPopover = style([
  hideOnPrint,
  {
    background: colors.primaryContrast,
    borderColor: colors.borders,
    borderWidth: thickness.thick,
    borderStyle: "solid",
    borderRadius: radii.medium,
    display: "flex",
    zIndex: layers.top,
  },
])

export const accountMenuActions = style([
  hideOnPrint,
  {
    listStyle: "none",
    margin: hspace.small,
    textAlign: "right",
  },
])

export const accountMenuListItem = style([
  hideOnPrint,
  {
    marginBottom: vspace.small,
    textTransform: "capitalize",
  },
])

export const accountInfo = style([
  hideOnPrint,
  {
    margin: hspace.small,
    paddingRight: hspace.small,
    borderRightWidth: thickness.thin,
    borderRightColor: colors.borders,
    borderRightStyle: "solid",
  },
])
