import { style, styleVariants } from "@vanilla-extract/css"
import { margin } from "polished"
import {
  colors,
  fonts,
  hspace,
  mediaQueries,
  radii,
  thickness,
  vspace,
} from "src/style/constants"
import { marginY, paddingX, paddingY } from "src/style/utils"
import { std } from "src/style/utils.css"

export const pageBreak = style({
  display: "block",
  width: "40%",
  margin: "auto",
  textAlign: "center",
  borderTop: "1px solid gray",
  paddingTop: vspace.half,
  "@media": {
    [mediaQueries.print]: {
      display: "none",
    },
  },
})

export const inheritFont = style({
  fontFamily: "inherit",
  fontSize: "inherit",
})

const morphemeBase = style({
  border: "none",
  background: "none",
  color: "inherit",
  padding: 0,
  display: "inline-block",
  minWidth: hspace.edge,
})

export const morphemeButton = styleVariants({
  lexical: [morphemeBase, inheritFont],
  functional: [morphemeBase, std.smallCaps],
})

const wordShared = style([
  paddingY(vspace.half),
  paddingX(hspace.halfEdge),
  {
    borderWidth: thickness.thick,
    borderColor: "transparent",
    borderStyle: "solid",
    "@media": {
      [mediaQueries.print]: {
        display: "inline-block",
        border: "none",
        ...margin(0, "3.5rem", vspace[1.5], 0),
      },
      [mediaQueries.medium]: margin(vspace.half, "2.5rem", vspace.one, 0),
    },
  },
])

export const wordGroupInline = style([
  wordShared,
  margin(vspace.half, "1.5rem", vspace.half, 0),
  {
    display: "inline-block",
  },
])

export const wordGroup = style([
  wordShared,
  marginY(vspace.half),
  {
    display: "block",
    borderColor: colors.borders,
    borderRadius: radii.medium,
    lineHeight: vspace.one,
    position: "relative",
    pageBreakInside: "avoid",
    breakInside: "avoid",
    "@media": {
      [mediaQueries.medium]: {
        display: "inline-block",
        borderColor: "transparent",
      },
    },
  },
])

export const selectedWord = style({
  borderColor: "black",
  backgroundColor: colors.bodyDark,
  "@media": {
    [mediaQueries.medium]: {
      borderColor: "black",
    },
  },
})

export const syllabaryLayer = style({
  fontFamily: fonts.cherokee,
  fontSize: "1.15rem",
})

export const syllabarySelectedLayer = style({
  fontFamily: fonts.cherokee,
  fontSize: "1.15rem",
  display: "block",
  borderWidth: thickness.thick,
  borderStyle: "solid",
  borderColor: colors.borders,
  borderRadius: radii.medium,
  paddingLeft: hspace.halfEdge,
  paddingRight: hspace.halfEdge,
})

export const plainSyllabary = style({
  marginRight: hspace.char,
  fontFamily: fonts.cherokee,
  fontSize: "1.15rem",
})

const documentBlockBase = style({
  position: "relative",
  display: "block",
  breakAfter: "avoid",
  marginTop: vspace[1.5],
  marginBottom: vspace.one,
  paddingBottom: vspace.one,
  "@media": {
    [mediaQueries.print]: {
      paddingBottom: vspace.quarter,
      marginBottom: vspace.double,
    },
  },
})

const bordered = style({
  borderBottom: `${thickness.thin} solid ${colors.text}`,
  selectors: {
    "&:last-of-type": {
      borderBottom: "none",
      marginBottom: 0,
      paddingBottom: 0,
    },
  },
  "@media": {
    [mediaQueries.print]: {
      borderBottom: "1px solid black",
    },
  },
})

export const documentBlock = styleVariants({
  story: [documentBlockBase],
  wordByWord: [documentBlockBase, bordered],
})

export const inlineBlock = style({
  "@media": {
    [mediaQueries.medium]: { display: "inline-block" },
    [mediaQueries.print]: { display: "inline-block" },
  },
})

const annotationSectionBase = style({
  display: "flex",
  flexFlow: "row wrap",
  width: "100%",
  position: "relative",
  marginBottom: vspace.half,
})

export const annotationSection = styleVariants({
  story: [annotationSectionBase],
  wordParts: [
    annotationSectionBase,
    {
      flexFlow: "column nowrap",
      "@media": {
        [mediaQueries.medium]: {
          flexFlow: "row wrap",
        },
      },
    },
  ],
})

export const audioContainer = style({ paddingLeft: "40%" })

export const infoIcon = style({
  cursor: "pointer",
  marginLeft: hspace.halfEdge,
  "@media": {
    [mediaQueries.print]: {
      display: "none",
    },
  },
})

export const linkSvg = style({ fill: colors.primary })

export const fillerLine = style([
  {
    borderWidth: 0,
    borderBottom: `1px solid ${colors.text}`,
    background: "none",
    textAlign: "start",
    width: "100%",
  },
])

export const lineBox = style([
  {
    height: "1.5em",
    padding: ".75em",
    paddingLeft: "0em",
    paddingRight: "0.75em",
  },
])
