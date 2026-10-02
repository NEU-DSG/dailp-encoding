import { style, styleVariants } from "@vanilla-extract/css"
import { margin } from "polished"
import { BsFileX } from "react-icons/bs"
import { button } from "src/components/button.css"
import {
  colors,
  hspace,
  mediaQueries,
  radii,
  tagColors,
  thickness,
  vspace,
} from "src/style/constants"
import { marginX, marginY, paddingX, paddingY } from "src/style/utils"

const wordShared = style([
  paddingY(vspace.quarter),
  paddingX(hspace.halfEdge),
  {
    borderWidth: thickness.thick,
    borderStyle: "solid",
    "@media": {
      [mediaQueries.print]: {
        ...margin(0, "3.5rem", vspace[1.5], hspace.small),
      },
      [mediaQueries.medium]: margin(0, "2.5rem", vspace.one, hspace.small),
    },
  },
])

export const commentWrapper = style([
  wordShared,
  marginY(vspace.half),
  {
    borderColor: colors.borders,
    borderRadius: radii.large,
    lineHeight: vspace.one,
    pageBreakInside: "avoid",
    breakInside: "avoid",
    "@media": {
      [mediaQueries.medium]: {},
    },
  },
])

export const headerStyle = style([
  marginX(hspace.medium),
  {
    fontSize: "0.7rem",
  },
])

export const tagPadding = style([paddingY(vspace.medium)])

export const tagColorStory = style([
  paddingX(hspace.medium),
  {
    display: "inline-block",
    borderRadius: radii.round,
    backgroundColor: tagColors.story,
    fontSize: "0.7rem",
  },
])

export const tagColorSuggestion = style([
  paddingX(hspace.medium),
  {
    display: "inline-block",
    borderRadius: radii.round,
    backgroundColor: tagColors.suggestion,
    fontSize: "0.7rem",
  },
])

export const tagColorQuestion = style([
  paddingX(hspace.medium),
  {
    display: "inline-block",
    borderRadius: radii.round,
    backgroundColor: tagColors.question,
    fontSize: "0.7rem",
  },
])

export const commentFooters = style([
  {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.5rem 1rem",
  },
])

export const editButtonMargin = style([
  marginY(vspace.one),
  marginX(hspace.large),
])

export const deleteButton = style([
  button,
  paddingX(hspace.medium),
  paddingY(vspace.small),
  {
    display: "flex",
    justifyContent: "space-around",
    marginLeft: hspace.small,
    fontSize: "0.8em",
    height: "auto",
    width: "auto",
  },
])

// Warning popup pulled from delete audio popup
// * In the future consolodate popups under a comp or adjust this as needed *
export const overlay = style({
  position: "fixed",
  width: "100vw",
  height: "100vh",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(240, 240, 240, 0.9)",
  zIndex: 9999,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
})

export const confirmationBox = style({
  backgroundColor: "white",
  padding: "16px",
  borderRadius: 0,
  border: "1px solid #ccc",
  width: "90%",
  maxWidth: "280px",
  textAlign: "center",
})

export const confirmationText = style({
  margin: "0 0 16px 0",
  fontSize: "14px",
  fontWeight: "bold",
  color: "#333",
})

export const modalButtonGroup = style({
  display: "flex",
  gap: "10px",
  justifyContent: "center",
})

export const buttonStyle = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  width: "100%",
  padding: "8px 12px",
})
