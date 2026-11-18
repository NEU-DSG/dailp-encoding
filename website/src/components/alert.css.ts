import { style } from "@vanilla-extract/css"
import { colors, fonts, hspace, rhythm } from "src/style/constants"

export const wrapper = style({
  display: "flex",
  justifyContent: "center",
  margin: "2rem 0",
})

export const notice = style({
  backgroundColor: "#e8f2ff", // pale blue, lighter than footer
  border: "1px solid #c6ddff",
  borderRadius: "8px",
  padding: "1.5rem 2rem",
  maxWidth: "800px",
  width: "100%",
})

export const title = style({
  margin: "0 0 0.5rem 0",
  fontWeight: 600,
})

export const content = style({
  fontSize: "0.95rem",
})
