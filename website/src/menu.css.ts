import { style, styleVariants } from "@vanilla-extract/css"
import { border, padding, position, rgba } from "polished"
import {
  colors,
  fonts,
  hspace,
  mediaQueries,
  selectors,
  thickness,
  vspace,
} from "src/style/constants"
import { onFocus, onHover, paddingX, paddingY } from "src/style/utils"
import { fullWidth } from "src/style/utils.css"

export const navMenu = style({
  display: "flex",
  backgroundColor: colors.body,
  borderColor: colors.primary,
  borderWidth: thickness.thick,
  borderStyle: "solid",
  flexFlow: "column",
  zIndex: 999,
  selectors: { "&:focus": { outline: "none" } },
})

export const navLink = style([
  padding(vspace.quarter, hspace.char),
  onHover({
    color: colors.primary,
  }),
  {
    color: colors.secondaryText,
    selectors: {
      [selectors.currentPage]: {
        color: colors.primary,
        borderColor: colors.primary,
      },
    },
    textDecoration: "none",
    background: "none",
    border: "none",
    display: "flex",
    flexFlow: "row",
    alignItems: "center",
    transition: "all 0.2s ease",
    "@media": {
      [mediaQueries.large]: paddingX(hspace.edge),
    },
  },
  border("bottom", thickness.thick, "solid", "transparent"),
])

export const subMenuItems = style([
  navLink,
  {
    color: "black",
  },
])

export const drawerItem = style([
  {
    display: "inline-block",
    padding: vspace.quarter,
    textDecoration: "none",
    selectors: {
      [selectors.currentPage]: {
        color: colors.primary,
      },
    },
  },
  onHover({ color: colors.primary }),
  onFocus({ color: colors.primary }, { color: colors.text }),
])

export const desktopNav = style([
  fullWidth,
  {
    display: "none",
    "@media": {
      [mediaQueries.medium]: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "0",
      },
    },
  },
])

export const navButton = style({
  border: "none",
  padding: 0,
  background: "none",
  marginRight: hspace.edge,
  height: 32,
  color: colors.primary,
  "@media": {
    [mediaQueries.medium]: {
      display: "none",
    },
  },
})

export const navDrawer = style([
  position("fixed", 0, "initial", 0, 0),
  paddingX(hspace.edge),
  {
    paddingTop: vspace.one,
    width: "16rem",
    backgroundColor: colors.body,
    fontFamily: fonts.header,
    transition: "transform 150ms ease-in-out",
    transform: "translateX(-16rem)",
    selectors: {
      "&[data-enter]": {
        transform: "translateX(0)",
      },
    },
  },
])

export const drawerList = style({
  listStyle: "none",
  paddingInlineStart: 0,
})

export const drawerBg = style({
  position: "fixed",
  inset: 0,
  zIndex: 999,
  backgroundColor: rgba(0, 0, 0, 0.2),
  transition: "opacity 100ms ease-in-out",
  opacity: 0,
  "@media": {
    [mediaQueries.medium]: {
      display: "none",
    },
  },
  selectors: {
    "&[data-enter]": {
      opacity: 1,
    },
  },
})
