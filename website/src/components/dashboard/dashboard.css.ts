import { style } from "@vanilla-extract/css"
import { flowRight } from "lodash-es"
import { important, position } from "polished"
import { rightButton } from "src/components/carousel.css"
import {
  colors,
  fonts,
  hspace,
  layers,
  mediaQueries,
  radii,
  space,
  thickness,
  vspace,
} from "src/style/constants"
import { paddingX, paddingY } from "src/style/utils"
import { largeDialog, std } from "src/style/utils.css"

export const dashboardTab = style({
  borderRadius: 0,
  border: "none",
  flexGrow: 1,
  cursor: "pointer",
  fontFamily: fonts.header,
  fontSize: "1.1rem",
  backgroundColor: colors.secondary,
  color: colors.secondaryContrast,
  outlineColor: colors.secondaryContrast,
  selectors: {
    '&[aria-selected="true"]': {
      borderBottom: `2px solid ${colors.secondaryContrast}`,
    },
  },
})

export const dashboardTabs = style([
  std.fullWidth,
  important({
    margin: 0,
  }),
  {
    display: "flex",
    position: "sticky",
    flexFlow: "row nowrap",
    height: vspace[1.75],
  },
])

export const dashboardTabPanel = style([
  std.fullWidth,
  paddingX(hspace.halfEdge),
  {
    "@media": {
      [mediaQueries.medium]: paddingX(0),
    },
    selectors: {
      "&:focus": {
        outline: "none",
      },
    },
  },
])

export const wideAndTop = style({
  left: 0,
  display: "flex",
  flexFlow: "column nowrap",
  alignItems: "center",
  position: "sticky",
  top: 55,
  width: "100%",
  zIndex: layers.base,
  "@media": {
    [mediaQueries.medium]: {
      top: 0,
    },
    [mediaQueries.print]: {
      display: "none",
      height: 0,
    },
  },
})

export const dashboardHeader = style({
  left: 0,
  display: "flex",
  flexFlow: "column nowrap",
  alignItems: "center",
  top: 55,
  width: "100%",
  zIndex: layers.base,
  "@media": {
    [mediaQueries.medium]: {
      top: 0,
    },
    [mediaQueries.print]: {
      display: "none",
      height: 0,
    },
  },
    marginTop: vspace.half,
})

export const dashboardItem = style({
  width: "100%",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "black",
  borderRadius: radii.medium,
  display: "grid",
})

export const noBullets = style({
  listStyleType: "none" /* Remove bullets */,
  padding: 10,
  margin: 10,
})

export const cardShadow = style({
  boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
})