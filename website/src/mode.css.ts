import { style, styleVariants } from "@vanilla-extract/css"
import sprinkles, {
  fullWidth,
  hspace,
  mediaQueries,
  vspace,
} from "src/sprinkles.css"
import * as cwkwTheme from "./cwkw/theme.css"
import { drawerBg } from "./menu.css"
import { mobileWordPanel, morphemeDialog } from "./pages/documents/document.css"
import { paddingX } from "./style-utils"
import { collPanelButton, wordPanelButton } from "./word-panel.css"

export const highlightedLabel = sprinkles({
  outlineStyle: "dashed",
  outlineColor: "headings",
  outlineWidth: "thick",
})

export const levelGroup = style([
  sprinkles({
    display: { any: "flex", print: "none" },
    marginY: "quarter",
  }),
  {
    flexFlow: "row wrap",
    justifyContent: "center",
  },
])

export const levelLabel = sprinkles({
  marginRight: "edge",
  paddingX: "char",
  cursor: "pointer",
})

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
  { color: cwkwTheme.colors.text },
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
  paddingX(hspace.edge),
  { paddingTop: vspace.one },
])

export const settingsContainer = style({
  display: "flex",
  flexFlow: "column nowrap",
})

export const closeButton = style([wordPanelButton.basic])
