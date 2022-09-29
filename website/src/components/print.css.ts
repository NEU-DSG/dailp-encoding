import { globalStyle, style } from "@vanilla-extract/css"
import { important, margin, padding } from "polished"
import { colors, mediaQueries, thickness } from "src/style/constants"
import { hsize } from "src/style/constants"
import { media } from "src/style/utils"

// Parent class defining a Wordpress page.
// All classes defined in this file begin with this generated className to control the scope of these styles.
export const wp = style({})

// Displays element on print.
const showOnPrint = `${wp} .show-on-print`
globalStyle(showOnPrint, {
  ...media(mediaQueries.print, {
    ...important({
      display: "block",
    }),
  }),
})

// Formats colors of links.
const link = `${wp} a`
globalStyle(link, {
  ...media(mediaQueries.print, {
    ...important({
      color: colors.link,
    }),
  }),
})

//// PROSE & SECTIONS
// Prose is an element that needs to take up the full-width of a page.
const prose = `${wp} .prose`
// Section is an element that should not be broken up between pages.
const section = `${wp} .section`

// This removes line breaks to create full-width pages.
globalStyle(`${prose} br`, {
  ...media(mediaQueries.print, {
    display: "none",
  }),
})

// Keeps elements on the same page, preventing page-breaks between them.
globalStyle(section, {
  ...media(mediaQueries.print, {
    breakInside: "avoid",
  }),
})

//// SHORT-ANSWER/SYLLABARY-INPUT STYLES
const shortAnswer = `${wp} .short-answer`
const syllabaryInput = `${wp} .syllabary-input`
const syllabaryInputSize = `calc(1rem * 3)`

// Allows elements to reach full-width of page.
globalStyle(`${syllabaryInput} span, ${shortAnswer} span, ${shortAnswer} p`, {
  ...media(mediaQueries.print, {
    display: "flex",
    gap: hsize.edge,
  }),
})

globalStyle(`${syllabaryInput} span, ${shortAnswer} span`, {
  ...media(mediaQueries.print, {
    alignItems: "center",
  }),
})

// Inputs/textboxes will take up the remaining space on a line, to be on the same line as the given question.
globalStyle(`${syllabaryInput} input, ${shortAnswer} input`, {
  ...media(mediaQueries.print, {
    flex: 1,
  }),
})

// Increases input box size by three times.
globalStyle(`${syllabaryInput} input`, {
  ...media(mediaQueries.print, {
    height: syllabaryInputSize,
    border: `${thickness.thin} solid ${colors.text}`,
  }),
})

// Short answer questions incorporate a flexbox to allow for the textbox line to be on the same line as the given question.
globalStyle(`${shortAnswer} p`, {
  ...media(mediaQueries.print, {
    flexWrap: "wrap",
  }),
})

// Syllabary inputs are special cases where the textbox line may need to take up more space and work with a numbered list that appears only on print.
globalStyle(`${syllabaryInput} br`, {
  ...media(mediaQueries.print, {
    ...important({
      display: "block",
    }),
  }),
})

// IMAGE AND CAPTION STYLES
// A row within a table with the class "centered" - only rows containing an image, blue text, and its caption are styled this way.
const trCentered = `${wp} tr.centered`

globalStyle(`${trCentered}, ${trCentered} td:nth-child(3) h3`, {
  ...media(mediaQueries.print, {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }),
})

globalStyle(`${trCentered} td`, {
  ...media(mediaQueries.print, {
    ...important({
      width: "auto",
    }),
    flexDirection: "row",
    border: "none",
    paddingBottom: 0,
  }),
})

// The first child of a row with the "centered" class is always going to be the image.
globalStyle(
  `${trCentered} td:nth-child(1), 
  ${trCentered} td:nth-child(2), 
  ${trCentered} td:nth-child(1) h3`,
  {
    ...media(mediaQueries.print, {
      ...margin(0),
      ...padding(0),
    }),
  }
)

// The third child of a row with the "centered" class is always going to be the "caption" that needs to be separated from the image and its blue text.
globalStyle(`${trCentered} td:nth-child(3)`, {
  ...media(mediaQueries.print, {
    alignSelf: "flex-start",
    paddingLeft: 0,
    paddingBottom: 0,
  }),
})
