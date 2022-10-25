import { style } from "@vanilla-extract/css"
import { margin } from "polished"
import { colors, fonts, hsize, hspace, mediaQueries } from "src/style/constants"
import { paddingX } from "src/style/utils"
import { hideOnPrint, row } from "src/style/utils.css"
import * as baseLayout from "../../layout.css"
import { drawerWidth } from "../edited-collections/sidebar.css"

export const header = style([baseLayout.header])

export const openHeader = style([
  paddingX(hspace.edge),
  hideOnPrint,
  {
    backgroundColor: colors.secondary,
    fontFamily: fonts.header,
    display: "flex",
    justifyContent: "center",
  },
])

export const headerContents = style([baseLayout.headerContents])

export const subHeader = style([baseLayout.subHeader, { fontSize: "larger" }])

export const siteTitle = style([baseLayout.siteTitle])

export const siteLink = style([baseLayout.siteLink])

export const contentContainer = style([baseLayout.contentContainer])

export const leftMargin = style({
  "@media": {
    [mediaQueries.medium]: {
      marginLeft: drawerWidth,
      maxWidth: hsize.large,
    },
  },
})

export const openHeaderContents = style([
  row,
  leftMargin,
  {
    alignItems: "center",
    width: hsize.large,
  },
])

export const banner = style([
  {
    "@media": {
      [mediaQueries.medium]: {
        ...margin(0),
        width: hsize.small,
      },
    },
  },
])
