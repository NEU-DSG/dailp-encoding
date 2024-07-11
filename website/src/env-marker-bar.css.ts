import { style, styleVariants } from "@vanilla-extract/css"
import { reduce } from "lodash"
import { backgroundImages } from "polished"
import { fonts, thickness } from "./style/constants"

const palette = {
  red: "#f22727",
  orange: "#f28927",
  yellow: "#f2e427",
}

const stripe = (color: string) => {
  return `linear-gradient(to top right, ${color} 25%, #000000 25%, #000000 50%, ${color} 50%, ${color} 75%, #000000 75%, #000000 100%)`
}

const markerBarBase = style({
  position: "sticky",
  bottom: "0px",
  width: "100%",
  height: "min-content",
  backgroundSize: "113.14px 113.14px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
})

const markerLabelBase = style({
  width: "max-content",
  height: "max-content",
  textAlign: "center",
  padding: thickness.thick,
  margin: thickness.thick,
  fontFamily: fonts.header,
  fontWeight: "bold",
})

export const markerBar = styleVariants(palette, (color) => [
  markerBarBase,
  { backgroundImage: stripe(color) },
])

export const markerLabel = styleVariants(palette, (color) => [
  markerLabelBase,
  { background: color },
])
