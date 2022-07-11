import { style, styleVariants } from "@vanilla-extract/css"
import { fonts, hspace, mediaQueries, radii, vspace } from "src/style/constants"
import { paddingX, paddingY } from "src/style/utils"
import { closeButton } from "./morpheme.css"
<<<<<<<< HEAD:website/src/word-panel.css.ts
========
import { marginX, paddingX, paddingY } from "./style/utils"
>>>>>>>> 793cd1e (Modified styling and edit-word-panel structure):website/src/panel-layout.css.tsx

const wordPanelPadding = "12px"

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

export const headerButtons = style({
  display: "flex",
  alignItems: "center",
})

export const collPanelContent = style({
  padding: wordPanelPadding,
  paddingTop: 0,
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
<<<<<<<< HEAD:website/src/word-panel.css.ts
  overflowX: "hidden",
========
  height: "100vh",
>>>>>>>> 793cd1e (Modified styling and edit-word-panel structure):website/src/panel-layout.css.tsx
  overflowY: "auto",
})

export const wordPanelHeader = style({
  padding: vspace.medium,
  fontFamily: fonts.body,
})

export const audioContainer = style({ paddingLeft: "40%" })

export const tableContainer = style({
<<<<<<<< HEAD:website/src/word-panel.css.ts
  border: "none",
  margin: 0,
  marginBottom: vspace.quarter,
========
  border: "0px solid transparent",
  width: "100%",
  margin: "0px",
>>>>>>>> 793cd1e (Modified styling and edit-word-panel structure):website/src/panel-layout.css.tsx
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

<<<<<<<< HEAD:website/src/word-panel.css.ts
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
========
export const editMorphemeCells = style([
  paddingX(hspace.small),
  paddingY(0),
  {
    display: "flex",
    flex: 1,
  },
])

export const editMatchingCells = style([
  editMorphemeCells,
  {
    flex: 5,
>>>>>>>> 793cd1e (Modified styling and edit-word-panel structure):website/src/panel-layout.css.tsx
  },
])
