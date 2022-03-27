import { style } from "@vanilla-extract/css"
import { position, rgba } from "polished"
import sprinkles, {
  colors,
  hspace,
  largeDialog,
  mediaQueries,
  radii,
  std,
  theme,
  thickness,
  vspace,
} from "src/sprinkles.css"
import { paddingX, paddingY } from "src/style-utils"

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

export const wideAndTop = style({
  width: "100%",
  zIndex: 1,
  "@media": {
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
  fontFamily: theme.fonts.header,
  fontSize: "1.1rem",
  backgroundColor: theme.colors.header,
  color: theme.colors.headings,
  outlineColor: theme.colors.headings,
  selectors: {
    '&[aria-selected="true"]': {
      borderBottom: `2px solid ${theme.colors.headings}`,
    },
  },
})

export const docTabs = style([
  std.fullWidth,
  {
    display: "flex",
    flexFlow: "row nowrap",
    margin: "0 !important",
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
    padding: 0,
    zIndex: 1009,
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

export const audioContainer = style([wideAndTop, topMargin, bottomPadded])

export const hideOnPrint = style({
  "@media": {
    print: { display: "none" },
  },
})

export const paragraph = style([topMargin, hideOnPrint])

export const solidSticky = style({
  backgroundColor: theme.colors.body,
  zIndex: 1,
})

export const wideSticky = style({
  left: 0,
  display: "flex",
  flexFlow: "column nowrap",
  alignItems: "center",
  width: "100% !important",
  zIndex: 1,
})

export const contentContainer = style({
  display: "flex",
  flexDirection: "row",
  flexWrap: "nowrap",
})

export const contentSection2 = style([
  sprinkles({ display: { any: "none", medium: "block" } }),
  {
    flex: 1,
  },
])

export const mobileWordPanel = style([
  position("fixed", 0, 0, 0, "initial"),
  paddingX(hspace.edge),
  {
    paddingTop: vspace.one,
    width: "13rem",
    backgroundColor: colors.body,
    fontFamily: theme.fonts.header,
    transition: "transform 150ms ease-in-out",
    transform: "translateX(16rem)",
    selectors: {
      "&[data-enter]": {
        transform: "translateX(0)",
      },
    },
  },
])
