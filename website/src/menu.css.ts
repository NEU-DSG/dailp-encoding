import { style } from "@vanilla-extract/css"
import { position, rgba } from "polished"
import { paddingX } from "src/style-utils"
import sprinkles, {
  theme,
  colors,
  fullWidth,
  hspace,
  vspace,
  mediaQueries,
} from "src/sprinkles.css"

export const navMenu = style([
  sprinkles({
    display: "flex",
    backgroundColor: "body",
    borderColor: "link",
    borderWidth: "thick",
    borderStyle: "solid",
  }),
  {
    flexFlow: "column",
    selectors: { "&:focus": { outline: "none" } },
  },
])

export const navLink = style([
  sprinkles({
    paddingY: "quarter",
    paddingX: { any: "char", large: "edge" },
    color: { any: "text", currentPage: "link", hover: "link", focus: "link" },
    borderColor: { any: "transparent", currentPage: "link" },
  }),
  {
    textDecoration: "none",
    background: "none",
    border: "none",
    borderBottom: "2px solid transparent",
    display: "flex",
    flexFlow: "row",
    alignItems: "center",
  },
])

export const drawerItem = style([
  sprinkles({
    color: { any: "text", currentPage: "link", hover: "link", focus: "link" },
  }),
  { padding: vspace.half, textDecoration: "none", color: colors.text },
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

export const drawerBg = style([
  {
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
  },
])
