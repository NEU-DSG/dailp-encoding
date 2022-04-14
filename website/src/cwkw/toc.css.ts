import { style } from "@vanilla-extract/css"
import { countReset } from "console"
import { ItemDeleteButton } from "tinacms"
import { content } from "src/footer.css"

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
