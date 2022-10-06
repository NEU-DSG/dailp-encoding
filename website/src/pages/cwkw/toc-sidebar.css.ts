import { style } from "@vanilla-extract/css"
import { drawerBg, navButton, navDrawer } from "src/menu.css"
import { hspace, mediaQueries, vspace } from "src/style/constants"
import { paddingX, paddingY } from "src/style/utils"

export const sidebar = style([
  {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#585858",
    overflow: "auto",
    width: "max-content",
    maxWidth: "90%",
    "@media": {
      [mediaQueries.large]: {
        height: "100vh",
      },
    },
  },
])

export const tocHeader = style([
  paddingX(hspace.medium),
  paddingY(vspace.medium),
  {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#E2E2E2",
  },
])

export const tocDrawerBg = style([
  drawerBg,
  {
    "@media": {
      [mediaQueries.medium]: {
        display: "block",
      },
    },
  },
])

export const tocDrawer = style([navDrawer, { backgroundColor: "#353535" }])

export const tocNavButton = style([
  navButton,
  {
    "@media": {
      [mediaQueries.medium]: {
        display: "block",
      },
    },
  },
])
