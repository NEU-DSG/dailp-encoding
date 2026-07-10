import { style } from "@vanilla-extract/css"
import { margin } from "polished"
import { colors, hsize, hspace, vspace } from "src/style/constants"
import { marginY, onHover, paddingX, paddingY } from "src/style/utils"

// Styles intro chapters.
export const numberedOrderedList = style([
  {
    display: "block",
    listStyleType: "lower-roman",
    listStylePosition: "outside",
    paddingLeft: "1rem",
    alignContent: "left",

    selectors: {
      // Removes the left margin in a list.
      [`nav > &`]: { marginLeft: "0px" },
    },
  },
])

// Styles body and credit chapters.
export const orderedList = style([
  {
    counterReset: "item",
    selectors: {
      // Removes the left margin in a list.
      [`nav > &`]: { marginLeft: "0px" },
    },
  },
])

export const numberedListItem = style([
  margin(0),
  paddingY(vspace.large),
  {
    borderBottom: `1px solid ${colors.borders}`,
    width: "100%",
    color: colors.primaryText,
    selectors: {
      // Removes the padding at the bottom of an item that is the last of its type in a nested list, to avoid double padding.
      // Removes the horizontal line when its the last in a list, to avoid double lines.
      [`${orderedList} &:last-of-type`]: {
        paddingBottom: "0px",
        borderBottom: "none",
      },
      [`${numberedOrderedList} &:last-of-type`]: {
        paddingBottom: "0px",
        borderBottom: "none",
      },
    },
  },
])

// export const listItem = style([
//   numberedListItem,
//   {
//     display: "block",
//     ":before": {
//       content: 'counters(item, ".") " "',
//       counterIncrement: "item",
//     },
//   },
// ])

export const listItem = style([
  numberedListItem,
  {
    // display: "flex",
    // alignItems: "center",
    // justifyContent: "space-between",
    display: "block",

    selectors: {
      "&::before": {
        display: "inline",
        marginRight: "8px",
        whiteSpace: "nowrap",
      },
    },
  },
])

export const link = style([
  paddingX(hspace.medium),
  onHover({ color: colors.borders }),
  {
    color: colors.primaryText,
    textDecoration: "none",
    minWidth: 0,

    whiteSpace: "normal",
    overflowWrap: "break-word",
  },
])

export const selectedLink = style([
  link,
  { color: colors.focus, textDecoration: "underline" },
])

export const title = style([
  marginY(vspace.medium),
  {
    color: colors.primaryText,
    fontWeight: "bolder",
  },
])

// Collapsible parent chapter toggle styling
export const chapterToggle = style({
  background: "none",
  border: "none",
  padding: 0,
  margin: 0,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "0.3rem",
  color: colors.primaryText,
  fontSize: "inherit",
})

export const toggleIcon = style({
  transition: "transform 0.2s ease",
})

export const toggleIconOpen = style({
  transform: "rotate(180deg)",
})

export const row = style({
  display: "grid",
  gridTemplateColumns: "auto 1fr auto",
  alignItems: "start",
  gap: "4px",
  width: "100%",
})

export const number = style({
  gap: "20px",
  width: "auto",
  textAlign: "right",
  opacity: 0.7,
  fontVariantNumeric: "tabular-nums",
})

export const toggleSpacer = style({
  width: "40px",
})

export const nestedList = style({
  paddingLeft: "0",
  marginLeft: "1rem",
})

export const nestedOrderedList = style({
  listStyleType: "lower-roman",
  listStylePosition: "outside",
  paddingLeft: "1.5rem",
  marginLeft: "0",
})

export const simpleRow = style({
  display: "grid",
  gridTemplateColumns: "1fr auto",
  alignItems: "center",
  width: "100%",
})
