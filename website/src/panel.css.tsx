import { style, styleVariants } from "@vanilla-extract/css"
<<<<<<<< HEAD:website/src/word-panel.css.ts
import { fonts, hspace, mediaQueries, radii, vspace } from "src/style/constants"
import { paddingX, paddingY } from "src/style/utils"
========
import { fonts, hspace, mediaQueries, vspace } from "src/style/constants"
>>>>>>>> f6e248d (Added an editable word panel on documents):website/src/panel.css.tsx
import { closeButton } from "./morpheme.css"
import { marginX } from "./style/utils"

const wordPanelPadding = "12px"

<<<<<<<< HEAD:website/src/word-panel.css.ts
export const cherHeader = style({
  fontFamily: fonts.cherokee,
  marginBottom: vspace.eighth,
})
========
export const cherHeader = style([
  marginX(hspace.large),
  {
    fontFamily: fonts.cherokee,
    marginTop: vspace.one,
  },
])
>>>>>>>> f6e248d (Added an editable word panel on documents):website/src/panel.css.tsx

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

export const headerButtons = style({
  display: "flex",
  alignItems: "center",
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
  overflowY: "auto",
})

export const wordPanelHeader = style({
  padding: vspace.medium,
  fontFamily: fonts.body,
})

export const audioContainer = style({ paddingLeft: "40%" })

export const tableContainer = style({
  border: "none",
  margin: 0,
  marginBottom: vspace.quarter,
})

<<<<<<<< HEAD:website/src/word-panel.css.ts
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
========
export const tableCells = style([
  {
    border: "transparent",
    fontFamily: fonts.body,
    padding: hspace.small,
    wordWrap: "break-word",
  },
])
>>>>>>>> f6e248d (Added an editable word panel on documents):website/src/panel.css.tsx
