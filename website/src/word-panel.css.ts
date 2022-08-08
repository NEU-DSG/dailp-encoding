import { style, styleVariants } from "@vanilla-extract/css"
import { fonts, hspace, mediaQueries, radii, vspace } from "src/style/constants"
import { paddingX, paddingY } from "src/style/utils"
import { closeButton } from "./morpheme.css"

const wordPanelPadding = "8px"

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
  },
  overflowX: "hidden",
  overflowY: "auto",
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
