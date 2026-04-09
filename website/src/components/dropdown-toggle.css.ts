import { globalStyle, style } from "@vanilla-extract/css"
import { fonts } from "src/style/constants"

export const dropdownToggle = style({
  background: "none",
  border: "none",
  color: "white",
  fontFamily: "Inter",
  fontSize: "20px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "0.3rem",
})

export const toggleIcon = style({
  fontSize: "0.8rem",
  transition: "transform 0.3s ease",
  textDecoration: "none",
  display: "inline-block",
  selectors: {
    [`${dropdownToggle}:hover &`]: {
      transform: "rotate(180deg)",
      textDecoration: "none",
    },
  },
})

export const toggleText = style({
  color: "white",
  fontFamily: fonts.header,
  fontWeight: "500",
  fontSize: "20px",
  cursor: "pointer",
  transition: "font-weight 0.2s ease",
})

globalStyle(`.open ${toggleText}`, {
  textDecoration: "underline",
  fontWeight: "700",
})

globalStyle(`${toggleText}:hover`, {
  textDecoration: "underline",
  fontWeight: "700",
})
