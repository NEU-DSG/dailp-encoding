import { style } from "@vanilla-extract/css"
import { colors } from "src/style/constants"

export const container = style({
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  marginLeft: "6px",
  verticalAlign: "middle",
})

export const icon = style({
  color: colors.primary,
  fontSize: "14px",
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
  padding: "10px 14px",
  backgroundColor: "white",
  color: "black",
  borderRadius: "6px",
  fontSize: "12px",
  lineHeight: "1.5",
  zIndex: 1000,
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
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
    marginLeft: "-5px",
    borderWidth: "5px",
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
