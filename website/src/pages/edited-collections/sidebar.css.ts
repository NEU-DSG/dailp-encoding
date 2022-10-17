import { style } from "@vanilla-extract/css"
import { padding } from "polished"
import { drawerBg, navButton, navDrawer } from "src/menu.css"
import { colors, hsize, mediaQueries, vspace } from "src/style/constants"
import { paddedWidth } from "src/style/utils.css"

export const textColor = style({ color: colors.primaryText })
export const bgColor = style({ backgroundColor: "#585858" })

const bg = style([bgColor, textColor, padding(vspace.one)])

export const sidebar = style([
  bg,
  {
    display: "flex",
    flexDirection: "column",
    overflow: hsize.auto,
    "@media": {
      [mediaQueries.large]: {
        height: "100vh",
        maxWidth: hsize.medium,
        width: hsize.small,
      },
    },
  },
])

export const closedSidebar = style([
  bg,
  {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    "@media": {
      [mediaQueries.large]: {
        height: "100vh",
        width: hsize.edge,
      },
    },
  },
])

export const header = style([
  textColor,
  {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
])

export const title = style([
  {
    fontWeight: "bolder",
  },
])

export const sidebarDrawerBg = style([
  drawerBg,
  {
    "@media": {
      [mediaQueries.medium]: {
        display: "block",
      },
    },
  },
])

export const drawer = style([navDrawer, bgColor])

export const sidebarNavButton = style([
  navButton,
  {
    "@media": {
      [mediaQueries.medium]: {
        display: "block",
      },
    },
  },
])
