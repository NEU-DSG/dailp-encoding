import { style } from "@vanilla-extract/css"
import { margin } from "polished"
import { linkColor } from "src/ui/atoms/link/link.css"
import { drawerWidth } from "src/components/sidebar.css"
import {
  colors,
  fonts,
  hsize,
  hspace,
  mediaQueries,
  vspace,
} from "src/style/constants"
import { paddingX, paddingY } from "src/style/utils"
import { hideOnPrint, row } from "src/style/utils.css"
import * as baseLayout from "../../layout.css"

export const header = style([baseLayout.header])

export const openHeader = style([
  paddingX(hspace.edge),
  hideOnPrint,
  {
    position: "sticky",
    backgroundColor: colors.secondary,
    fontFamily: fonts.header,
    "@media": {
      [mediaQueries.medium]: {
        position: "static",
        display: "flex",
        justifyContent: "center",
      },
    },
  },
])

export const headerContents = style([baseLayout.headerContents])

export const subHeader = style([baseLayout.subHeader, { fontSize: "larger" }])

export const siteTitle = style([baseLayout.siteTitle, { flex: 1 }])

export const siteLink = style([baseLayout.siteLink, { display: "flex" }])

export const contentContainer = style([
  baseLayout.contentContainer,
  { flex: 1 },
])

export const leftMargin = style({
  "@media": {
    [mediaQueries.medium]: {
      marginLeft: drawerWidth,
      width: "100%",
      maxWidth: hsize.large,
    },
  },
})

export const openHeaderContents = style([
  row,
  {
    "@media": {
      [mediaQueries.medium]: {
        marginLeft: drawerWidth,
        alignItems: "center",
        width: hsize.large,
      },
    },
  },
])

export const banner = style([
  margin(0),
  paddingY(vspace.medium),

  {
    width: hsize.xsmall,
    "@media": {
      [mediaQueries.medium]: {
        width: hsize.small,
      },
    },
  },
])

export const noticeText = style([
  {
    paddingTop: vspace.large,
    borderTop: `1px ridge ${colors.borders}`,
    color: colors.primaryText,
    vars: {
      [linkColor]: "white",
      [colors.focus]: "white",
    },
  },
])

export const loginHeader = style([
  {
    color: colors.body,
    vars: {
      [linkColor]: "white",
      [colors.focus]: "white",
      [colors.primary]: "#333",
    },
  },
])
