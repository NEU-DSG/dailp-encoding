import { style } from "@vanilla-extract/css"
import { colors } from "src/style/design-tokens"

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
  bottom: "130%",
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
  border: "2px solid black",
  visibility: "hidden",
  opacity: 0,
  pointerEvents: "none",
  textAlign: "left",

  // CSS of the little triangle arrow at the bottom
  ":before": {
    // Before manually places black outline
    content: '""',
    position: "absolute",
    top: "100%",
    left: "50%",
    marginLeft: "-0.4375rem",
    borderWidth: "0.4375rem",
    borderStyle: "solid",
    borderColor: "black transparent transparent transparent",
    zIndex: 1,
  },

  ":after": {
    // After manually places white interior on top
    content: '""',
    position: "absolute",
    top: "100%",
    left: "50%",
    marginLeft: "-0.3125rem",
    borderWidth: "0.3125rem",
    borderStyle: "solid",
    borderColor: "white transparent transparent transparent",
    zIndex: 2,
  },

  selectors: {
    [`${container}:hover &`]: {
      visibility: "visible",
      opacity: 1,
    },
  },
})
