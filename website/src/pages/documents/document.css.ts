import { style } from "@vanilla-extract/css"
import { important, position } from "polished"
import {
  colors,
  fonts,
  hspace,
  mediaQueries,
  radii,
  thickness,
  vspace,
} from "src/style/constants"
import { paddingX, paddingY } from "src/style/utils"
import { largeDialog, std } from "src/style/utils.css"

export const docTitle = std.fullWidth

export const annotationContents = style({
  width: "100%",
  flex: 2,
})

export const topMargin = style({
  marginTop: vspace.half,
})

export const bottomPadded = style({
  marginBottom: vspace.half,
  display: "flex",
  flexFlow: "row wrap",
  alignItems: "center",
  justifyContent: "space-between",
  "@media": {
    [mediaQueries.print]: {
      display: "none",
    },
  },
})

export const displayModeArea = style({
  backgroundColor: colors.body,
  position: "sticky",
  top: `calc(55px + ${vspace[1.75]})`,
  width: "100%",
  zIndex: 1,
  paddingTop: vspace.quarter,
  paddingBottom: vspace.quarter,
  "@media": {
    [mediaQueries.medium]: {
      top: vspace[1.75],
    },
    [mediaQueries.print]: {
      display: "none",
      height: 0,
    },
  },
})

export const wideAndTop = style({
  left: 0,
  display: "flex",
  flexFlow: "column nowrap",
  alignItems: "center",
  position: "sticky",
  top: 55,
  width: "100%",
  zIndex: 1,
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

export const docTab = style({
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

export const docTabs = style([
  std.fullWidth,
  important({
    margin: 0,
  }),
  {
    display: "flex",
    flexFlow: "row nowrap",
    height: vspace[1.75],
  },
])
export const docTabPanel = style([
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

export const imageTabPanel = style([std.fullWidth, { outline: "none" }])

export const docHeader = style([
  std.fullWidth,
  paddingY(0),
  paddingX(hspace.edge),
  {
    "@media": {
      [mediaQueries.print]: paddingX(0),
    },
  },
])

export const morphemeDialog = style([
  largeDialog,
  {
    borderRadius: radii.medium,
    borderColor: colors.borders,
    borderWidth: thickness.thin,
    backgroundColor: colors.body,
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "100vw",
    margin: 0,
    zIndex: 1009,
  },
])

export const unpaddedMorphemeDialog = style([
  morphemeDialog,
  {
    padding: 0,
  },
])

export const morphemeDialogBackdrop = style({
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.2)",
  zIndex: 1008,
})

export const annotatedDocument = style({
  alignItems: "center",
  "@media": {
    [mediaQueries.medium]: paddingX(hspace.edge),
  },
})

export const audioContainer = style([
  {
    display: "flex",
    flexFlow: "row nowrap",
  },
  topMargin,
  bottomPadded,
])

export const hideOnPrint = style({
  "@media": {
    print: { display: "none" },
  },
})

export const paragraph = style([topMargin, hideOnPrint])

export const contentContainer = style({
  display: "flex",
  flexDirection: "row",
  flexWrap: "nowrap",
})

export const contentSection2 = style({
  display: "none",
  width: "20rem",
  minWidth: 0,
  "@media": {
    [mediaQueries.medium]: {
      display: "block",
    },
  },
})

export const mobileWordPanel = style([
  position("fixed", 0, 0, 0, "initial"),
  {
    width: "15.5rem",
    maxWidth: "90vw",
    backgroundColor: colors.body,
    fontFamily: fonts.header,
    transition: "transform 150ms ease-in-out",
    transform: "translateX(16rem)",
    selectors: {
      "&[data-enter]": {
        transform: "translateX(0)",
      },
    },
    "@media": {
      [mediaQueries.medium]: {
        display: "none",
      },
    },
  },
])

export const scrollTop = style({
  display: "flex",
  flexFlow: "column nowrap",
  justifyContent: "flex-end",
  alignContent: "center",
  alignItems: "center",
  alignSelf: "flex-end",
  position: "sticky",
  zIndex: 1,
  top: `calc(100vh - 100px)`,
  right: 0,
  padding: vspace.quarter,
  color: colors.secondaryContrast,
  outlineColor: colors.secondaryContrast,
  backgroundColor: colors.secondary,
})