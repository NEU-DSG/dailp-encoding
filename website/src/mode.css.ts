import { globalStyle, style } from "@vanilla-extract/css"
import {
  colors,
  hspace,
  mediaQueries,
  thickness,
  vspace,
} from "src/style/constants"
import { marginY, paddingX } from "src/style/utils"
import { fullWidth, hideOnPrint, paddingAround } from "src/style/utils.css"
import { drawerBg } from "src/ui/organisms/menu/menu.css"
import { morphemeDialog } from "src/pages/documents/document.css"
import { collPanelButton, wordPanelButton } from "src/panel-layout.css"

export const highlightedLabel = style({
  outlineStyle: "dashed",
  outlineColor: colors.headings,
  outlineWidth: thickness.thick,
})

export const levelGroup = style([
  hideOnPrint,
  marginY(vspace.quarter),
  {
    display: "flex",
    flexFlow: "row wrap",
    justifyContent: "center",
  },
])

export const levelLabel = style([
  paddingX(hspace.char),
  {
    marginRight: hspace.edge,
    cursor: "pointer",
  },
])

export const prefBand = style([
  fullWidth,
  {
    paddingTop: vspace.half,
    paddingBottom: vspace.half,
  },
])

export const prefButtonShell = style({
  textAlign: "right",
  flex: 1,
})

export const prefButton = style([
  collPanelButton,
  { color: colors.secondaryText },
])

export const prefBG = style([
  drawerBg,
  {
    "@media": {
      [mediaQueries.medium]: {
        display: "block",
      },
    },
  },
])

export const prefDrawer = style([
  morphemeDialog,
  //mobileWordPanel,
  paddingAround,
])

export const settingsContainer = style({
  display: "flex",
  flexFlow: "column nowrap",
})

globalStyle(`${settingsContainer} > :last-child`, {
  marginBottom: 0,
})

export const closeButton = style([wordPanelButton.basic])
