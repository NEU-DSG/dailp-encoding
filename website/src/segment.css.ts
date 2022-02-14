import { StyleRule, style, styleVariants } from "@vanilla-extract/css"
import { borderWidth, margin } from "polished"
import {
  colors,
  hspace,
  mediaQueries,
  radii,
  std,
  theme,
  thickness,
  vspace,
} from "src/sprinkles.css"
import { marginY, paddingY } from "./style-utils"

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

export const wordGroup = style([
  marginY(vspace.half),
  paddingY(vspace.half),
  {
    display: "block",
    padding: hspace.halfEdge,
    borderWidth: thickness.thick,
    borderStyle: "solid",
    borderColor: colors.borders,
    borderRadius: radii.medium,
    lineHeight: vspace.one,
    position: "relative",
    pageBreakInside: "avoid",
    breakInside: "avoid",
    "@media": {
      [mediaQueries.medium]: {
        display: "inline-block",
        padding: 0,
        border: "none",
        ...margin(vspace.half, "3rem", vspace.one, 0),
      },
      [mediaQueries.print]: {
        display: "inline-block",
        padding: 0,
        border: "none",
        ...margin(0, "3.5rem", vspace[1.5], 0),
      },
    },
  },
])

export const syllabaryLayer = style({
  fontFamily: theme.fonts.cherokee,
  fontSize: "1.15rem",
})

export const syllabarySelectedLayer = style({
  fontFamily: theme.fonts.cherokee,
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
  fontFamily: theme.fonts.cherokee,
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

const borderedBase: StyleRule = {
  borderBottom: `1px solid ${theme.colors.text}`,
  selectors: {
    "&:last-of-type": {
      borderBottom: "none",
      marginBottom: 0,
      paddingBottom: 0,
    },
  },
}

export const bordered = style({
  "@media": {
    [mediaQueries.medium]: borderedBase,
    [mediaQueries.print]: {
      ...borderedBase,
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

export const storySection = style({
  display: "flex",
  flexFlow: "row wrap",
})

const annotationSectionBase = style([
  {
    width: "100%",
    position: "relative",
    marginBottom: vspace.half,
  },
])

export const annotationSection = styleVariants({
  story: [annotationSectionBase, storySection],
  wordByWord: [annotationSectionBase],
})

export const audioContainer = style({ paddingLeft: "40%" })

export const infoIcon = style({
  cursor: "help",
  marginLeft: hspace.halfEdge,
  "@media": {
    [mediaQueries.print]: {
      display: "none",
    },
  },
})

export const linkSvg = style({ fill: colors.link })
