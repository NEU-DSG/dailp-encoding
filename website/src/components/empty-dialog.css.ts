import { style } from "@vanilla-extract/css"
import {
  hspace,
  layers,
  mediaQueries,
  radii,
  space,
  thickness,
  vspace,
} from "src/style/constants"

export const backdrop = style({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: layers.top,
})

export const dialog = style({
  position: "relative",
  backgroundColor: "white",
  borderRadius: radii.large,
  border: `${thickness.thin} solid #585858`,
  padding: `${vspace.one} ${hspace.edge}`,
  width: "90%",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  "@media": {
    [mediaQueries.medium]: {
      width: "28.75rem",
      height: "31.4375rem",
    },
  },
})

export const closeButtonContainer = style({
  position: "absolute",
  top: space.large,
  right: space.large,
})

export const title = style({
  font: `normal 400 1.625rem/1.2 'Charis SIL'`,
  marginBottom: space.large,
  marginTop: 0,
  textAlign: "center",
  color: "black",
})

export const subtitle = style({
  font: `normal 400 1rem/1.2 'Charis SIL'`,
  marginBottom: vspace.quarter,
  marginTop: 0,
  color: "black",
  textAlign: "center",
})

export const body = style({
  font: `normal 400 1.125rem/1.2 'Charis SIL'`,
  textAlign: "center",
  paddingBottom: "4rem",
  "@media": {
    [mediaQueries.medium]: {
      paddingBottom: 0,
    },
  },
})
