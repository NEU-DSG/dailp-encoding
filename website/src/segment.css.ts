import { StyleRule, style, styleVariants } from "@vanilla-extract/css"
import { margin } from "polished"
import sprinkles, { mediaQueries, std, theme, vspace } from "src/sprinkles.css"

export const pageBreak = style([
  sprinkles({
    display: { any: "block", print: "none" },
    paddingTop: "half",
  }),
  {
    width: "40%",
    margin: "auto",
    textAlign: "center",
    borderTop: "1px solid gray",
  },
])

export const inheritFont = style({
  fontFamily: "inherit",
  fontSize: "inherit",
})

const morphemeBase = style([
  sprinkles({
    color: "inherit",
    padding: 0,
    display: "inline-block",
    minWidth: "edge",
  }),
  { border: "none", background: "none" },
])

export const morphemeButton = styleVariants({
  lexical: [morphemeBase, inheritFont],
  functional: [morphemeBase, std.smallCaps],
})

export const wordGroup = style([
  sprinkles({
    display: { any: "block", medium: "inline-block", print: "inline-block" },
    position: "relative",
    marginY: "half",
    paddingY: "half",
    paddingLeft: "halfEdge",
    paddingRight: 0,
    borderWidth: "thick",
    borderStyle: "solid",
    borderColor: "borders",
    borderRadius: "medium",
    lineHeight: "one",
  }),
  {
    pageBreakInside: "avoid",
    breakInside: "avoid",
    "@media": {
      [mediaQueries.medium]: {
        padding: 0,
        border: "none",
        ...margin(vspace.half, "3rem", vspace.one, 0),
      },
      [mediaQueries.print]: {
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

export const plainSyllabary = style([syllabaryLayer, { marginRight: "1ch" }])

const documentBlockBase = style([
  {
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
  },
])

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

export const inlineBlock = sprinkles({
  display: { medium: "inline-block", print: "inline-block" },
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

export const infoIcon = style([
  sprinkles({
    display: { print: "none" },
    marginLeft: "halfEdge",
  }),
  {
    cursor: "help",
  },
])

export const linkSvg = sprinkles({ fill: "link" })
