import {
  GlobalStyleRule,
  StyleRule,
  globalStyle,
  style,
} from "@vanilla-extract/css"
import { important, margin } from "polished"
import { colors, mediaQueries, thickness, vspace } from "src/style/constants"
import { hsize } from "src/style/constants"
import { media } from "src/style/utils"

// Parent class defining a Wordpress page.
// All classes defined in this file begin with this generated className to control the scope of these styles.
export const lesson = style({})

// Function that returns a global style for printed media.
const printMedia = (styles: StyleRule): GlobalStyleRule => {
  return {
    ...media(mediaQueries.print, {
      ...styles,
    }),
  }
}

// Displays element on print.
const showOnPrint = `${lesson} .show-on-print`
globalStyle(
  showOnPrint,
  printMedia({
    ...important({
      display: "block",
    }),
  })
)

// Formats colors of links.
const link = `${lesson} a`
globalStyle(
  link,
  printMedia({
    ...important({
      color: colors.link,
    }),
  })
)

//// SECTIONS
// Section is an element that should not be broken up between pages.
const section = `${lesson} .section`

// Keeps elements on the same page, preventing page-breaks between them.
globalStyle(section, printMedia({ breakInside: "avoid" }))

//// SHORT-ANSWER/SYLLABARY-INPUT STYLES
const shortAnswer = `${lesson} .short-answer`
const syllabaryInput = `${lesson} .syllabary-input`
const syllabaryInputSize = `calc(1rem * 3)`

// Allows elements to reach full-width of page.
globalStyle(
  `${syllabaryInput} span, ${shortAnswer} span, ${shortAnswer} p`,
  printMedia({ display: "flex", gap: hsize.edge })
)

globalStyle(
  `${syllabaryInput} span, ${shortAnswer} span`,
  printMedia({ alignItems: "center" })
)

// Inputs/textboxes will take up the remaining space on a line, to be on the same line as the given question.
globalStyle(
  `${syllabaryInput} input, ${shortAnswer} input`,
  printMedia({ flex: 1 })
)

// Increases input box size by three times.
globalStyle(
  `${syllabaryInput} input`,
  printMedia({
    height: syllabaryInputSize,
    border: `${thickness.thin} solid ${colors.text}`,
  })
)

// Short answer questions incorporate a flexbox to allow for the textbox line to be on the same line as the given question.
globalStyle(
  `${shortAnswer} p`,
  printMedia({
    flexWrap: "wrap",
  })
)

//// IMAGE AND CAPTION STYLES
const figure = `${lesson} figure`
// Gives flexbox items (image and caption) a column look.
globalStyle(
  figure,
  printMedia({
    ...margin(0),
    flexDirection: "column",
    ...important({ gap: vspace.large }),
  })
)

globalStyle(
  `${figure} img`,
  printMedia({
    ...margin(0),
  })
)

// The furthest textbox to the right of a figure should be below the figure and its blue caption on print.
globalStyle(`${figure} p`, printMedia({ alignSelf: "start" }))
