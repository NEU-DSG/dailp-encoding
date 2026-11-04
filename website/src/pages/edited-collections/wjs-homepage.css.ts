import { style } from "@vanilla-extract/css"
import { fonts, hspace, mediaQueries } from "src/style/constants"
import { paddingX } from "src/style/utils"
import { hideOnPrint } from "src/style/utils.css"
import {
  subtitle as homepageSubtitle,
  title as homepageTitle,
} from "../../components/homepage-header.css"

// TODO: move these into palette.ts as a WJS collection theme
const wjsMaroon = "#7B2830"
const wjsMaroonHover = "#A33842"
const wjsHeading = "#833E2E"

// Quick nav styles
export const quickNav = style({
  display: "flex",
  flexDirection: "row",
  width: "100%",
  backgroundColor: wjsMaroon,
  borderTop: "2px solid white",
  borderBottom: "2px solid white",
  flexWrap: "wrap",
})

export const navButtonStyle = style({
  flex: "1 1 0",
  textAlign: "center",
  textDecoration: "none",
  padding: "16px 8px",
  backgroundColor: wjsMaroon,
  color: "white",
  fontFamily: fonts.header,
  fontWeight: 700,
  minWidth: "140px",
  selectors: {
    "& + &": { borderLeft: "2px solid white" },
  },
  ":hover": {
    backgroundColor: wjsMaroonHover,
  },
  ":focus-visible": {
    outline: "3px solid white",
    outlineOffset: "-5px",
  },
})

// Title card styles
export const title = style([
  homepageTitle,
  {
    fontFamily: "'Alyamama', sans-serif",
    fontWeight: 600,
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
    backgroundColor: wjsMaroon,
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

export const contentColumn = style([
  paddingX(hspace.edge),
  {
    maxWidth: "873px",
    margin: "0 auto",
    boxSizing: "content-box",
  },
])

export const section = style({
  paddingTop: "48px",
  scrollMarginTop: "96px",
})

export const sectionHeading = style({
  fontFamily: fonts.header,
  fontWeight: 700,
  color: wjsHeading,
  margin: "0 0 16px",
})
