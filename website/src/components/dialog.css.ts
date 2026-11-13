import { globalStyle, style } from "@vanilla-extract/css"
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

export const buttons = style({
  display: "flex",
  gap: space.medium,
  justifyContent: "space-between",
  marginTop: vspace.one,
  "@media": {
    [mediaQueries.medium]: {
      position: "absolute",
      bottom: "4.1875rem",
      left: "3.5rem",
      right: "3.5rem",
      marginTop: 0,
    },
  },
})

export const dropdownGroup = style({
  display: "flex",
  flexDirection: "column",
})

export const dropdownLabel = style({
  fontSize: "0.85rem",
  fontWeight: 500,
  margin: 0,
  textAlign: "left",
  alignSelf: "stretch",
  paddingLeft: hspace.edge,
})

export const dropdownSelect = style({
  width: "24rem",
  height: "1.3rem",
  maxWidth: "100%",
  fontSize: "0.75rem",
  textAlign: "center",
  alignSelf: "center",
})

globalStyle(`${dropdownSelect} option`, {
  textAlign: "center",
})
