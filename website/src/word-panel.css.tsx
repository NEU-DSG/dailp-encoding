import { style, styleVariants } from "@vanilla-extract/css"
import { fonts, mediaQueries, vspace } from "src/style/constants"
import { closeButton } from "./morpheme.css"

const wordPanelPadding = "8px"

export const cherHeader = style({
  fontFamily: fonts.cherokee,
})

export const noSpaceBelow = style({
  marginBottom: vspace.half,
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
  top: 101,
  border: "none",
  borderRadius: "4px",
  "@media": {
    [mediaQueries.medium]: {
      border: "1px solid #ddd",
      height: "calc(100vh - 125px)",
    },
  },
  height: "100vh",
  overflowY: "auto",
})

export const wordPanelHeader = style({
  padding: wordPanelPadding,
  fontFamily: fonts.body,
})

export const audioContainer = style({ paddingLeft: "40%" })

export const tableContainer = style({
  border: "0px solid transparent",
  width: "max-content",
  margin: "0px",
})

export const tableCells = style({
  border: "4px solid transparent",
  fontFamily: fonts.body,
  padding: "0px",
  paddingRight: "3px",
  wordWrap: "break-word",
})
