import { style } from "@vanilla-extract/css"
import { borderWidth } from "polished"
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

export const verticalCard = style({
  display: "grid",
  gridTemplateRows: "auto auto 1fr",
  width: "40%",
  border: "1px solid black",
  borderRadius: radii.medium,
  overflow: "hidden",
})

export const verticalCardImage = style([
  {
    width: "100%",
    height: "auto",
    objectFit: "cover",
    borderTopLeftRadius: radii.medium,
    borderTopRightRadius: radii.medium,
  },
])

export const verticalCardHeader = style({
  padding: space.small,
  fontWeight: "bold",
})

export const verticalCardText = style([
  {
    padding: space.small,
  },
])
