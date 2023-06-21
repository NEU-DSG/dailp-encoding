import { style } from "@vanilla-extract/css"

export const card = style({
  width: "100%",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "black",
  borderRadius: "1em",
  display: "flex",
})

export const cardImage = style({
  width: "25%",
  borderBottomLeftRadius: "inherit",
  borderTopLeftRadius: "inherit",
  margin: "0px",
})

export const cardHeader = style({})

export const cardText = style({
  marginLeft: "2em",
  marginTop: "2em",
  marginRight: "1em",
})
