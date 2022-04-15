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
