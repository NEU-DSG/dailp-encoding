import { style, styleVariants } from "@vanilla-extract/css"
import { rgba } from "polished"
import {
  fontSize,
  fonts,
  hspace,
  mediaQueries,
  radii,
  rootFontSize,
  vspace,
} from "src/style/constants"
import { marginX, paddingX, paddingY } from "src/style/utils"

const wordPanelPadding = "8px"

// Avoid a circular dependency with `src/components/mode.css` by defining
// a local base close button style here instead of importing it.
export const closeButton = style({
  background: "none",
  border: "none",
  color: "inherit",
  padding: 0,
  cursor: "pointer",
})

export const cherHeader = style({
  fontFamily: fonts.cherokee,
  marginBottom: vspace.eighth,
})

export const noSpaceBelow = style({
  marginBottom: vspace.quarter,
})

export const wordPanelButton = styleVariants({
  basic: [closeButton],
  colpright: [
    closeButton,
    {
      position: "relative",
      float: "right",
      top: "0px",
    },
  ],
  colpleft: [
    closeButton,
    {
      position: "relative",
      float: "left",
      top: "0px",
      marginRight: wordPanelPadding,
      left: "0px",
    },
  ],
})

export const collPanelContent = style({
  padding: wordPanelPadding,
  marginBottom: "0px",
})

export const collPanelButton = style({
  flex: 1,
  backgroundColor: "rgba(0, 0, 0, 0)",
  border: "none",
  textAlign: "left",
  padding: wordPanelPadding,
  fontFamily: fonts.header,
})

export const collPanel = style({
  width: "inherit",
  display: "flex",
  flexDirection: "column",
  borderTop: "1px solid #ddd",
})

export const wordPanelContent = style({
  fontFamily: fonts.body,
  position: "sticky",
  top: 58,
  border: "none",
  borderRadius: radii.large,
  marginTop: 8,
  "@media": {
    [mediaQueries.medium]: {
      width: 350,
      border: "1px solid #ddd",
      height: "calc(100vh - 66px)",
    },
    [mediaQueries.large]: {
      width: "20rem",
    },
  },
  overflowX: "hidden",
})

export const wordPanelHeader = style({
  padding: wordPanelPadding,
  fontFamily: fonts.body,
})

export const audioContainer = style({ paddingLeft: "40%" })

export const tableContainer = style({
  border: "none",
  margin: 0,
  marginBottom: vspace.quarter,
})

const tableCells = style([
  paddingY(vspace.eighth),
  paddingX(0),
  {
    border: "none",
    fontFamily: fonts.body,
    wordWrap: "break-word",
  },
])

export const glossCell = style([
  tableCells,
  {
    width: "100%",
    paddingLeft: hspace.halfEdge,
  },
])

export const morphemeCell = style([
  tableCells,
  {
    fontStyle: "italic",
    paddingRight: hspace.halfEdge,
  },
])

export const editCherHeader = style([
  marginX(hspace.large),
  {
    fontFamily: fonts.cherokee,
    marginTop: vspace.one,
  },
])
export const headerButtons = style({
  display: "flex",
  alignItems: "center",
  // Set this min-height here so the header space, as a flex-box, will not shrink when the close button disappears.
  minHeight: vspace.double,
})

export const editMorphemeCells = style([
  paddingX(hspace.small),
  paddingY(0),
  {
    display: "flex",
    flex: 1,
  },
])

export const editGlossCells = style([
  editMorphemeCells,
  {
    flex: 4,
  },
])

export const glossOption = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
})

export const selectedGlossOption = style({
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  overflow: "hidden",
})

export const globalGlossTag = style([
  paddingX(hspace.small),
  {
    fontFamily: fonts.header,
    fontSize: fontSize.tiny,
    backgroundColor: rgba("black", 0.15),
    borderRadius: radii.medium,
  },
])

export const buttonSpacing = style([marginX(hspace.small)])
