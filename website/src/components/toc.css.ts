import { style } from "@vanilla-extract/css"
import { margin } from "polished"
import { sidebar, textColor } from "src/pages/edited-collections/sidebar.css"
import { colors, hspace, vspace } from "src/style/constants"
import { onHover, paddingX, paddingY } from "src/style/utils"

// Styles intro chapters.
export const numberedOrderedList = style([
  {
    display: "block",
    listStyleType: "lower-roman",
    listStylePosition: "inside",
    marginBottom: 0,
  },
])

// Styles body chapters.
export const orderedList = style([
  {
    counterReset: "item",
    selectors: {
      [`${sidebar} > &`]: { marginLeft: "0px" },
    },
  },
])

export const listItem = style([
  margin(0),
  paddingY(vspace.large),
  {
    display: "block",
    ":before": {
      content: 'counters(item, ".") " "',
      counterIncrement: "item",
    },
    selectors: {
      [`${orderedList} ${orderedList} &:last-of-type`]: {
        paddingBottom: "0px",
      },
    },
  },
])

export const link = style([
  paddingX(hspace.medium),
  onHover({ color: colors.borders }),
  textColor,
  {
    textDecoration: "none",
  },
])

export const divider = style([
  {
    backgroundColor: colors.borders,
    width: "100%",
    selectors: {
      [`${orderedList} ${listItem} &:last-of-type`]: { display: "none" },
    },
  },
])
