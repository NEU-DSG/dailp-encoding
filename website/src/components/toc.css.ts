import { style } from "@vanilla-extract/css"

export const orderedList = style({
  counterReset: "item",
})

export const listItem = style({
  display: "block",
  ":before": {
    content: 'counters(item, ".") " "',
    counterIncrement: "item",
  },
})

export const numberedOrderedList = style({
  display: "block",
  listStyleType: "lower-roman",
  listStylePosition: "inside",
  marginBottom: 0,
})
