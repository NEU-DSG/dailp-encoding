import { style } from "@vanilla-extract/css"
import { margin } from "polished"
import { drawerWidth } from "src/components/sidebar.css"
import {
  colors,
  fonts,
  hsize,
  hspace,
  mediaQueries,
  vspace,
} from "src/style/constants"
import { marginY, media, paddingX, paddingY } from "src/style/utils"
import * as utils from "src/style/utils.css"
import * as baseLayout from "../../layout.css"

export const header = style([baseLayout.header])

export const headerContents = style([baseLayout.headerContents])

export const subHeader = style([baseLayout.subHeader, { fontSize: "larger" }])

export const siteTitle = style([
  baseLayout.siteTitle,
  media(mediaQueries.medium, marginY(vspace.half)),
  { flex: 1 },
])

export const siteLink = style([baseLayout.siteLink, { display: "flex" }])

export const contentContainer = style([
  baseLayout.contentContainer,
  { flex: 1 },
])

export const banner = style([
  margin(0),
  paddingY(vspace.medium),
  {
    width: hsize.xsmall,
    "@media": {
      [mediaQueries.medium]: {
        width: "15rem",
      },
    },
  },
])

export const paddedCenterColumn = style([
  utils.paddedCenterColumn,
  {
    width: "100%",
  },
])

export const fullWidth = style({
  width: "100%",
  maxWidth: "50rem",
})
