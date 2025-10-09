import { style } from "@vanilla-extract/css"
import { padding } from "polished"
import { navButton, navDrawer } from "src/components/menu/menu.css"
import {
  colors,
  hspace,
  layers,
  mediaQueries,
  radii,
  vspace,
} from "src/style/constants"

export const drawerWidth = "20rem"
export const bgColor = style({ backgroundColor: "#585858" })
export const iconSize = "32px"

export const drawer = style([
  navDrawer,
  bgColor,
  padding(vspace.one),
  {
    zIndex: layers.top,
    overflowY: "auto",
    scrollbarGutter: "stable",
    "@media": {
      [mediaQueries.medium]: {
        width: drawerWidth,
      },
    },
  },
])

export const header = style([
  {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
])

export const desktopNav = style([
  navButton,
  bgColor,
  {
    "@media": {
      [mediaQueries.medium]: {
        display: "block",
        position: "absolute",
        color: colors.body,
        borderRadius: radii.medium,
        top: vspace.large,
        left: hspace[0],
      },
    },
  },
])

export const openNav = style([
  desktopNav,
  padding(vspace.small),
  { transform: `translateX(${drawerWidth})` },
])

export const closedNav = style([
  desktopNav,
  padding(vspace.small),
  { transform: `translateX(${hspace[0]})` },
])
