import { style } from "@vanilla-extract/css"
import { padding } from "polished"
import { navDrawer } from "src/menu.css"
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

export const initDrawer = style([
  bgColor,
  padding(vspace.one),
  {
    minWidth: drawerWidth,
    maxWidth: drawerWidth,
    position: "sticky",
    top: 0,

    zIndex: layers.top,
    overflowY: "auto",
    scrollbarGutter: "stable",

    "@media": {
      [mediaQueries.medium]: {
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

export const baseNavButton = style([
  bgColor,
  padding(hspace.halfEdge),
  {
    "@media": {
      [mediaQueries.medium]: {
        width: "3rem",
        height: "3rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        position: "sticky",
        top: 0,

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

export const closeNavButton = style({
  "@media": {
    [mediaQueries.medium]: {
      transform: `translateX(-${drawerWidth})`,
    },
  },
})
