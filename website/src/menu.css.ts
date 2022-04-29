import { style } from "@vanilla-extract/css"
import { position, rgba } from "polished"
import sprinkles, {
  colors,
  fullWidth,
  hspace,
  mediaQueries,
  theme,
  thickness,
  vspace,
} from "src/sprinkles.css"
import { paddingX, paddingY } from "src/style-utils"

export const navMenu = style({
  display: "flex",
  backgroundColor: colors.body,
  borderColor: colors.link,
  borderWidth: thickness.thick,
  borderStyle: "solid",
  flexFlow: "column",
  zIndex: 999,
  selectors: { "&:focus": { outline: "none" } },
})

export const navLink = style([
  sprinkles({
    color: { currentPage: "link", hover: "link", focus: "link" },
    borderColor: { currentPage: "link" },
  }),
  paddingY(vspace.quarter),
  paddingX(hspace.char),
  {
    color: colors.text,
    borderColor: "transparent",
    textDecoration: "none",
    background: "none",
    border: "none",
    borderBottom: "2px solid transparent",
    display: "flex",
    flexFlow: "row",
    alignItems: "center",
    "@media": {
      [mediaQueries.large]: paddingX(hspace.edge),
    },
  },
])

export const subMenuItems = style([
  navLink,
  {
    color: "black",
  },
])

export const drawerItem = style([
  sprinkles({
    color: { any: "text", currentPage: "link", hover: "link", focus: "link" },
  }),
  {
    display: "inline-block",
    padding: vspace.quarter,
    textDecoration: "none",
    color: "black",
  },
])

export const desktopNav = style([
  fullWidth,
  sprinkles({ display: { any: "none", medium: "flex" } }),
])

export const navButton = style([
  sprinkles({ display: { medium: "none" } }),
  {
    border: "none",
    padding: 0,
    background: "none",
    marginRight: hspace.edge,
    height: 32,
  },
])

export const navDrawer = style([
  position("fixed", 0, "initial", 0, 0),
  paddingX(hspace.edge),
  {
    paddingTop: vspace.one,
    width: "16rem",
    backgroundColor: colors.body,
    fontFamily: theme.fonts.header,
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
