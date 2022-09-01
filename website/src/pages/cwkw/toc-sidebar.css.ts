import { style } from "@vanilla-extract/css"
import { drawerBg, navDrawer } from "src/menu.css"
import { hspace, mediaQueries, vspace } from "src/style/constants"
import { marginY, paddingX, paddingY } from "src/style/utils"

export const sidebar = style([
  {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#353535",
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

export const tocMobileButton = style({
  position: "fixed",
  bottom: "10%",
  right: "7%",
  backgroundColor: "#353535",
  padding: 15,
})

export const list = style([marginY(vspace[0]), { padding: hspace.small }])

export const listItem = style([
  marginY(vspace[0]),
  {
    color: "#7D7D7D",
    fontSize: "0.8rem",
  },
])

export const listItemContent = style([
  { display: "flex", justifyContent: "space-between", alignItems: "center" },
])

export const chapterTitle = style({
  flex: 1,
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
})
