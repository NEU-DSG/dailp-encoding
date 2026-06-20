import { style } from "@vanilla-extract/css"
import { colors } from "src/style/constants"

export const container = style({
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  marginLeft: "0.375rem",
  verticalAlign: "middle",
})

export const icon = style({
  color: colors.primary,
  fontSize: "0.875rem",
  transition: "color 0.2s ease",
  cursor: "pointer",
  selectors: {
    [`${container}:hover &`]: {
      color: "#333",
    },
  },
})

export const tooltip = style({
  position: "absolute",
  bottom: "120%",
  left: "50%",
  transform: "translateX(-50%)",
  width: "240px",
  padding: "0.625rem 0.875rem",
  backgroundColor: "white",
  color: "black",
  borderRadius: "0.375rem",
  fontSize: "0.75rem",
  lineHeight: "1.5",
  zIndex: 1000,
  boxShadow: "0 0.25rem 0.75rem rgba(61, 61, 61, 0.15)",
  visibility: "hidden",
  opacity: 0,
  pointerEvents: "none",
  textAlign: "left",

  // CSS of the little triangle arrow at the bottom
  ":after": {
    content: '""',
    position: "absolute",
    top: "100%",
    left: "50%",
    marginLeft: "-0.3125rem",
    borderWidth: "0.3125rem",
    borderStyle: "solid",
    borderColor: "white transparent transparent transparent",
  },

  selectors: {
    [`${container}:hover &`]: {
      visibility: "visible",
      opacity: 1,
    },
  },
})
