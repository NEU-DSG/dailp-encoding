import { globalStyle, style } from "@vanilla-extract/css"
import { mediaQueries, radii, space, vspace } from "src/style/constants"

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
