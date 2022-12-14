import { style } from "@vanilla-extract/css"
import { padding } from "polished"
import { navDrawer } from "src/menu.css"
import {
  colors,
  hsize,
  hspace,
  layers,
  mediaQueries,
  radii,
  vspace,
} from "src/style/constants"

export const drawerWidth = "20rem"
export const bgColor = style({ backgroundColor: "#585858" })
export const iconSize = "32px"

export const initDrawer = style([
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
        transform: "none",
        selectors: {
          "&[data-enter]": {
            transform: "none",
          },
        },
      },
    },
  },
])

export const drawer = style([
  initDrawer,
  {
    "@media": {
      [mediaQueries.medium]: {
        transition: "transform 0.5s ease-out",
        transform: `translateX(-${drawerWidth})`,
        selectors: {
          "&[data-enter]": {
            transform: "translateX(0)",
          },
        },
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

export const openNavButton = style([
  bgColor,
  padding(hspace.halfEdge),
  {
    "@media": {
      [mediaQueries.medium]: {
        width: `calc(${hsize.xsmall} / 2)`,
        height: `calc(${hsize.xsmall} / 2)`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",

        top: vspace.double,

        left: drawerWidth,

        color: colors.body,
        border: "none",
        borderRadius: radii.large,

        transition: "transform 0.5s ease-out",
        transform: `translateX(0)`,
      },
    },
  },
])

export const closeNavButton = style([
  openNavButton,
  {
    "@media": {
      [mediaQueries.medium]: {
        transform: `translateX(-${drawerWidth})`,
      },
    },
  },
])
