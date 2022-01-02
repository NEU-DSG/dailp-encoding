import { style } from "@vanilla-extract/css"
import sprinkles, { std, theme, vspace } from "../../sprinkles.css"

export const docTitle = std.fullWidth

export const annotationContents = style({
  width: "100%",
})

export const topMargin = sprinkles({
  marginTop: "half",
})

export const bottomPadded = style([
  sprinkles({ marginBottom: "half" }),
  {
    display: "flex",
    flexFlow: "row wrap",
    alignItems: "center",
    justifyContent: "space-between",
    "@media": {
      print: {
        display: "none",
      },
    },
  },
])

export const wideAndTop = style({
  width: "100%",
  zIndex: 1,
  "@media": {
    print: {
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
  sprinkles({
    paddingX: {
      any: "halfEdge",
      medium: "none",
    },
  }),
  {
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
  sprinkles({
    paddingX: {
      any: "edge",
      print: "none",
    },
    paddingY: "none",
  }),
])

export const morphemeDialog = style([
  sprinkles({
    borderRadius: "medium",
    borderColor: "borders",
    borderWidth: "thin",
    backgroundColor: "body",
  }),
  {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "100vw",
    zIndex: 999,
  },
])

export const morphemeDialogBackdrop = style({
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.2)",
  zIndex: 998,
})

export const annotatedDocument = style([
  sprinkles({
    paddingX: { medium: "edge" },
  }),
  { alignItems: "center" },
])

export const audioContainer = style([wideAndTop, topMargin, bottomPadded])

export const hideOnPrint = sprinkles({
  display: { print: "none" },
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
