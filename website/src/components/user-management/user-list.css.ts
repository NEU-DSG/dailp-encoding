import { globalStyle, style } from "@vanilla-extract/css"
import {
  mediaQueries,
  radii,
  space,
  thickness,
  vspace,
} from "src/style/constants"

export const scrollable = style({
  maxHeight: "31.25rem",
  overflowY: "auto",
  overflowX: "auto",
  borderRadius: radii.large,
  padding: space.large,
})

export const userRow = style({
  display: "flex",
  flexFlow: "row",
  marginBottom: vspace.half,
  gap: "0.5rem",
  alignItems: "center",
  "@media": {
    [mediaQueries.medium]: {
      gap: "1rem",
    },
  },
})

globalStyle(`${userRow} > *`, {
  width: "6rem",
  "@media": {
    [mediaQueries.medium]: {
      width: "10rem",
    },
  },
})

export const usernameCell = style({
  width: "9rem",
  "@media": {
    [mediaQueries.medium]: {
      width: "16rem",
    },
  },
})

export const roleCell = style({
  width: "9rem",
  "@media": {
    [mediaQueries.medium]: {
      width: "13rem",
    },
  },
})

export const pendingCell = style({
  width: "4rem",
  marginLeft: "-0.5rem",
  marginRight: "1rem",
  "@media": {
    [mediaQueries.medium]: {
      width: "5rem",
      marginLeft: "-1rem",
      marginRight: "2rem",
    },
  },
})

export const removeCell = style({
  marginRight: 0,
})

export const checkboxCell = style({
  flexShrink: 0,
  height: "1rem",
  cursor: "pointer",
})

globalStyle(`${userRow} input${checkboxCell}`, {
  width: "1rem",
  margin: 0,
  padding: 0,
})

export const queryContainer = style({
  display: "flex",
  flexFlow: "row nowrap",
  alignItems: "center",
  gap: space.medium,
  width: "100%",
  padding: `${vspace.half} 0`,
})

export const queryInput = style({
  flex: 1,
  maxWidth: "calc(100% - 3rem)",
  height: "1.9375rem",
  border: `${thickness.thin} solid #5c3b37`,
  borderRadius: radii.large,
  padding: `0 ${space.medium}`,
  font: `normal 400 0.9375rem/1.2 'Charis SIL'`,
})

export const updateButton = style({
  flexShrink: 0,
  width: "8.625rem",
  height: "2.375rem",
  backgroundColor: "#9f4d43",
  color: "white",
  border: thickness.none,
  cursor: "pointer",
  fontFamily: "Quattrocento Sans, sans-serif",
})

export const dialogUsername = style({
  color: "#415373",
})

export const dialogRole = style({
  color: "#9f4d43",
})
