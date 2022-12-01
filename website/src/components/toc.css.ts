import { style } from "@vanilla-extract/css"
import { margin } from "polished"
import { colors, hsize, hspace, vspace } from "src/style/constants"
import { marginY, onHover, paddingX, paddingY } from "src/style/utils"

// Styles intro chapters.
export const numberedOrderedList = style([
  {
    display: "block",
    listStyleType: "lower-roman",
    listStylePosition: "inside",

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
    color: colors.primaryText,
    selectors: {
      // Removes the padding at the bottom of an item that is the last of its type in a nested list, to avoid double padding.
      [`${orderedList} ${orderedList} &:last-of-type`]: {
        paddingBottom: "0px",
      },
    },
  },
])

export const listItem = style([
  numberedListItem,
  {
    display: "block",
    ":before": {
      content: 'counters(item, ".") " "',
      counterIncrement: "item",
    },
  },
])

export const link = style([
  paddingX(hspace.medium),
  onHover({ color: colors.borders }),
  {
    color: colors.primaryText,
    textDecoration: "none",
  },
])

export const divider = style([
  {
    backgroundColor: colors.borders,
    width: hsize.full,
    selectors: {
      // Removes the horizontal line when its the last in a list, to avoid double lines.
      [`${orderedList} ${listItem} &:last-of-type`]: { display: "none" },
    },
  },
])

export const title = style([
  marginY(vspace.medium),
  {
    color: colors.primaryText,
    fontWeight: "bolder",
  },
])
