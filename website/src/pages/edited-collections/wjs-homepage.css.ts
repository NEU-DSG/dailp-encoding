import "@fontsource/alyamama/400.css"
import { style } from "@vanilla-extract/css"
import { colors, fonts, hspace, mediaQueries } from "src/style/constants"
import { paddingX } from "src/style/utils"
import { hideOnPrint } from "src/style/utils.css"
import {
  subtitle as homepageSubtitle,
  title as homepageTitle,
} from "../../components/homepage-header.css"

// Quick nav styles
export const quickNav = style({
  display: "flex",
  flexDirection: "row",
})

export const navButtonStyle = style({
  border: "2px solid white",
  padding: "8px 16px",
  backgroundColor: "#7B2830",
  color: "white",
  fontFamily: fonts.header,
  ":hover": {
    backgroundColor: "#A33842",
  },
})

// Title card styles
export const title = style([
  homepageTitle,
  {
    fontFamily: "'Alyamama', sans-serif",
  },
])

export const subtitle = style([
  homepageSubtitle,
  {
    fontFamily: "'Alyamama', sans-serif",
  },
])

// Header styles
export const openHeader = style([
  paddingX(hspace.edge),
  hideOnPrint,
  {
    position: "sticky",
    backgroundColor: "#7B2830",
    fontFamily: "'Alyamama', sans-serif",
    "@media": {
      [mediaQueries.medium]: {
        position: "static",
        display: "flex",
        justifyContent: "center",
      },
    },
  },
])
