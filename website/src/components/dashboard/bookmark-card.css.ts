import { style } from "@vanilla-extract/css"
import { margin } from "polished"
import {
  fonts,
  hsize,
  mediaQueries,
  radii,
  space,
  thickness,
  vspace,
} from "src/style/constants"
import { media, onHover } from "src/style/utils"

export const card = style([
  {
    width: "100%",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "black",
    borderRadius: radii.medium,
    display: "grid",
    gridTemplateColumns: "fit-content(20%) minmax(50px,5fr)",
    gridTemplateRows: "fit-content(100%) fit-content(100%)",
    columnGap: space.medium,
    boxShadow: "8px 8px 4px rgba(0, 0, 0, 0.2)",
  },
  onHover({
    scale: 1.03,
    borderWidth: "4px",
    borderColor: "maroon",
  }),
])

export const cardImage = style([
  {
    width: "100%",
    borderTopLeftRadius: "inherit",
    margin: "inherit",
    borderBottomLeftRadius: radii.none,
    gridRowStart: "1",
    gridColumnStart: "1",
    gridRowEnd: "span 1",
    gridColumnEnd: "span 1",
  },
  media(mediaQueries.medium, {
    borderBottomLeftRadius: "inherit",
    gridRowEnd: "span 2",
  }),
])

export const cardHeader = style({
  margin: "inherit",
  gridRowStart: "1",
  gridColumnStart: "2",
  gridRowEnd: "span 1",
  gridColumnEnd: "span 1",
  placeSelf: "center stretch",
  padding: space.small,
})

export const cardText = style([
  {
    margin: "inherit",
    gridRowStart: "2",
    gridColumnStart: "1",
    gridRowEnd: "span 1",
    gridColumnEnd: "span 2",
    placeSelf: "center stretch",
    fontFamily: fonts.header,
    borderTopWidth: thickness.thin,
    padding: space.small,
  },
  media(mediaQueries.medium, {
    gridRowStart: "2",
    gridColumnStart: "2",
    gridRowEnd: "span 1",
    gridColumnEnd: "span 1",
    placeSelf: "center stretch",
    borderTopWidth: thickness.none,
  }),
])

export const descriptionContainer = style({
  display: "flex",
  justifyContent: "space-between",
  padding: space.medium,
})

export const pillButton = style({
  marginRight: space.medium,
  width: "10%",
  height: "40%",
  backgroundColor: "white",
  color: "red",
  display: "inline-block",
  borderRadius: "999px",
  textDecoration: "none",
  fontSize: "16px",
  cursor: "pointer",
  userSelect: "none",
  border: "2px solid red",
  position: "relative",
  textAlign: "center",
  top: "50%",
  left: "5%",
  transform: "translate(-50%, -50%)",
})
