import { globalStyle, style } from "@vanilla-extract/css"
import { important, padding } from "polished"
import { Styles } from "polished/lib/types/style"
import {
  colors,
  hsize,
  hspace,
  space,
  thickness,
  vspace,
} from "src/style/constants"
import { marginY, paddingX } from "src/style/utils"

// Parent class defining a Wordpress page.
// All classes defined in this file begin with this generated className to control the scope of these styles.
export const lesson = style({})

const mobileQuery = "screen and (max-width: 52em)"

//// INPUT STYLES
const mobileInputSize = `calc(1rem * 2)`

// On mobile, increases width and height of input boxes for better mobile visibility.
globalStyle(`${lesson} input`, {
  "@media": {
    [mobileQuery]: important({
      width: hsize.full,
      height: mobileInputSize,
    }),
  },
})

// A global style that styles fill in the blank sentences where a word
// appears below the input box.
globalStyle(`${lesson} .fill-blank span`, {
  display: "inline-flex",
  flexDirection: "column",
  alignItems: "center",
  ...paddingX(hspace.halfEdge),
})

//// IMAGE AND CAPTION STYLES
const figure = `${lesson} figure`
// Gives flexbox items (image and caption) a column look only on mobile.
globalStyle(figure, {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  textAlign: "left",
  gap: `calc(${space.large} * 2)`,

  "@media": {
    [mobileQuery]: important({
      flexDirection: "column",
      gap: 0,
    }),
  },
})

// Styles the caption text of figures.
globalStyle(`${figure} figcaption > *`, {
  color: colors.primary,
  display: "flex",
  flexDirection: "column",
  alignItems: "start",
})

/// TABLE STYLES
// Styles rows of a table.
// On mobile, since row width is limited, convert each row into a "column-like" element
// and space out their margins.
globalStyle(`${lesson} table tr`, {
  "@media": {
    [mobileQuery]: important({
      display: "flex",
      flexDirection: "column",
      border: `${thickness.thin} solid ${colors.text}`,
      ...(marginY(vspace.large) as Styles),
    }),
  },
})

// Styles columns of a table.
// On mobile, give columns full width with equally sized padding.
globalStyle(`${lesson} table td`, {
  "@media": {
    [mobileQuery]: important({
      width: hsize.full,
      ...padding(hspace.medium),
    }),
  },
})

/// HORIZONTAL LINE STYLES
globalStyle(
  `${lesson} hr`,
  important({ width: hsize.full, marginBottom: vspace["1.5"] })
)

/// BLOCKQUOTES STYLES
// By default, set this width to 500px, but on mobile make width auto to
// compensate for the smaller size screen.
globalStyle(`${lesson} blockquote`, {
  width: `calc(${hsize.large} / 2)`,
  "@media": {
    [mobileQuery]: important({
      width: hsize.auto,
    }),
  },
})

/// MODULE BUTTON STYLES
// Styles the position of the module buttons at the end of every lesson.
globalStyle(`${lesson} .module-buttons`, {
  display: "flex",
  justifyContent: "space-between",
})
